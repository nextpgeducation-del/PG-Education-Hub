import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, feesTable } from "@workspace/db";
import {
  GetStudentProfileResponse,
  UpdateStudentProfilePhotoBody,
  UpdateStudentProfilePhotoResponse,
  ChangeStudentPasswordBody,
  ChangeStudentPasswordResponse,
  GetStudentFeesResponse,
  GetStudentNotificationsResponse,
} from "@workspace/api-zod";
import { requireStudent, hashPassword, verifyPassword } from "../lib/auth";

const router: IRouter = Router();

router.get(
  "/student/profile",
  requireStudent,
  async (req, res): Promise<void> => {
    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, req.session.studentId!));

    if (!student) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    res.json(GetStudentProfileResponse.parse(student));
  },
);

router.patch(
  "/student/profile",
  requireStudent,
  async (req, res): Promise<void> => {
    const parsed = UpdateStudentProfilePhotoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [student] = await db
      .update(studentsTable)
      .set({ profilePhotoUrl: parsed.data.profilePhotoUrl })
      .where(eq(studentsTable.id, req.session.studentId!))
      .returning();

    if (!student) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    res.json(UpdateStudentProfilePhotoResponse.parse(student));
  },
);

router.post(
  "/student/change-password",
  requireStudent,
  async (req, res): Promise<void> => {
    const parsed = ChangeStudentPasswordBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, req.session.studentId!));

    if (!student) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const valid = await verifyPassword(
      parsed.data.currentPassword,
      student.passwordHash,
    );
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);
    await db
      .update(studentsTable)
      .set({ passwordHash })
      .where(eq(studentsTable.id, student.id));

    res.status(204).json(ChangeStudentPasswordResponse.parse(undefined));
  },
);

router.get(
  "/student/fees",
  requireStudent,
  async (req, res): Promise<void> => {
    const fees = await db
      .select()
      .from(feesTable)
      .where(eq(feesTable.studentId, req.session.studentId!))
      .orderBy(feesTable.year, feesTable.month);

    res.json(GetStudentFeesResponse.parse(fees));
  },
);

router.get(
  "/student/notifications",
  requireStudent,
  async (_req, res): Promise<void> => {
    res.json(GetStudentNotificationsResponse.parse([]));
  },
);

export default router;
