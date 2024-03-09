import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config/env.config';
import { AuthenticationError } from '../core/Errors';

export interface AuthRequest extends Request {
  user?: { _id: Types.ObjectId };
}
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) throw new AuthenticationError();

  try {
    const user: { _id: Types.ObjectId } = jwt.verify(token, config.jwt.secret) as { _id: Types.ObjectId };
    user._id = new Types.ObjectId(user._id);
    req.user = user;
    next();
  } catch (err) {
    throw new AuthenticationError();
  }
};

export default authMiddleware;
