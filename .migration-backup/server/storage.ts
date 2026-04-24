import { db } from "./db";
import {
  institutions,
  applications,
  packages,
  adminUsers,
  announcements,
  type Institution,
  type InsertInstitution,
  type Application,
  type InsertApplication,
  type AdminUser,
  type InsertAdminUser,
  type Announcement,
  type InsertAnnouncement,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getInstitutions(type?: string): Promise<Institution[]>;
  getInstitution(id: number): Promise<Institution | undefined>;
  createInstitution(inst: InsertInstitution): Promise<Institution>;

  createApplication(app: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;

  getPackages(): Promise<any[]>;

  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminById(id: number): Promise<AdminUser | undefined>;
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;

  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsByInstitution(institutionId: number): Promise<Announcement[]>;
  getAnnouncementsByAdmin(adminUserId: number): Promise<Announcement[]>;
  createAnnouncement(ann: InsertAnnouncement): Promise<Announcement>;
  deleteAnnouncement(id: number): Promise<void>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getInstitutions(type?: string): Promise<Institution[]> {
    if (type) {
      return await db.select().from(institutions).where(eq(institutions.type, type));
    }
    return await db.select().from(institutions);
  }

  async getInstitution(id: number): Promise<Institution | undefined> {
    const [institution] = await db.select().from(institutions).where(eq(institutions.id, id));
    return institution;
  }

  async createInstitution(inst: InsertInstitution): Promise<Institution> {
    const [institution] = await db.insert(institutions).values(inst).returning();
    return institution;
  }

  async createApplication(app: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(app).returning();
    return application;
  }

  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getPackages(): Promise<any[]> {
    return await db.select().from(packages);
  }

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin;
  }

  async getAdminById(id: number): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return admin;
  }

  async createAdminUser(admin: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(admin).returning();
    return user;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async getAnnouncementsByInstitution(institutionId: number): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.institutionId, institutionId)).orderBy(desc(announcements.createdAt));
  }

  async getAnnouncementsByAdmin(adminUserId: number): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.adminUserId, adminUserId)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(ann: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(ann).returning();
    return announcement;
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }
}

export const storage = new DatabaseStorage();
