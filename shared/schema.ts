import { pgTable, text, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'university' or 'language_center'
  description: text("description").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  institutionId: serial("institution_id").references(() => institutions.id),
  desiredProgram: text("desired_program").notNull(),
  documents: text("documents"), // A simple text field to list documents or URLs
  status: varchar("status", { length: 50 }).notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInstitutionSchema = createInsertSchema(institutions).omit({ id: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ 
  id: true, 
  status: true, 
  createdAt: true 
});

export type Institution = typeof institutions.$inferSelect;
export type InsertInstitution = z.infer<typeof insertInstitutionSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

// Contract Types
export type CreateApplicationRequest = InsertApplication;
export type ApplicationResponse = Application;
export type InstitutionResponse = Institution;
