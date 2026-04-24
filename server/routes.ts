import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { packages, adminUsers, insertAnnouncementSchema, institutions } from "@shared/schema";
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

  // Always sync institution image URLs
  const imageMap: Record<string, string> = {
    "APU": "/universities/apu.jpeg",
    "Taylor's": "/universities/taylors.jpeg",
    "UCSI": "/universities/ucsi.jpeg",
    "UNITEN": "/universities/uniten.jpeg",
    "Lincoln": "/universities/lincoln.jpeg",
    "City": "/universities/city.jpeg",
    "MMU": "/universities/mmu.jpeg",
    "MSU": "/universities/msu.jpeg",
    "SEGI": "/universities/segi.jpeg",
    "Cyberjaya": "/universities/cyberjaya.jpeg",
    "Mahsa": "/universities/mahsa.jpeg",
    "Geometika": "/universities/geometika.jpeg",
    "IIUM": "/universities/iium.jpeg",
    "Monash": "/universities/monash.jpeg",
    "UKM": "/universities/ukm.jpeg",
    "Al-Madinah": "/universities/almadinah.jpeg",
    "Britannia Language Centre": "/universities/britannia.jpeg",
    "Sheffield Academy": "/universities/sheffield.jpeg",
    "EMS Language Centre": "/universities/ems.jpeg",
    "Bright Language Center": "/universities/bright.jpeg",
    "Big Ben Academy": "/universities/bigben.jpeg",
    "EXCEL Language Center": "/universities/excel.jpeg",
    "Erican Language Center": "/universities/erican.jpeg",
    "Webster Language Center": "/universities/webster.jpeg",
    "Study circle language center": "/universities/studycircle.jpeg",
  };
  const allInstitutionsForImages = await storage.getInstitutions();
  for (const inst of allInstitutionsForImages) {
    const img = imageMap[inst.name];
    if (img && inst.imageUrl !== img) {
      await db.update(institutions).set({ imageUrl: img }).where(eq(institutions.id, inst.id));
    }
  }

  const SHORT_FEATURES_AR = ["رسوم الدراسة", "رسوم التسجيل", "استقبال من المطار مع شرحة جوال وبطاقة مواصلات", "سكن يوم في فندق", "اختبار تحديد المستوى", "شهادة إتمام"];
  const SHORT_FEATURES_EN = ["Tuition Fees", "Registration Fees", "Airport Pickup with SIM Card & Transit Card", "One Hotel Night", "Placement Test", "Certificate of Completion"];
  const LONG_FEATURES_AR = ["رسوم الدراسة", "فيزا الطالب", "التأمين الطبي", "رسوم التسجيل", "استقبال من المطار مع شرحة جوال وبطاقة مواصلات", "سكن يوم في فندق", "الفحص الطبي", "اختبار تحديد المستوى", "شهادة إتمام"];
  const LONG_FEATURES_EN = ["Tuition Fees", "Student Visa", "Medical Insurance", "Registration Fees", "Airport Pickup with SIM Card & Transit Card", "One Hotel Night", "Medical Check-up", "Placement Test", "Certificate of Completion"];

  const canonicalPackages = [
    {
      nameAr: "باقة 3 أشهر",
      nameEn: "3-Month Package",
      originalPrice: "",
      discountedPrice: "8,800",
      savings: "",
      descriptionAr: "باقة مكثفة لمدة 3 أشهر",
      descriptionEn: "Intensive 3-month package",
      featuresAr: SHORT_FEATURES_AR,
      featuresEn: SHORT_FEATURES_EN,
    },
    {
      nameAr: "باقة 4 أشهر",
      nameEn: "4-Month Package",
      originalPrice: "",
      discountedPrice: "13,600",
      savings: "",
      descriptionAr: "باقة متوسطة لمدة 4 أشهر",
      descriptionEn: "Intermediate 4-month package",
      featuresAr: SHORT_FEATURES_AR,
      featuresEn: SHORT_FEATURES_EN,
      isSpecial: "true",
    },
    {
      nameAr: "باقة 6 أشهر",
      nameEn: "6-Month Package",
      originalPrice: "",
      discountedPrice: "16,300",
      savings: "",
      descriptionAr: "باقة شاملة لمدة 6 أشهر مع كافة الخدمات",
      descriptionEn: "Comprehensive 6-month package with all services",
      featuresAr: LONG_FEATURES_AR,
      featuresEn: LONG_FEATURES_EN,
    },
    {
      nameAr: "باقة 8 أشهر",
      nameEn: "8-Month Package",
      originalPrice: "",
      discountedPrice: "20,400",
      savings: "",
      descriptionAr: "باقة طويلة الأمد لتعلم اللغة",
      descriptionEn: "Long-term language learning package",
      featuresAr: LONG_FEATURES_AR,
      featuresEn: LONG_FEATURES_EN,
    },
    {
      nameAr: "باقة 10 أشهر",
      nameEn: "10-Month Package",
      originalPrice: "",
      discountedPrice: "24,800",
      savings: "",
      descriptionAr: "أفضل قيمة لتعلم اللغة بشكل متكامل",
      descriptionEn: "Best value for integrated language learning",
      featuresAr: LONG_FEATURES_AR,
      featuresEn: LONG_FEATURES_EN,
    },
    {
      nameAr: "باقة سنة كاملة",
      nameEn: "Full Year Package",
      originalPrice: "",
      discountedPrice: "28,500",
      savings: "",
      descriptionAr: "ادرس سنة كاملة واحصل على أفضل تجربة",
      descriptionEn: "Study a full year for the best experience",
      featuresAr: LONG_FEATURES_AR,
      featuresEn: LONG_FEATURES_EN,
      isSpecial: "true",
    },
  ];

  const existingPackages = await storage.getPackages();
  if (existingPackages.length === 0) {
    for (const pkg of canonicalPackages) {
      await db.insert(packages).values(pkg);
    }
  } else {
    const sortedExisting = [...existingPackages].sort((a, b) => a.id - b.id);
    for (let i = 0; i < sortedExisting.length && i < canonicalPackages.length; i++) {
      const existing = sortedExisting[i];
      const canonical = canonicalPackages[i];
      await db.update(packages)
        .set({
          nameAr: canonical.nameAr,
          nameEn: canonical.nameEn,
          originalPrice: canonical.originalPrice,
          discountedPrice: canonical.discountedPrice,
          savings: canonical.savings,
          descriptionAr: canonical.descriptionAr,
          descriptionEn: canonical.descriptionEn,
          featuresAr: canonical.featuresAr,
          featuresEn: canonical.featuresEn,
          isSpecial: canonical.isSpecial ?? null,
        })
        .where(eq(packages.id, existing.id));
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

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const baseUrl = "https://gatewayservicess.com";
      const today = new Date().toISOString().split("T")[0];
      const institutions = await storage.getInstitutions();

      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/institutions", priority: "0.9", changefreq: "weekly" },
        { url: "/announcements", priority: "0.7", changefreq: "daily" },
      ];

      const institutionPages = institutions.map((inst) => ({
        url: `/institutions/${inst.id}`,
        priority: "0.6",
        changefreq: "monthly",
      }));

      const allPages = [...staticPages, ...institutionPages];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      res.status(500).send("Error generating sitemap");
    }
  });

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
