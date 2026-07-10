import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notesTable = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  className: text("class_name", { enum: ["6-8", "9-10", "11-12"] }).notNull(),
  fileUrl: text("file_url").notNull(),
  uploadDate: timestamp("upload_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertNoteSchema = createInsertSchema(notesTable).omit({
  id: true,
  uploadDate: true,
});
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type NoteRow = typeof notesTable.$inferSelect;

export const papersTable = pgTable("papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  board: text("board").notNull(),
  subject: text("subject").notNull(),
  year: integer("year").notNull(),
  className: text("class_name", { enum: ["6-8", "9-10", "11-12"] }).notNull(),
  fileUrl: text("file_url").notNull(),
  uploadDate: timestamp("upload_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertPaperSchema = createInsertSchema(papersTable).omit({
  id: true,
  uploadDate: true,
});
export type InsertPaper = z.infer<typeof insertPaperSchema>;
export type PaperRow = typeof papersTable.$inferSelect;

export const galleryImagesTable = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  uploadDate: timestamp("upload_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertGalleryImageSchema = createInsertSchema(
  galleryImagesTable,
).omit({ id: true, uploadDate: true });
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImageRow = typeof galleryImagesTable.$inferSelect;

export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(
  announcementsTable,
).omit({ id: true, createdAt: true });
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type AnnouncementRow = typeof announcementsTable.$inferSelect;

export const contactMessagesTable = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(
  contactMessagesTable,
).omit({ id: true, createdAt: true });
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessageRow = typeof contactMessagesTable.$inferSelect;

export const newsletterSubscribersTable = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(
  newsletterSubscribersTable,
).omit({ id: true, createdAt: true });
export type InsertNewsletterSubscriber = z.infer<
  typeof insertNewsletterSubscriberSchema
>;
export type NewsletterSubscriberRow =
  typeof newsletterSubscribersTable.$inferSelect;
