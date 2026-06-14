#!/usr/bin/env node
/**
 * Build-time pre-render script for Gateway Services.
 *
 * After `vite build`, this script:
 *  1. Reads dist/public/index.html.
 *  2. For each public route, writes dist/public/<route>/index.html containing:
 *     a. Route-specific <head> meta (title, description, canonical, OG, Twitter).
 *     b. Meaningful HTML body content inside <div id="root"> so non-rendering
 *        AI crawlers (GPTBot, ClaudeBot, PerplexityBot) see real page text.
 *        React's createRoot() replaces this with its rendered tree when JS runs.
 *  3. Overwrites dist/public/sitemap.xml with a complete, build-time sitemap
 *     that includes every /institutions/:id URL — eliminating cross-artifact
 *     routing ambiguity and the dependency on the API artifact for sitemap data.
 *
 * DB access policy:
 *  - DATABASE_URL absent → exit 1 (fail-closed). Institutions require DB at build time.
 *  - DATABASE_URL set, DB unreachable or query fails → exit 1 (fail-closed).
 *
 * Private SPA routes (/dashboard, /admin) are NOT pre-rendered; they rely on
 * the targeted rewrites in artifact.toml. Unknown paths that have no file on
 * disk AND no matching rewrite receive a genuine HTTP 404.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "dist/public");

let template;
try {
  template = readFileSync(join(distDir, "index.html"), "utf-8");
} catch {
  console.error("dist/public/index.html not found — run vite build first.");
  process.exit(1);
}

const BASE = "https://gatewayservicess.com";
const TODAY = new Date().toISOString().split("T")[0];

// ── Home page body content ────────────────────────────────────────────────
// Injected into the root dist/public/index.html so the home page has crawlable
// body text for AI and social crawlers. React replaces this on the client.

const HOME_BODY = `
<main lang="en">
  <header>
    <h1>Gateway Services — بوابتك إلى ماليزيا</h1>
    <p>Your trusted gateway to study in Malaysia. Free enrollment assistance for universities and English language centers.</p>
  </header>
  <section>
    <h2>Study in Malaysia with Gateway Services</h2>
    <p>We are a licensed Saudi company helping Arabic-speaking and international students register at Malaysian universities and English language centers. Our services are completely free for students.</p>
  </section>
  <section>
    <h2>Our Services</h2>
    <ul>
      <li>University admission in Malaysia</li>
      <li>English language center registration</li>
      <li>Student visa assistance</li>
      <li>Airport pickup and settlement support</li>
      <li>Educational consultations</li>
    </ul>
  </section>
  <section>
    <h2>Featured Universities &amp; Language Centers</h2>
    <p>We partner with leading Malaysian universities including APU, Taylor&apos;s, UCSI, UNITEN, Lincoln, City University, MMU, MSU, SEGI, Cyberjaya, and more. For English language preparation we work with Britannia Language Centre, Sheffield Academy, EMS Language Centre, Bright Language Center, Big Ben Academy, EXCEL Language Center, and other premier institutes.</p>
  </section>
  <section>
    <h2>Contact Us</h2>
    <p>Reach us on WhatsApp for a free consultation about studying in Malaysia.</p>
    <p><a href="/institutions">Browse all institutions</a> | <a href="/about">About Gateway Services</a></p>
  </section>
</main>`;

// ── HTML helpers ──────────────────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escAttr(s) {
  return String(s).replace(/"/g, "&quot;");
}

function li(items) {
  return items.map((i) => `<li>${esc(i)}</li>`).join("\n");
}

// ── Head patching ─────────────────────────────────────────────────────────

function patchHead(html, { title, description, ogTitle, canonical }) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"[^>]*>/,
    `<meta name="description" content="${escAttr(description)}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"[^>]*>/,
    `<link rel="canonical" href="${canonical}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"[^>]*>/,
    `<meta property="og:url" content="${canonical}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"[^>]*>/,
    `<meta property="og:title" content="${escAttr(ogTitle)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"[^>]*>/,
    `<meta property="og:description" content="${escAttr(description)}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"[^>]*>/,
    `<meta name="twitter:title" content="${escAttr(ogTitle)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"[^>]*>/,
    `<meta name="twitter:description" content="${escAttr(description)}" />`
  );
  return html;
}

// ── Body content injection ────────────────────────────────────────────────
// Replaces <div id="root"></div> with static HTML content.
// React's createRoot() will replace this when JavaScript executes.
// Non-rendering AI crawlers see the real text content.

function injectBody(html, bodyContent) {
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${bodyContent}</div>`
  );
}

// ── Static page body content ──────────────────────────────────────────────

const ABOUT_BODY = `
<main lang="en">
  <header>
    <h1>About Gateway Services | عن Gateway Services</h1>
    <p>A licensed Saudi company founded by youth who lived the study experience in Malaysia.</p>
  </header>
  <section>
    <h2>Who We Are</h2>
    <p>We are a licensed Saudi company registered with a Saudi commercial register, founded by young people with real experience studying and living in Malaysia. Our goal is to facilitate the journey of students wishing to study in Malaysia, from choosing the right English language institute or university to settling in and starting academic life with full comfort and clarity.</p>
    <p>We believe that studying abroad requires a trusted party that understands the student&apos;s needs and helps them with clear steps, away from complexity or scattered information. We provide our services in a professional and transparent manner that suits students and parents alike.</p>
  </section>
  <section>
    <h2>Our Services</h2>
    <ul>
      ${li([
        "Registration in English Language Institutes",
        "Applying to Malaysian Universities",
        "Educational Consultations",
        "Assistance with Admission Procedures",
        "Pre-travel and Post-arrival Guidance",
        "Student Support Throughout Their Journey",
      ])}
    </ul>
  </section>
  <section>
    <h2>Our Vision</h2>
    <p>To be one of the trusted Saudi entities in providing educational services for students wishing to study in Malaysia, with a focus on credibility, service quality, and the student experience.</p>
  </section>
  <section>
    <h2>Why Gateway Services?</h2>
    <ul>
      ${li([
        "Saudi company registered with a commercial register",
        "Experience and knowledge of life and study in Malaysia",
        "Direct follow-up with the student",
        "Clarity and transparency in procedures",
        "Continuous support before and after arrival",
      ])}
    </ul>
  </section>
</main>
`;

const TERMS_BODY = `
<main lang="en">
  <header>
    <h1>Terms &amp; Conditions | الشروط والأحكام</h1>
    <p>Gateway Services terms governing student support and enrollment services.</p>
  </header>
  <section>
    <h2>1. Nature of Service</h2>
    <p>We provide student assistance services including:</p>
    <ul>
      ${li([
        "Admission to institutes or universities in Malaysia",
        "Accommodation arrangements",
        "Airport reception",
        "Providing information and student support services",
      ])}
    </ul>
  </section>
  <section>
    <h2>2. Use of Service</h2>
    <p>The service is intended for students wishing to study in Malaysia, and accurate information must be provided upon registration.</p>
  </section>
  <section>
    <h2>3. Liability</h2>
    <p>We operate as an intermediary and coordination service provider. We are not responsible for application rejections by the educational institution if they result from the institution&apos;s own requirements.</p>
  </section>
  <section>
    <h2>4. Payment (If Applicable in the Future)</h2>
    <p>If there are service fees or paid packages, they will be clarified before completing the request.</p>
  </section>
  <section>
    <h2>5. Refund Policy</h2>
    <p>Refund requests are evaluated on a case-by-case basis in accordance with the policies of the institution involved.</p>
  </section>
  <section>
    <h2>6. Amendments</h2>
    <p>We reserve the right to modify these terms at any time without prior notice.</p>
  </section>
</main>
`;

const ANNOUNCEMENTS_BODY = `
<main lang="en">
  <header>
    <h1>Announcements | الإعلانات</h1>
    <p>Latest news, promotions, and program updates from Gateway Services.</p>
  </header>
  <p>Check back here for the latest announcements from Gateway Services and its partnered institutions in Malaysia.</p>
</main>
`;

// ── Static routes configuration ───────────────────────────────────────────

const staticRoutes = [
  {
    path: "about",
    title: "About Gateway Services | عن بوابتك إلى ماليزيا",
    description:
      "A licensed Saudi company helping students study in Malaysia — universities, language centers, visa support, and airport pickup. Free enrollment assistance.",
    ogTitle: "About Us | Gateway Services — بوابتك إلى ماليزيا",
    canonical: `${BASE}/about`,
    body: ABOUT_BODY,
  },
  {
    path: "institutions",
    title: "Universities & Language Centers in Malaysia | Gateway Services",
    description:
      "Browse Malaysian universities and English language centers partnered with Gateway Services. Free admission help for Arabic-speaking students.",
    ogTitle: "Study in Malaysia — Universities & Language Centers | Gateway Services",
    canonical: `${BASE}/institutions`,
    body: null, // replaced below with DB-rendered list
  },
  {
    path: "announcements",
    title: "Announcements | إعلانات — Gateway Services",
    description:
      "Latest news, promotions, and program updates from Gateway Services and its partnered institutions in Malaysia.",
    ogTitle: "Announcements | Gateway Services",
    canonical: `${BASE}/announcements`,
    body: ANNOUNCEMENTS_BODY,
  },
  {
    path: "terms",
    title: "Terms & Conditions | الشروط والأحكام — Gateway Services",
    description:
      "Terms and conditions governing Gateway Services' student support and enrollment services for students studying in Malaysia.",
    ogTitle: "Terms & Conditions | Gateway Services",
    canonical: `${BASE}/terms`,
    body: TERMS_BODY,
  },
];

// ── File emitter ──────────────────────────────────────────────────────────

function emit(subPath, html) {
  const dir = join(distDir, subPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf-8");
  console.log(`  prerendered  /${subPath}/index.html`);
}

function buildHtml(route) {
  let html = patchHead(template, route);
  if (route.body) {
    html = injectBody(html, route.body);
  }
  return html;
}

// ── Patch root index.html with home page body content ────────────────────
// The root dist/public/index.html serves "/" directly. Injecting HOME_BODY
// gives AI and social crawlers meaningful text for the home page.
// React's createRoot() replaces it when JavaScript executes.

console.log("Patching root index.html with home page content…");
const rootHtml = injectBody(template, HOME_BODY);
writeFileSync(join(distDir, "index.html"), rootHtml, "utf-8");
console.log("  patched  /index.html");

// ── Static routes ─────────────────────────────────────────────────────────

console.log("Pre-rendering static public routes…");
for (const route of staticRoutes) {
  if (route.path !== "institutions") {
    emit(route.path, buildHtml(route));
  }
}

// ── Database-driven routes ────────────────────────────────────────────────

async function prerenderFromDb() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error(
      "\n  DATABASE_URL is required for pre-rendering institution pages.\n" +
      "  Set DATABASE_URL in the build environment and retry.\n" +
      "  Without institution pre-rendering, institution detail URLs would return HTTP 404.\n"
    );
    process.exit(1);
  }

  let pg;
  try {
    pg = await import("pg");
  } catch (err) {
    console.error(`  pg module not found but DATABASE_URL is set: ${err.message}`);
    process.exit(1);
  }

  const { default: Pg } = pg;
  const client = new Pg.Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
  } catch (err) {
    console.error(
      `  Could not connect to database: ${err.message}\n` +
      "  Build aborted. Fix DATABASE_URL and ensure the database is reachable."
    );
    process.exit(1);
  }

  let institutions;
  let announcements;
  try {
    const instResult = await client.query(
      "SELECT id, name, type, description FROM institutions ORDER BY type, name"
    );
    institutions = instResult.rows;

    const annResult = await client.query(
      `SELECT title_en, title_ar, content_en, created_at, institution_id
       FROM announcements
       ORDER BY created_at DESC
       LIMIT 20`
    );
    announcements = annResult.rows;
  } catch (err) {
    console.error(`  DB query failed: ${err.message}`);
    await client.end();
    process.exit(1);
  }

  await client.end();

  // ── /institutions list page ────────────────────────────────────────────
  const universities = institutions.filter((i) => i.type === "university");
  const languageCenters = institutions.filter((i) => i.type === "language_center");

  const instListBody = `
<main lang="en">
  <header>
    <h1>Universities &amp; Language Centers in Malaysia | Gateway Services</h1>
    <p>Gateway Services partners with ${institutions.length} leading Malaysian institutions. Browse universities and English language centers below.</p>
  </header>
  <section>
    <h2>Universities (${universities.length})</h2>
    <ul>
      ${universities.map((i) => `<li><a href="${BASE}/institutions/${i.id}">${esc(i.name)}</a>${i.description ? ` — ${esc(i.description)}` : ""}</li>`).join("\n      ")}
    </ul>
  </section>
  <section>
    <h2>English Language Centers (${languageCenters.length})</h2>
    <ul>
      ${languageCenters.map((i) => `<li><a href="${BASE}/institutions/${i.id}">${esc(i.name)}</a>${i.description ? ` — ${esc(i.description)}` : ""}</li>`).join("\n      ")}
    </ul>
  </section>
</main>`;

  const instRoute = staticRoutes.find((r) => r.path === "institutions");
  instRoute.body = instListBody;
  emit("institutions", buildHtml(instRoute));

  // ── /announcements page with real data ────────────────────────────────
  if (announcements.length > 0) {
    const annBody = `
<main lang="en">
  <header>
    <h1>Announcements | إعلانات — Gateway Services</h1>
    <p>Latest news and updates from Gateway Services and its partnered institutions.</p>
  </header>
  <section>
    <ul>
      ${announcements.map((a) => `<li><h2>${esc(a.title_en || a.title_ar || "Announcement")}</h2>${a.content_en ? `<p>${esc(a.content_en.slice(0, 300))}${a.content_en.length > 300 ? "…" : ""}</p>` : ""}</li>`).join("\n      ")}
    </ul>
  </section>
</main>`;
    const annRoute = staticRoutes.find((r) => r.path === "announcements");
    annRoute.body = annBody;
    emit("announcements", buildHtml(annRoute));
  }

  // ── /institutions/:id detail pages ───────────────────────────────────
  console.log(`Pre-rendering ${institutions.length} institution detail pages…`);

  for (const inst of institutions) {
    const typeLabel = inst.type === "university" ? "University" : "Language Center";
    const title = `${inst.name} — ${typeLabel} in Malaysia | Gateway Services`;
    const description =
      inst.description ||
      `Study at ${inst.name}, a ${typeLabel.toLowerCase()} in Malaysia. Register with Gateway Services for free enrollment support.`;
    const canonical = `${BASE}/institutions/${inst.id}`;
    const ogTitle = `${inst.name} | ${typeLabel} in Malaysia`;

    const body = `
<main lang="en">
  <header>
    <h1>${esc(inst.name)}</h1>
    <p><strong>${esc(typeLabel)}</strong> — Malaysia</p>
  </header>
  <section>
    <p>${esc(description)}</p>
  </section>
  <section>
    <h2>Apply with Gateway Services</h2>
    <p>Gateway Services provides free admission assistance for ${esc(inst.name)}. We help with application, student visa, airport pickup, and settlement in Malaysia.</p>
    <p><a href="${BASE}/institutions">View all institutions</a> | <a href="${BASE}/">Contact us via WhatsApp</a></p>
  </section>
</main>`;

    emit(`institutions/${inst.id}`, buildHtml({ title, description, ogTitle, canonical, body }));
  }

  // ── Generate complete sitemap.xml ─────────────────────────────────────
  console.log("Generating complete build-time sitemap.xml…");

  const sitemapPages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/about", priority: "0.8", changefreq: "monthly" },
    { url: "/institutions", priority: "0.9", changefreq: "weekly" },
    { url: "/announcements", priority: "0.7", changefreq: "daily" },
    { url: "/terms", priority: "0.5", changefreq: "monthly" },
    ...institutions.map((i) => ({
      url: `/institutions/${i.id}`,
      priority: "0.6",
      changefreq: "monthly",
    })),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    (p) => `  <url>
    <loc>${BASE}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  writeFileSync(join(distDir, "sitemap.xml"), sitemapXml, "utf-8");
  console.log(`  wrote sitemap.xml (${sitemapPages.length} URLs)`);
}

await prerenderFromDb();

console.log("\nPre-rendering complete.");
