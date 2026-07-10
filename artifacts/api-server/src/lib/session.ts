import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";

declare module "express-session" {
  interface SessionData {
    studentId?: number;
    adminId?: number;
  }
}

const PgStore = connectPgSimple(session);

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set.");
}

const store = new PgStore({
  pool,
  tableName: "session",
  createTableIfMissing: true,
});

store.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Session store error:", err);
});

export const sessionMiddleware = session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
});
