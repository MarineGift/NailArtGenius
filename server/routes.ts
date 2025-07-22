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
      const userId = req.user.claims.sub;
      const { sessionId, fingerType, photoType } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ message: "사진 파일이 필요합니다." });
      }

      // Save photo information to database
      const photoData = {
        userId,
        sessionId,
        fileName: req.file.filename,
        filePath: req.file.path,
        photoType,
        fingerType,
        cardDetected: false, // Will be updated during analysis
      };

      const savedPhoto = await storage.saveCustomerPhoto(photoData);
      
      res.json({
        id: savedPhoto.id,
        imageUrl: `/uploads/${req.file.filename}`,
        fingerType,
        photoType
      });
    } catch (error) {
      console.error("Photo upload error:", error);
      res.status(500).json({ message: "사진 업로드 중 오류가 발생했습니다." });
    }
  });

  // Photo analysis route for nail measurements
  app.post("/api/photos/analyze", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.body;
      
      // Get all photos for this session
      const photos = await storage.getCustomerPhotos(userId, sessionId);
      
      if (photos.length < 6) {
        return res.status(400).json({ message: "6장의 사진이 모두 필요합니다." });
      }

      // Import nail measurement AI functions
      const { analyzeNailPhotos } = await import("./nailMeasurementAI");
      
      // Analyze photos and get measurements
      const measurements = await analyzeNailPhotos(sessionId, photos);
      
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
      
      res.json({
        measurements: savedMeasurements,
        sessionId,
        success: true
      });
    } catch (error: any) {
      console.error("Photo analysis error:", error);
      res.status(500).json({ message: error.message || "사진 분석 중 오류가 발생했습니다." });
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

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}
