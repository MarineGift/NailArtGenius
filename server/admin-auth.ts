import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  email?: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(adminUser: AdminUser): string {
  return jwt.sign(
    { 
      id: adminUser.id, 
      username: adminUser.username, 
      role: adminUser.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const admin = await storage.getAdminById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Admin not found or inactive' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}

// Initialize default admin user if not exists
export async function initializeDefaultAdmin() {
  try {
    const existingAdmin = await storage.getAdminByUsername('admin');
    if (!existingAdmin) {
      const hashedPassword = await hashPassword('1111');
      await storage.createAdmin({
        username: 'admin',
        password: hashedPassword,
        name: 'System Administrator',
        email: 'admin@connienail.com',
        role: 'admin'
      });
      console.log('Default admin user created: admin/1111');
    }
  } catch (error) {
    console.error('Failed to initialize default admin:', error);
  }
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}