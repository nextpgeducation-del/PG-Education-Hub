import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, adminsTable } from "@workspace/db";
import {
  LoginAdminBody,
  LoginAdminResponse,
  LogoutAdminResponse,
  GetCurrentAdminResponse,
} from "@workspace/api-zod";
import { verifyPassword } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/admin/login", async (req, res): Promise<void> => {
  const parsed = LoginAdminBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, parsed.data.username));

  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  await db
    .update(adminsTable)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminsTable.id, admin.id));

  req.session.adminId = admin.id;
  res.json(
    LoginAdminResponse.parse({ ...admin, lastLoginAt: new Date() }),
  );
});

router.post("/auth/admin/logout", async (req, res): Promise<void> => {
  req.session.adminId = undefined;
  res.status(204).json(LogoutAdminResponse.parse(undefined));
});

router.get("/auth/admin/me", async (req, res): Promise<void> => {
  if (!req.session.adminId) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, req.session.adminId));

  if (!admin) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  res.json(GetCurrentAdminResponse.parse(admin));
});

export default router;
