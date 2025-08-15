import { storage } from "./storage";
import bcrypt from "bcrypt";

export async function seedData() {
  try {
    // Check if admin user already exists
    const existingAdmin = await storage.getAdminUserByUsername('admin');
    
    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await storage.createAdminUser({
        username: 'admin',
        email: 'admin@kictgroup.com',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      
      console.log('✅ Admin user created');
    }

    // Create sample customer inquiries
    const inquiries = await storage.getCustomerInquiries();
    if (inquiries.length === 0) {
      await storage.createCustomerInquiry({
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        subject: 'Product Inquiry',
        message: 'I am interested in your services and would like more information about pricing and availability.',
        status: 'pending'
      });

      await storage.createCustomerInquiry({
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0456',
        subject: 'Technical Support',
        message: 'I need help setting up my account and accessing the portal.',
        status: 'pending'
      });

      await storage.createCustomerInquiry({
        name: 'Michael Brown',
        email: 'mbrown@email.com',
        phone: null,
        subject: 'Partnership Opportunity',
        message: 'Our company is interested in exploring partnership opportunities with KICT Group.',
        status: 'responded'
      });

      console.log('✅ Sample inquiries created');
    }

    // Create sample gallery items
    const gallery = await storage.getGalleryItems();
    if (gallery.length === 0) {
      await storage.createGalleryItem({
        title: 'Modern Office Space',
        description: 'State-of-the-art office environment designed for productivity',
        imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
        category: 'office',
        isPublished: true
      });

      await storage.createGalleryItem({
        title: 'Team Collaboration',
        description: 'Our team working together on innovative solutions',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        category: 'team',
        isPublished: true
      });

      await storage.createGalleryItem({
        title: 'Technology Infrastructure',
        description: 'Advanced technology setup supporting our operations',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        category: 'technology',
        isPublished: false
      });

      console.log('✅ Sample gallery items created');
    }

    // Create sample news articles
    const news = await storage.getNews();
    if (news.length === 0) {
      await storage.createNews({
        title: 'KICT Group Announces New Partnership',
        summary: 'Exciting new collaboration to drive innovation in technology solutions',
        content: `We are pleased to announce a strategic partnership that will enhance our service offerings and expand our reach in the technology sector.

This partnership represents a significant milestone in our growth strategy and demonstrates our commitment to providing cutting-edge solutions to our clients.

Key benefits of this partnership include:
- Enhanced service capabilities
- Expanded market reach
- Access to new technologies
- Improved customer support

We look forward to the opportunities this partnership will bring and the positive impact it will have on our clients and stakeholders.`,
        author: 'KICT Group Communications',
        isPublished: true
      });

      await storage.createNews({
        title: 'New Technology Platform Launch',
        summary: 'Introducing our latest technology platform designed for enterprise clients',
        content: `Today marks the launch of our revolutionary new technology platform, designed specifically to meet the evolving needs of enterprise clients.

This platform incorporates the latest advancements in cloud computing, artificial intelligence, and data analytics to provide unparalleled performance and reliability.

Features include:
- Advanced analytics dashboard
- Real-time monitoring capabilities
- Seamless integration options
- Enhanced security protocols
- Scalable architecture

Our development team has worked tirelessly to ensure this platform meets the highest standards of quality and performance.`,
        author: 'Product Development Team',
        isPublished: false
      });

      console.log('✅ Sample news articles created');
    }

    // Create default email templates
    const emailTemplates = await storage.getEmailTemplates();
    if (emailTemplates.length === 0) {
      await storage.createEmailTemplate({
        name: 'Inquiry Response',
        subject: 'Thank you for your inquiry - KICT Group',
        body: `Dear {customer_name},

Thank you for reaching out to KICT Group. We have received your inquiry regarding "{inquiry_subject}" and appreciate your interest in our services.

Our team will review your message and respond within 24-48 business hours. If you have any urgent questions, please don't hesitate to contact us directly.

Best regards,
KICT Group Customer Service Team`,
        isDefault: true
      });

      console.log('✅ Default email templates created');
    }

    // Create default SMS templates
    const smsTemplates = await storage.getSmsTemplates();
    if (smsTemplates.length === 0) {
      await storage.createSmsTemplate({
        name: 'Inquiry Confirmation',
        message: 'Thank you for contacting KICT Group. We have received your inquiry and will respond soon. For urgent matters, please call our support line.',
        isDefault: true
      });

      console.log('✅ Default SMS templates created');
    }

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}