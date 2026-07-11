import { Router, type IRouter } from "express";
import { and, asc, count, desc, eq, gte, ilike, or, sum } from "drizzle-orm";
import {
  db,
  studentsTable,
  feesTable,
  notesTable,
  papersTable,
  galleryImagesTable,
  announcementsTable,
  contactMessagesTable,
  adminsTable,
} from "@workspace/db";
import {
  ChangeAdminPasswordBody,
  ChangeAdminPasswordResponse,
  GetAdminDashboardSummaryResponse,
  ListStudentsQueryParams,
  ListStudentsResponse,
  CreateStudentBody,
  CreateStudentResponse,
  GetStudentParams,
  GetStudentResponse,
  UpdateStudentParams,
  UpdateStudentBody,
  UpdateStudentResponse,
  DeleteStudentParams,
  TerminateStudentParams,
  TerminateStudentBody,
  TerminateStudentResponse,
  RestoreStudentParams,
  RestoreStudentResponse,
  ListTerminatedStudentsResponse,
  GetStudentFeesAdminParams,
  GetStudentFeesAdminResponse,
  UpdateFeeParams,
  UpdateFeeBody,
  UpdateFeeResponse,
  ListNotesAdminResponse,
  CreateNoteBody,
  CreateNoteResponse,
  DeleteNoteParams,
  ListPapersAdminResponse,
  CreatePaperBody,
  CreatePaperResponse,
  DeletePaperParams,
  ListGalleryAdminResponse,
  CreateGalleryImageBody,
  CreateGalleryImageResponse,
  DeleteGalleryImageParams,
  ListAnnouncementsAdminResponse,
  CreateAnnouncementBody,
  CreateAnnouncementResponse,
  UpdateAnnouncementParams,
  UpdateAnnouncementBody,
  UpdateAnnouncementResponse,
  DeleteAnnouncementParams,
  ListContactMessagesResponse,
} from "@workspace/api-zod";
import { requireAdmin, hashPassword, verifyPassword } from "../lib/auth";
import { generateStudentId, generateAdmissionNumber, generateReceiptNumber } from "../lib/ids";

const router: IRouter = Router();

router.use(requireAdmin);

router.post("/admin/change-password", async (req, res): Promise<void> => {
  const parsed = ChangeAdminPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, req.session.adminId!));

  if (!admin) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  const valid = await verifyPassword(
    parsed.data.currentPassword,
    admin.passwordHash,
  );
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db
    .update(adminsTable)
    .set({ passwordHash, mustChangePassword: false })
    .where(eq(adminsTable.id, admin.id));

  res.status(204).json(ChangeAdminPasswordResponse.parse(undefined));
});

router.get("/admin/dashboard-summary", async (_req, res): Promise<void> => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    [totalRow],
    [activeRow],
    [terminatedRow],
    [newAdmissionsRow],
    [todaysRow],
    [collectedRow],
    [pendingRow],
    [monthlyRow],
    [notesRow],
    [papersRow],
  ] = await Promise.all([
    db.select({ total: count() }).from(studentsTable),
    db.select({ total: count() }).from(studentsTable).where(eq(studentsTable.status, "active")),
    db.select({ total: count() }).from(studentsTable).where(eq(studentsTable.status, "terminated")),
    db.select({ total: count() }).from(studentsTable).where(gte(studentsTable.registrationDate, startOfMonth)),
    db.select({ total: count() }).from(studentsTable).where(gte(studentsTable.registrationDate, startOfToday)),
    db.select({ total: sum(feesTable.amountPaid) }).from(feesTable),
    db.select({ total: sum(feesTable.feeAmount) }).from(feesTable).where(or(eq(feesTable.status, "pending"), eq(feesTable.status, "partial"))),
    db.select({ total: sum(feesTable.amountPaid) }).from(feesTable).where(and(eq(feesTable.month, now.getMonth() + 1), eq(feesTable.year, now.getFullYear()))),
    db.select({ total: count() }).from(notesTable),
    db.select({ total: count() }).from(papersTable),
  ]);

  res.json(
    GetAdminDashboardSummaryResponse.parse({
      totalStudents: totalRow?.total ?? 0,
      activeStudents: activeRow?.total ?? 0,
      terminatedStudents: terminatedRow?.total ?? 0,
      totalFeesCollected: Number(collectedRow?.total ?? 0),
      pendingFees: Number(pendingRow?.total ?? 0),
      monthlyCollection: Number(monthlyRow?.total ?? 0),
      newAdmissionsThisMonth: newAdmissionsRow?.total ?? 0,
      todaysNewRegistrations: todaysRow?.total ?? 0,
      totalNotes: notesRow?.total ?? 0,
      totalPapers: papersRow?.total ?? 0,
      totalMockTests: 0,
    }),
  );
});

