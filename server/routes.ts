import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { analyzeNailShape, generateNailShapeImage } from "./openai";
import { insertCustomerSchema, insertAppointmentSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error('Error creating upload directory:', error);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${nanoid()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile with signup data
  app.put('/api/auth/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { phoneNumber, workplace, region, postalCode } = req.body;
      
      const updatedUser = await storage.updateUser(userId, {
        phoneNumber,
        workplace,
        region,
        postalCode,
        updatedAt: new Date(),
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // PayPal routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Photo upload routes for card-based measurement
  app.post('/api/photos/upload', isAuthenticated, upload.single('photo'), async (req: any, res) => {
    try {
      console.log("Upload request received:", {
        body: req.body,
        file: req.file ? {
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype
        } : null
      });

      const userId = req.user.claims.sub;
      const { sessionId, fingerType, photoType } = req.body;
      
      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({ message: "사진 파일이 필요합니다." });
      }

      if (!sessionId || !fingerType) {
        console.log("Missing required fields:", { sessionId, fingerType, photoType });
        return res.status(400).json({ message: "세션 ID와 손가락 유형이 필요합니다." });
      }

      // Save photo information to database
      const photoData = {
        userId,
        sessionId,
        fileName: req.file.filename,
        filePath: req.file.path,
        photoType: photoType || 'finger_with_card',
        fingerType,
        cardDetected: false, // Will be updated during analysis
      };

      console.log("Saving photo data:", photoData);
      const savedPhoto = await storage.saveCustomerPhoto(photoData);
      console.log("Photo saved successfully:", savedPhoto.id);
      
      res.json({
        id: savedPhoto.id,
        imageUrl: `/uploads/${req.file.filename}`,
        fingerType,
        photoType: photoData.photoType
      });
    } catch (error: any) {
      console.error("Photo upload error:", error);
      res.status(500).json({ 
        message: "사진 업로드 중 오류가 발생했습니다.",
        error: error.message,
        details: error.stack 
      });
    }
  });

  // New combined route: analyze photos and generate nail art images with PDF
  app.post("/api/photos/analyze-and-generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.body;
      
      console.log("Starting photo analysis and nail art generation for session:", sessionId);
      
      // Get all photos for this session
      const photos = await storage.getCustomerPhotos(userId, sessionId);
      
      if (photos.length < 6) {
        return res.status(400).json({ message: "6장의 사진이 모두 필요합니다." });
      }

      // Step 1: Try OpenAI analysis, fallback to demo mode if quota exceeded
      let analysisResult;
      let measurements;
      
      try {
        const { analyzePreciseNailMeasurements } = await import("./preciseNailMeasurement");
        console.log("Attempting OpenAI analysis...");
        const photosForAnalysis = photos.map(photo => ({
          filePath: photo.filePath,
          fingerType: photo.fingerType || 'unknown',
          photoType: photo.photoType
        }));
        analysisResult = await analyzePreciseNailMeasurements(sessionId, photosForAnalysis);
        measurements = analysisResult.fingerMeasurements;
        
        if (!analysisResult.cardDetected) {
          return res.status(400).json({ 
            message: "카드를 감지할 수 없습니다. 카드가 선명하게 보이는 사진을 다시 업로드해주세요.",
            recommendations: analysisResult.recommendations
          });
        }
      } catch (error: any) {
        if (error.code === 'insufficient_quota' || error.status === 429) {
          console.log("OpenAI quota exceeded, switching to demo mode...");
          const { createDemoAnalysisResult } = await import("./demoMode");
          analysisResult = createDemoAnalysisResult();
          measurements = analysisResult.fingerMeasurements;
          
          // Add demo notice to recommendations
          analysisResult.recommendations.unshift("데모 모드: OpenAI API 할당량 초과로 인해 시뮬레이션된 결과를 표시합니다");
        } else {
          throw error;
        }
      }
      
      // Save measurements to database
      const savedMeasurements = [];
      for (const measurement of measurements) {
        const nailData = {
          userId,
          sessionId,
          fingerType: measurement.fingerType,
          nailWidth: measurement.nailWidth.toString(),
          nailLength: measurement.nailLength.toString(),
          nailCurvature: measurement.nailCurvature.toString(),
          fingerWidth: measurement.fingerWidth.toString(),
          fingerLength: measurement.fingerLength.toString(),
          shapeCategory: measurement.shapeCategory,
          measurementConfidence: measurement.confidence.toString(),
          shapeData: measurement
        };
        
        const savedMeasurement = await storage.saveAiGeneratedNail(nailData);
        savedMeasurements.push(savedMeasurement);
      }
      
      // Step 2: Try OpenAI image generation, fallback to demo if quota exceeded
      let nailArtResult;
      
      try {
        const { generatePrecisionNailArt } = await import("./advancedNailArtGenerator");
        console.log("Attempting OpenAI image generation...");
        
        nailArtResult = await generatePrecisionNailArt(
          sessionId,
          measurements,
          {
            style: 'elegant',
            colors: ['#FFB6C1', '#FFC0CB', '#FFFFFF'],
            theme: 'classic',
            complexity: 'medium'
          }
        );
      } catch (error: any) {
        if (error.code === 'insufficient_quota' || error.status === 429) {
          console.log("OpenAI quota exceeded for image generation, using demo mode...");
          const { generateDemoNailArt } = await import("./demoMode");
          nailArtResult = generateDemoNailArt(measurements);
        } else {
          throw error;
        }
      }
      
      // Step 3: Create PDF with all generated nail art images
      console.log("Creating PDF with nail art images...");
      let pdfUrl = '';
      
      try {
        const { jsPDF } = require('jspdf');
        const pdf = new jsPDF();
        
        // Add title page
        pdf.setFontSize(20);
        pdf.text('AI Generated Nail Art Design', 20, 30);
        pdf.setFontSize(12);
        pdf.text(`Session: ${sessionId}`, 20, 50);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60);
        
        // Add each nail art image description to PDF
        let yPosition = 80;
        for (let i = 0; i < Math.min(nailArtResult.descriptions.length, 10); i++) {
          const fingerName = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
          const handSide = i < 5 ? 'Left' : 'Right';
          const fingerIndex = i % 5;
          
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFontSize(14);
          pdf.text(`${handSide} ${fingerName[fingerIndex]} Nail Art`, 20, yPosition);
          pdf.setFontSize(10);
          pdf.text(nailArtResult.descriptions[i] || 'Nail art design generated', 20, yPosition + 10);
          
          // Note: Image URL for reference
          if (nailArtResult.generatedImages[i]) {
            pdf.text(`Image: ${nailArtResult.generatedImages[i]}`, 20, yPosition + 20);
          }
          
          yPosition += 40;
        }
        
        // Save PDF file
        const pdfFileName = `nail_art_${sessionId}_${Date.now()}.pdf`;
        const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);
        
        // Ensure uploads directory exists
        await fs.mkdir(path.dirname(pdfPath), { recursive: true });
        
        // Save PDF
        const pdfBuffer = pdf.output('arraybuffer');
        await fs.writeFile(pdfPath, Buffer.from(pdfBuffer));
        
        pdfUrl = `/uploads/${pdfFileName}`;
        console.log(`PDF saved successfully to: ${pdfPath}`);
        
      } catch (pdfError) {
        console.error("Error creating PDF:", pdfError);
        // Continue without PDF if generation fails
      }
      
      res.json({
        message: analysisResult.recommendations.includes("데모 모드") 
          ? "데모 모드: 네일아트 시뮬레이션이 완료되었습니다!" 
          : "네일아트 생성이 완료되었습니다!",
        sessionId,
        measurements: savedMeasurements,
        generatedImages: nailArtResult.generatedImages,
        descriptions: nailArtResult.descriptions,
        designSpecs: nailArtResult.designSpecs || [],
        pdfUrl: pdfUrl,
        totalImages: 10,
        analysisTime: `${Date.now() - startTime}ms`,
        demoMode: analysisResult.recommendations.includes("데모 모드"),
        recommendations: analysisResult.recommendations,
        success: true
      });
    } catch (error: any) {
      console.error("Photo analysis and generation error:", error);
      res.status(500).json({ message: error.message || "분석 및 생성 중 오류가 발생했습니다." });
    }
  });

  // Legacy AI analysis route
  app.post('/api/ai/analyze', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { photoIds, sessionId } = req.body;

      if (!photoIds || !Array.isArray(photoIds)) {
        return res.status(400).json({ message: "Photo IDs are required" });
      }

      // Get photos from storage
      const photos = await storage.getCustomerPhotos(userId);
      const analysisPhotos = photos.filter(photo => photoIds.includes(photo.id));

      if (analysisPhotos.length === 0) {
        return res.status(400).json({ message: "No valid photos found" });
      }

      // Convert images to base64
      const base64Images = [];
      const fingerTypes = [];

      for (const photo of analysisPhotos) {
        try {
          const imageBuffer = await fs.readFile(photo.filePath);
          const base64Image = imageBuffer.toString('base64');
          base64Images.push(base64Image);
          fingerTypes.push(photo.fingerType || 'unknown');
        } catch (error) {
          console.error(`Error reading photo ${photo.id}:`, error);
        }
      }

      if (base64Images.length === 0) {
        return res.status(500).json({ message: "Failed to process photos" });
      }

      // Analyze with AI
      const analysisResults = await analyzeNailShape(base64Images, fingerTypes);

      // Generate nail shape images and save results
      const savedNails = [];
      for (const result of analysisResults) {
        try {
          const shapeImageUrl = await generateNailShapeImage(result);
          
          const nailData = {
            userId,
            sessionId: sessionId || nanoid(),
            fingerType: result.fingerType,
            shapeData: result,
            imageUrl: shapeImageUrl,
          };

          const savedNail = await storage.saveAiGeneratedNail(nailData);
          savedNails.push(savedNail);
        } catch (error) {
          console.error(`Error generating shape for ${result.fingerType}:`, error);
        }
      }

      res.json({
        message: "Analysis completed successfully",
        results: analysisResults,
        generatedNails: savedNails,
        sessionId: sessionId || nanoid()
      });
    } catch (error) {
      console.error("Error analyzing nails:", error);
      res.status(500).json({ message: "Failed to analyze nails" });
    }
  });

  // Nail art generation routes
  app.post('/api/ai/generate-nail-art', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, stylePreferences } = req.body;

      if (!sessionId || !stylePreferences) {
        return res.status(400).json({ message: "Session ID and style preferences are required" });
      }

      // Get measurements from the session
      const aiNails = await storage.getAiGeneratedNails(userId, sessionId);
      if (!aiNails || aiNails.length === 0) {
        return res.status(400).json({ message: "No nail measurements found. Please complete photo analysis first." });
      }

      // Extract measurements from stored AI results
      const measurements = aiNails.map(nail => ({
        fingerType: nail.fingerType,
        nailWidth: parseFloat(nail.nailWidth || "10") || 10,
        nailLength: parseFloat(nail.nailLength || "12") || 12,
        nailCurvature: parseFloat(nail.nailCurvature || "5") || 5,
        fingerWidth: parseFloat(nail.fingerWidth || "15") || 15,
        fingerLength: parseFloat(nail.fingerLength || "25") || 25,
        shapeCategory: nail.shapeCategory || 'oval',
        confidence: parseFloat(nail.measurementConfidence || "0.8") || 0.8,
      }));

      // Generate nail art images
      const { generateNailArtImages } = await import('./nailArtGenerator');
      const generatedArt = await generateNailArtImages({
        measurements,
        stylePreferences,
        sessionId,
      });

      res.json({
        message: "Nail art generated successfully",
        generatedArt,
        sessionId,
      });

    } catch (error: any) {
      console.error("Error generating nail art:", error);
      res.status(500).json({ message: error.message || "네일아트 생성 중 오류가 발생했습니다." });
    }
  });

  app.post('/api/ai/combine-design', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, fingerType, designImagePath } = req.body;

      if (!sessionId || !fingerType || !designImagePath) {
        return res.status(400).json({ message: "Session ID, finger type, and design image path are required" });
      }

      // Get original photo and measurements
      const photos = await storage.getCustomerPhotos(userId);
      const originalPhoto = photos.find(p => p.fingerType === fingerType);
      
      if (!originalPhoto) {
        return res.status(404).json({ message: "Original nail photo not found" });
      }

      // Get measurements
      const aiNails = await storage.getAiGeneratedNails(userId, sessionId);
      const nailData = aiNails.find(n => n.fingerType === fingerType);
      
      if (!nailData) {
        return res.status(404).json({ message: "Nail measurements not found" });
      }

      const measurement = {
        fingerType: nailData.fingerType,
        nailWidth: parseFloat(nailData.nailWidth || "10") || 10,
        nailLength: parseFloat(nailData.nailLength || "12") || 12,
        nailCurvature: parseFloat(nailData.nailCurvature || "5") || 5,
        fingerWidth: parseFloat(nailData.fingerWidth || "15") || 15,
        fingerLength: parseFloat(nailData.fingerLength || "25") || 25,
        shapeCategory: nailData.shapeCategory || 'oval',
        confidence: parseFloat(nailData.measurementConfidence || "0.8") || 0.8,
      };

      // Combine images
      const { combineNailWithDesign } = await import('./nailArtGenerator');
      const combinedImage = await combineNailWithDesign(
        originalPhoto.filePath,
        designImagePath,
        measurement,
        sessionId
      );

      res.json({
        message: "Images combined successfully",
        combinedImage,
      });

    } catch (error: any) {
      console.error("Error combining images:", error);
      res.status(500).json({ message: error.message || "이미지 결합 중 오류가 발생했습니다." });
    }
  });

  // Nail designs routes
  app.get('/api/designs', async (req, res) => {
    try {
      const { category } = req.query;
      const designs = await storage.getNailDesigns(category as string);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching designs:", error);
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  app.get('/api/designs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getNailDesign(id);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }

      res.json(design);
    } catch (error) {
      console.error("Error fetching design:", error);
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  // Orders routes
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { designId, sessionId, totalAmount } = req.body;

      const orderData = {
        userId,
        designId: designId ? parseInt(designId) : null,
        sessionId,
        totalAmount,
        paymentStatus: "pending",
        printStatus: "waiting",
      };

      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updates = req.body;

      const order = await storage.updateOrder(orderId, updates);
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Customer routes
  app.get("/api/customers/check-phone", async (req, res) => {
    try {
      const phoneNumber = req.query.phone as string;
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      
      const customer = await storage.getCustomerByPhone(phoneNumber);
      res.json({ exists: !!customer, customer });
    } catch (error) {
      console.error("Error checking phone number:", error);
      res.status(500).json({ message: "Failed to check phone number" });
    }
  });

  // Appointment routes
  app.get("/api/appointments/booked-slots/:date", async (req, res) => {
    try {
      const date = new Date(req.params.date + 'T00:00:00');
      const bookedSlots = await storage.getBookedSlotsByDate(date);
      res.json(bookedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      res.status(500).json({ message: "Failed to fetch booked slots" });
    }
  });

  app.get("/api/appointments/available-slots", isAuthenticated, async (req: any, res) => {
    try {
      const dateString = req.query.date as string;
      if (!dateString) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const date = new Date(dateString);
      const availableSlots = await storage.getAvailableTimeSlots(date);
      res.json(availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ message: "Failed to fetch available slots" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const { appointmentDate, timeSlot, visitReason, customer, mailingList } = req.body;
      
      // Check if appointment slot is already booked
      const existingAppointment = await storage.getAppointmentByDateAndTime(
        appointmentDate, 
        timeSlot
      );
      
      if (existingAppointment) {
        return res.status(400).json({ message: "시간대가 이미 예약되었습니다" });
      }
      
      // Create or update customer
      const savedCustomer = await storage.upsertCustomer({
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        email: customer.email || null,
        visitType: customer.visitType,
      });
      
      // Create appointment
      const appointment = await storage.createAppointment({
        customerId: savedCustomer.id,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        visitReason: visitReason || "일반 방문",
        status: "scheduled",
        notes: mailingList ? "메일링 리스트 가입" : null,
      });
      
      res.json({ appointment, customer: savedCustomer });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const { period = "day", date, view = "appointments", status } = req.query;
      const appointments = await storage.getAppointmentsByPeriod(
        period as string,
        date as string || new Date().toISOString(),
        view as string
      );
      
      let filteredAppointments = appointments;
      if (status && status !== "all") {
        filteredAppointments = appointments.filter(apt => apt.status === status);
      }
      
      res.json(filteredAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Admin appointment management
  app.put("/api/admin/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedAppointment = await storage.updateAppointment(appointmentId, updates);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete("/api/admin/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      
      // Instead of deleting, mark as cancelled
      const updatedAppointment = await storage.updateAppointment(appointmentId, {
        status: "cancelled"
      });
      
      res.json({ message: "Appointment cancelled", appointment: updatedAppointment });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      res.status(500).json({ message: "Failed to cancel appointment" });
    }
  });

  // Style preferences routes
  app.get("/api/style-preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserStylePreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching style preferences:", error);
      res.status(500).json({ message: "Failed to fetch style preferences" });
    }
  });

  app.post("/api/style-preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferencesData = {
        userId,
        ...req.body
      };
      
      const preferences = await storage.upsertUserStylePreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error saving style preferences:", error);
      res.status(500).json({ message: "Failed to save style preferences" });
    }
  });

  // Custom design routes
  app.get("/api/custom-designs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const designs = await storage.getUserCustomNailDesigns(userId);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching custom designs:", error);
      res.status(500).json({ message: "Failed to fetch custom designs" });
    }
  });

  // Get AI measurements route
  app.get("/api/ai/measurements/:sessionId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.params;
      
      const measurements = await storage.getAiGeneratedNails(userId, sessionId);
      res.json(measurements);
    } catch (error) {
      console.error("Error fetching measurements:", error);
      res.status(500).json({ message: "측정 데이터를 가져오는 중 오류가 발생했습니다." });
    }
  });

  // Generate design with measurements route
  app.post("/api/designs/generate-with-measurements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, customPrompt, stylePreferences } = req.body;
      
      // Get measurements
      const measurements = await storage.getAiGeneratedNails(userId, sessionId);
      
      if (!measurements || measurements.length === 0) {
        return res.status(400).json({ message: "손톱 측정 데이터가 필요합니다." });
      }

      // Import and use nail measurement AI
      const { generateNailArtWithMeasurements } = await import("./nailMeasurementAI");
      
      // Convert database measurements to the expected format
      const formattedMeasurements = measurements.map((m: any) => ({
        fingerType: m.fingerType,
        nailWidth: parseFloat(m.nailWidth),
        nailLength: parseFloat(m.nailLength),
        nailCurvature: parseFloat(m.nailCurvature),
        fingerWidth: parseFloat(m.fingerWidth),
        fingerLength: parseFloat(m.fingerLength),
        shapeCategory: m.shapeCategory,
        confidence: parseFloat(m.measurementConfidence)
      }));
      
      const designUrl = await generateNailArtWithMeasurements(
        formattedMeasurements,
        customPrompt,
        stylePreferences
      );
      
      res.json({
        designUrl,
        sessionId,
        measurements: formattedMeasurements
      });
    } catch (error) {
      console.error("Error generating design with measurements:", error);
      res.status(500).json({ message: error.message || "디자인 생성 중 오류가 발생했습니다." });
    }
  });

  // Advanced design generation route
  app.post("/api/designs/generate-advanced", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, customPrompt, advancedPreferences } = req.body;
      
      // Get measurements
      const measurements = await storage.getAiGeneratedNails(userId, sessionId);
      
      if (!measurements || measurements.length === 0) {
        return res.status(400).json({ message: "손톱 측정 데이터가 필요합니다." });
      }

      // Import advanced design generator
      const { generateAdvancedNailDesign } = await import("./advancedDesignGenerator");
      
      // Convert database measurements to the expected format
      const formattedMeasurements = measurements.map((m: any) => ({
        fingerType: m.fingerType,
        nailWidth: parseFloat(m.nailWidth),
        nailLength: parseFloat(m.nailLength),
        nailCurvature: parseFloat(m.nailCurvature),
        fingerWidth: parseFloat(m.fingerWidth),
        fingerLength: parseFloat(m.fingerLength),
        shapeCategory: m.shapeCategory,
        confidence: parseFloat(m.measurementConfidence)
      }));
      
      const designUrl = await generateAdvancedNailDesign(
        formattedMeasurements,
        advancedPreferences,
        customPrompt
      );
      
      res.json({
        designUrl,
        sessionId,
        measurements: formattedMeasurements,
        preferences: advancedPreferences
      });
    } catch (error) {
      console.error("Error generating advanced design:", error);
      res.status(500).json({ message: error.message || "고급 디자인 생성 중 오류가 발생했습니다." });
    }
  });

  // Generate design variations route
  app.post("/api/designs/generate-variations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, advancedPreferences, variationCount = 3 } = req.body;
      
      // Get measurements
      const measurements = await storage.getAiGeneratedNails(userId, sessionId);
      
      if (!measurements || measurements.length === 0) {
        return res.status(400).json({ message: "손톱 측정 데이터가 필요합니다." });
      }

      // Import advanced design generator
      const { generateDesignVariations } = await import("./advancedDesignGenerator");
      
      // Convert database measurements to the expected format
      const formattedMeasurements = measurements.map((m: any) => ({
        fingerType: m.fingerType,
        nailWidth: parseFloat(m.nailWidth),
        nailLength: parseFloat(m.nailLength),
        nailCurvature: parseFloat(m.nailCurvature),
        fingerWidth: parseFloat(m.fingerWidth),
        fingerLength: parseFloat(m.fingerLength),
        shapeCategory: m.shapeCategory,
        confidence: parseFloat(m.measurementConfidence)
      }));
      
      const designUrls = await generateDesignVariations(
        formattedMeasurements,
        advancedPreferences,
        variationCount
      );
      
      res.json({
        designUrls,
        sessionId,
        variationCount: designUrls.length
      });
    } catch (error) {
      console.error("Error generating design variations:", error);
      res.status(500).json({ message: error.message || "디자인 변형 생성 중 오류가 발생했습니다." });
    }
  });

  // Analyze design recommendations route
  app.post("/api/designs/analyze-recommendations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, advancedPreferences } = req.body;
      
      // Get measurements
      const measurements = await storage.getAiGeneratedNails(userId, sessionId);
      
      if (!measurements || measurements.length === 0) {
        return res.status(400).json({ message: "손톱 측정 데이터가 필요합니다." });
      }

      // Import advanced design generator
      const { analyzeDesignRecommendations } = await import("./advancedDesignGenerator");
      
      // Convert database measurements to the expected format
      const formattedMeasurements = measurements.map((m: any) => ({
        fingerType: m.fingerType,
        nailWidth: parseFloat(m.nailWidth),
        nailLength: parseFloat(m.nailLength),
        nailCurvature: parseFloat(m.nailCurvature),
        fingerWidth: parseFloat(m.fingerWidth),
        fingerLength: parseFloat(m.fingerLength),
        shapeCategory: m.shapeCategory,
        confidence: parseFloat(m.measurementConfidence)
      }));
      
      const analysis = await analyzeDesignRecommendations(formattedMeasurements, advancedPreferences);
      
      res.json({
        analysis,
        sessionId
      });
    } catch (error) {
      console.error("Error analyzing design recommendations:", error);
      res.status(500).json({ message: error.message || "디자인 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/custom-designs/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { customPrompt, baseDesignId, stylePreferencesId, nailAnalysis } = req.body;
      
      // Import the AI design generator functions
      const { generateDesignPrompt, generateCustomDesignImage, calculateCustomDesignPricing } = await import("./aiDesignGenerator");
      
      // Get user's style preferences
      const stylePreferences = await storage.getUserStylePreferences(userId);
      
      // Generate enhanced prompt
      const enhancedPrompt = await generateDesignPrompt({
        customPrompt,
        stylePreferences,
        nailAnalysis,
        baseDesignId
      });
      
      // Generate design image
      const generatedImageUrl = await generateCustomDesignImage(enhancedPrompt);
      
      // Calculate pricing
      const customization = {
        colors: stylePreferences?.preferredColors || [],
        style: stylePreferences?.preferredStyles?.join(", ") || "modern",
        complexity: stylePreferences?.complexity || "medium",
        occasion: stylePreferences?.occasions?.[0] || "daily",
        personalizedElements: customPrompt.split(" ").filter((word: string) => word.length > 3)
      };
      
      const price = calculateCustomDesignPricing(customization);
      
      // Save custom design
      const designData = {
        userId,
        sessionId: req.body.sessionId || `custom_${Date.now()}`,
        designPrompt: enhancedPrompt,
        generatedImageUrl,
        stylePreferencesId: stylePreferences?.id || null,
        baseDesignId: baseDesignId || null,
        customization,
        generationParams: {
          model: "dalle-3",
          prompt: enhancedPrompt,
          timestamp: new Date().toISOString()
        },
        price: price.toString(),
        status: "generated"
      };
      
      const savedDesign = await storage.createCustomNailDesign(designData);
      res.json(savedDesign);
    } catch (error) {
      console.error("Error generating custom design:", error);
      res.status(500).json({ message: "Failed to generate custom design" });
    }
  });

  app.get("/api/custom-designs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const designId = parseInt(req.params.id);
      const design = await storage.getCustomNailDesign(designId);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      console.error("Error fetching custom design:", error);
      res.status(500).json({ message: "Failed to fetch custom design" });
    }
  });

  app.post("/api/custom-designs/:id/save", isAuthenticated, async (req: any, res) => {
    try {
      const designId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const design = await storage.getCustomNailDesign(designId);
      if (!design || design.userId !== userId) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      // Create order for custom design
      const orderData = {
        userId,
        designId: null, // Custom designs don't use regular design ID
        sessionId: design.sessionId,
        totalAmount: design.price || "50000",
        paymentStatus: "pending",
        printStatus: "waiting"
      };
      
      const order = await storage.createOrder(orderData);
      
      // Update design status
      await storage.updateCustomNailDesign(designId, { status: "approved" });
      
      res.json({ order, design });
    } catch (error) {
      console.error("Error saving custom design:", error);
      res.status(500).json({ message: "Failed to save custom design" });
    }
  });

  // Admin routes (temporarily allow all authenticated users for demo)
  app.get("/api/admin/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const dateString = req.query.date as string;
      let appointments;
      
      if (dateString) {
        const date = new Date(dateString);
        appointments = await storage.getAllAppointments(date);
      } else {
        appointments = await storage.getAllAppointments();
      }
      
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching admin appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/admin/orders", isAuthenticated, async (req: any, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:id", isAuthenticated, async (req: any, res) => {
    try {
      const targetUserId = req.params.id;
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(targetUserId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.put("/api/admin/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedAppointment = await storage.updateAppointment(appointmentId, updates);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete("/api/admin/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      
      await storage.deleteAppointment(appointmentId);
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  app.post("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const adminData = req.body;
      const admin = await storage.createAdminUser(adminData);
      res.status(201).json(admin);
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  // Appointment routes
  app.post("/api/appointments", async (req, res) => {
    try {
      const { customerName, phoneNumber, email, visitType, appointmentDate, timeSlot } = req.body;
      
      // Validate required fields
      if (!customerName || !phoneNumber || !visitType || !appointmentDate || !timeSlot) {
        return res.status(400).json({ message: "필수 정보가 누락되었습니다." });
      }

      // Check if time slot is already booked
      const existingAppointment = await storage.getAppointmentByDateAndTime(appointmentDate, timeSlot);
      if (existingAppointment) {
        return res.status(409).json({ message: "선택한 시간대가 이미 예약되었습니다." });
      }

      // Create or update customer
      const customer = await storage.upsertCustomer({
        name: customerName,
        phoneNumber,
        email: email || null,
        visitType,
      });

      // Create appointment
      const appointment = await storage.createAppointment({
        customerId: customer.id,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: "scheduled",
      });

      res.status(201).json({ appointment, customer });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "예약 생성 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/appointments/booked-slots", async (req, res) => {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ message: "날짜를 지정해주세요." });
      }

      const bookedSlots = await storage.getBookedSlotsByDate(new Date(date as string));
      res.json(bookedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      res.status(500).json({ message: "예약된 시간대 조회 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const { period, date, view } = req.query;
      const appointments = await storage.getAppointmentsByPeriod(
        period as string,
        date as string,
        view as string
      );
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "예약 조회 중 오류가 발생했습니다." });
    }
  });

  // PayPal routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Analytics routes
  app.get('/api/analytics/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Track this page view
      await storage.trackUserActivity({
        userId,
        sessionId: req.sessionID,
        activityType: 'analytics_view',
        pagePath: '/analytics',
        deviceInfo: {
          userAgent: req.headers['user-agent'],
        },
        ipAddress: req.ip,
        createdAt: new Date(),
      });

      const engagement = await storage.getUserEngagementMetrics(userId);
      res.json(engagement);
    } catch (error: any) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get('/api/analytics/design-interactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interactions = await storage.getDesignInteractions(userId);
      res.json(interactions);
    } catch (error: any) {
      console.error("Error fetching design interactions:", error);
      res.status(500).json({ message: "Failed to fetch design interactions" });
    }
  });

  app.post('/api/analytics/track', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { activityType, activityData, pagePath, duration } = req.body;

      await storage.trackUserActivity({
        userId,
        sessionId: req.sessionID,
        activityType,
        activityData,
        pagePath,
        deviceInfo: {
          userAgent: req.headers['user-agent'],
        },
        ipAddress: req.ip,
        duration,
        createdAt: new Date(),
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error tracking activity:", error);
      res.status(500).json({ message: "Failed to track activity" });
    }
  });

  app.post('/api/analytics/design-interaction', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { designId, customDesignId, interactionType, rating, timeSpent, interactionData } = req.body;

      await storage.trackDesignInteraction({
        userId,
        designId,
        customDesignId,
        interactionType,
        rating,
        timeSpent,
        interactionData,
        createdAt: new Date(),
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error tracking design interaction:", error);
      res.status(500).json({ message: "Failed to track design interaction" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}
