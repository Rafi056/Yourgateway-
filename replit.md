# Replit.md

## Overview

This is a bilingual (Arabic/English) education portal web application called "بوابتك إلى ماليزيا" (Your Gateway to Malaysia). It helps Arabic-speaking students find and apply to universities and language centers in Malaysia. The app features:

- A browsable directory of Malaysian universities and language centers
- Study package listings with pricing and discounts
- An application submission system that also triggers WhatsApp notifications
- A dashboard to view submitted applications
- Full RTL/LTR language switching between Arabic and English

The backend is an Express.js REST API with a PostgreSQL database (via Drizzle ORM). The frontend is a React SPA using Vite, with routing handled by Wouter.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight, replaces React Router)
- **State/Data Fetching**: TanStack React Query v5 for all server state; no global client state library
- **UI Components**: shadcn/ui component library (Radix UI primitives + Tailwind CSS)
- **Animations**: Framer Motion for page transitions and interactive animations
- **Internationalization**: Custom `LanguageProvider` context (`client/src/lib/i18n.tsx`) that holds a flat translation map for both `ar` and `en`, switches `dir` attribute between `rtl` and `ltr`, and exposes a `t(key)` function
- **Styling**: Tailwind CSS with custom CSS variables defining an "Oxford Blue + Gold" academic color palette; RTL layout is handled by toggling `dir` classes throughout components
- **API Communication**: Custom hooks (`use-institutions.ts`, `use-applications.ts`) wrap React Query and call the shared route definitions from `@shared/routes`

**Pages:**
- `/` — Home (hero, services, pathways, CTA)
- `/institutions` — Filterable list of universities, language centers, and packages
- `/institutions/:id` — Institution detail + application form
- `/dashboard` — View all submitted applications
- `/announcements` — Public institute announcements feed
- `/admin` — Admin login + announcement management panel

### Backend Architecture

- **Runtime**: Node.js with Express v5 (ESM modules, TypeScript via tsx)
- **Entry point**: `server/index.ts` creates an HTTP server, registers routes, and serves static files in production
- **Route registration**: `server/routes.ts` imports the shared `api` route definition object and wires up handlers; also seeds the database on first run
- **Storage layer**: `server/storage.ts` defines an `IStorage` interface and a `DatabaseStorage` class that wraps Drizzle ORM queries — this makes the storage layer swappable
- **Database access**: `server/db.ts` creates a `pg.Pool` and a Drizzle instance using `DATABASE_URL` from environment
- **Build**: `script/build.ts` runs Vite for the client and esbuild for the server, bundling a specific allowlist of heavy dependencies to reduce cold-start time

### Data Storage

- **Database**: PostgreSQL (required; `DATABASE_URL` env var must be set)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-derived Zod validation schemas
- **Schema** (`shared/schema.ts`):
  - `institutions` — id, name, type (`university` | `language_center`), description, location, imageUrl
  - `packages` — id, nameAr, nameEn, originalPrice, discountedPrice, savings, descriptionAr, descriptionEn, featuresAr[], featuresEn[], isSpecial
  - `applications` — id, studentName, studentEmail, institutionId (FK → institutions), desiredProgram, documents, status (default: `pending`), createdAt
- **Migrations**: Drizzle Kit, output to `./migrations`, push via `npm run db:push`
- **Seeding**: `server/routes.ts` seeds institutions and packages on startup if tables are empty

### Shared Code

The `shared/` directory is imported by both client and server:
- `shared/schema.ts` — Drizzle table definitions + Zod insert schemas + TypeScript types
- `shared/routes.ts` — Typed API route map (method, path, input schema, response schemas) + a `buildUrl` helper for path param interpolation

This pattern ensures the frontend and backend agree on types and validation without code duplication.

### Authentication

- **Admin Authentication**: Institute admins authenticate via `express-session` (cookie-based, SESSION_SECRET env var). Login/logout endpoints at `/api/admin/login` and `/api/admin/logout`. Session data includes `adminUserId`. Cookies use `httpOnly`, `sameSite: lax`, and `secure` in production.
- **Demo Admin Accounts**: Seeded on startup — `admin1`/`admin123` (Britannia Language Centre), `admin2`/`admin123` (Sheffield Academy).
- **Student Auth**: Not implemented. The dashboard shows all applications globally.

### Announcements System

- **Public Page** (`/announcements`): Displays all institute announcements as cards sorted by newest first. Shows title, content, institution name, admin name, date, and optional image. Bilingual AR/EN.
- **Admin Panel** (`/admin`): Login form → create/delete announcements. Each admin sees only their own announcements. Form requires bilingual title + content, optional image URL.
- **API Routes**: `GET /api/announcements`, `POST /api/announcements` (auth), `DELETE /api/announcements/:id` (auth, own only), `GET /api/admin/announcements` (auth)
- **DB Tables**: `admin_users` (username, passwordHash, institutionId FK, nameAr, nameEn), `announcements` (institutionId FK, adminUserId FK, titleAr, titleEn, contentAr, contentEn, imageUrl, createdAt)

---

## External Dependencies

### Third-Party Services

- **WhatsApp**: Application submissions trigger `window.open` calls to `wa.me` links for two phone numbers (`+601129082602`, `+966562022668`). This is the primary notification/communication channel.
- **Payment Options**: Language package cards have a "Subscribe Now" button that opens a payment modal with 4 options (Tabby, Tamara, Bank Transfer, WhatsApp inquiry). All options currently redirect to WhatsApp with a pre-filled message containing the package name, price, and chosen payment method. Direct Tabby/Tamara API integration is pending API keys.
- **Google Fonts**: DM Sans, Playfair Display, and other fonts loaded via `<link>` tags in `client/index.html`
- **Unsplash**: Hero background image sourced from Unsplash CDN URL

### npm Package Groups

| Group | Packages |
|---|---|
| UI Primitives | All `@radix-ui/react-*` components |
| Forms | `react-hook-form`, `@hookform/resolvers` |
| Animation | `framer-motion` |
| Data fetching | `@tanstack/react-query` |
| Auth | `bcryptjs`, `express-session` |
| Database | `drizzle-orm`, `drizzle-zod`, `pg`, `connect-pg-simple` |
| Validation | `zod`, `zod-validation-error` |
| Routing | `wouter` |
| Date handling | `date-fns` |
| Build tools | `vite`, `esbuild`, `tsx`, `tailwindcss`, `typescript` |

### Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret key for express-session cookie signing |
| `NODE_ENV` | No | Controls dev vs. production mode |
| `REPL_ID` | No | Enables Replit-specific Vite plugins (cartographer, dev banner) |

### Replit-Specific Plugins

- `@replit/vite-plugin-runtime-error-modal` — always active
- `@replit/vite-plugin-cartographer` — active in dev on Replit
- `@replit/vite-plugin-dev-banner` — active in dev on Replit