import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { analyzeNailShape, generateNailShapeImage } from "./openai";
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

  // Photo upload routes
  app.post('/api/photos/upload', isAuthenticated, upload.array('photos', 6), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = req.files as Express.Multer.File[];
      const { photoTypes, fingerTypes, sessionId } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const savedPhotos = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const photoType = Array.isArray(photoTypes) ? photoTypes[i] : photoTypes;
        const fingerType = Array.isArray(fingerTypes) ? fingerTypes[i] : fingerTypes;

        const photoData = {
          userId,
          fileName: file.filename,
          filePath: file.path,
          photoType,
          fingerType,
        };

        const savedPhoto = await storage.saveCustomerPhoto(photoData);
        savedPhotos.push(savedPhoto);
      }

      res.json({ 
        message: "Photos uploaded successfully", 
        photos: savedPhotos,
        sessionId 
      });
    } catch (error) {
      console.error("Error uploading photos:", error);
      res.status(500).json({ message: "Failed to upload photos" });
    }
  });

  // AI analysis routes
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

  // Appointment routes
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

  app.post("/api/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = { ...req.body, userId };
      
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.get("/api/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.put("/api/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updates = req.body;
      
      const appointment = await storage.updateAppointment(appointmentId, updates);
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
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
