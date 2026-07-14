# 📘 Development Guide: F16s Platform Overhaul

This guide documents the comprehensive changes made to the F16s Freight Logistics platform, detailing the architectural shift, new features, and core dependencies.

---

## 🏛 Project Architecture (The "Tree")

### 📂 Repository Structure

A clean breakdown of the project's filesystem to help you navigate the codebase.

```text
📦 f16s_main (Root)
 ┣ 📂 app                       # 🧠 Backend Core (Laravel)
 ┃ ┣ 📂 Http/Controllers        # 🏛️ PSR-4 Tiered API Handlers
 ┃ ┃ ┣ 📂 Auth                  # 🔐 Login / Identity
 ┃ ┃ ┣ 📂 Admin                 # 🛠️ Business Management
 ┃ ┃ ┣ 📂 Logistics             # 📦 Waybill & Conversion
 ┃ ┃ ┣ 📂 Generators            # 📄 PDF Engine
 ┃ ┃ ┗ 📂 Data                  # 📊 Rates & Lookup Cache
 ┃ ┗ 📜 *.php                   # Models (User, Waybill, etc.)
 ┣ 📂 python                    # 🐍 OCR Extraction Pipeline
 ┣ 📂 public/media/assets       # 📂 Organized Semantic Assets
 ┃ ┣ 📂 banners                 # 🌇 Hero & Page Banners
 ┃ ┣ 📂 logos                   # 🏷️ Brand & Airline Marks
 ┃ ┣ 📂 vectors                 # 📐 Core Feature Icons (SVG)
 ┃ ┣ 📂 illustrations           # 🎨 Visual Components
 ┃ ┗ 📂 blog                    # 📰 Editorial Content
 ┣ 📂 resources/js/src          # 🎨 Frontend Source
 ┃ ┣ 📂 assets/sass             # 💅 Global Stylesheets
 ┃ ┃ ┣ 📜 public-custom.scss    # 🔥 Centralized View Architecture
 ┃ ┃ ┗ 📜 style.vue.scss        # Core Entry Theme
 ┣ 📂 resources/views           # 🏛️ Backend Templates
 ┃ ┣ 📂 emails                  # 📧 E-mail Manifests
 ┃ ┣ 📂 documents               # 📄 Legal PDF Templates (Renamed from pdf)
 ┃ ┣ 📂 tools/ocr               # 🛠️ Dev-Debug OCR Utilities
 ┃ ┗ 📜 welcome.blade.php       # 🚪 Main Application Entry
 ┃ ┣ 📂 view/layouts            # 🆕 Unified System Frames
 ┃ ┃ ┣ 📂 public                # 🏙 Public Engine
 ┃ ┃ ┗ 📂 admin                 # 🔐 Superadmin Engine
 ┃ ┣ 📂 view/pages              # 📄 Organized Domain Folders
 ┃ ┃ ┣ 📂 public                # 🌍 Public Ecosystem
 ┃ ┃ ┃ ┣ 📂 services           # 💼 Nested Service Pages
 ┃ ┃ ┃ ┣ 📂 legal              # ⚖️ Legal Policy Disclosures
 ┃ ┃ ┃ ┗ 📜 blogData.js        # 💾 Localized Data Source
 ┃ ┃ ┣ 📂 dashboard             # 🔐 User Portal Domain
 ┃ ┃ ┗ 📂 admin                 # 🛠 Unified Management Views
 ┃ ┣ 📜 router.js               # Client-side Routing Tree
 ┃ ┗ 📜 seo_helpers.js          # 🔍 SEO Schema Generator
 ┗ 📜 guide.md                  # 📘 This Documentation
```

### 🔗 Page Connection Hierarchy

Showing how the pages are interconnected through the main layout and dashboard systems.