router.get("/admin/students", async (req, res): Promise<void> => {
  const parsed = ListStudentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, className, status, sort } = parsed.data;

  const conditions = [];
  if (className) conditions.push(eq(studentsTable.className, className));
  if (status) conditions.push(eq(studentsTable.status, status));
  else conditions.push(or(eq(studentsTable.status, "active"), eq(studentsTable.status, "inactive"), eq(studentsTable.status, "suspended"))!);
  if (search)
    conditions.push(
      or(
        ilike(studentsTable.fullName, `%${search}%`),
        ilike(studentsTable.mobile, `%${search}%`),
        ilike(studentsTable.studentId, `%${search}%`),
        ilike(studentsTable.admissionNumber, `%${search}%`),
      ),
    );

  let orderBy = desc(studentsTable.createdAt);
  if (sort === "oldest") orderBy = asc(studentsTable.createdAt);
  else if (sort === "nameAsc") orderBy = asc(studentsTable.fullName);
  else if (sort === "nameDesc") orderBy = desc(studentsTable.fullName);

  const students = await db
    .select()
    .from(studentsTable)
    .where(and(...conditions))
    .orderBy(orderBy);

  res.json(ListStudentsResponse.parse(students));
});

router.post("/admin/students", async (req, res): Promise<void> => {
  const parsed = CreateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const passwordHash = await hashPassword(parsed.data.password);

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
      admissionDate: parsed.data.admissionDate.toISOString().slice(0, 10),
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

  res.status(201).json(CreateStudentResponse.parse(student));
});

router.get("/admin/students/:id", async (req, res): Promise<void> => {
  const params = GetStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [student] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.id, params.data.id));

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  res.json(GetStudentResponse.parse(student));
});

router.patch("/admin/students/:id", async (req, res): Promise<void> => {
  const params = UpdateStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.admissionDate) {
    updates.admissionDate = parsed.data.admissionDate.toISOString().slice(0, 10);
  }

  const [student] = await db
    .update(studentsTable)
    .set(updates)
    .where(eq(studentsTable.id, params.data.id))
    .returning();

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  res.json(UpdateStudentResponse.parse(student));
});

router.delete("/admin/students/:id", async (req, res): Promise<void> => {
  const params = DeleteStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [student] = await db
    .delete(studentsTable)
    .where(eq(studentsTable.id, params.data.id))
    .returning();

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/admin/students/:id/terminate", async (req, res): Promise<void> => {
  const params = TerminateStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = TerminateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [student] = await db
    .update(studentsTable)
    .set({
      status: "terminated",
      terminationDate: new Date(),
      terminationReason: parsed.data.reason,
    })
    .where(eq(studentsTable.id, params.data.id))
    .returning();

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  res.json(TerminateStudentResponse.parse(student));
});

router.post("/admin/students/:id/restore", async (req, res): Promise<void> => {
  const params = RestoreStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [student] = await db
    .update(studentsTable)
    .set({ status: "active", terminationDate: null, terminationReason: null })
    .where(eq(studentsTable.id, params.data.id))
    .returning();

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  res.json(RestoreStudentResponse.parse(student));
});

router.get("/admin/terminated-students", async (_req, res): Promise<void> => {
  const students = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.status, "terminated"))
    .orderBy(desc(studentsTable.terminationDate));

  res.json(ListTerminatedStudentsResponse.parse(students));
});

router.get("/admin/students/:id/fees", async (req, res): Promise<void> => {
  const params = GetStudentFeesAdminParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [student] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.id, params.data.id));

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  const fees = await db
    .select()
    .from(feesTable)
    .where(eq(feesTable.studentId, params.data.id))
    .orderBy(feesTable.year, feesTable.month);

  res.json(GetStudentFeesAdminResponse.parse(fees));
});

