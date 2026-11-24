import crypto from 'crypto';
import type {NextFunction, Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import {DATA_DIR, db} from './db.ts';

export const SESSION_COOKIE_NAME = 'solmonix_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function resolveSessionSecret(): string {
  const envSecret = process.env.SESSION_SECRET?.trim();
  if (envSecret && envSecret.length >= 16) {
    return envSecret;
  }
  const secretPath = path.join(DATA_DIR, '.session-secret');
  try {
    if (fs.existsSync(secretPath)) {
      const existing = fs.readFileSync(secretPath, 'utf8').trim();
      if (existing.length >= 32) return existing;
    }
  } catch {
    // Ignore read errors and fall through
  }

  const generated =
    process.env.VERCEL && (process.env.VERCEL_PROJECT_ID || process.env.VERCEL_URL)
      ? crypto
          .createHmac('sha256', 'solmonix-vercel-session')
          .update(`${process.env.VERCEL_PROJECT_ID || ''}:${process.env.VERCEL_URL || ''}`)
          .digest('hex')
      : crypto.randomBytes(48).toString('hex');

  try {
    fs.writeFileSync(secretPath, generated, {mode: 0o600});
  } catch {
    // Keep in-memory secret if filesystem is read-only
  }
  return generated;
}

const SESSION_SECRET = resolveSessionSecret();

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface SessionTokenPayload {
  id: number;
  email: string;
  role: string;
  exp: number;
}

export function hashPassword(password: string, existingSalt?: string): {hash: string; salt: string} {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hashBuffer = crypto.scryptSync(password, salt, 64);
  return {hash: hashBuffer.toString('hex'), salt};
}

export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  const derived = crypto.scryptSync(password, storedSalt, 64);
  const storedBuf = Buffer.from(storedHash, 'hex');
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

export function signSessionToken(admin: AdminUser): string {
  const payload: SessionTokenPayload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined): AdminUser | null {
  if (!token || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as SessionTokenPayload;
    if (!parsed.exp || parsed.exp < Date.now()) return null;

    const row = db
      .prepare('SELECT id, name, email, role FROM admins WHERE id = ? AND email = ?')
      .get(parsed.id, parsed.email) as AdminUser | undefined;
    return row || null;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      result[key] = decodeURIComponent(val);
    }
  }
  return result;
}

export function getAuthenticatedAdmin(req: Request): AdminUser | null {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE_NAME];
  return verifySessionToken(token);
}

export function setSessionCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: SESSION_TTL_MS,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME, {path: '/'});
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminUser;
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const admin = getAuthenticatedAdmin(req);
  if (!admin) {
    res.status(401).json({ok: false, message: 'Administrator authentication required.'});
    return;
  }
  req.admin = admin;
  next();
}
