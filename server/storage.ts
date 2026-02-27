import { db } from "./db";
import {
  institutions,
  applications,
  type Institution,
  type InsertInstitution,
  type Application,
  type InsertApplication,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getInstitutions(type?: string): Promise<Institution[]>;
  getInstitution(id: number): Promise<Institution | undefined>;
  createInstitution(inst: InsertInstitution): Promise<Institution>;

  createApplication(app: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
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
}

export const storage = new DatabaseStorage();
