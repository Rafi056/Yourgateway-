import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { packages } from "@shared/schema";

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
        originalPrice: "41,100", // Adjusted to show original logic or fixed price
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

  return httpServer;
}
