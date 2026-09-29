import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { User } from '../types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interwood_lahore_secure_jwt_secret_key_2026';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication required. No token provided.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid or expired authentication token.' });
      return;
    }

    const user = db.users.find(u => u._id === decoded.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found in system.' });
      return;
    }

    req.user = user;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden. Admin privileges required.' });
    return;
  }
  next();
};
