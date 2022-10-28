import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RequestWithUser } from '../../types/types';
import User from '../../models/User';

dotenv.config();

export const isAuthenticated = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied.' });
  }

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'some secret',
      async (err, decoded: JwtPayload) => {
        if (err) return res.status(403).json({ msg: 'Forbidden.' });

        req.userId = decoded.id;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId).select('isAdmin -_id');

    // valid token, user deleted from db
    if (!user) return res.status(403).json({ msg: 'Forbidden.' });

    if (!user.isAdmin) return res.status(403).json({ msg: 'Forbidden.' });

    next();
  } catch (error) {
    next(error);
  }
};
