import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export interface JwtPayload {
  /** ID do usuário (subject). */
  sub: string;
  role: string;
  tenantId: string;
}

function sign(payload: JwtPayload, expiresIn: string): string {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function signAccessToken(payload: JwtPayload): string {
  return sign(payload, env.JWT_ACCESS_EXPIRES_IN);
}

export function signRefreshToken(payload: JwtPayload): string {
  return sign(payload, env.JWT_REFRESH_EXPIRES_IN);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
