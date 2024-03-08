import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config/env.config';

export interface AuthRequest extends Request {
  user?: { _id: Types.ObjectId };
}
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) return res.sendStatus(401);

    (user as { _id: Types.ObjectId })._id = new Types.ObjectId((user as { _id: string })._id);

    req.user = user as { _id: Types.ObjectId };
    next();
  });
};

export default authMiddleware;
