# 📘 Development Guide — F16s Platform

This guide covers the **public website**, the **air waybill dashboard** (FocusAir, House Way Bill, Consolidation,
Message Log), the **superadmin panel**, the **OCR pipeline** and the **PDF documents**. The **Freight OS** — the
inbox, enquiries, jobs, FocusSea, import, accounts, sales and the Boss view — is documented in `docs/plan/`
(`HANDOFF.md`, `PRD.md`, `implementation_guide.md`, `ui_ux_guide.md`).

1. [Repository structure](#1-repository-structure)
2. [Pages and routes](#2-pages-and-routes)
3. [Branding and style rules](#3-branding-and-style-rules)
4. [Public website](#4-public-website)
5. [Air waybill dashboard](#5-air-waybill-dashboard)
6. [OCR pipeline](#6-ocr-pipeline)
7. [PDF documents](#7-pdf-documents)
8. [Superadmin and platform](#8-superadmin-and-platform)
9. [Dependencies](#9-dependencies)
10. [How to continue development](#10-how-to-continue-development)

---

## 1. Repository structure

```text
📦 (root)
 ┣ 📂 app                          # Backend (Laravel)
 ┃ ┣ 📂 Http/Controllers
 ┃ ┃ ┣ 📂 Auth                     # Login / identity
 ┃ ┃ ┣ 📂 Admin                    # Business management
 ┃ ┃ ┣ 📂 Logistics                # Waybills, conversion, OCR
 ┃ ┃ ┣ 📂 Generators               # PDF generation
 ┃ ┃ ┣ 📂 Data                     # Rates and lookups
 ┃ ┃ ┗ 📂 Freight                  # Freight OS → docs/plan/
 ┃ ┗ 📜 *.php                      # Models (User, AirwayBills, …)
 ┣ 📂 python                       # OCR / extraction service (FastAPI)
 ┣ 📂 public/media/assets          # banners · logos · vectors · illustrations · blog
 ┣ 📂 resources/js/src             # Frontend (Vue 2)
 ┃ ┣ 📂 assets/sass
 ┃ ┃ ┣ 📜 public-custom.scss       # Public website styles
 ┃ ┃ ┗ 📜 style.vue.scss           # Core theme entry
 ┃ ┣ 📂 view/layouts
 ┃ ┃ ┣ 📂 public                   # MainLayout — website and dashboard
 ┃ ┃ ┣ 📂 admin                    # Superadmin
 ┃ ┃ ┗ 📂 freight                  # Freight OS shell → docs/plan/
 ┃ ┣ 📂 view/pages
 ┃ ┃ ┣ 📂 public                   # Website (services/, legal/, blogData.js)
 ┃ ┃ ┣ 📂 dashboard                # Air waybill dashboard
 ┃ ┃ ┣ 📂 admin                    # Superadmin
 ┃ ┃ ┗ 📂 freight                  # Freight OS → docs/plan/
 ┃ ┗ 📜 router.js                  # Client-side routes
 ┣ 📂 resources/views
 ┃ ┣ 📂 emails                     # Mail templates
 ┃ ┣ 📂 documents                  # PDF templates
 ┃ ┗ 📜 welcome.blade.php          # App entry + preloader
 ┗ 📜 guide.md                     # This guide
```

---

## 2. Pages and routes

```text
🌐 /
 ┣ 🏙 Public website (MainLayout)
 ┃ ┣ Home (/) · About Us (/about-us) · Services (/services) · Solutions (/solutions) · Contact Us (/contact-us)
 ┃ ┣ Service pages: /cloud-storage · /end-to-end · /scalable-architecture · /product-description
 ┃ ┣ Blogs & News (/blogs-and-news) → Blog Post (/blog/:slug)
 ┃ ┗ Legal: /privacy · /privacy-policy · /terms-conditions
 ┃
 ┣ 🔐 Air waybill dashboard (sign-in required)
 ┃ ┣ ✈️ FocusAir — master AWB (/master-airway-bill, alias /focus-air) — OCR upload
 ┃ ┣ 🏠 House Way Bill (/house-way-bill)
 ┃ ┣ 📦 Consolidation (/consolidation)
 ┃ ┣ 📜 Message Log (/message-log)
 ┃ ┗ 📑 XML View (/xml-view/:id)
 ┃
 ┗ 🛠 Superadmin (layouts/admin/Layout, /superadmin/…)
   ┣ 👥 All Users (all-users) · 🏢 All Company (all-company)
   ┣ 📋 OCR Templates (all-templates) · ⚙️ Settings (setting)
   ┗ 📞 Contact Leads (all-contacts)
```

---

## 3. Branding and style rules

### Colours

| Element | Code | Role |
| :-- | :-- | :-- |
| **Brand Blue** | `#355594` | Identity, headers, main buttons |
| **Hover Blue** | `#2a4476` | Interactive states |
| **Text Muted** | `#5A6B8A` | Body copy, secondary text |
| **Surface** | `#f8fafc` | Page background |
| **Glass Layer** | `rgba(255, 255, 255, 0.95)` | Modals and cards |

### Fonts

- **Inter** — public website.
- **Nunito** — dashboard and utility sections.
- **In PDFs:** the AWB, HAWB and import documents print values in **Courier**; the bill and the bill of lading use
  **DejaVu Sans**, which prints ₹ and non-Latin names.

### Public website style rules

These apply to the **public website**. The Freight OS follows `docs/plan/ui_ux_guide.md` (`fx-` classes).

1. **Styles live in `public-custom.scss`**, not in a page's `<style scoped>`.
2. **No `backdrop-filter: blur()` on repeated elements** — high-opacity backgrounds (`rgba(255, 255, 255, 0.9)`)
   give the same look without the GPU cost.
3. **Decorative backgrounds** use the shared soft ellipses (`.decorative-ellipses`).
4. **Buttons** are pill-shaped with a shadow; on hover they lift (`translateY(-2px)`) and the icon shifts.
5. **Cards** have a `28px` or `32px` corner radius and `0.4s ease` transitions; main containers take `.glass-card`.

---

## 4. Public website

### Service and legal pages
Cloud Storage, End-to-End Service, Scalable Architecture and Product Description (`view/pages/public/services/`),
and the Privacy Policy and Terms pages (`legal/`).

### Blog
- **Database first:** `BlogsAndNews.vue` lists posts from the `blogs` table, filtered by category, and falls back to
  placeholders when the API cannot be reached. `HomeNewsSection.vue` reads the same endpoint for the home page.
- **Superadmin:** `BlogController.php` takes the image upload, makes the slug and validates the post.
- **Static data:** `resources/js/src/view/pages/public/blogData.js` — each post has `title`, `slug`, `image`
  (`/media/assets/blog/`), `content` (HTML) and `metaTitle` / `metaDescription`.
- **Setup:** `php artisan migrate` creates `blogs`; uploads need write access:
  `chmod -R 775 public/media/assets/blog/`.
- **Internal links** point back to `/services`, `/solutions` or `/product-description`.

### SEO
- **Meta tags (`vue-meta`):** every page sets its title, description and Open Graph tags in `metaInfo()`;
  `BlogPost.vue` takes them from the post.
- **Schema.org (JSON-LD):** WebSite (with the logo and social links) in `welcome.blade.php`, SoftwareApplication in `Home.vue`, BlogPosting in
  `BlogPost.vue`.
- **Sitemap and robots:** `public/sitemap.xml`; `public/robots.txt` points to it.

### Responsive layout
- `Header.vue` and `Footer.vue` adapt to mobile, tablet and desktop; service cards scroll sideways on mobile.
- **Mobile menu:** the profile sits in the hamburger menu as a card — an origin badge (`geo-alt-fill`) and a red
  **Sign out** button.

### Loading and performance
- **Images:** WebP first (quality 82, ~70% smaller) in `<picture>` with JPG fallbacks; names
  `banner-[type].[webp|jpg]` and `icon-name.webp`; all under `public/media/assets/`.
- **Lazy loading:** `loading="lazy"` below the fold, `loading="eager"` for hero images.
- **Ready guards:** the hero waits for `imagesReady` before it shows, so nothing shifts.
- **Skeletons:** shimmer placeholders for the hero and product grids, matching the final layout.
- **`will-change`** only while a transition runs.
- **Preloader:** in `welcome.blade.php` so it shows before the JS loads — `blue-logo.png` at `150px` with a CSS
  `pulse`; it hides on the window `load` event and again in `App.vue`'s `mounted()`. The dashboard pages use `PageLoader.vue`.
- **Timers:** `HomeStatsSection.vue` keeps its counter intervals in `this.activeTimers` and clears them in
  `beforeDestroy()`.

### Build (`webpack.mix.js`)
- **Vendor bundle:** `vue`, `vue-router`, `vue-meta`, `vuex` and `bootstrap-vue` go to `public/js/vendor.js`.
- **Code splitting:** `splitChunks` with `maxInitialRequests: 6` and a shared `common` chunk.
- **Chunk files** are named by hash (`js/chunk/[name].[chunkhash].js`), and the previous build's chunks are removed
  before each build.

### Digital cards
`JosephCard.vue` and `DeepanjanCard.vue` — vCards write phone numbers as `TEL;TYPE=CELL,VOICE:+91…` so they import
on iOS and Android.

---

## 5. Air waybill dashboard

### FocusAir (master AWB)
- The document page, renamed from `WebDoc`. OCR upload through `OcrUploadModal.vue` (§6).
- Templates per company (`ksr`, `ksr_house1`, `ksr_house2`, …).
- Form state is reset between extractions.
- **Email FNA:** a checkbox fills the field with the signed-in user's email and stays in step with it.

### Address book matching (`resources/js/src/core/mixins/airWayBillMixin.js`)
- `normalizeText(str)` — lowercase letters and digits only.
- `calculateSimilarity(str1, str2)` — Levenshtein similarity.
- `findMatchingAddress(ocrEntity, savedList)` — matches the extracted shipper / consignee to the saved address book
  at 90% or more, else keeps the extracted text. Used by `FocusAir.vue` and `HouseWayBill.vue`.

### Message Log
- `MessageLogController@getAllAirwayBill` is paginated on the server, and loads the house waybills for the page's
  master AWBs in one query.
- `MessageLog.vue` formats rows in a computed property (`normalizedItems`), not in the template.
- The dashboard pages share one card style: white, `32px` radius, `box-shadow: 0 10px 30px rgba(53, 85, 148, 0.1)`.

### EDI messages
- **FWB** — the electronic air waybill. **FHL** — the house list for a consolidation.
- Sent as **Cargo-XML** (the successor to Cargo-IMP) to airlines through Descartes, towards paperless e-AWB.

### Descartes status responses
- `GLNResponseController.php` reads the incoming Cargo-XML and records it in `status_response`
  (model `StatusReponse.php`).
- On **Rejected** for an Air Waybill it mails the AWB's `awb_email` (`emails.awb-reject-status`).
- `ClientShipments.vue` (superadmin, via `SuperAdminController@getClientShipments`) shows **FNA Received** badges with
  the rejection on hover.

---

## 6. OCR pipeline

| Part | What it does |
|---|---|
| `python/ocr_server.py` | FastAPI service, loaded once, so there is no Python cold start. Runs as the `ai-server` container on port **8000** (`OCR_SERVICE_URL`) |
| `python/extract_awb_new.py` | Reads an AWB by template boxes |
| `OcrController.php` | `POST /api/user/upload-awb-file` queues a reading and returns its job id; `GET /api/user/ocr-status/{jobId}` returns its status and the extracted JSON |
| `ProcessPdfOcrJob.php` | The queued job; its state is kept on `PdfProcessingJob` |
| `OcrUploadModal.vue` | The upload and polling modal used by `FocusAir.vue` and `HouseWayBill.vue`: `<OcrUploadModal initialType="ksr" @extracted="processExtractedData" />`. With no file chosen, **Extract** opens the file picker; its polling interval is cleared in `beforeDestroy` |

### Extraction (`extract_awb_new.py`)
- Airport aliases (Mumbai/Bombay, Chicago O'Hare, Toronto, …).
- Drops form headers ("SHIPPER'S NAME AND ADDRESS") so names and places come out clean.
- Flight numbers in several formats; dates completed ("05-MAY" → "05-MAY-2026").
- Removes PDF-to-text artefacts (`|`, extra spaces).

### Templates (box coordinates)
- Stored in the database (`App\SystemTemplate`), edited by the superadmin.
- On every change `TemplateController` writes `python/boxes_config.json.tmp` and renames it over
  `python/boxes_config.json`, so the parser never reads a half-written file.
- A template that a company still uses cannot be deleted.
- `NewCompany.vue` assigns templates by clicking their tags; old flat lists are converted when the record loads.

---

## 7. PDF documents

`resources/views/documents/` (DomPDF).

### AWB and HAWB (`generate-awb-pdf.blade.php`, `generate-hawb-pdf.blade.php`)
- Flat containers instead of nested tables.
- One utility class block in the `<head>`: `.box-cell` (field cell), `.label-text`, `.value-text` (Courier),
  `.border-l`, `.border-b`, ….
- Page 2, the Conditions of Contract, is two columns with a forced page break.
- The IATA logo is embedded as base64 (`base64_encode(file_get_contents(public_path('media/assets/logos/iata-logo.png')))`),
  because DomPDF's `chroot` blocks the file path.

---

## 8. Superadmin and platform

### Company template cache
- `UserController::me()` caches `templates_config` for **60 seconds** under `company_templates_{companyName}`.
- `CompanyController` clears it on `register()` and `update()` —
  `Cache::forget("company_templates_{$company->name}")` — so a change shows on the next request.

### User fields
- `can_send` — whether the user may send XML directly.
- `pima_address` — written into the `ram:PrimaryID` header by `ConversionController.php`.

### Validation messages (`resources/lang/en/validation.php`)
- Short messages: `:attribute is required.`, `:attribute format is invalid.`, `:attribute cannot exceed :max characters.`
- `attributes` names the fields: `awb_code` → *AWB Prefix*, `awb_no` → *AWB Number*, `ship_name` → *Shipper Name*,
  `cons_address` → *Consignee Address*, `hawb_no` → *House Airway Bill Number*, `master_origin`, `master_destination`,
  `master_pcs`, `master_weight`, ….
- The keys are unchanged, so the forms still highlight the field in error.

### OpenClaw webhooks
- `VerifyOpenClawSignature.php` checks each request's signature and refuses a nonce already in `openclaw_nonces`.
- Incoming actions wait in `openclaw_pending_actions` until an admin confirms them. API: `openclaw_api_docs.md`.

---

## 9. Dependencies

### Frontend

| Package | Purpose |
| :-- | :-- |
| `vue` 2.7.16 | Framework |
| `bootstrap-vue` ^2.13.0 | UI components and grid |
| `laravel-mix` ^6.0.49 | Build |
| `vue-router` ^3.1.5 | Routing |
| `vuex` ^3.3.0 | State |
| `vue-meta` ^2.4.0 | SEO and meta tags |
| `animate.css` ^4.1.0 | Animations |
| `@fortawesome/fontawesome-free` ^5.13.0 | Icons |

### Backend

| Package | Purpose |
| :-- | :-- |
| `laravel/framework` ^9.52 | Framework |
| `tymon/jwt-auth` ^1.0 | Authentication |
| `barryvdh/laravel-dompdf` ^2.2 | PDFs |

---

## 10. How to continue development

1. **A new public page:** create the `.vue` file in `resources/js/src/view/pages/public/`, use `.glass-card` for the
   main container, put its styles in `public-custom.scss`, and register the route in `router.js`.
2. **A blog post:** through Superadmin → blogs (image into `public/media/assets/blog/`).
3. **Build the assets:**
   ```bash
   npm run dev    # local
   npm run prod   # production
   ```
4. **Schema changes:** Laravel migrations only — `it_devops_checklist.md`.
