import { Router, type IRouter } from "express";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import {
  db,
  announcementsTable,
  contactMessagesTable,
  galleryImagesTable,
  newsletterSubscribersTable,
  notesTable,
  papersTable,
  studentsTable,
} from "@workspace/db";
import {
  SubmitContactMessageBody,
  SubmitContactMessageResponse,
  SubscribeNewsletterBody,
  SubscribeNewsletterResponse,
  ListPublicAnnouncementsResponse,
  ListNotesQueryParams,
  ListNotesResponse,
  ListPapersQueryParams,
  ListPapersResponse,
  ListGalleryImagesResponse,
  GetPublicStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [message] = await db
    .insert(contactMessagesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(SubmitContactMessageResponse.parse(message));
});

router.post("/newsletter", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [subscriber] = await db
    .insert(newsletterSubscribersTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(SubscribeNewsletterResponse.parse(subscriber));
});

router.get("/announcements", async (_req, res): Promise<void> => {
  const announcements = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.pinned), desc(announcementsTable.createdAt));
  res.json(ListPublicAnnouncementsResponse.parse(announcements));
});

router.get("/notes", async (req, res): Promise<void> => {
  const parsed = ListNotesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { className, subject, search } = parsed.data;

  const conditions = [];
  if (className) conditions.push(eq(notesTable.className, className));
  if (subject) conditions.push(ilike(notesTable.subject, `%${subject}%`));
  if (search)
    conditions.push(
      or(
        ilike(notesTable.title, `%${search}%`),
        ilike(notesTable.subject, `%${search}%`),
      ),
    );

  const notes = await db
    .select()
    .from(notesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(notesTable.uploadDate));

  res.json(ListNotesResponse.parse(notes));
});

router.get("/papers", async (req, res): Promise<void> => {
  const parsed = ListPapersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { board, subject, search } = parsed.data;

  const conditions = [];
  if (board) conditions.push(ilike(papersTable.board, `%${board}%`));
  if (subject) conditions.push(ilike(papersTable.subject, `%${subject}%`));
  if (search)
    conditions.push(
      or(
        ilike(papersTable.title, `%${search}%`),
        ilike(papersTable.subject, `%${search}%`),
      ),
    );

  const papers = await db
    .select()
    .from(papersTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(papersTable.uploadDate));

  res.json(ListPapersResponse.parse(papers));
});

router.get("/gallery", async (_req, res): Promise<void> => {
  const images = await db
    .select()
    .from(galleryImagesTable)
    .orderBy(desc(galleryImagesTable.uploadDate));
  res.json(ListGalleryImagesResponse.parse(images));
});

router.get("/stats", async (_req, res): Promise<void> => {
  const [row] = await db
    .select({ total: count() })
    .from(studentsTable);

  res.json(
    GetPublicStatsResponse.parse({
      studentsEnrolled: row?.total ?? 0,
      expertTeachers: 2,
      coursesCount: 7,
      successRate: 98,
    }),
  );
});

export default router;
