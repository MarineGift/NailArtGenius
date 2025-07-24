import { type Express } from "express";
import { accessStorage } from './access-storage';

export function registerAccessRoutes(app: Express) {
  console.log('🔗 Registering Microsoft Access-style API routes...');

  // Admin Dashboard Routes
  app.get('/api/admin/dashboard', async (req, res) => {
    try {
      const stats = await accessStorage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
  });

  // Admin Authentication Routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = accessStorage.getAdminByUsername(username) as any;
      
      if (admin && admin.Password === password) {
        res.json({ 
          success: true, 
          admin: { 
            id: admin.AdminID, 
            username: admin.Username, 
            name: admin.AdminName 
          } 
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  });

  // Customer Management Routes
  app.get('/api/admin/customers', async (req, res) => {
    try {
      const customers = await accessStorage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Failed to fetch customers' });
    }
  });

  app.post('/api/admin/customers', async (req, res) => {
    try {
      const customer = req.body;
      const result = await accessStorage.createCustomer(customer);
      res.json({ success: true, customerId: result.lastInsertRowid });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: 'Failed to create customer' });
    }
  });

  app.get('/api/admin/customers/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const customers = await accessStorage.getCustomersByCategory(category);
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customers by category:', error);
      res.status(500).json({ message: 'Failed to fetch customers by category' });
    }
  });

  // Booking Management Routes
  app.get('/api/admin/bookings', async (req, res) => {
    try {
      const bookings = await accessStorage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  app.post('/api/admin/bookings', async (req, res) => {
    try {
      const booking = req.body;
      const result = await accessStorage.createBooking(booking);
      res.json({ success: true, bookingId: result.lastInsertRowid });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });

  // Order Management Routes
  app.get('/api/admin/orders', async (req, res) => {
    try {
      const orders = await accessStorage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  app.post('/api/admin/orders', async (req, res) => {
    try {
      const order = req.body;
      const result = await accessStorage.createOrder(order);
      res.json({ success: true, orderId: result.lastInsertRowid });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  });

  // Gallery Management Routes
  app.get('/api/gallery', async (req, res) => {
    try {
      const gallery = await accessStorage.getAllGallery();
      res.json(gallery);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      res.status(500).json({ message: 'Failed to fetch gallery' });
    }
  });

  app.post('/api/admin/gallery', async (req, res) => {
    try {
      const gallery = req.body;
      const result = await accessStorage.createGalleryItem(gallery);
      res.json({ success: true, galleryId: result.lastInsertRowid });
    } catch (error) {
      console.error('Error creating gallery item:', error);
      res.status(500).json({ message: 'Failed to create gallery item' });
    }
  });

  // Customer Nail Info Routes
  app.get('/api/customer/:phone/nail-info', async (req, res) => {
    try {
      const { phone } = req.params;
      const nailInfo = await accessStorage.getCustomerNailInfoByPhone(phone);
      res.json(nailInfo);
    } catch (error) {
      console.error('Error fetching customer nail info:', error);
      res.status(500).json({ message: 'Failed to fetch nail information' });
    }
  });

  app.post('/api/customer/:phone/nail-info', async (req, res) => {
    try {
      const { phone } = req.params;
      const nailInfo = { ...req.body, phoneNumber: phone };
      const result = await accessStorage.createCustomerNailInfo(nailInfo);
      res.json({ success: true, nailInfoId: result.lastInsertRowid });
    } catch (error) {
      console.error('Error creating customer nail info:', error);
      res.status(500).json({ message: 'Failed to save nail information' });
    }
  });

  // Site Visit Tracking Routes
  app.post('/api/track-visit', async (req, res) => {
    try {
      const visit = req.body;
      const result = await accessStorage.createSiteVisit(visit);
      res.json({ success: true, visitId: result.lastInsertRowid });
    } catch (error) {
      console.error('Error tracking site visit:', error);
      res.status(500).json({ message: 'Failed to track visit' });
    }
  });

  // Today's Data Routes (for dashboard)
  app.get('/api/admin/today/customers', async (req, res) => {
    try {
      const customers = await accessStorage.getTodayCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching today customers:', error);
      res.status(500).json({ message: 'Failed to fetch today customers' });
    }
  });

  app.get('/api/admin/today/bookings', async (req, res) => {
    try {
      const bookings = await accessStorage.getTodayBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching today bookings:', error);
      res.status(500).json({ message: 'Failed to fetch today bookings' });
    }
  });

  app.get('/api/admin/today/orders', async (req, res) => {
    try {
      const orders = await accessStorage.getTodayOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching today orders:', error);
      res.status(500).json({ message: 'Failed to fetch today orders' });
    }
  });

  app.get('/api/admin/today/visits', async (req, res) => {
    try {
      const visits = await accessStorage.getTodayVisits();
      res.json(visits);
    } catch (error) {
      console.error('Error fetching today visits:', error);
      res.status(500).json({ message: 'Failed to fetch today visits' });
    }
  });

  // Authentication check route
  app.get('/api/auth/user', (req, res) => {
    // Simple implementation - in production should use proper session management
    res.status(401).json({ message: 'Unauthorized' });
  });

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'Microsoft Access database ready', timestamp: new Date().toISOString() });
  });

  console.log('✅ Microsoft Access-style API routes registered successfully');
}

export default registerAccessRoutes;