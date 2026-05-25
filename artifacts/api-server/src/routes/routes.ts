import type { Express, Request } from "express";
import { storage } from "../storage";
import { api } from "../shared-routes";
import { z } from "zod";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { packages, adminUsers, insertAnnouncementSchema, institutions } from "@workspace/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "gateway-jwt-secret-2024";

function getAdminIdFromRequest(req: Request): number | null {
  // 1. Authorization header (new frontend)
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { adminId: number };
      return payload.adminId;
    } catch {
      return null;
    }
  }
  // 2. JWT cookie (old cached frontend or any browser)
  const cookieToken = req.cookies?.gw_admin_token;
  if (cookieToken) {
    try {
      const payload = jwt.verify(cookieToken, JWT_SECRET) as { adminId: number };
      return payload.adminId;
    } catch {
      return null;
    }
  }
  // 3. Session fallback
  return req.session?.adminUserId ?? null;
}

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

  const SHORT_FEATURES_AR = ["رسوم الدراسة", "رسوم التسجيل", "استقبال من المطار مع شرحة جوال وبطاقة مواصلات", "اختبار تحديد المستوى", "شهادة إتمام"];
  const SHORT_FEATURES_EN = ["Tuition Fees", "Registration Fees", "Airport Pickup with SIM Card & Transit Card", "Placement Test", "Certificate of Completion"];
  const MID_FEATURES_AR = ["رسوم الدراسة", "فيزا الطالب", "الفحص الطبي", "رسوم التسجيل", "استقبال من المطار مع شرحة جوال وبطاقة مواصلات", "اختبار تحديد المستوى", "شهادة إتمام"];
  const MID_FEATURES_EN = ["Tuition Fees", "Student Visa", "Medical Check-up", "Registration Fees", "Airport Pickup with SIM Card & Transit Card", "Placement Test", "Certificate of Completion"];
  const LONG_FEATURES_AR = ["رسوم الدراسة", "فيزا الطالب", "التأمين الطبي", "رسوم التسجيل", "استقبال من المطار مع شرحة جوال وبطاقة مواصلات", "الفحص الطبي", "اختبار تحديد المستوى", "شهادة إتمام"];
  const LONG_FEATURES_EN = ["Tuition Fees", "Student Visa", "Medical Insurance", "Registration Fees", "Airport Pickup with SIM Card & Transit Card", "Medical Check-up", "Placement Test", "Certificate of Completion"];

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
      featuresAr: MID_FEATURES_AR,
      featuresEn: MID_FEATURES_EN,
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

  // Seed or update admin accounts for all institutions
  const allInstitutions = await storage.getInstitutions();
  const institutionByName = Object.fromEntries(allInstitutions.map((i) => [i.name, i.id]));

  const adminAccounts = [
    // Language centers
    { username: "admin1",      password: "admin123",    nameAr: "مدير معهد بريتانيا",             nameEn: "Britannia Admin",       institution: "Britannia Language Centre" },
    { username: "Sheff123",    password: "Nourshef07",  nameAr: "مدير معهد شيفيلد",               nameEn: "Sheffield Admin",       institution: "Sheffield Academy" },
    { username: "bigben",      password: "gateway2024", nameAr: "مدير Big Ben Academy",            nameEn: "Big Ben Admin",         institution: "Big Ben Academy" },
    { username: "bright",      password: "gateway2024", nameAr: "مدير Bright Language Center",     nameEn: "Bright Admin",          institution: "Bright Language Center" },
    { username: "ems",         password: "gateway2024", nameAr: "مدير EMS Language Centre",        nameEn: "EMS Admin",             institution: "EMS Language Centre" },
    { username: "excel",       password: "gateway2024", nameAr: "مدير EXCEL Language Center",      nameEn: "EXCEL Admin",           institution: "EXCEL Language Center" },
    { username: "erican",      password: "gateway2024", nameAr: "مدير Erican Language Center",     nameEn: "Erican Admin",          institution: "Erican Language Center" },
    { username: "studycircle", password: "gateway2024", nameAr: "مدير Study Circle",               nameEn: "Study Circle Admin",    institution: "Study circle language center" },
    { username: "webster",     password: "gateway2024", nameAr: "مدير Webster Language Center",    nameEn: "Webster Admin",         institution: "Webster Language Center" },
    // Universities
    { username: "apu",         password: "gateway2024", nameAr: "مدير APU",                        nameEn: "APU Admin",             institution: "APU" },
    { username: "almadinah",   password: "gateway2024", nameAr: "مدير Al-Madinah",                 nameEn: "Al-Madinah Admin",      institution: "Al-Madinah" },
    { username: "city",        password: "gateway2024", nameAr: "مدير City University",             nameEn: "City Admin",            institution: "City" },
    { username: "cyberjaya",   password: "gateway2024", nameAr: "مدير Cyberjaya",                  nameEn: "Cyberjaya Admin",       institution: "Cyberjaya" },
    { username: "geometika",   password: "gateway2024", nameAr: "مدير Geometika",                  nameEn: "Geometika Admin",       institution: "Geometika" },
    { username: "iium",        password: "gateway2024", nameAr: "مدير IIUM",                       nameEn: "IIUM Admin",            institution: "IIUM" },
    { username: "lincoln",     password: "gateway2024", nameAr: "مدير Lincoln",                    nameEn: "Lincoln Admin",         institution: "Lincoln" },
    { username: "mmu",         password: "gateway2024", nameAr: "مدير MMU",                        nameEn: "MMU Admin",             institution: "MMU" },
    { username: "msu",         password: "gateway2024", nameAr: "مدير MSU",                        nameEn: "MSU Admin",             institution: "MSU" },
    { username: "mahsa",       password: "gateway2024", nameAr: "مدير Mahsa",                      nameEn: "Mahsa Admin",           institution: "Mahsa" },
    { username: "monash",      password: "gateway2024", nameAr: "مدير Monash",                     nameEn: "Monash Admin",          institution: "Monash" },
    { username: "segi",        password: "gateway2024", nameAr: "مدير SEGI",                       nameEn: "SEGI Admin",            institution: "SEGI" },
    { username: "taylors",     password: "gateway2024", nameAr: "مدير Taylor's",                   nameEn: "Taylor's Admin",        institution: "Taylor's" },
    { username: "ucsi",        password: "gateway2024", nameAr: "مدير UCSI",                       nameEn: "UCSI Admin",            institution: "UCSI" },
    { username: "ukm",         password: "gateway2024", nameAr: "مدير UKM",                        nameEn: "UKM Admin",             institution: "UKM" },
    { username: "uniten",      password: "gateway2024", nameAr: "مدير UNITEN",                     nameEn: "UNITEN Admin",          institution: "UNITEN" },
  ];

  // Remove old admin2 account if it exists (replaced by Sheff123)
  const oldAdmin2 = await storage.getAdminByUsername("admin2");
  if (oldAdmin2) {
    await db.delete(adminUsers).where(eq(adminUsers.username, "admin2"));
  }

  for (const acc of adminAccounts) {
    const institutionId = institutionByName[acc.institution];
    if (!institutionId) continue;
    const existing = await storage.getAdminByUsername(acc.username);
    const hash = await bcrypt.hash(acc.password, 10);
    if (!existing) {
      await storage.createAdminUser({
        username: acc.username,
        passwordHash: hash,
        institutionId,
        nameAr: acc.nameAr,
        nameEn: acc.nameEn,
      });
    } else {
      await db.update(adminUsers)
        .set({ passwordHash: hash, institutionId, nameAr: acc.nameAr, nameEn: acc.nameEn })
        .where(eq(adminUsers.username, acc.username));
    }
  }
}