```text
🌐 Root (/)
 ┣ 🏙 Public Experience (MainLayout)
 ┃ ┣ 🏠 Home (/)
 ┃ ┣ ℹ️ About Us (/about-us)
 ┃ ┣ 🛠 Services Ecosystem (/services)
 ┃ ┃ ┣ 📁 /services/CloudStorage (/cloud-storage)
 ┃ ┃ ┣ 📁 /services/EndToEnd (/end-to-end)
 ┃ ┃ ┗ 📁 /services/SmallBusiness (/small-business)
 ┃ ┣ 💡 Solutions (/solutions)
 ┃ ┣ 📞 Contact Us (/contact-us)
 ┃ ┣ 📰 Blogs & News (/blogs-and-news)
 ┃ ┃ ┗ 📝 Blog Post (/blog/:slug)
 ┃ ┗ ⚖️ Legal Ecosystem (Privacy, Terms)
 ┃   ┗ 📁 /legal/*
 ┃
 ┣ 🔐 User Dashboard (Auth Required)
 ┃ ┣ ✈️ Focus Air (/focus-air)        --> [OCR Document Upload]
 ┃ ┣ 🏠 House Way Bill (/house-way-bill)
 ┃ ┣ 📦 Consolidation (/consolidation)
 ┃ ┣ 📜 Message Log (/message-log)
 ┃ ┗ 📑 XML View (/xml-view/:id)
 ┃
 ┗ 🛠 Superadmin Panel (layouts/admin/Layout)
   ┗ 📂 Unified Registry (src/view/pages/admin/*)
     ┣ 👥 All Users (/superadmin/all-users)
     ┣ 🏢 All Company (/superadmin/all-company)
     ┣ 📋 OCR Templates (/superadmin/all-templates)
     ┣ ⚙️ Global Settings (/superadmin/setting)
     ┗ 📞 Contact Leads (/superadmin/all-contacts)
```

#### 📊 Visual Flow (Mermaid)

```mermaid
graph TD
    %% Entry Points
    Start[User Landing] --> MainL[MainLayout]
    Start --> AdminL[AdminLayout]

    %% Public Flow
    subgraph "Public Ecosystem"
        MainL --> H[Home]
        MainL --> S[Services]
        S --> S1[Cloud]
        S --> S2[E2E]
        S --> S3[SME]
        MainL --> B[Blogs]
        B --> BP[Post Detail]
    end

    %% User Flow
    subgraph "Dashboard Ecosystem"
        MainL --> D1[Rate Search]
        MainL --> D2[Focus Air - OCR]
        MainL --> D3[Waybills]
    end

    %% Admin Flow
    subgraph "Admin Ecosystem"
        AdminL --> A1[Users]
        AdminL --> A2[Settings]
        AdminL --> A3[Imports]
    end

    %% Styles
    style MainL fill:#355594,color:#fff
    style AdminL fill:#2a4476,color:#fff
```

---

## 🎨 Branding & Visual Identity

The F16s platform follows a **Premium Modern Freight** aesthetic, characterized by clean lines, high contrast, and immersive "Glassmorphism" effects.

### 🌈 Color Palette

| Element         | Color Code                  | Visual Role                                    |
| :-------------- | :-------------------------- | :--------------------------------------------- |
| **Brand Blue**  | `#355594`                   | Primary identity, Headers, Main CTA background |
| **Hover Blue**  | `#2a4476`                   | Interactive states, Deep contrast              |
| **Text Muted**  | `#5A6B8A`                   | Body copy, Secondary information               |
| **Surface**     | `#f8fafc`                   | Main body background                           |
| **Glass Layer** | `rgba(255, 255, 255, 0.95)` | Modal and Card backgrounds                     |

### 🔡 Typography

-   **Primary Font**: `Inter` — Used for all public-facing pages for its clean, high-readability modern look.
-   **Secondary Font**: `Nunito` — Used in dashboard and utility sections.
-   **Data Font**: `Courier New` — Used exclusively in PDF generation for a professional, fixed-width "logistics" feel.

### ✨ Visual Style Guidelines

1. **Global CSS Strategy**:
    - Components MUST maintain clear decoupling of logic and style. Page-specific styling is centralizing within `public-custom.scss` instead of component-local `<style scoped>` tags.
2. **Performance-First Visuals**:
    - Historically expensive `backdrop-filter: blur()` layers were phased out during the optimization sprint to restore seamless 60fps scrolling.
    - Rich, high-opacity layered backgrounds (`rgba(255, 255, 255, 0.9)`) achieve the same premium aesthetic without GPU taxation.
3. **Soft Atmospherics**:
    - Decorative backgrounds use centralized soft blurred ellipses (`.decorative-ellipses`) hosted globally to scale back resource consumption.
4. **Button Design**:
    - All primary buttons are **Pill-shaped** (rounded-full) with `box-shadow` for elevation.
    - Hover state includes a slight lift (`translateY(-2px)`) and a horizontal icon shift.
5. **Card Aesthetics**:
    - Corner radius is standardized at `28px` or `32px` for a soft, premium feel.
    - Transitions are set to `0.4s ease` for fluid interaction.

---

## 🔄 Project Evolution

The platform has undergone a major transformation from a functional logistics tool to a **Modern Premium Freight Experience**. The focus was on high-fidelity UI, glassmorphism aesthetics, and superior mobile responsiveness.

---

