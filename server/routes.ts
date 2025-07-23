import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { initializeDefaultAdmin, authenticateAdmin, verifyPassword, generateToken, hashPassword } from "./admin-auth";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { analyzeNailShape, generateNailShapeImage } from "./openai";
import { generateNailArt, analyzeNailArt } from "./aiNailGenerator";
import { 
  insertCustomerSchema, 
  insertAppointmentSchema, 
  insertCarouselImageSchema, 
  insertCustomerNailImageSchema, 
  insertCustomerReservationSchema, 
  insertContactInquirySchema,
  insertGallerySchema,
  insertAiNailArtImageSchema
} from "@shared/schema";
import { db } from "./db";
import { smsService } from "./smsService";
import {
  customers,
  customerPurchases,
  smsTemplates,
  smsHistory,
  contactInquiries,
  customerNailImages,
  customerReservations,
  carouselImages,
  gallery,
  galleryDesc,
  aiNailArtImages,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
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
  // Initialize default admin user
  await initializeDefaultAdmin();
  
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

  // Admin authentication routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      // Use admin_users table for all admin authentication
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }

      const isValidPassword = await verifyPassword(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }

      if (!admin.isActive) {
        return res.status(401).json({ message: 'Account is deactivated.' });
      }

      // Update last login time
      await storage.updateAdminLastLogin(admin.id);

      // Generate JWT token
      const token = generateToken(admin);

      res.json({
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Error occurred during login process.' });
    }
  });

  // Admin logout route
  app.post('/api/admin/logout', async (req, res) => {
    try {
      // Simply clear the session/token on the client side
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({ message: 'Error occurred during logout.' });
    }
  });

  // Admin registration route
  app.post('/api/admin/register', async (req, res) => {
    try {
      const { name, email, phoneNumber, username, password } = req.body;
      
      if (!name || !email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Check if username already exists
      const existingAdmin = await storage.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ message: 'Username already exists.' });
      }

      // Hash password and create admin (inactive by default)
      const hashedPassword = await hashPassword(password);
      const newAdmin = await storage.createAdmin({
        name,
        email,
        username,
        password: hashedPassword,
        role: 'admin',
        isActive: false, // Needs admin activation
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.status(201).json({
        message: 'Admin account created successfully. Please contact an administrator to activate your account.',
        admin: {
          id: newAdmin.id,
          username: newAdmin.username,
          name: newAdmin.name,
          email: newAdmin.email
        }
      });
    } catch (error) {
      console.error('Admin registration error:', error);
      res.status(500).json({ message: 'Error occurred during registration.' });
    }
  });

  // Password reset route
  app.post('/api/admin/password-reset', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }

      // In a real application, you would send an email here
      // For now, we'll just return a success message
      res.json({
        message: 'If an account with that email exists, password reset instructions have been sent.'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'Error occurred during password reset.' });
    }
  });

  // Create admin user route
  app.post('/api/admin/create-user', authenticateAdmin, async (req: any, res) => {
    try {
      const { username, password, firstName, lastName, email, level } = req.body;
      
      if (!username || !password || !firstName || !lastName || !level) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
      }

      // Check if user already exists
      const existingUser = await storage.getUser(username);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }

      // Hash password if it's an admin user
      let hashedPassword = password;
      if (level === 'admin') {
        hashedPassword = await hashPassword(password);
      }

      const newUser = await storage.createUserFromAdmin({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        level
      });

      res.status(201).json({
        message: 'User created successfully.',
        user: {
          id: newUser.id,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          level: newUser.level
        }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Error occurred while creating user.' });
    }
  });

  // Admin dashboard data
  app.get('/api/admin/dashboard', authenticateAdmin, async (req: any, res) => {
    try {
      const customers = await storage.getAllCustomers();
      const appointments = await storage.getAllAppointments();
      const orders = await storage.getAllOrders();
      const users = await storage.getAllUsers();

      // Calculate statistics
      const stats = {
        totalCustomers: customers.length,
        totalAppointments: appointments.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        recentCustomers: customers.slice(0, 10),
        recentAppointments: appointments.slice(0, 10),
        todayAppointments: appointments.filter(apt => {
          const today = new Date();
          const aptDate = new Date(apt.appointmentDate);
          return aptDate.toDateString() === today.toDateString();
        }).length
      };

      res.json(stats);
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).json({ message: 'Error occurred while fetching dashboard data.' });
    }
  });

  // Customer management routes
  app.get('/api/admin/customers', authenticateAdmin, async (req: any, res) => {
    try {
      const { category } = req.query;
      
      let customers;
      if (category) {
        customers = await storage.getCustomersByCategory(category);
      } else {
        customers = await storage.getAllCustomers();
      }

      res.json(customers);
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({ message: '고객 목록을 가져오는 중 오류가 발생했습니다.' });
    }
  });

  // Appointments management routes  
  app.get('/api/admin/appointments', authenticateAdmin, async (req: any, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      
      // Transform appointments to include customer information
      const appointmentsWithCustomers = appointments.map(apt => ({
        id: apt.id,
        customerName: 'Unknown', // Will be populated from join
        customerPhone: 'N/A', // Will be populated from join
        service: apt.visitReason || 'General Service',
        appointmentDate: apt.appointmentDate,
        timeSlot: apt.timeSlot,
        status: apt.status || 'confirmed',
        totalAmount: parseFloat(apt.price || '0') || 0,
        createdAt: apt.createdAt || new Date(),
        notes: apt.notes || ''
      }));

      res.json(appointmentsWithCustomers);
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({ message: 'Failed to load appointments.' });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    const Stripe = (await import('stripe')).default;
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe secret key not configured' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20" as any,
    });

    try {
      const { amount, currency = 'usd', bookingDetails } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          bookingService: bookingDetails?.service?.toString() || '',
          bookingDate: bookingDetails?.date || '',
          bookingTimeSlot: bookingDetails?.timeSlot || '',
          customerPhone: bookingDetails?.phone || ''
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // PayPal routes (keeping existing functionality)
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

  // Get latest nail art results for PDF preview
  app.get('/api/photos/latest-results/:sessionId?', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = req.params.sessionId;

      // Get the latest AI generated nails for the user
      const aiNails = await storage.getAiGeneratedNails(userId, sessionId);
      
      if (aiNails.length === 0) {
        return res.status(404).json({ message: "생성된 네일아트 결과가 없습니다." });
      }

      // Filter by session ID if provided
      const filteredNails = sessionId 
        ? aiNails.filter(nail => nail.sessionId === sessionId)
        : aiNails;

      if (filteredNails.length === 0) {
        return res.status(404).json({ message: "해당 세션의 결과를 찾을 수 없습니다." });
      }

      // Group by session and get the most recent
      const sessionGroups = filteredNails.reduce((acc, nail) => {
        const session = nail.sessionId || 'default';
        if (!acc[session]) {
          acc[session] = [];
        }
        acc[session].push(nail);
        return acc;
      }, {} as Record<string, any[]>);

      const latestSession = Object.keys(sessionGroups).sort().pop();
      const latestNails = sessionGroups[latestSession || 'default'];

      // Format response for PDF preview
      const generatedImages = latestNails
        .map(nail => nail.generatedImageUrl || nail.imageUrl || '')
        .filter(Boolean);

      const descriptions = latestNails.map(nail => 
        `${nail.fingerType} 손가락용 네일아트 (${nail.nailWidthMm?.toFixed(1) || 'N/A'}mm × ${nail.nailLengthMm?.toFixed(1) || 'N/A'}mm)`
      );

      const designSpecs = latestNails.map(nail => ({
        fingerType: nail.fingerType,
        designDescription: `${nail.fingerType} 손가락을 위한 맞춤형 디자인`,
        estimatedSize: `${nail.nailWidthMm?.toFixed(1) || 'N/A'}mm × ${nail.nailLengthMm?.toFixed(1) || 'N/A'}mm`,
        designComplexity: nail.shapeCategory || 'medium'
      }));

      // Check for existing PDF file
      const pdfFileName = `nail_art_${latestSession}_*.pdf`;
      let pdfUrl = '';
      try {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const files = await fs.readdir(uploadsDir);
        const pdfFile = files.find(file => file.startsWith(`nail_art_${latestSession}_`) && file.endsWith('.pdf'));
        if (pdfFile) {
          pdfUrl = `/uploads/${pdfFile}`;
        }
      } catch (error) {
        console.log("No PDF file found, will generate on request");
      }

      res.json({
        generatedImages,
        descriptions,
        designSpecs,
        pdfUrl,
        sessionId: latestSession,
        totalImages: generatedImages.length,
        demoMode: latestNails.some(nail => nail.fingerType?.includes('demo')),
        success: true
      });

    } catch (error) {
      console.error("Error fetching latest results:", error);
      res.status(500).json({ message: "결과를 불러오는 중 오류가 발생했습니다." });
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
        analysisTime: `${Date.now() - new Date().getTime()}ms`,
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
      const { 
        appointmentDate, 
        timeSlot, 
        visitReason, 
        customerName, 
        customerPhone, 
        customerEmail, 
        notes,
        serviceId,
        isOnlinePayment,
        finalPrice,
        customer, 
        mailingList 
      } = req.body;
      
      // Check if appointment slot has capacity (max 3 people per time slot)
      const existingAppointments = await storage.getAppointmentsByDateAndTime(
        appointmentDate, 
        timeSlot
      );
      
      if (existingAppointments.length >= 3) {
        return res.status(400).json({ 
          message: "Sorry, this time slot is fully booked. Please select a different time." 
        });
      }
      
      // Create or update customer - handle both old format (customer object) and new format (individual fields)
      const customerData = customer ? {
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        email: customer.email || null,
        visitType: customer.visitType,
      } : {
        name: customerName || customerPhone, // Use phone as name if name not provided
        phoneNumber: customerPhone,
        email: customerEmail || null,
        visitType: "appointment",
      };
      
      const savedCustomer = await storage.upsertCustomer(customerData);
      
      // Create appointment
      const appointmentNotes = [
        notes,
        mailingList ? "Mailing list subscription" : null,
        isOnlinePayment ? `Online payment: $${finalPrice}` : null
      ].filter(Boolean).join("; ");

      const appointment = await storage.createAppointment({
        customerId: savedCustomer.id,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        visitReason: visitReason || "General visit",
        status: "scheduled",
        notes: appointmentNotes || null,
      });
      
      // Send SMS confirmation to customer
      try {
        const appointmentDateTime = new Date(appointmentDate);
        const formattedDate = appointmentDateTime.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        });
        const formattedTime = appointmentDateTime.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        const smsMessage = `[Connie's Nail] ${savedCustomer.name}님, ${formattedDate} ${timeSlot}에 예약이 완료되었습니다. 문의: 02-1234-5678`;
        
        await smsService.sendSMS(savedCustomer.phoneNumber || '', smsMessage);
        console.log(`SMS sent successfully to ${savedCustomer.phoneNumber}`);
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
        // Don't fail the appointment creation if SMS fails
      }
      
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

  // Gallery Management Routes  
  app.get("/api/gallery", async (req, res) => {
    try {
      // Return mock data until database schema is set up
      const mockGalleryItems = [
        {
          id: 1,
          title: "Classic French Manicure",
          description: "전통적인 프렌치 매니큐어 스타일",
          category: "classic",
          image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
          price: "$45",
          duration: "45분",
          difficulty: "beginner",
          rating: 4.8,
          reviews: 127,
          techniques: ["베이스 코팅", "화이트 팁", "탑 코팅"],
          materials: ["젤 베이스", "화이트 젤", "클리어 탑코트"],
          aftercare: "2-3주 지속, 오일 케어 권장",
          suitableFor: "모든 행사, 직장, 일상",
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 2,
          title: "Floral Design",
          description: "섬세한 꽃 무늬 네일아트",
          category: "floral",
          image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=400&fit=crop",
          price: "$65",
          duration: "90분",
          difficulty: "advanced",
          rating: 4.9,
          reviews: 89,
          techniques: ["손그림 아트", "그라데이션", "세밀 터치"],
          materials: ["아크릴 페인트", "세밀 브러시", "젤 탑코트"],
          aftercare: "3-4주 지속, 손 보호 권장",
          suitableFor: "특별한 행사, 웨딩, 파티",
          isActive: true,
          createdAt: new Date()
        }
      ];
      
      res.json(mockGalleryItems);
    } catch (error: any) {
      console.error("Error fetching gallery items:", error);
      res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });

  app.post("/api/gallery", isAuthenticated, async (req, res) => {
    try {
      const galleryItemData = req.body;
      
      if (!galleryItemData.title || !galleryItemData.description || !galleryItemData.category) {
        return res.status(400).json({ message: "Title, description, and category are required" });
      }

      const newItem = {
        id: Date.now(),
        ...galleryItemData,
        createdAt: new Date(),
        isActive: true
      };
      
      res.status(201).json(newItem);
    } catch (error: any) {
      console.error("Error creating gallery item:", error);
      res.status(500).json({ message: "Failed to create gallery item" });
    }
  });

  app.put("/api/gallery/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedItem = {
        id: parseInt(id),
        ...updateData,
        updatedAt: new Date()
      };
      
      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating gallery item:", error);
      res.status(500).json({ message: "Failed to update gallery item" });
    }
  });

  app.delete("/api/gallery/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      res.json({ message: "Gallery item deleted successfully", id: parseInt(id) });
    } catch (error: any) {
      console.error("Error deleting gallery item:", error);
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });

  // Real-time booking routes
  app.get("/api/real-time-availability/:date", async (req, res) => {
    try {
      const { date } = req.params;
      
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }

      // Generate time slots (10:00 AM to 7:00 PM, 30-minute intervals)
      const timeSlots = [];
      for (let hour = 10; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          if (hour === 18 && minute > 0) break; // Stop at 6:30 PM
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          timeSlots.push(timeString);
        }
      }

      // Check which slots are booked
      const bookedSlots = await storage.getBookedSlotsByDate(date);
      const bookedTimes = bookedSlots.map(slot => slot.timeSlot);

      const availableTimeSlots = timeSlots.map(time => ({
        time,
        available: !bookedTimes.includes(time),
        booked: bookedTimes.includes(time)
      }));

      const totalSlots = timeSlots.length;
      const bookedCount = bookedTimes.length;
      const availableCount = totalSlots - bookedCount;

      const availability = {
        date,
        totalSlots,
        availableSlots: availableCount,
        bookedSlots: bookedCount,
        timeSlots: availableTimeSlots,
        lastUpdated: new Date().toISOString()
      };

      res.json(availability);
    } catch (error: any) {
      console.error("Error fetching real-time availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  app.post("/api/real-time-appointments", async (req, res) => {
    try {
      const { appointmentDate, timeSlot, serviceId, serviceName, duration, price, customer, realTimeBooking } = req.body;
      
      // Double-check availability before booking (prevent race conditions)
      const existingAppointment = await storage.getAppointmentByDateAndTime(
        appointmentDate, 
        timeSlot
      );
      
      if (existingAppointment) {
        return res.status(409).json({ 
          message: "시간대가 이미 예약되었습니다. 다른 시간을 선택해 주세요.",
          code: "SLOT_ALREADY_BOOKED"
        });
      }
      
      // Create or update customer
      const savedCustomer = await storage.upsertCustomer({
        name: customer.name,
        phoneNumber: customer.phone,
        email: customer.email || null,
        visitType: customer.visitType,
      });
      
      // Create appointment with real-time booking flag
      const appointment = await storage.createAppointment({
        customerId: savedCustomer.id,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        visitReason: serviceName || "일반 방문",
        status: "confirmed", // Real-time bookings are immediately confirmed
        notes: customer.notes || null,
        serviceId: serviceId || null,
        duration: duration || 60,
        price: price || 0,
        // realTimeBooking: true // This field doesn't exist in schema
      });
      
      res.json({ 
        appointment, 
        customer: savedCustomer,
        message: "실시간 예약이 완료되었습니다!",
        realTimeConfirmation: true
      });
    } catch (error: any) {
      console.error("Error creating real-time appointment:", error);
      res.status(500).json({ 
        message: "예약 처리 중 오류가 발생했습니다.",
        code: "BOOKING_ERROR"
      });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      // Return actual services from database
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
      const admin = await storage.createAdmin(adminData);
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

  // Enhanced booking system routes
  app.get('/api/services', async (req, res) => {
    try {
      const { category } = req.query;
      let services;
      
      if (category && typeof category === 'string') {
        services = await storage.getServicesByCategory(category);
      } else {
        services = await storage.getAllServices();
      }
      
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/availability/:date', async (req, res) => {
    try {
      const { date } = req.params;
      const { serviceId } = req.query;
      
      const requestedDate = new Date(date);
      if (isNaN(requestedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const availableSlots = await storage.getAvailableTimeSlotsWithService(
        requestedDate, 
        serviceId ? parseInt(serviceId as string) : undefined
      );
      
      res.json({ 
        date,
        availableSlots,
        totalSlots: availableSlots.length
      });
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  app.post('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = req.body;
      
      // Validate appointment data (remove userId from validation since it's not in schema)
      const validatedData = insertAppointmentSchema.parse({
        ...appointmentData,
      });
      
      // Check if time slot is still available
      const isAvailable = await storage.isTimeSlotAvailable(
        new Date(validatedData.appointmentDate),
        validatedData.timeSlot
      );
      
      if (!isAvailable) {
        return res.status(409).json({ 
          message: "선택한 시간은 이미 예약되어 있습니다. 다른 시간을 선택해 주세요.",
          code: "TIME_SLOT_UNAVAILABLE" 
        });
      }

      // Create customer if needed
      let customer;
      if (appointmentData.customerPhone) {
        customer = await storage.getCustomerByPhone(appointmentData.customerPhone);
        if (!customer) {
          customer = await storage.upsertCustomer({
            name: appointmentData.customerName,
            phoneNumber: appointmentData.customerPhone,
            email: appointmentData.customerEmail,
            visitType: "인터넷예약"
          });
        }
      }

      // Create appointment (ensure customerId is provided)
      if (!customer) {
        return res.status(400).json({ 
          message: "고객 정보 생성에 실패했습니다.",
          code: "CUSTOMER_CREATION_FAILED" 
        });
      }

      const appointment = await storage.createAppointment({
        ...validatedData,
        customerId: customer.id,
      });
      
      res.json({
        message: "예약이 성공적으로 완료되었습니다!",
        appointment,
        success: true
      });
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "예약 정보가 올바르지 않습니다.",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "예약 생성 중 오류가 발생했습니다." });
    }
  });

  app.get('/api/appointments/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching user appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get('/api/operating-hours/:dayOfWeek', async (req, res) => {
    try {
      const dayOfWeek = parseInt(req.params.dayOfWeek);
      if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ message: "Invalid day of week" });
      }
      
      const hours = await storage.getOperatingHours(dayOfWeek);
      res.json(hours || { isOpen: false });
    } catch (error) {
      console.error("Error fetching operating hours:", error);
      res.status(500).json({ message: "Failed to fetch operating hours" });
    }
  });

  // Enhanced Customer Management Routes
  app.get('/api/customers', isAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.patch('/api/customers/:id/category', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { category } = req.body;
      
      if (!['mailing', 'general', 'booking'].includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }

      await storage.updateCustomerCategory(parseInt(id), category);
      res.json({ message: "Customer category updated successfully" });
    } catch (error) {
      console.error("Error updating customer category:", error);
      res.status(500).json({ message: "Failed to update customer category" });
    }
  });

  // Email sending functionality
  app.post('/api/admin/send-email', isAuthenticated, async (req, res) => {
    try {
      const { customerIds, subject, content } = req.body;
      
      if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
        return res.status(400).json({ message: "Customer IDs are required" });
      }
      
      if (!subject || !content) {
        return res.status(400).json({ message: "Subject and content are required" });
      }

      // Get customers with email addresses
      const customers = await storage.getCustomersByIds(customerIds);
      const emailCustomers = customers.filter(c => c.email && c.mailingConsent);
      
      if (emailCustomers.length === 0) {
        return res.status(400).json({ message: "No valid email recipients found" });
      }

      // Check if SENDGRID_API_KEY is available
      if (!process.env.SENDGRID_API_KEY) {
        return res.status(503).json({ 
          message: "이메일 서비스가 설정되지 않았습니다. SendGrid API 키를 설정해주세요.",
          code: "EMAIL_SERVICE_NOT_CONFIGURED"
        });
      }

      // Send emails using SendGrid
      const { sendEmail } = await import('./sendgridEmail');
      let successCount = 0;
      let failCount = 0;

      for (const customer of emailCustomers) {
        try {
          await sendEmail({
            to: customer.email!,
            from: 'Sungimconniekim@gmail.com', // Your verified sender
            subject,
            html: content.replace(/\n/g, '<br>'),
            text: content
          });
          successCount++;
        } catch (emailError) {
          console.error(`Failed to send email to ${customer.email}:`, emailError);
          failCount++;
        }
      }

      res.json({ 
        message: `이메일 전송 완료: 성공 ${successCount}건, 실패 ${failCount}건`,
        successCount,
        failCount,
        totalAttempted: emailCustomers.length
      });
    } catch (error) {
      console.error("Error sending emails:", error);
      res.status(500).json({ message: "Failed to send emails" });
    }
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

  // Customer purchase history routes
  app.get('/api/customer-purchases', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = req.query.customerId;
      let query = db.select().from(customerPurchases);
      
      if (customerId) {
        query = query.where(eq(customerPurchases.customerId, parseInt(customerId)));
      }
      
      const purchases = await query.orderBy(desc(customerPurchases.purchaseDate));
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching customer purchases:", error);
      res.status(500).json({ message: "Failed to fetch customer purchases" });
    }
  });

  app.post('/api/customer-purchases', isAuthenticated, async (req: any, res) => {
    try {
      const purchaseData = {
        ...req.body,
        purchaseDate: new Date()
      };
      
      const [purchase] = await db.insert(customerPurchases).values(purchaseData).returning();
      
      // Update customer total spent
      const [customer] = await db.select().from(customers).where(eq(customers.id, purchase.customerId));
      if (customer) {
        const currentTotal = parseFloat(customer.totalSpent || '0');
        const newTotal = currentTotal + parseFloat(purchase.amount);
        
        await db.update(customers)
          .set({ 
            totalSpent: newTotal.toString(),
            lastVisit: new Date()
          })
          .where(eq(customers.id, purchase.customerId));
      }
      
      res.json(purchase);
    } catch (error) {
      console.error("Error creating customer purchase:", error);
      res.status(500).json({ message: "Failed to create customer purchase" });
    }
  });

  // SMS template routes
  app.get('/api/sms-templates', isAuthenticated, async (req: any, res) => {
    try {
      const templates = await db.select().from(smsTemplates).where(eq(smsTemplates.isActive, true));
      res.json(templates);
    } catch (error) {
      console.error("Error fetching SMS templates:", error);
      res.status(500).json({ message: "Failed to fetch SMS templates" });
    }
  });

  // SMS history routes
  app.get('/api/sms-history', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = req.query.customerId;
      let query = db.select().from(smsHistory);
      
      if (customerId) {
        query = query.where(eq(smsHistory.customerId, parseInt(customerId)));
      }
      
      const history = await query.orderBy(desc(smsHistory.sentAt));
      res.json(history);
    } catch (error) {
      console.error("Error fetching SMS history:", error);
      res.status(500).json({ message: "Failed to fetch SMS history" });
    }
  });

  // SMS sending route
  app.post('/api/sms/send', isAuthenticated, async (req: any, res) => {
    try {
      const { customerId, templateId, message } = req.body;
      
      if (templateId) {
        const success = await smsService.sendSMS(customerId, templateId);
        res.json({ success });
      } else if (message) {
        // Create a temporary template for custom message
        const [tempTemplate] = await db.insert(smsTemplates).values({
          name: `Custom Message ${Date.now()}`,
          type: 'custom',
          template: message,
          variables: [],
          isActive: false
        }).returning();
        
        const success = await smsService.sendSMS(customerId, tempTemplate.id);
        res.json({ success });
      } else {
        res.status(400).json({ message: "Template ID or message is required" });
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      res.status(500).json({ message: "Failed to send SMS" });
    }
  });

  // SMS automation routes
  app.post('/api/sms/send-reminders', isAuthenticated, async (req: any, res) => {
    try {
      await smsService.sendAppointmentReminders();
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending reminders:", error);
      res.status(500).json({ message: "Failed to send reminders" });
    }
  });

  // Initialize SMS templates on startup
  smsService.createDefaultTemplates().catch(console.error);

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  // Serve HTML version for testing
  app.use('/html-version', express.static(path.join(process.cwd(), 'html-version')));

  // Contact inquiries API
  app.post('/api/contact-inquiries', async (req, res) => {
    try {
      const { fullName, phoneNumber, inquiry } = req.body;
      
      if (!fullName || !phoneNumber || !inquiry) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const contactInquiry = await db.insert(contactInquiries).values({
        fullName,
        phoneNumber,
        inquiry
      }).returning();
      
      res.status(201).json({ 
        success: true, 
        inquiry: contactInquiry[0] 
      });
    } catch (error) {
      console.error('Error saving contact inquiry:', error);
      res.status(500).json({ error: 'Failed to save inquiry' });
    }
  });

  // Get contact inquiries (admin only)
  app.get('/api/contact-inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const inquiries = await db
        .select()
        .from(contactInquiries)
        .orderBy(desc(contactInquiries.createdAt));
      
      res.json(inquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
  });

  // Customer nail images API routes
  app.get('/api/customer-nail-images/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const images = await db.select().from(customerNailImages).where(eq(customerNailImages.userId, userId));
      res.json(images);
    } catch (error) {
      console.error('Error fetching customer nail images:', error);
      res.status(500).json({ message: 'Failed to fetch customer nail images' });
    }
  });

  app.post('/api/customer-nail-images/upload', upload.array('images', 12), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const userId = req.body.userId;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
      }

      const insertData = files.map((file, index) => ({
        userId,
        imageIndex: index + 1,
        fileName: file.filename,
        filePath: file.path,
        fingerType: req.body[`fingerType_${index}`] || 'index',
        handType: req.body[`handType_${index}`] || 'right',
        imageUrl: `/uploads/${file.filename}`,
        notes: req.body[`notes_${index}`] || ''
      }));

      const results = await db.insert(customerNailImages).values(insertData).returning();
      res.json(results);
    } catch (error) {
      console.error('Error uploading customer nail images:', error);
      res.status(500).json({ message: 'Failed to upload customer nail images' });
    }
  });

  app.patch('/api/customer-nail-images/:imageId', async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);
      const { notes } = req.body;
      
      const result = await db.update(customerNailImages)
        .set({ notes })
        .where(eq(customerNailImages.id, imageId))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }

      res.json(result[0]);
    } catch (error) {
      console.error('Error updating customer nail image:', error);
      res.status(500).json({ message: 'Failed to update customer nail image' });
    }
  });

  app.delete('/api/customer-nail-images/:imageId', async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);
      
      const result = await db.delete(customerNailImages)
        .where(eq(customerNailImages.id, imageId))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }

      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer nail image:', error);
      res.status(500).json({ message: 'Failed to delete customer nail image' });
    }
  });

  // Customer reservations API routes
  app.get('/api/customer-reservations', async (req, res) => {
    try {
      const reservations = await db.select().from(customerReservations).orderBy(desc(customerReservations.createdAt));
      res.json(reservations);
    } catch (error) {
      console.error('Error fetching customer reservations:', error);
      res.status(500).json({ message: 'Failed to fetch customer reservations' });
    }
  });

  app.post('/api/customer-reservations', async (req, res) => {
    try {
      const reservation = insertCustomerReservationSchema.parse(req.body);
      const newReservation = await db.insert(customerReservations).values(reservation).returning();
      res.status(201).json(newReservation[0]);
    } catch (error) {
      console.error('Error creating customer reservation:', error);
      res.status(500).json({ message: 'Failed to create customer reservation' });
    }
  });

  app.patch('/api/customer-reservations/:reservationId', async (req, res) => {
    try {
      const reservationId = parseInt(req.params.reservationId);
      const updates = req.body;
      
      const result = await db.update(customerReservations)
        .set(updates)
        .where(eq(customerReservations.id, reservationId))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      res.json(result[0]);
    } catch (error) {
      console.error('Error updating customer reservation:', error);
      res.status(500).json({ message: 'Failed to update customer reservation' });
    }
  });

  // Carousel Images Routes
  app.get("/api/carousel-images", async (req, res) => {
    try {
      const page = req.query.page as string;
      const images = await storage.getCarouselImages(page);
      res.json(images);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      res.status(500).json({ message: "Failed to fetch carousel images" });
    }
  });

  app.post("/api/admin/carousel-images", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const { page, headerText, detailedDescription, displayOrder } = req.body;
      const imagePath = `/uploads/${req.file.filename}`;

      const imageData = {
        page,
        imagePath,
        headerText,
        detailedDescription,
        displayOrder: parseInt(displayOrder) || 0,
        isActive: true
      };

      const result = insertCarouselImageSchema.safeParse(imageData);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid image data", errors: result.error.errors });
      }

      const carousel = await storage.createCarouselImage(result.data);
      res.json(carousel);
    } catch (error) {
      console.error("Error creating carousel image:", error);
      res.status(500).json({ message: "Failed to create carousel image" });
    }
  });

  app.put("/api/admin/carousel-images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;

      const carousel = await storage.updateCarouselImage(id, updates);
      res.json(carousel);
    } catch (error) {
      console.error("Error updating carousel image:", error);
      res.status(500).json({ message: "Failed to update carousel image" });
    }
  });

  app.delete("/api/admin/carousel-images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCarouselImage(id);
      res.json({ message: "Carousel image deleted successfully" });
    } catch (error) {
      console.error("Error deleting carousel image:", error);
      res.status(500).json({ message: "Failed to delete carousel image" });
    }
  });

  app.get("/api/admin/carousel-images", async (req, res) => {
    try {
      const images = await storage.getCarouselImages(); // Get all images for admin
      res.json(images);
    } catch (error) {
      console.error("Error fetching admin carousel images:", error);
      res.status(500).json({ message: "Failed to fetch carousel images" });
    }
  });

  // Contact inquiry routes
  app.post('/api/contact-inquiries', async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      
      // Check if there's an existing customer with this phone number
      const existingCustomer = await db.select()
        .from(customers)
        .where(eq(customers.phoneNumber, validatedData.phoneNumber))
        .limit(1);

      const inquiryData = {
        fullName: validatedData.fullName || (validatedData as any).customerName,
        phoneNumber: validatedData.phoneNumber,
        inquiry: validatedData.inquiry,
        status: 'new' as const,
        adminResponse: null,
        respondedAt: null,
      };

      const [inquiry] = await db.insert(contactInquiries)
        .values(inquiryData)
        .returning();

      res.json(inquiry);
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      res.status(500).json({ message: "Failed to create contact inquiry" });
    }
  });

  app.get('/api/admin/contact-inquiries', authenticateAdmin, async (req, res) => {
    try {
      const inquiries = await db.select()
        .from(contactInquiries)
        .orderBy(desc(contactInquiries.createdAt));

      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ message: "Failed to fetch contact inquiries" });
    }
  });

  app.patch('/api/admin/contact-inquiries/:id', authenticateAdmin, async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      const { status, adminResponse } = req.body;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (adminResponse) {
        updateData.adminResponse = adminResponse;
        updateData.respondedAt = new Date();
      }

      const [updatedInquiry] = await db.update(contactInquiries)
        .set(updateData)
        .where(eq(contactInquiries.id, inquiryId))
        .returning();

      if (!updatedInquiry) {
        return res.status(404).json({ message: "Contact inquiry not found" });
      }

      res.json(updatedInquiry);
    } catch (error) {
      console.error("Error updating contact inquiry:", error);
      res.status(500).json({ message: "Failed to update contact inquiry" });
    }
  });

  // === NEW FEATURE ROUTES ===
  
  // Gallery Management Routes
  app.get('/api/admin/gallery', authenticateAdmin, async (req: any, res) => {
    try {
      const { category } = req.query;
      const galleryItems = category 
        ? await storage.getGalleryByCategory(category as string)
        : await storage.getAllGallery();
      res.json(galleryItems);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      res.status(500).json({ message: 'Failed to fetch gallery items' });
    }
  });

  app.post('/api/admin/gallery', authenticateAdmin, upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
      }

      const { title, description, category, tags, displayOrder } = req.body;
      const imagePath = `/uploads/${req.file.filename}`;

      const galleryData = {
        title: title || 'New Gallery Item',
        description: description || '',
        imagePath,
        category: category || 'nail_art',
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        displayOrder: parseInt(displayOrder) || 0,
        isActive: true
      };

      const savedGallery = await storage.createGallery(galleryData);
      res.json({ message: 'Gallery item created successfully', gallery: savedGallery });
    } catch (error) {
      console.error('Error creating gallery item:', error);
      res.status(500).json({ message: 'Failed to create gallery item' });
    }
  });

  app.put('/api/admin/gallery/:id', authenticateAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedGallery = await storage.updateGallery(id, updates);
      res.json({ message: 'Gallery item updated successfully', gallery: updatedGallery });
    } catch (error) {
      console.error('Error updating gallery item:', error);
      res.status(500).json({ message: 'Failed to update gallery item' });
    }
  });

  app.delete('/api/admin/gallery/:id', authenticateAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGallery(id);
      res.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      res.status(500).json({ message: 'Failed to delete gallery item' });
    }
  });

  // Customer Nail Info Routes (10-finger AI nail art system)
  app.get('/api/customer/:phone/nail-info', async (req, res) => {
    try {
      const customerPhone = req.params.phone;
      const nailInfo = await storage.getCustomerNailInfoByPhone(customerPhone);
      res.json(nailInfo);
    } catch (error) {
      console.error('Error fetching customer nail info:', error);
      res.status(500).json({ message: 'Failed to fetch customer nail info' });
    }
  });

  app.get('/api/customer/:phone/nail-info/latest', async (req, res) => {
    try {
      const customerPhone = req.params.phone;
      const latestNailInfo = await storage.getLatestCustomerNailSession(customerPhone);
      res.json(latestNailInfo);
    } catch (error) {
      console.error('Error fetching latest customer nail info:', error);
      res.status(500).json({ message: 'Failed to fetch latest customer nail info' });
    }
  });

  app.post('/api/customer/:phone/nail-info', async (req, res) => {
    try {
      const customerPhone = req.params.phone;
      const nailData = {
        customerPhone,
        ...req.body
      };

      const savedNail = await storage.createCustomerNailInfo(nailData);
      res.json({ message: 'Customer nail info created successfully', nail: savedNail });
    } catch (error) {
      console.error('Error creating customer nail info:', error);
      res.status(500).json({ message: 'Failed to create customer nail info' });
    }
  });

  // AI Nail Art Images Routes (Customer Phone Number based) - Legacy Support
  app.get('/api/admin/ai-nail-art/:phone', authenticateAdmin, async (req: any, res) => {
    try {
      const customerPhone = req.params.phone;
      const nailInfo = await storage.getCustomerNailInfoByPhone(customerPhone);
      res.json(nailInfo);
    } catch (error) {
      console.error('Error fetching AI nail art images:', error);
      res.status(500).json({ message: 'Failed to fetch AI nail art images' });
    }
  });

  app.post('/api/admin/customer-nail-info', authenticateAdmin, upload.fields([
    { name: 'originalImage', maxCount: 1 },
    { name: 'aiGeneratedImage', maxCount: 1 }
  ]), async (req: any, res) => {
    try {
      const { 
        customerPhone, 
        fingerPosition, 
        designPrompt, 
        nailShape, 
        nailLength, 
        nailCondition, 
        designStyle, 
        colorPreferences, 
        sessionId 
      } = req.body;
      
      if (!customerPhone || !fingerPosition) {
        return res.status(400).json({ message: 'Customer phone and finger position are required' });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const originalImagePath = files.originalImage ? `/uploads/${files.originalImage[0].filename}` : undefined;
      const aiGeneratedImagePath = files.aiGeneratedImage ? `/uploads/${files.aiGeneratedImage[0].filename}` : undefined;

      const nailData = {
        customerPhone,
        fingerPosition,
        originalImagePath,
        aiGeneratedImagePath,
        designPrompt: designPrompt || '',
        nailShape: nailShape || 'oval',
        nailLength: nailLength || 'medium',
        nailCondition: nailCondition || 'healthy',
        designStyle: designStyle || 'natural',
        colorPreferences: colorPreferences ? colorPreferences.split(',').map((c: string) => c.trim()) : [],
        sessionId: sessionId || nanoid()
      };

      const savedNail = await storage.createCustomerNailInfo(nailData);
      res.json({ message: 'Customer nail info created successfully', nail: savedNail });
    } catch (error) {
      console.error('Error creating customer nail info:', error);
      res.status(500).json({ message: 'Failed to create customer nail info' });
    }
  });

  app.put('/api/admin/ai-nail-art/:id', authenticateAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedAiNail = await storage.updateAiNailArtImage(id, updates);
      res.json({ message: 'AI nail art image updated successfully', aiNail: updatedAiNail });
    } catch (error) {
      console.error('Error updating AI nail art image:', error);
      res.status(500).json({ message: 'Failed to update AI nail art image' });
    }
  });

  app.delete('/api/admin/ai-nail-art/:id', authenticateAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAiNailArtImage(id);
      res.json({ message: 'AI nail art image deleted successfully' });
    } catch (error) {
      console.error('Error deleting AI nail art image:', error);
      res.status(500).json({ message: 'Failed to delete AI nail art image' });
    }
  });

  // Public Gallery Route (for customer viewing)
  app.get('/api/gallery', async (req, res) => {
    try {
      const { category } = req.query;
      const galleryItems = category 
        ? await storage.getGalleryByCategory(category as string)
        : await storage.getAllGallery();
      res.json(galleryItems);
    } catch (error) {
      console.error('Error fetching public gallery:', error);
      res.status(500).json({ message: 'Failed to fetch gallery' });
    }
  });

  // Gallery Description Routes
  app.get('/api/gallery/:id/description', async (req, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      const description = await db.select().from(galleryDesc).where(eq(galleryDesc.galleryId, galleryId));
      
      if (description.length === 0) {
        return res.status(404).json({ message: 'Gallery description not found' });
      }
      
      res.json(description[0]);
    } catch (error) {
      console.error('Error fetching gallery description:', error);
      res.status(500).json({ message: 'Failed to fetch gallery description' });
    }
  });

  app.post('/api/admin/gallery/:id/description', authenticateAdmin, async (req: any, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      const descriptionData = {
        galleryId,
        ...req.body
      };
      
      const [newDescription] = await db.insert(galleryDesc).values(descriptionData).returning();
      res.json({ message: 'Gallery description created successfully', description: newDescription });
    } catch (error) {
      console.error('Error creating gallery description:', error);
      res.status(500).json({ message: 'Failed to create gallery description' });
    }
  });

  app.put('/api/admin/gallery/:id/description', authenticateAdmin, async (req: any, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      const updates = req.body;
      
      const [updatedDescription] = await db.update(galleryDesc)
        .set(updates)
        .where(eq(galleryDesc.galleryId, galleryId))
        .returning();
        
      res.json({ message: 'Gallery description updated successfully', description: updatedDescription });
    } catch (error) {
      console.error('Error updating gallery description:', error);
      res.status(500).json({ message: 'Failed to update gallery description' });
    }
  });

  // Carousel management route updates
  app.put('/api/admin/carousel-images/:id', authenticateAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedImage = await storage.updateCarouselImage(id, updates);
      res.json({ message: 'Carousel image updated successfully', image: updatedImage });
    } catch (error) {
      console.error('Error updating carousel image:', error);
      res.status(500).json({ message: 'Failed to update carousel image' });
    }
  });

  app.delete('/api/admin/carousel-images/:id', authenticateAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCarouselImage(id);
      res.json({ message: 'Carousel image deleted successfully' });
    } catch (error) {
      console.error('Error deleting carousel image:', error);
      res.status(500).json({ message: 'Failed to delete carousel image' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