router.patch("/admin/fees/:feeId", async (req, res): Promise<void> => {
  const params = UpdateFeeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateFeeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.paymentDate) {
    updates.paymentDate = parsed.data.paymentDate.toISOString().slice(0, 10);
  }
  if (parsed.data.status === "paid") {
    const [existing] = await db
      .select()
      .from(feesTable)
      .where(eq(feesTable.id, params.data.feeId));
    if (existing && !existing.receiptNumber) {
      updates.receiptNumber = generateReceiptNumber();
    }
  }

  const [fee] = await db
    .update(feesTable)
    .set(updates)
    .where(eq(feesTable.id, params.data.feeId))
    .returning();

  if (!fee) {
    res.status(404).json({ error: "Fee record not found" });
    return;
  }

  res.json(UpdateFeeResponse.parse(fee));
});

router.get("/admin/notes", async (_req, res): Promise<void> => {
  const notes = await db
    .select()
    .from(notesTable)
    .orderBy(desc(notesTable.uploadDate));
  res.json(ListNotesAdminResponse.parse(notes));
});

router.post("/admin/notes", async (req, res): Promise<void> => {
  const parsed = CreateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [note] = await db.insert(notesTable).values(parsed.data).returning();
  res.status(201).json(CreateNoteResponse.parse(note));
});

router.delete("/admin/notes/:id", async (req, res): Promise<void> => {
  const params = DeleteNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [note] = await db
    .delete(notesTable)
    .where(eq(notesTable.id, params.data.id))
    .returning();

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/admin/papers", async (_req, res): Promise<void> => {
  const papers = await db
    .select()
    .from(papersTable)
    .orderBy(desc(papersTable.uploadDate));
  res.json(ListPapersAdminResponse.parse(papers));
});

router.post("/admin/papers", async (req, res): Promise<void> => {
  const parsed = CreatePaperBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [paper] = await db.insert(papersTable).values(parsed.data).returning();
  res.status(201).json(CreatePaperResponse.parse(paper));
});

router.delete("/admin/papers/:id", async (req, res): Promise<void> => {
  const params = DeletePaperParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [paper] = await db
    .delete(papersTable)
    .where(eq(papersTable.id, params.data.id))
    .returning();

  if (!paper) {
    res.status(404).json({ error: "Paper not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/admin/gallery", async (_req, res): Promise<void> => {
  const images = await db
    .select()
    .from(galleryImagesTable)
    .orderBy(desc(galleryImagesTable.uploadDate));
  res.json(ListGalleryAdminResponse.parse(images));
});

router.post("/admin/gallery", async (req, res): Promise<void> => {
  const parsed = CreateGalleryImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [image] = await db
    .insert(galleryImagesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(CreateGalleryImageResponse.parse(image));
});

router.delete("/admin/gallery/:id", async (req, res): Promise<void> => {
  const params = DeleteGalleryImageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [image] = await db
    .delete(galleryImagesTable)
    .where(eq(galleryImagesTable.id, params.data.id))
    .returning();

  if (!image) {
    res.status(404).json({ error: "Gallery image not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/admin/announcements", async (_req, res): Promise<void> => {
  const announcements = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.pinned), desc(announcementsTable.createdAt));
  res.json(ListAnnouncementsAdminResponse.parse(announcements));
});

router.post("/admin/announcements", async (req, res): Promise<void> => {
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [announcement] = await db
    .insert(announcementsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(CreateAnnouncementResponse.parse(announcement));
});

router.patch("/admin/announcements/:id", async (req, res): Promise<void> => {
  const params = UpdateAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [announcement] = await db
    .update(announcementsTable)
    .set(parsed.data)
    .where(eq(announcementsTable.id, params.data.id))
    .returning();

  if (!announcement) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }

  res.json(UpdateAnnouncementResponse.parse(announcement));
});

router.delete("/admin/announcements/:id", async (req, res): Promise<void> => {
  const params = DeleteAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [announcement] = await db
    .delete(announcementsTable)
    .where(eq(announcementsTable.id, params.data.id))
    .returning();

  if (!announcement) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/admin/contact-messages", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(desc(contactMessagesTable.createdAt));
  res.json(ListContactMessagesResponse.parse(messages));
});

export default router;
