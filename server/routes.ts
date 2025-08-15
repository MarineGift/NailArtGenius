import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerInquirySchema, insertGallerySchema, insertNewsSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getAdminUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          firstName: user.firstName, 
          lastName: user.lastName,
          role: user.role 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/me", verifyToken, async (req, res) => {
    try {
      const user = await storage.getAdminUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        firstName: user.firstName, 
        lastName: user.lastName,
        role: user.role 
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Customer Inquiries routes
  app.get("/api/inquiries", verifyToken, async (req, res) => {
    try {
      const inquiries = await storage.getCustomerInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Get inquiries error:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const validation = insertCustomerInquirySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid data", details: validation.error });
      }

      const inquiry = await storage.createCustomerInquiry(validation.data);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Create inquiry error:", error);
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });

  app.patch("/api/inquiries/:id/status", verifyToken, async (req, res) => {
    try {
      const { status } = req.body;
      const id = parseInt(req.params.id);
      
      const inquiry = await storage.updateCustomerInquiryStatus(id, status);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      console.error("Update inquiry status error:", error);
      res.status(500).json({ error: "Failed to update inquiry status" });
    }
  });

  app.delete("/api/inquiries/:id", verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCustomerInquiry(id);
      
      if (!success) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      
      res.json({ message: "Inquiry deleted successfully" });
    } catch (error) {
      console.error("Delete inquiry error:", error);
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const items = await storage.getGalleryItems();
      res.json(items);
    } catch (error) {
      console.error("Get gallery error:", error);
      res.status(500).json({ error: "Failed to fetch gallery items" });
    }
  });

  app.post("/api/gallery", verifyToken, async (req, res) => {
    try {
      const validation = insertGallerySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid data", details: validation.error });
      }

      const item = await storage.createGalleryItem(validation.data);
      res.status(201).json(item);
    } catch (error) {
      console.error("Create gallery item error:", error);
      res.status(500).json({ error: "Failed to create gallery item" });
    }
  });

  app.put("/api/gallery/:id", verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertGallerySchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid data", details: validation.error });
      }

      const item = await storage.updateGalleryItem(id, validation.data);
      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Update gallery item error:", error);
      res.status(500).json({ error: "Failed to update gallery item" });
    }
  });

  app.delete("/api/gallery/:id", verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGalleryItem(id);
      
      if (!success) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      
      res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      console.error("Delete gallery item error:", error);
      res.status(500).json({ error: "Failed to delete gallery item" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const { published } = req.query;
      let newsItems;
      
      if (published === 'true') {
        newsItems = await storage.getPublishedNews();
      } else {
        newsItems = await storage.getNews();
      }
      
      res.json(newsItems);
    } catch (error) {
      console.error("Get news error:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.post("/api/news", verifyToken, async (req, res) => {
    try {
      const validation = insertNewsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid data", details: validation.error });
      }

      const news = await storage.createNews(validation.data);
      res.status(201).json(news);
    } catch (error) {
      console.error("Create news error:", error);
      res.status(500).json({ error: "Failed to create news" });
    }
  });

  app.put("/api/news/:id", verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertNewsSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid data", details: validation.error });
      }

      const news = await storage.updateNews(id, validation.data);
      if (!news) {
        return res.status(404).json({ error: "News item not found" });
      }
      
      res.json(news);
    } catch (error) {
      console.error("Update news error:", error);
      res.status(500).json({ error: "Failed to update news" });
    }
  });

  app.post("/api/news/:id/publish", verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const news = await storage.publishNews(id);
      
      if (!news) {
        return res.status(404).json({ error: "News item not found" });
      }
      
      res.json(news);
    } catch (error) {
      console.error("Publish news error:", error);
      res.status(500).json({ error: "Failed to publish news" });
    }
  });

  app.delete("/api/news/:id", verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNews(id);
      
      if (!success) {
        return res.status(404).json({ error: "News item not found" });
      }
      
      res.json({ message: "News deleted successfully" });
    } catch (error) {
      console.error("Delete news error:", error);
      res.status(500).json({ error: "Failed to delete news" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", verifyToken, async (req, res) => {
    try {
      const [inquiries, gallery, news] = await Promise.all([
        storage.getCustomerInquiries(),
        storage.getGalleryItems(),
        storage.getNews()
      ]);

      const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;
      const publishedGallery = gallery.filter(g => g.isPublished).length;
      const publishedNews = news.filter(n => n.isPublished).length;

      res.json({
        totalInquiries: inquiries.length,
        pendingInquiries,
        totalGallery: gallery.length,
        publishedGallery,
        totalNews: news.length,
        publishedNews
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Email/SMS functionality (placeholder for now)
  app.post("/api/send-email", verifyToken, async (req, res) => {
    try {
      const { to, subject, body, inquiryId } = req.body;
      
      // Here you would integrate with SendGrid or another email service
      console.log("Sending email:", { to, subject, body });
      
      // Update inquiry status if provided
      if (inquiryId) {
        await storage.updateCustomerInquiryStatus(inquiryId, 'responded');
      }
      
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Send email error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/api/send-sms", verifyToken, async (req, res) => {
    try {
      const { to, message, inquiryId } = req.body;
      
      // Here you would integrate with SMS service
      console.log("Sending SMS:", { to, message });
      
      // Update inquiry status if provided
      if (inquiryId) {
        await storage.updateCustomerInquiryStatus(inquiryId, 'responded');
      }
      
      res.json({ message: "SMS sent successfully" });
    } catch (error) {
      console.error("Send SMS error:", error);
      res.status(500).json({ error: "Failed to send SMS" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}