import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function requireStudent(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session.studentId) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session.adminId) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  next();
}