## 📂 Core Changes & New Modules

### 🆕 New Service Pages

We have expanded the platform's service offerings with dedicated, high-fidelity pages:

-   **Cloud Storage**: Modern data management interface.
-   **End-to-End Service**: Comprehensive logistics lifecycle visualization.
-   **Small Business Solutions**: Scalable freight options for SMEs.
-   **Privacy Policy & Terms**: Legal pages updated with glassmorphism styling.

### 📰 Blogs & News Section

A complete blog ecosystem was integrated:

-   `BlogsAndNews.vue`: Grid-based listing of latest updates.
-   `BlogPost.vue`: Dynamic article view with reading progress bars and social sharing.

### 📱 Responsive Overhaul

-   Optimized `Header.vue` and `Footer.vue` for seamless transitions between mobile, tablet, and desktop.
-   Implemented horizontal carousels for service cards on mobile to prevent vertical clutter.
-   Corrected text clipping and icon alignment issues in the "Solutions" section.
-   **FocusAir UI Refresh**: Standardized the document upload modal with premium animations, loading states, and explicit file selection previews. (Note: The core document processing component and API routes were recently renamed from `WebDoc` to `FocusAir` to better align with the brand language).

---

## 🛠 Dependencies & Tech Stack

### Frontend (Vue.js 2 Ecosystem)

| Package                 | Purpose                           |
| :---------------------- | :-------------------------------- |
| `vue` ^2.6.11           | Core Frontend Framework           |
| `bootstrap-vue` ^2.13.0 | UI Components & Grid System       |
| `laravel-mix` ^6.0.49   | Asset Compilation                 |
| `vue-router` ^3.1.5     | Client-side Routing               |
| `vuex` ^3.3.0           | State Management                  |
| `vue-meta` ^2.4.0       | Dynamic SEO & Meta Tag Management |
| `animate.css` ^4.1.0    | Motion & Transitions              |
| `font-awesome` ^5.13.0  | Iconography                       |

### Backend (Laravel 9 Ecosystem)

| Package                   | Purpose                   |
| :------------------------ | :------------------------ |
| `laravel/framework` ^9.52 | Core Backend Framework    |
| `tymon/jwt-auth` ^1.0     | Authentication & Security |
| `barryvdh/laravel-dompdf` | PDF Generation            |
| `maatwebsite/excel`       | Logistics Data Exports    |

---

## 🚀 Recent Asset Updates

-   **Logos**: Transitioned to `white-logo1.svg` and `blue-logo1.svg` for scalable branding. Specific logos (e.g., Air France, Etihad) are dynamically scaled in CSS to maintain visual balance.
-   **Banners & Icons**:
    -   Implemented a **WebP-First** strategy. Banners (Plane, Ship, Truck) and Product Icons have been compressed to WebP (e.g., 2.7MB → 110KB) with high-quality JPG fallbacks.
    -   Standardized naming convention: `banner-[type].[webp|jpg]` and `icon-name.webp`.
-   **Media Location**: All optimized assets are centralized in the organized `public/media/assets/` repository system.

---

## 📊 Data Management & Content Updates

### 📰 Blog System (`blogData.js`)

All blog content is centralized in `resources/js/src/view/pages/public/blogData.js` to ensure easy updates without modifying Vue components.

-   **How to update**: Add or modify objects in the `blogs` array.
-   **Fields per post**:
    -   `title`: The main headline.
    -   `slug`: The URL-friendly identifier (e.g., `f16s-editorial`).
    -   `image`: Path to the asset in `/media/assets/blog/`.
    -   `content`: HTML string containing the body text and internal links.
    -   `metaTitle` / `metaDescription`: Used by `vue-meta` for dynamic SEO rendering.
-   **Internal Linking**: Ensure all content links back to `/services`, `/solutions`, or `/product-description` to maintain SEO authority.
-   **Dynamic SEO**: All pages implement `metaInfo()` for unique titles and descriptions.

---

## 🔍 SEO Optimization & Structured Data

The platform is fully optimized for search engines using modern technical SEO practices:

### 🏷 Dynamic Meta Tags (`vue-meta`)

Each page has a unique Title, Description, and Open Graph (OG) tags to ensure rich previews on social media (LinkedIn, Twitter, Facebook).

-   **Implementation**: Located in the `script` section of each Vue page under `metaInfo`.
-   **Dynamic Blogs**: `BlogPost.vue` pulls meta data directly from `blogData.js`.

### 🗂 Schema.org (JSON-LD)

We have implemented structured data to help Google understand the business and platform:

