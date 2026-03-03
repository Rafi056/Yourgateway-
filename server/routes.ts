import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { packages, adminUsers, insertAnnouncementSchema } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  const existing = await storage.getInstitutions();
  if (existing.length === 0) {
    // Universities
    const universities = [
      "APU", "Taylor's", "UCSI", "UNITEN", "Lincoln", "City", "MMU", "MSU", "SEGI", "Cyberjaya", "Mahsa", "Geometika", "Others"
    ];
    for (const name of universities) {
      await storage.createInstitution({
        name,
        type: "university",
        description: name === "Others" ? "Select this option if your desired university is not listed." : `Study at ${name}, one of Malaysia's leading universities.`,
        location: "Malaysia",
        imageUrl: null,
      });
    }

    // Language Centers
    const languageCenters = [
      "Britannia Language Centre", "Sheffield Academy", "EMS Language Centre", "Bright Language Center", 
      "Big Ben Academy", "EXCEL Language Center", "Erican Language Center", "Webster Language Center", 
      "Study circle language center", "Others"
    ];
    for (const name of languageCenters) {
      await storage.createInstitution({
        name,
        type: "language_center",
        description: name === "Others" ? "Select this option if your desired language center is not listed." : `Learn English at ${name}, a premier language institution.`,
        location: "Malaysia",
        imageUrl: null,
      });
    }
  }

  const existingPackages = await storage.getPackages();
  if (existingPackages.length === 0) {
    const seedPackages = [
      {
        nameAr: "باقة شهرين – خصم 20%",
        nameEn: "2-Month Package – 20% Discount",
        originalPrice: "6,300",
        discountedPrice: "5,140",
        savings: "1,160",
        descriptionAr: "باقة مكثفة لشهرين مع خصم خاص",
        descriptionEn: "Intensive 2-month package with a special discount",
        featuresAr: ["رسوم الدراسة", "رسوم التسجيل", "اختبار تحديد المستوى", "شهادة إتمام"],
        featuresEn: ["Tuition Fees", "Registration Fees", "Placement Test", "Certificate of Completion"]
      },
      {
        nameAr: "شهرين + شهر مجاناً",
        nameEn: "2 Months + 1 Month FREE",
        originalPrice: "9,200",
        discountedPrice: "6,300",
        savings: "2,900",
        descriptionAr: "ادرس 3 أشهر بسعر شهرين فقط!",
        descriptionEn: "Study 3 Months for the Price of 2!",
        featuresAr: ["رسوم الدراسة", "رسوم التسجيل", "اختبار تحديد المستوى", "شهادة إتمام"],
        featuresEn: ["Tuition Fees", "Registration Fees", "Placement Test", "Certificate of Completion"],
        isSpecial: "true"
      },
      {
        nameAr: "باقة 6 أشهر – خصم 25%",
        nameEn: "6-Month Package – 25% Discount",
        originalPrice: "21,100",
        discountedPrice: "16,750",
        savings: "4,350",
        descriptionAr: "باقة شاملة لمدة 6 أشهر مع كافة الخدمات",
        descriptionEn: "Comprehensive 6-month package with all services",
        featuresAr: ["رسوم الدراسة", "فيزا الطالب", "التأمين الطبي", "رسوم التسجيل", "الاستقبال من المطار", "الفحص الطبي", "اختبار تحديد المستوى", "شهادة إتمام", "اختبار IELTS مجاني (محاولة واحدة)"],
        featuresEn: ["Tuition Fees", "Student Visa", "Medical Insurance", "Registration Fees", "Airport Pickup", "Medical Check-up", "Placement Test", "Certificate of Completion", "FREE IELTS Exam (One Attempt)"]
      },
      {
        nameAr: "باقة 8 أشهر – خصم 25%",
        nameEn: "8-Month Package – 25% Discount",
        originalPrice: "27,400",
        discountedPrice: "21,600",
        savings: "5,800",
        descriptionAr: "باقة طويلة الأمد لتعلم اللغة",
        descriptionEn: "Long-term language learning package",
        featuresAr: ["رسوم الدراسة", "فيزا الطالب", "التأمين الطبي", "رسوم التسجيل", "الاستقبال من المطار", "الفحص الطبي", "اختبار تحديد المستوى", "شهادة إتمام", "اختبار IELTS مجاني (محاولة واحدة)"],
        featuresEn: ["Tuition Fees", "Student Visa", "Medical Insurance", "Registration Fees", "Airport Pickup", "Medical Check-up", "Placement Test", "Certificate of Completion", "FREE IELTS Exam (One Attempt)"]
      },
      {
        nameAr: "باقة 10 أشهر – خصم 30%",
        nameEn: "10-Month Package – 30% Discount",
        originalPrice: "33,200",
        discountedPrice: "24,500",
        savings: "8,700",
        descriptionAr: "أفضل قيمة لتعلم اللغة بشكل متكامل",
        descriptionEn: "Best value for integrated language learning",
        featuresAr: ["رسوم الدراسة", "فيزا الطالب", "التأمين الطبي", "رسوم التسجيل", "الاستقبال من المطار", "الفحص الطبي", "اختبار تحديد المستوى", "شهادة إتمام", "اختبار IELTS مجاني (محاولة واحدة)"],
        featuresEn: ["Tuition Fees", "Student Visa", "Medical Insurance", "Registration Fees", "Airport Pickup", "Medical Check-up", "Placement Test", "Certificate of Completion", "FREE IELTS Exam (One Attempt)"]
      },
      {
        nameAr: "باقة 12 شهر – سجل 8 أشهر + 4 مجاناً",
        nameEn: "12-Month Package – Enroll 8 Months + 4 FREE",
        originalPrice: "41,100",
        discountedPrice: "27,400",
        savings: "13,700",
        descriptionAr: "ادرس سنة كاملة بسعر 8 أشهر!",
        descriptionEn: "Study 12 Months for the Price of 8!",
        featuresAr: ["رسوم الدراسة", "فيزا الطالب", "التأمين الطبي", "رسوم التسجيل", "الاستقبال من المطار", "الفحص الطبي", "اختبار تحديد المستوى", "شهادة إتمام", "اختبار IELTS مجاني (محاولة واحدة)"],
        featuresEn: ["Tuition Fees", "Student Visa", "Medical Insurance", "Registration Fees", "Airport Pickup", "Medical Check-up", "Placement Test", "Certificate of Completion", "FREE IELTS Exam (One Attempt)"],
        isSpecial: "true"
      }
    ];
    for (const pkg of seedPackages) {
      await db.insert(packages).values(pkg);
    }
  }

  const existingAdmins = await storage.getAdminByUsername("admin1");
  if (!existingAdmins) {
    const allInstitutions = await storage.getInstitutions("language_center");
    const hash = await bcrypt.hash("admin123", 10);
    if (allInstitutions.length >= 2) {
      await storage.createAdminUser({
        username: "admin1",
        passwordHash: hash,
        institutionId: allInstitutions[0].id,
        nameAr: "مدير معهد بريتانيا",
        nameEn: "Britannia Admin",
      });
      await storage.createAdminUser({
        username: "admin2",
        passwordHash: hash,
        institutionId: allInstitutions[1].id,
        nameAr: "مدير معهد شيفيلد",
        nameEn: "Sheffield Admin",
      });
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the DB
  seedDatabase().catch(console.error);

  app.get("/api/packages", async (req, res) => {
    try {
      const data = await storage.getPackages();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.institutions.list.path, async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const data = await storage.getInstitutions(type);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.institutions.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = await storage.getInstitution(id);
      if (!data) {
        return res.status(404).json({ message: "Institution not found" });
      }
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.applications.create.path, async (req, res) => {
    try {
      // Coerce numeric institutionId if needed, though zod handles strings depending on schema definition
      // Let's ensure the body parser will handle coercion if needed
      const schema = api.applications.create.input.extend({
        institutionId: z.coerce.number(),
      });
      const input = schema.parse(req.body);
      const application = await storage.createApplication(input);
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.applications.list.path, async (req, res) => {
    try {
      const data = await storage.getApplications();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.applications.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = await storage.getApplication(id);
      if (!data) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.adminUserId = admin.id;
      const institution = await storage.getInstitution(admin.institutionId!);
      res.json({
        id: admin.id,
        username: admin.username,
        nameAr: admin.nameAr,
        nameEn: admin.nameEn,
        institutionId: admin.institutionId,
        institutionName: institution?.name || "",
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/me", async (req, res) => {
    try {
      if (!req.session.adminUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const admin = await storage.getAdminById(req.session.adminUserId);
      if (!admin) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const institution = await storage.getInstitution(admin.institutionId!);
      res.json({
        id: admin.id,
        username: admin.username,
        nameAr: admin.nameAr,
        nameEn: admin.nameEn,
        institutionId: admin.institutionId,
        institutionName: institution?.name || "",
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/institutions/:id/announcements", async (req, res) => {
    try {
      const institutionId = Number(req.params.id);
      const data = await storage.getAnnouncementsByInstitution(institutionId);
      const enriched = await Promise.all(
        data.map(async (ann) => {
          const admin = ann.adminUserId ? await storage.getAdminById(ann.adminUserId) : null;
          return {
            ...ann,
            adminNameAr: admin?.nameAr || "",
            adminNameEn: admin?.nameEn || "",
          };
        })
      );
      res.json(enriched);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/announcements", async (req, res) => {
    try {
      const data = await storage.getAnnouncements();
      const enriched = await Promise.all(
        data.map(async (ann) => {
          const admin = ann.adminUserId ? await storage.getAdminById(ann.adminUserId) : null;
          const institution = ann.institutionId ? await storage.getInstitution(ann.institutionId) : null;
          return {
            ...ann,
            adminNameAr: admin?.nameAr || "",
            adminNameEn: admin?.nameEn || "",
            institutionName: institution?.name || "",
          };
        })
      );
      res.json(enriched);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      if (!req.session.adminUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const admin = await storage.getAdminById(req.session.adminUserId);
      if (!admin) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const validated = insertAnnouncementSchema.parse({
        ...req.body,
        institutionId: admin.institutionId,
        adminUserId: admin.id,
        imageUrl: req.body.imageUrl || null,
      });
      const announcement = await storage.createAnnouncement(validated);
      res.status(201).json(announcement);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      if (!req.session.adminUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const id = Number(req.params.id);
      const announcement = await storage.getAnnouncement(id);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      if (announcement.adminUserId !== req.session.adminUserId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      await storage.deleteAnnouncement(id);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = "https://gatewayservicess.com";
    const urls = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/institutions", priority: "0.9", changefreq: "weekly" },
      { loc: "/announcements", priority: "0.7", changefreq: "daily" },
      { loc: "/dashboard", priority: "0.5", changefreq: "monthly" },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  app.get("/api/admin/announcements", async (req, res) => {
    try {
      if (!req.session.adminUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const data = await storage.getAnnouncementsByAdmin(req.session.adminUserId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
