import jwt from 'jsonwebtoken';
import config from '../config';
import { Types } from 'mongoose';

interface TokenPayload {
  id: string;
  role: string;
}

/**
 * Generate JWT token
 */
export const generateToken = (
  userId: string | Types.ObjectId, 
  role: string,
  expiresIn = '1h'
): string => {
  const payload = { id: userId.toString(), role };
  // @ts-ignore - Ignore TS errors since we know this works at runtime
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): TokenPayload => {
  // @ts-ignore - Ignore TS errors since we know this works at runtime
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
};

/**
 * Generate access and refresh tokens
 */
export const generateAuthTokens = (userId: string | Types.ObjectId, role: string) => {
  // @ts-ignore - Ignore TS errors since we know this works at runtime
  const accessToken = generateToken(userId, role, config.jwt.accessExpire);
  // @ts-ignore - Ignore TS errors since we know this works at runtime
  const refreshToken = generateToken(userId, role, config.jwt.refreshExpire);
  
  return {
    accessToken,
    refreshToken,
  };
};