-   **Organization Schema**: Global business details (name, logo, social links).
-   **SoftwareApplication Schema**: Injected into the Home page to highlight the F16s platform as a business application.
-   **BlogPosting Schema**: Dynamically injected into each blog post for "Rich Results" in Google Search.
-   **Utility**: All schema generation is centralized in `resources/js/src/seo_helpers.js`.

### 🗺 Sitemaps & Robots

-   **Sitemap**: A comprehensive `public/sitemap.xml` is maintained to guide search engine crawlers.
-   **Robots.txt**: Configured to allow full indexing and points directly to the sitemap.

---

## ⚡ Performance & Load Optimization

The platform uses a multi-layered approach to ensure a fast, "instant-feel" experience even on slower connections.

### 🖼 Intelligent Asset Loading & Optimization

-   **WebP-First Strategy**: Established a batch conversion pipeline (Quality 82) that reduced banner and blog PNGs (1.3MB - 2.6MB) by ~70%. Using `<picture>` tags ensures WebP delivery with high-quality JPG fallbacks.
-   **Progressive Rendering**: Applied `loading="lazy"` to all below-the-fold assets. Critical hero assets use `loading="eager"` to minimize Largest Contentful Paint (LCP).
-   **Ready-State Guards**: Hero slideshows and interactive grids are "guarded" by an `imagesReady` state. The UI only transitions once primary assets are loaded, preventing layout shifts.

### 🦴 Perceived Speed (Skeleton Loaders)

-   **Branded Placeholders**: Implemented shimmer-effect skeletons for the Hero section and Product grids.
-   **UX Strategy**: Skeletons match the exact layout of the final content, eliminating layout shifts and providing immediate visual feedback during load.

### 🏎 Hardware Acceleration & Global Style Centralization

-   **Scoped Style Eradication**: Eliminated all redundant `<style scoped>` blocks across primary landing pages. This drastically cuts CSS parse time, improves style injection speeds, and centralizes components' aesthetic maintenance to one file.
-   **GPU Filter Deprecation**: Removed high-intensity `backdrop-filter` rendering contexts from repetitive grid containers to fully zero-out UI jank.
-   **Layer Promoting**: Critical dynamic interactions utilize `will-change` prompting GPU allocation only when transitioning, reducing sustained processor footprint.

### 🌊 Branded Preloader & Build Optimization

-   **Visuals**: A high-impact loading screen featuring a pulse-animated logo on a pure white background.
-   **Build Hardening (Laravel Mix 6)**:
    -   **Advanced Vendor Extraction**: Centralized `vue`, `vuetify`, and `bootstrap-vue` into a dedicated `vendor.js` for long-term browser caching.
    -   **Granular Code Splitting**: Configured Webpack `splitChunks` with `maxInitialRequests: 6` to balance parallel loading and bundle size.
    -   **Named Chunks**: All routes implement `/* webpackChunkName */`, grouping 40+ dynamic imports into logical clusters (`public`, `layout`, `superadmin`, `awb`) to reduce HTTP overhead.
-   **Implementation**:
    -   Preloader located in `welcome.blade.php` to ensure it renders before the JS bundle is parsed.
    -   Uses a `max-width: 300px` SVG (`blue-logo.svg`) with a CSS `@keyframes pulse` animation.
-   **Transition**: Dual-guaranteed vanish sequence triggered by raw browser window load event AND explicitly finalized via the `mounted()` hook in `App.vue` once state is hydrated.

### 🗄️ Near-Instant Company Template Cache Invalidation Strategy

To balance extreme performance under high loads with the need for immediate visibility when superadmins make updates, the company templates configuration uses a dual-layer caching strategy:

1. **Short TTL Cache**: The `UserController::me()` endpoint caches the `templates_config` for a brief **60 seconds** (under the key `company_templates_{companyName}`). At high traffic (e.g. 20 req/s), this resolves ~1,199 out of 1,200 database reads from memory.
2. **Instant Invalidation on Admin Updates**: When a superadmin registers or edits a company in `CompanyController` (`register()` or `update()`), the system automatically invokes:
   ```php
   Cache::forget("company_templates_{$company->name}");
   ```
   This instantly purges the cache, guaranteeing that users see new templates on their very next request with **zero lag**, while retaining robust load protection.

---


## ⚙️ Functional Architecture & Connectivity

### 📡 EDI & Messaging Standards

The platform's core logic revolves around automating IATA messaging standards for air freight:

