import { Response, NextFunction } from 'express';
import { AuthRequest } from '../common/authMiddleware';

export const wrapController = (func: (req: AuthRequest, res: Response, next?: NextFunction) => Promise<unknown>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
};
