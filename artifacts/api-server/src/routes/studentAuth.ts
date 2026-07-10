import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, feesTable } from "@workspace/db";
import {
  RegisterStudentBody,
  RegisterStudentResponse,
  LoginStudentBody,
  LoginStudentResponse,
  LogoutStudentResponse,
  GetCurrentStudentResponse,
} from "@workspace/api-zod";
import { hashPassword, verifyPassword } from "../lib/auth";
import { generateStudentId, generateAdmissionNumber } from "../lib/ids";

const router: IRouter = Router();

router.post("/auth/student/register", async (req, res): Promise<void> => {
  const parsed = RegisterStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.mobile, parsed.data.mobile));

  if (existing) {
    res.status(409).json({ error: "Mobile number already registered" });
    return;
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const today = new Date().toISOString().slice(0, 10);

  const [student] = await db
    .insert(studentsTable)
    .values({
      fullName: parsed.data.fullName,
      fatherName: parsed.data.fatherName,
      mobile: parsed.data.mobile,
      email: parsed.data.email,
      pinCode: parsed.data.pinCode,
      schoolName: parsed.data.schoolName,
      className: parsed.data.className,
      passwordHash,
      studentId: generateStudentId(),
      admissionNumber: generateAdmissionNumber(),
      admissionDate: today,
    })
    .returning();

  if (!student) {
    res.status(500).json({ error: "Failed to create student" });
    return;
  }

  const now = new Date();
  const feeRows = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      studentId: student.id,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      feeAmount: 2000,
    };
  });
  await db.insert(feesTable).values(feeRows);

  req.session.studentId = student.id;
  res.status(201).json(RegisterStudentResponse.parse(student));
});

router.post("/auth/student/login", async (req, res): Promise<void> => {
  const parsed = LoginStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [student] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.mobile, parsed.data.mobile));

  if (!student) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await verifyPassword(parsed.data.password, student.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.studentId = student.id;
  res.json(LoginStudentResponse.parse(student));
});

router.post("/auth/student/logout", async (req, res): Promise<void> => {
  req.session.studentId = undefined;
  res.status(204).json(LogoutStudentResponse.parse(undefined));
});

router.get("/auth/student/me", async (req, res): Promise<void> => {
  if (!req.session.studentId) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  const [student] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.id, req.session.studentId));

  if (!student) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  res.json(GetCurrentStudentResponse.parse(student));
});

export default router;