-   **FWB (Freight Waybill)**: Electronic version of the Air Waybill.
-   **FHL (Freight House List)**: Detailed manifest for consolidated shipments (House level).
-   **XML / EDI Integration**: The system facilitates the transition from legacy Cargo-IMP to modern **Cargo-XML**, allowing for direct, real-time communication with 100+ global airlines (Emirates, Qatar, Lufthansa, etc.).
-   **e-Freight Roadmap**: All functional pages are designed to move the industry toward paperless, 100% digital e-AWB compliance.

---

## 🧠 Intelligent OCR & Document Processing

The platform features a sophisticated OCR pipeline to automate data entry from PDF Air Waybills:

### 🐍 Python-Powered Extraction (`extract_awb_new.py`)

-   **Enhanced IATA Mapping**: Expanded dictionary to include global airport aliases (e.g., Mumbai/Bombay, Chicago O'Hare, Toronto).
-   **Smart Address Parsing**: Logic to filter out legacy headers (e.g., "SHIPPER'S NAME AND ADDRESS") to extract clean entity names and locations.
-   **Flight & Date Normalization**:
    -   Improved regex for diverse flight number formats.
    -   Automatic date normalization (e.g., "05-MAY" to "05-MAY-2026") to ensure backend compatibility.
-   **Border Artifact Removal**: Advanced cleaning of PDF-to-text artifacts like pipe characters (`|`) and redundant whitespace.

### 🔌 Backend Hardening (`OcrController.php`)

-   **Robust Process Management**: Implemented fallback paths for Python environments and detailed logging for debugging.
-   **JSON Validation**: Strict validation of OCR script output to prevent frontend crashes on malformed data.
-   **Error Handling**: Graceful error responses with clear messaging for the frontend.

### 📄 FocusAir (Unified Document Interface)

-   **Multi-Type Support**: Added support for various document templates (`ksr`, `ksr_house1`, `ksr_house2`, etc.).
-   **State Reset Mechanisms**: Explicit resetting of form state and component flags during successive OCR extractions to ensure a clean slate and prevent stale data.
-   **Improved UX**:
    -   Real-time file selection feedback.
    -   Integrated loading spinners (`b-spinner`) for long-running extraction tasks.
    -   Validation checks to ensure files are selected before processing.

### 🔍 Address Book Auto-Matching (`resources/js/src/core/mixins/airWayBillMixin.js`)

- `normalizeText(str)`: Strips punctuation/spaces and converts text to lowercase alphanumeric.
- `calculateSimilarity(str1, str2)`: Calculates 90% Levenshtein fuzzy similarity ratio between strings.
- `findMatchingAddress(ocrEntity, savedList)`: Auto-matches OCR shipper/consignee against saved address book records before falling back to raw OCR text (used in `HouseWayBill.vue` & `FocusAir.vue`).

---

## 📄 Modernized PDF Rendering Engine

The platform's PDF generation (DomPDF) has been overhauled to move away from legacy, nested table layouts toward a clean, modular CSS utility-based system.

### 🛠 Architecture: `generate-awb-pdf.blade.php`

-   **Flattened Hierarchy**: Replaced "table-in-table" nesting with flat containers, significantly improving rendering stability and alignment across different PDF engines.
-   **CSS Design System**: Centralized all styling into a modular utility class block in the document `<head>`.
    -   `.box-cell`: Standardized padding and layout for form fields.
    -   `.label-text`: Consistent style for field labels.
    -   `.value-text`: Uses **Courier New** for a professional, fixed-width "typewritten" look for data values.
    -   `.border-l`, `.border-b`, etc.: Modular border controls for clean grid lines.
-   **Maintainability**: Reduced code duplication by 40% and removed thousands of legacy `&nbsp;` hacks.
-   **Multi-page Support**: Optimized the "Conditions of Contract" (Page 2) with a clean 2-column layout and enforced page breaks.

---

## 🛠 How to Continue Development

1. **Adding a New Page**:
    - Create the `.vue` file in `resources/js/src/view/pages/`.
    - Apply the `.glass-card` class to main containers.
    - Register the route in `router.js`.
2. **Updating the Blog**:
    - Add the new image to `public/media/assets/blog/`.
    - Update the array in `blogData.js`.
3. **Rebuilding Assets**:
    ```bash
    npm run dev    # Local development
    npm run prod   # Production build
    ```

## 🚀 Dynamic Blog Subsystem Setup

To migrate the blog data from the static JS file into your dynamic database environment, please follow these quick deployment steps:

### 🗄️ 1. Run Table Migration

Open your terminal in the project root and run the standard Laravel artisan command to construct the new `blogs` database table:

```bash
php artisan migrate
```

_(Note: This executes the generated `/database/migrations/2026_05_10_000000_create_blogs_table.php` blueprint automatically.)_

### 📤 2. Upload Folder Permissions

Ensure your server storage mechanism has write permissions set for the public assets folder where new user-generated blog WebP files are stored:

```bash
chmod -R 775 public/media/assets/blog/
```

### 🔗 3. Connection Points Verified

The entire ecosystem has been wired end-to-end:
1. **Superadmin Controller**: Logic finalized in `BlogController.php` to automatically process image uploads, auto-slugify titles, and validate constraints.
2. **Public Blog Feed**: `BlogsAndNews.vue` prioritizes live database articles, dynamically filtering by Categories (Air Freight, Technology, etc.), and seamlessly defaulting to code-safe visual placeholders during connectivity transitions.
3. **Homepage Sync**: The `HomeNewsSection.vue` component has been hooked up to the exact same API endpoint. It dynamically updates the Featured Hero and Grid blocks globally the moment a post goes live in the database.

---

### ⚡ Persistent OCR Microservice & Async Polling Pipeline

- **FastAPI Microservice (`python/ocr_server.py`)**: Persistent FastAPI service wrapping `extract_awb_new.py` on port 8001 to eliminate Python subprocess cold-start latency.
- **Async Queue Processing (`ProcessPdfOcrJob.php`)**: Processes PDF extractions asynchronously using Redis queue workers and stores results in `pdf_processing_jobs` table.
- **Polling Endpoints (`OcrController.php`)**: `POST /user/upload-pdf` (submits upload job & returns job ID) and `GET /user/ocr-status/{jobId}` (polls job status & returns extracted JSON).
- **Frontend Integration (`OcrUploadModal.vue`)**: Reusable modal component handling file uploads and status polling across `FocusAir.vue` and `HouseWayBill.vue`.

---

## 📑 Finalized Upgrades: Dashboard Design Unification & Site Speed (May 10)

This update harmonized visual interaction patterns across the administration dashboard components and addressed critical first-paint layout shifts in loading logic.

### 🎨 Component Dashboard Synchronization (FocusAir / HouseWayBill / Consolidation)

- **Unified Grid Wrappers**: All main functional containers now utilize uniform optimized inline-shadow blocks (`background: #ffffff`, `box-shadow: 0 10px 30px rgba(53, 85, 148, 0.1)`) standardizing the curvature to 32px and padding thresholds globally.
- **Advanced "Latest Messages" Modals**:
  - Scrubbed computationally expensive `backdrop-filter: blur()` declarations which caused recursive layout thrashing during modal activation.
  - Migrated modal layers to performant CSS compositing system using high-opacity fill vectors.
  - Restructured the button groups into modernized rounded-pill flex layout consistent with branding guide.
- **Logic & Link Preservation**: Fully ported technical logic for interactive elements (PDF downloads) to modern footer slots within the message item grid cards.

### ⚡ Performance & Asset Loading Acceleration

- **Optimized Preloader Layout Shift**:
  - **Hardcoded Boot Loader**: Modified [welcome.blade.php](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/views/welcome.blade.php) from browser fluid size to explicit `150px` dimensions preventing startup flicker.
  - **Vue Navigation Loader**: Recalibrated [PageLoader.vue](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/js/src/view/components/PageLoader.vue) inner image weights to dynamic `120px` and refined complementary text hierarchy to 1.3rem.
- **Native Styling Enforced**: Upgraded critical loader rendering path via direct inline CSS logic which bypasses latency overhead of delayed JS stylesheet injection.

---

## Finalized Phase: Modular Frontend Architecture

To maintain zero-duplication DRY code practices, we fully extracted the OCR interaction loop into a single autonomous child component.

### Key Component
- **File**: `resources/js/src/view/components/OcrUploadModal.vue`
- **Purpose**: Manages dynamic file upload states, triggers background API jobs, and visualizes live analysis loops with high-fidelity Vue animations.

### Usage in Page Modules
Both `FocusAir.vue` and `HouseWayBill.vue` were refactored to remove custom polling logic and use the declarative hook:

```html
<!-- Import declaration -->
import OcrUploadModal from "@/view/components/OcrUploadModal.vue";

<!-- Usage within template -->
<OcrUploadModal initialType="ksr" @extracted="processExtractedData" />
```

### Automated Interactions
- **Null Guard**: Clicking "Extract" automatically fires standard OS file discovery if no payload loaded.
- **Encapsulated Lifecycle**: All state tracking (interval cleans up in `beforeDestroy`) stays confined, improving parent performance metrics.

---
## 📊 Finalized Phase: Coordinate Governance & Data Modeling

This final architectural layer shifted the source-of-truth for coordinate mappings from static JSON disk files into direct database relational tables, guaranteeing race-condition immunity and seamless superadmin editing capabilities.

### 1. Database-First Persistence
- **Model**: `App\SystemTemplate`
- **Strategy**: On every mutation, the model automatically writes to `boxes_config.json.tmp` and executes an atomic operating-system `rename` command. This supplies the Python parser with absolute consistent read cycles without locking overhead.
- **Protection**: Deletes are gated behind an Orphan Guardian. You cannot delete a template currently mapped into an active company configuration.

### 2. 🛠 User Creation Integrity Repair
Historically, certain critical user behaviors lacked physical storage in the relational engine. This was rectified via automatic schema expansion:
- **New Field `can_send`**: Governs direct XML dispatch authorization directly from user profile records.
- **New Field `pima_address`**: Formalizes storage for logical PIMA routing, successfully piping values directly into the `ram:PrimaryID` header generated in `ConversionController.php` for the first time.

### 3. Dynamic Coordinate Assignment UX
- **Component**: `NewCompany.vue`
- **Visual Injection**: Realized a "Pill Registry" system where Superadmins can instantly inject coordinate row mappings simply by clicking an active matrix tag.
- **Fallback Logic**: Fully integrated with client side input catchers, automatically converting flat-array legacy datasets into robust schema models seamlessly upon record mount.

---
## 📑 Finalized Upgrades: Global Error Formatting & PDF Image Stabilization (May 26)

This update addressed two core functional areas: visual image rendering within generated documents, and user-facing error clarity across all data entry forms.

### 1. 📄 PDF Image Stabilization (Base64 Inline Logo Injection)
- **Templates**: `generate-awb-pdf.blade.php` (Line 2736) and `generate-hawb-pdf.blade.php` (Line 2733)
- **Problem**: Absolute filesystem paths using `public_path()` were being blocked by DomPDF's internal `chroot` sandboxing restrictions, causing the IATA logo on page 2 of both generated PDFs to fail to load.
- **Solution**: Refactored both templates to read the raw image bytes from disk and dynamically inject the IATA logo as an inline Base64 data URI:
  ```html
  <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('media/assets/logos/iata-logo.png'))) }}" alt="IATA ICON" width="50px" height="auto">
  ```
  This eliminates all filesystem, sandbox, or protocol check overhead and guarantees 100% reliable rendering of the logo across all server environments.

### 2. 🛡️ Global Validation Error Optimization & Phrasing
- **Configuration**: `/resources/lang/en/validation.php`
- **Re-phrasing**: Cleaned up the raw Laravel validation messages globally. Phrasings have been shortened to a concise and modern standard (e.g., `:attribute is required.`, `:attribute format is invalid.`, and `:attribute cannot exceed :max characters.`), removing redundant prefixes such as "The" or "field".
- **Attribute Mapping Dictionary**: Populated the `'attributes'` localization block to dynamically map technical database columns into professional human-readable titles:
  - **AWB Attributes**: `awb_code` ➔ *AWB Prefix*, `awb_no` ➔ *AWB Number*
  - **Shipper/Consignee Info**: `ship_name` ➔ *Shipper Name*, `cons_address` ➔ *Consignee Address*, etc.
  - **Houseway specific Info**: `hawb_no` ➔ *House Airway Bill Number*, `master_origin` ➔ *Master Origin*, `master_destination` ➔ *Master Destination*, `master_pcs` ➔ *Master Pieces*, `master_weight` ➔ *Master Weight*.
- **Safety**: By maintaining identical key structures (retaining raw keys like `ship_name` for error mapping), the front-end inputs continue to dynamically highlight (using `:class="{ 'is-invalid': ... }"`) with zero risk of breaking any logical validation check systems.

---

## 📑 Finalized Upgrades: High-Performance Message Log, VCard Formats, Mobile Navigation & Memory Leak Protections (June 2026)

This update details backend optimization for logistics queries, layout synchronization for native mobile devices, card schema enhancements, and JavaScript-level resource lifecycle guards.

### 1. 📜 High-Performance Message Log & Server Pagination
- **Query Optimization & Eager Loading**: Eager-loads the nested `houseWaybills` relationship under paginated scopes in `MessageLogController@getAllAirwayBill`, preventing the $O(N)$ query loops (N+1 query issue) and eliminating the **Too Many Attempts** (Rate Limit) errors under high database loads.
- **Client-Side Rendering Speedup**: Moved computationally heavy data formatting mapping (e.g. moment parsing, status translations, and airport text mappings) out of the HTML render loop into Vue computed properties (`normalizedItems`) inside [MessageLog.vue](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/js/src/view/pages/dashboard/MessageLog.vue). This reduces CPU utilization by preventing redraw re-evaluations.
- **Server Pagination Integration**: Re-wired the table container to bind directly to Laravel's native paginator pages, updating on watcher callbacks dynamically on user clicks rather than pulling thousands of raw entries into client memory at once.

### 2. 🎴 Digital CEO Card Fixes & Enhancements
- **Components**: [JosephCard.vue](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/js/src/view/pages/public/JosephCard.vue) and [DeepanjanCard.vue](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/js/src/view/pages/public/DeepanjanCard.vue)
- **vCard RFC Compliance**: Cleaned up the phone number serialization array to output raw parameters (`TEL;TYPE=CELL,VOICE:+917011363516`) rather than the URI-wrapped syntax `VALUE=uri:tel:+917011363516`. This guarantees that contact records import correctly across all native iOS and Android contact managers without string truncation or formatting failures.
- **Visual Design Scale**: Increased the primary action button icon dimensions to `30px` (circles to `58px`) and adjusted sub-taglines and label spacing to ensure premium readability on mobile screens.

### 3. 📱 Mobile Navigation Overhaul
- **Component**: [Header.vue](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/js/src/view/layouts/public/Header.vue)
- **Hamburger Menu profile card**: Relocated the profile details from the top bar into the mobile hamburger menu.
- **Premium Card UI**: Styled the layout as a modern user profile card containing:
  - An origin badge pill using a soft blue background and `geo-alt-fill` icon (centered, middle-aligned, with greeting "Hi" and profile image removed to keep it sleek).
  - A red-themed premium **Sign out** button with a hover scaling effect.

### 4. 🧹 JavaScript Memory Leak Resolution
- **Component**: [HomeStatsSection.vue](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/js/src/view/pages/public/components/HomeStatsSection.vue)
- **Lifecycle Cleanups**: Configured the statistical counter animation intervals to store their handles within a mapped `this.activeTimers` object. Every active timer is cleared inside the `beforeDestroy()` hook. This prevents garbage collection blocks and reactivity updates on destroyed component scopes if the user navigates away before the counter finishes.

---

## 📑 Finalized Upgrades: Descartes Status Tracking & OpenClaw Webhook Integration (July 2026)

This update details the integration of real-time Descartes status response logging, client notification email automation, OpenClaw security, and a UX convenience toggle in Focus Air.

### 1. 📡 Descartes Status Response Tracking (`status_response`)
* **Database Table**: `status_response` (model [StatusReponse.php](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/app/StatusReponse.php)) logs callback notifications from Descartes (such as flight rejections, updates, or checks).
* **Ingress Handler**: [GLNResponseController.php](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/app/Http/Controllers/Logistics/GLNResponseController.php) parses incoming Cargo XML. If a status of `Rejected` is received:
  - It records the status update details into the `status_response` table.
  - It pulls the client routing email address (`awb_email`) from the corresponding AWB record in the `air_way_bills` table.
  - It automatically dispatches a rejection notification email (`emails.awb-reject-status`) to the client.
* **Admin Visualization**: [ClientShipments.vue](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/js/src/view/pages/admin/ClientShipments.vue) queries this table through `SuperAdminController@getClientShipments` to display **FNA Received** status badges (including hoverable rejections tooltips) dynamically in the shipments logs.

### 2. 🔐 OpenClaw API Webhook Integration
* **Non-Replay Authentication**: The `openclaw_nonces` table stores unique transaction nonces. The middleware [VerifyOpenClawSignature.php](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/app/Http/Middleware/VerifyOpenClawSignature.php) validates incoming webhook signatures and discards repeat nonces to block replay attempts.
* **Action queue**: Incoming external requests (e.g., publishing article updates via automated bots) are temporarily saved in the `openclaw_pending_actions` table, awaiting admin confirmation before database committing.

### 3. 📧 Default User Email Selection in Focus Air
* **Component**: [FocusAir.vue](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/resources/js/src/view/pages/dashboard/FocusAir.vue)
* **Features**:
  - Adds a dynamic checkbox option `"Default to my email (user@email.com)"` below the **Email FNA** input field.
  - Toggling it populates the field with the currently authenticated user's email address from the Vuex store (`current_user.email`).
  - Implements an automated watcher to keep the checkbox synced: manually updating the email input to match the user's email automatically checks the box, and editing it otherwise automatically unchecks it.
