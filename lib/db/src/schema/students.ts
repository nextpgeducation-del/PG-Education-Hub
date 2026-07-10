import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().unique(),
  admissionNumber: text("admission_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  fatherName: text("father_name").notNull(),
  mobile: text("mobile").notNull().unique(),
  email: text("email"),
  passwordHash: text("password_hash").notNull(),
  pinCode: text("pin_code").notNull(),
  schoolName: text("school_name").notNull(),
  className: text("class_name", { enum: ["6-8", "9-10", "11-12"] }).notNull(),
  admissionDate: date("admission_date", { mode: "string" }).notNull(),
  registrationDate: timestamp("registration_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
  status: text("status", {
    enum: ["active", "inactive", "suspended", "terminated"],
  })
    .notNull()
    .default("active"),
  profilePhotoUrl: text("profile_photo_url"),
  terminationDate: timestamp("termination_date", { withTimezone: true }),
  terminationReason: text("termination_reason"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({
  id: true,
  registrationDate: true,
  createdAt: true,
});
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type StudentRow = typeof studentsTable.$inferSelect;

export const feesTable = pgTable("fees", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => studentsTable.id, { onDelete: "cascade" }),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  feeAmount: integer("fee_amount").notNull().default(0),
  discount: integer("discount").notNull().default(0),
  lateFee: integer("late_fee").notNull().default(0),
  amountPaid: integer("amount_paid").notNull().default(0),
  status: text("status", { enum: ["paid", "partial", "pending"] })
    .notNull()
    .default("pending"),
  paymentDate: date("payment_date", { mode: "string" }),
  receiptNumber: text("receipt_number"),
  paymentMode: text("payment_mode", {
    enum: [
      "cash",
      "upi",
      "bank_transfer",
      "debit_card",
      "credit_card",
      "other",
    ],
  }),
  remarks: text("remarks"),
});

export const insertFeeSchema = createInsertSchema(feesTable).omit({
  id: true,
});
export type InsertFee = z.infer<typeof insertFeeSchema>;
export type FeeRow = typeof feesTable.$inferSelect;