export async function registerRoutes(
  app: Express
): Promise<void> {
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
      const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "7d" });
      res.cookie("gw_admin_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      const institution = await storage.getInstitution(admin.institutionId!);
      res.json({
        id: admin.id,
        username: admin.username,
        nameAr: admin.nameAr,
        nameEn: admin.nameEn,
        institutionId: admin.institutionId,
        institutionName: institution?.name || "",
        token,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/me", async (req, res) => {
    try {
      const adminId = getAdminIdFromRequest(req);
      if (!adminId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const admin = await storage.getAdminById(adminId);
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
    req.session.destroy(() => {});
    res.clearCookie("gw_admin_token", { path: "/", secure: true, sameSite: "none" });
    res.json({ message: "Logged out" });
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

  // ── Tamara: Create Checkout Session ──
  app.post("/api/payments/tamara/checkout", async (req, res) => {
    try {
      const { packageName, packagePrice, customerName, customerPhone, customerEmail, language } = req.body;

      const TAMARA_API_URL = "https://api-sandbox.tamara.co";
      const TAMARA_API_TOKEN = process.env.TAMARA_API_TOKEN;

      if (!TAMARA_API_TOKEN) {
        return res.status(500).json({ message: "Tamara not configured" });
      }

      // Convert MYR price string to number
      const priceNum = parseFloat(String(packagePrice).replace(/,/g, ""));
      // Tamara works in SAR, convert MYR → SAR (approx 0.80)
      const sarAmount = Math.round(priceNum * 0.80 * 100) / 100;

      const orderId = `GW-${Date.now()}`;
      const baseUrl = process.env.REPLIT_DOMAINS
        ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
        : "http://localhost:80";

      const payload = {
        order_reference_id: orderId,
        order_number: orderId,
        locale: language === "ar" ? "ar_SA" : "en_US",
        currency: "SAR",
        total_amount: { amount: sarAmount.toFixed(2), currency: "SAR" },
        description: packageName,
        country_code: "SA",
        payment_type: "PAY_BY_INSTALMENTS",
        instalments: 3,
        items: [
          {
            reference_id: orderId,
            type: "Digital",
            name: packageName,
            sku: orderId,
            quantity: 1,
            total_amount: { amount: sarAmount.toFixed(2), currency: "SAR" },
            unit_price: { amount: sarAmount.toFixed(2), currency: "SAR" },
            discount_amount: { amount: "0.00", currency: "SAR" },
            tax_amount: { amount: "0.00", currency: "SAR" },
          },
        ],
        consumer: {
          first_name: customerName || "Customer",
          last_name: "",
          phone_number: customerPhone || "",
          email: customerEmail || "customer@example.com",
        },
        billing_address: {
          first_name: customerName || "Customer",
          last_name: "",
          phone_number: customerPhone || "",
          address_line1: "Saudi Arabia",
          country_code: "SA",
        },
        shipping_address: {
          first_name: customerName || "Customer",
          last_name: "",
          phone_number: customerPhone || "",
          address_line1: "Saudi Arabia",
          country_code: "SA",
        },
        merchant_url: {
          success: `${baseUrl}/?payment=success&order=${orderId}`,
          failure: `${baseUrl}/?payment=failed&order=${orderId}`,
          cancel: `${baseUrl}/?payment=cancelled&order=${orderId}`,
          notification: `${baseUrl}/api/payments/tamara/webhook`,
        },
      };

      const tamaraRes = await fetch(`${TAMARA_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TAMARA_API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const tamaraData = await tamaraRes.json() as any;

      if (!tamaraRes.ok) {
        req.log?.error({ tamaraData, status: tamaraRes.status, payload }, "Tamara checkout failed");
        return res.status(400).json({ message: tamaraData.message || "Tamara error", details: tamaraData, status: tamaraRes.status });
      }

      res.json({ checkout_url: tamaraData.checkout_url, order_id: orderId });
    } catch (err) {
      req.log?.error({ err }, "Tamara checkout error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ── Tamara: Webhook ──
  app.post("/api/payments/tamara/webhook", (req, res) => {
    res.json({ received: true });
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const adminId = getAdminIdFromRequest(req);
      if (!adminId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const admin = await storage.getAdminById(adminId);
      if (!admin) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const validated = insertAnnouncementSchema.parse({
        ...req.body,
        institutionId: admin.institutionId,
        adminUserId: admin.id,
        imageUrl: req.body.imageUrl || null,
        pdfUrl: req.body.pdfUrl || null,
        pdfUrl2: req.body.pdfUrl2 || null,
        pdfUrl3: req.body.pdfUrl3 || null,
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
      const adminId = getAdminIdFromRequest(req);
      if (!adminId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const id = Number(req.params.id);
      const announcement = await storage.getAnnouncement(id);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      if (announcement.adminUserId !== adminId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      await storage.deleteAnnouncement(id);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/announcements", async (req, res) => {
    try {
      const adminId = getAdminIdFromRequest(req);
      if (!adminId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const data = await storage.getAnnouncementsByAdmin(adminId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

}
