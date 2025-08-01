// API routes for the nail salon application
import express from 'express';
import { z } from 'zod';
import { storage } from './storage.js';
import {
  insertUserSchema,
  insertServiceSchema,
  insertBookingSchema,
  insertContactMessageSchema,
} from '../shared/schema.js';

const router = express.Router();

// Helper function for error handling
const handleError = (res: express.Response, error: any, message = 'Internal server error') => {
  console.error(error);
  res.status(500).json({ error: message });
};

// Validation middleware
const validate = (schema: z.ZodSchema) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation failed', details: error });
  }
};

// Users routes
router.post('/api/users', validate(insertUserSchema), async (req, res) => {
  try {
    const user = await storage.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error, 'Failed to create user');
  }
});

router.get('/api/users/:email', async (req, res) => {
  try {
    const user = await storage.getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    handleError(res, error, 'Failed to get user');
  }
});

// Services routes
router.get('/api/services', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const services = includeInactive 
      ? await storage.getServices()
      : await storage.getActiveServices();
    res.json(services);
  } catch (error) {
    handleError(res, error, 'Failed to get services');
  }
});

router.get('/api/services/:id', async (req, res) => {
  try {
    const service = await storage.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    handleError(res, error, 'Failed to get service');
  }
});

router.post('/api/services', validate(insertServiceSchema), async (req, res) => {
  try {
    const service = await storage.createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    handleError(res, error, 'Failed to create service');
  }
});

// Bookings routes
router.post('/api/bookings', validate(insertBookingSchema), async (req, res) => {
  try {
    const booking = await storage.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    handleError(res, error, 'Failed to create booking');
  }
});

router.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await storage.getBookingsByUserId(req.params.userId);
    res.json(bookings);
  } catch (error) {
    handleError(res, error, 'Failed to get user bookings');
  }
});

router.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await storage.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    handleError(res, error, 'Failed to get booking');
  }
});

router.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const booking = await storage.updateBookingStatus(req.params.id, status);
    res.json(booking);
  } catch (error) {
    if (error instanceof Error && error.message === 'Booking not found') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    handleError(res, error, 'Failed to update booking status');
  }
});

// Contact messages routes
router.post('/api/contact', validate(insertContactMessageSchema), async (req, res) => {
  try {
    const message = await storage.createContactMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    handleError(res, error, 'Failed to create contact message');
  }
});

router.get('/api/contact', async (req, res) => {
  try {
    const messages = await storage.getContactMessages();
    res.json(messages);
  } catch (error) {
    handleError(res, error, 'Failed to get contact messages');
  }
});

router.patch('/api/contact/:id/read', async (req, res) => {
  try {
    const message = await storage.markMessageAsRead(req.params.id);
    res.json(message);
  } catch (error) {
    if (error instanceof Error && error.message === 'Message not found') {
      return res.status(404).json({ error: 'Message not found' });
    }
    handleError(res, error, 'Failed to mark message as read');
  }
});

export default router;