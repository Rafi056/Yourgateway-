import { pgTable, text, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
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

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  originalPrice: text("original_price").notNull(),
  discountedPrice: text("discounted_price").notNull(),
  savings: text("savings"),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  featuresAr: text("features_ar").array().notNull(),
  featuresEn: text("features_en").array().notNull(),
  isSpecial: text("is_special").default("false"), // Use text for boolean simplicity in some environments or just boolean
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

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  institutionId: integer("institution_id").references(() => institutions.id),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  institutionId: integer("institution_id").references(() => institutions.id),
  adminUserId: integer("admin_user_id").references(() => adminUsers.id),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  contentAr: text("content_ar").notNull(),
  contentEn: text("content_en").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Contract Types
export type CreateApplicationRequest = InsertApplication;
export type ApplicationResponse = Application;
export type InstitutionResponse = Institution;
