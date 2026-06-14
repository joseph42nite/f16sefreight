# 🚀 IT & DEVOPS PRODUCTION ROLLOUT MANIFESTO

This document separates operational procedures into two distinct delivery modules for precision targeting.

---

# ⚙️ PART 1: ASYNCHRONOUS OCR INFRASTRUCTURE SETUP
Deploy these steps to establish the High-Availability Python microservice and Redis pipeline.

### 1. Server Software Prerequisites
Ensure your production Linux server has Redis and Supervisor installed.
```bash
sudo apt update
sudo apt install redis-server supervisor -y
sudo systemctl enable redis-server.service
sudo systemctl start redis-server.service
```

### 2. Setup Dedicated Python Environment
Set up isolation and install FastAPI modules inside the existing `/python` directory:
```bash
cd python
python3 -m venv venv
./venv/bin/pip install fastapi uvicorn pdfplumber python-multipart
```

### 3. Environment Configuration (.env)
Append the following keys to your production `.env` file:
```dotenv
# Switched from 'sync' to 'redis'
QUEUE_CONNECTION=redis

# Fast API Endpoint Target
OCR_SERVICE_URL=http://127.0.0.1:8001

# Redis Client Config
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_CLIENT=predis
```

### 4. Supervisor Configurations (Process Lifelines)
**Command A: Instantiate FastAPI microservice daemon**
```bash
cat << 'EOF' | sudo tee /etc/supervisor/conf.d/f16s-ocr-fastapi.conf
[program:f16s-ocr-fastapi]
command=/var/www/html/f16sefreight.com/python/venv/bin/uvicorn ocr_server:app --host 127.0.0.1 --port 8001 --workers 2
directory=/var/www/html/f16sefreight.com/python
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/html/f16sefreight.com/storage/logs/fastapi.log
stopwaitsecs=10
EOF
```

**Command B: Instantiate Laravel Background Worker cluster**
```bash
cat << 'EOF' | sudo tee /etc/supervisor/conf.d/f16s-pdf-worker.conf
[program:f16s-pdf-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/f16sefreight.com/artisan queue:work redis --queue=pdf_processing --tries=3 --timeout=15 --sleep=1 --max-jobs=500
autostart=true
autorestart=true
user=www-data
numprocs=3
redirect_stderr=true
stdout_logfile=/var/www/html/f16sefreight.com/storage/logs/worker.log
stopwaitsecs=20
EOF
```
*(💡 Note: Adjust `/var/www/f16s_main` to match physical app path).*

### 5. Activate Daemons & Validate
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start f16s-ocr-fastapi:*
sudo supervisorctl start f16s-pdf-worker:*

# Validate Connectivity  ==========>clerity
curl http://127.0.0.1:8001/health
```

---

# 📊 PART 2: COORDINATE GOVERNANCE ENGINE (THE PORTAL)
Deploy these steps to fully instantiate the Database-First Template management screens.

### 1. Database Migration (Apply Relational Updates)
Realize the template configurations table and deploy required repair schema updates to user profiles:
```bash
php artisan migrate
```

### 2. Critical Data Bootstrap ===========>clerity
Perform this **ONE-TIME** runtime execution to copy existing configuration JSON state seamlessly into the newly built database table:
```bash
php artisan tinker --execute="\$path = base_path('python/boxes_config.json'); if (file_exists(\$path)) { \$data = json_decode(file_get_contents(\$path), true); if (isset(\$data['templates'])) { foreach (\$data['templates'] as \$k => \$v) { \App\SystemTemplate::updateOrCreate(['key' => \$k], ['coordinates' => \$v]); echo \"Imported \$k\n\"; } } }"
```

### 3. Application Cache Flush
Wipe the internal Laravel cache to bind available-templates routing logic to the updated DB cache Pluck system:
```bash
php artisan optimize:clear
```

### 4. Recompile Frontend Assets
Force re-aggregation of Javascript modules to push the updated coordinate building interfaces to users:
```bash
npm install
npm run prod
```
---

# 🗃️ PART 3: RAW DATABASE SQL SCHEMAS (Manual IT Deployment)
Since native `php artisan migrate` execution is not desired, the Database Administrator must execute the following 5 RAW MySQL queries manually to build the necessary table infrastructure for OCR, Template Governance, and Dynamic Blogs.

### 1. New Table: Blogs CMS
```sql
CREATE TABLE `blogs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `read_time` varchar(255) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `takeaways` json DEFAULT NULL,
  `published_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blogs_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. New Table: PDF Asynchronous Processing
```sql
CREATE TABLE `pdf_processing_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `temp_file_path` varchar(255) DEFAULT NULL,
  `document_type` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `queue_job_id` varchar(255) DEFAULT NULL,
  `extracted_data` json DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pdf_processing_jobs_user_id_status_index` (`user_id`,`status`),
  KEY `pdf_processing_jobs_status_created_at_index` (`status`,`created_at`),
  KEY `pdf_processing_jobs_queue_job_id_index` (`queue_job_id`),
  CONSTRAINT `pdf_processing_jobs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. New Table: Coordinate System Templates
```sql
CREATE TABLE `system_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `coordinates` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_templates_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. Schema Alterations: User & Company Profiles
```sql
-- Inject template config persistence into Company entities
ALTER TABLE `companies` ADD COLUMN `templates_config` json DEFAULT NULL;

-- Inject logistics transmission flags into User profiles
ALTER TABLE `users` ADD COLUMN `can_send` tinyint(1) NOT NULL DEFAULT '1' AFTER `origin_airport_code`;
ALTER TABLE `users` ADD COLUMN `pima_address` varchar(255) DEFAULT NULL AFTER `can_send`;
```

---

# 🌐 PART 4: FINAL PRODUCTION BROADCAST & SEO FLUSH
Execute these Final Commands once all above code deployments are complete to unlock dynamic meta tags and optimized loading.

### 1. Final Production Cache Flush
Ensures all newly registered backend routes (`/blog/{slug}`) are cached and exposed to the server immediately for crawlers to index dynamic meta tags:
```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
```

### 2. Establish Dynamic Upload Directory Permissions
SuperAdmin dynamic content depends on local write access to persistent storage. Ensure group ownership (`www-data`) and write-masking is correctly assigned to the public blog asset registry:
```bash
# 1. Ensure physical path exists
mkdir -p public/media/assets/blog

# 2. Apply group ownership and mask (775)
sudo chown -R $USER:www-data public/media/assets/blog
chmod -R 775 public/media/assets/blog
```

### 3. SuperAdmin Login Controller Hotfix Verification =======>clerity
Ensure `app/Http/Controllers/Auth/LoginController.php` is securely deployed on the production cluster to prevent critical runtime exit (Status 500) on login mismatches.

---

# 🔒 PART 5: SAVED ADDRESS BRANCH ISOLATION FIX

This fix ensures that saved shipper, consignee, and also-notify addresses are only visible to users within the **same branch location and company**. Two bugs were identified and resolved.

## Bug Summary
| Bug | Location | Description |
|---|---|---|
| Missing DB column | `saved_addresses` table | `agent_id` column did not exist, so branch-scoped retrieval always returned empty results |
| Wrong field assignment | `HousewayBillController.php` | `user_id` was being set to `$agent->id` (Branch ID) instead of the real user's ID |

## How it Works
The `agents_info` table already stores the relationship between a **Company** and its **Branches** (`agent_id → company_id`). By filtering `saved_addresses` by `agent_id`, the system automatically isolates data to that specific branch and company — no duplicate columns needed.

## 1. Database: Raw SQL Patch (Manual Execution by DBA)
Run this on the production database to add the missing column:
```sql
ALTER TABLE `saved_addresses`
ADD COLUMN `agent_id` INT NULL AFTER `user_id`;
```

## 2. Code Changes Applied
The following files were updated:

**`app/Http/Controllers/Logistics/HousewayBillController.php`**
- `saveShipperAddress()` — Fixed: `agent_id = $agent->id`, `user_id = $user->id`
- `saveConsigneeAddress()` — Fixed: `agent_id = $agent->id`, `user_id = $user->id`
- `saveAlsoNotify()` — Fixed: `agent_id = $agent->id`, `user_id = $user->id`

**`database/migrations/2026_05_16_000000_add_agent_id_to_saved_addresses_table.php`** *(NEW)*
- Adds `agent_id` integer column (nullable) to `saved_addresses` table

## 3. Optional: Artisan Migration (If artisan is available)
```bash
php artisan migrate
```

## 4. Backfill Existing Records (Optional, if you want old saved addresses to be visible)
If there are already records in `saved_addresses` that used the old buggy code (where `user_id` held the Branch ID), you can backfill them:
```sql
-- This copies the incorrectly stored branch ID from user_id into agent_id
-- for records that currently have agent_id = NULL.
-- REVIEW before running — only applies to HAWB-created records from before this fix.
UPDATE `saved_addresses`
SET `agent_id` = `user_id`
WHERE `agent_id` IS NULL AND `user_id` IS NOT NULL;
```
> **⚠️ CAUTION:** Only run the backfill after confirming this matches your data. Review a sample of records first.

---

# ⏱️ PART 6: OCR QUEUE TIMEOUT CHAIN — NO ACTION REQUIRED
*(Code already corrected in the deployment package. This section is for IT reference only.)*

The queue timeout values were incorrect in the original build. They have been fixed in the codebase. **The IT team does not need to change any files** — the corrections are already deployed in:
- `app/Jobs/ProcessPdfOcrJob.php`
- `config/queue.php`

### Why It Mattered
| Bug | What Would Have Happened |
|---|---|
| `Http::timeout(90)` was longer than `$timeout(50)` | The Laravel worker would be killed at 50s while still waiting for FastAPI — job stuck in `processing` forever, never completing |
| `retry_after(30)` was less than `$timeout(50)` | Redis would re-dispatch the same PDF job at the 30-second mark while the first copy was still running — **two workers processing the same file simultaneously**, corrupting `extracted_data` |

### Corrected Timeout Chain (for reference)
```
Redis retry_after: 110s  →  Job $timeout: 90s  →  Http::timeout: 80s  →  FastAPI: ~1–5s actual
```
Each value is safely larger than the one after it. This is now enforced in code.

---

# 🛡️ PART 7: SAVEDADDRESS MODEL — NO ACTION REQUIRED
*(Code already corrected in the deployment package. This section is for IT reference only.)*

The `app/SavedAddress.php` model previously had no `$fillable` array, which meant mass-assignment calls would silently fail. This has been corrected in the codebase. **The IT team does not need to change any files.**

---

# 🕐 PART 8: SCHEDULER CRON — ✅ IT ACTION REQUIRED

The application uses a background scheduler to automatically clean up stuck OCR jobs every 15 minutes. The scheduler code is already deployed in `app/Console/Kernel.php`, but **the server crontab must be registered manually by the IT team** for it to activate.

### Step 1 — Open the crontab editor on the production server
```bash
crontab -e
```

### Step 2 — Add this single line (adjust path if app is not at `/var/www/f16s_main`)
```bash
* * * * * cd /var/www/html/f16sefreight.com && php artisan schedule:run >> /dev/null 2>&1
```

### Step 3 — Verify it was saved
```bash
crontab -l
```
You should see the line you just added. The scheduler will now run automatically every minute and execute any due tasks (including the 15-minute OCR cleanup).

### What It Does
Every 15 minutes, the scheduler scans the `pdf_processing_jobs` table. Any job that has been stuck in `pending` or `processing` for more than 30 minutes (genuine FastAPI extractions complete in 1–5 seconds) is automatically:
1. Marked as `failed` with the message *"Timed out — cleaned up by scheduler."*
2. Its temporary PDF file deleted from `storage/app/pdf_temp/` to prevent disk filling

---

# 🗄️ PART 9: DATABASE PERFORMANCE INDEXES — ✅ IT ACTION REQUIRED (DBA to Execute)

The `air_way_bills` and `house_way_bills` tables currently have **no indexes** beyond their primary key. Every dashboard page load (message log, consolidation search, HAWB list) is doing a full table scan. As AWB volume grows, these queries become progressively slower.

**The DBA must execute the following SQL statements directly on the production database.** These are safe `ALTER TABLE ADD INDEX` statements — they do not change any data, only add lookup structures. They can be run one at a time.

### ✅ Execute These SQL Statements on the Production Database

```sql
-- ─────────────────────────────────────────────────────────────
-- TABLE: air_way_bills
-- ─────────────────────────────────────────────────────────────

-- Branch filter — used on every dashboard AWB list load
ALTER TABLE `air_way_bills`
ADD INDEX `awb_agent_id_idx` (`agent_id`);

-- AWB number lookup — used on every form save and message log search
ALTER TABLE `air_way_bills`
ADD INDEX `awb_code_no_idx` (`awb_code`, `awb_no`);

-- Branch + status composite — used by getAirwayBills($status) endpoint
ALTER TABLE `air_way_bills`
ADD INDEX `awb_agent_status_idx` (`agent_id`, `status`);


-- ─────────────────────────────────────────────────────────────
-- TABLE: house_way_bills
-- ─────────────────────────────────────────────────────────────

-- Branch filter — used on every HAWB list load
ALTER TABLE `house_way_bills`
ADD INDEX `hawb_agent_id_idx` (`agent_id`);

-- Master AWB reference lookup
ALTER TABLE `house_way_bills`
ADD INDEX `hawb_code_no_idx` (`awb_code`, `awb_no`);

-- 3-column composite — the most common query pattern in searchBills and consolidation
ALTER TABLE `house_way_bills`
ADD INDEX `hawb_agent_awb_idx` (`agent_id`, `awb_code`, `awb_no`);

-- Status filter (send / draft) — used in searchBills and getHouseWayBills
ALTER TABLE `house_way_bills`
ADD INDEX `hawb_status_agent_idx` (`status`, `agent_id`);


-- ─────────────────────────────────────────────────────────────
-- TABLE: way_bill_consignment_data
-- ─────────────────────────────────────────────────────────────

-- Always JOINed on awb_id in every message log and consolidation query
ALTER TABLE `way_bill_consignment_data`
ADD INDEX `consignment_awb_id_idx` (`awb_id`);


-- ─────────────────────────────────────────────────────────────
-- TABLE: way_bill_addresses
-- ─────────────────────────────────────────────────────────────

-- Looked up by awb_id on every AWB form load and save
ALTER TABLE `way_bill_addresses`
ADD INDEX `wayaddr_awb_id_idx` (`awb_id`);


-- ─────────────────────────────────────────────────────────────
-- TABLE: saved_addresses
-- ─────────────────────────────────────────────────────────────

-- Branch-scoped address retrieval (required by the Part 5 branch isolation fix)
ALTER TABLE `saved_addresses`
ADD INDEX `savedaddr_agent_type_idx` (`agent_id`, `address_type`);
```

### Index Reference Table
| Table | Index Name | Columns Indexed | Query It Accelerates |
|---|---|---|---|
| `air_way_bills` | `awb_agent_id_idx` | `agent_id` | Dashboard AWB list |
| `air_way_bills` | `awb_code_no_idx` | `awb_code, awb_no` | Every form save + search |
| `air_way_bills` | `awb_agent_status_idx` | `agent_id, status` | `getAirwayBills($status)` |
| `house_way_bills` | `hawb_agent_id_idx` | `agent_id` | HAWB list load |
| `house_way_bills` | `hawb_code_no_idx` | `awb_code, awb_no` | Master AWB reference |
| `house_way_bills` | `hawb_agent_awb_idx` | `agent_id, awb_code, awb_no` | searchBills, consolidation |
| `house_way_bills` | `hawb_status_agent_idx` | `status, agent_id` | Status-filtered queries |
| `way_bill_consignment_data` | `consignment_awb_id_idx` | `awb_id` | All JOIN queries |
| `way_bill_addresses` | `wayaddr_awb_id_idx` | `awb_id` | AWB address load/save |
| `saved_addresses` | `savedaddr_agent_type_idx` | `agent_id, address_type` | Saved address retrieval |

---

# 🌐 PART 10: FRONTEND ASSET REBUILD — ✅ IT ACTION REQUIRED ==========> clerity

The `webpack.mix.js` vendor bundle configuration was updated to include `vue-router`, `vue-meta`, and `vuex` alongside the existing `vue` and `bootstrap-vue`. Previously these were bundled into the main `app.js` file on every page load. Now they are extracted into a separate `vendor.js` file that the browser can cache indefinitely.

**The IT team must run the production build** after deploying the updated code to push the new bundle structure to users.

### What Changed in `webpack.mix.js`
| Before | After |
|---|---|
| `.extract(["vue", "vuetify", "bootstrap-vue"])` | `.extract(["vue", "vue-router", "vue-meta", "vuex", "bootstrap-vue"])` |
| `vue-router` bundled in `app.js` (re-downloaded on every deploy) | `vue-router` in `vendor.js` (cached by browser, never re-downloaded unless updated) |
| `vue-meta` SEO tags bundled in `app.js` | `vue-meta` in `vendor.js` — SEO tags activate from cache immediately on page load |
| `vuex` state management in `app.js` | `vuex` in `vendor.js` |

### ✅ Run This on the Server After Code Deployment

```bash
# 1. Navigate to the application root
cd /var/www/f16s_main

# 2. Install any new node dependencies
npm install

# 3. Compile and minify all assets for production
npm run prod
```

> *(Note: `npm run prod` is the same as `npm run production` — it minifies JS/CSS and adds content-hash versioning to filenames for cache busting.)*

### What the IT Team Will See After Build
The following files will be regenerated in `public/js/`:
- `vendor.js` — now larger (includes vue-router, vue-meta, vuex) but cached forever
- `app.js` — now smaller (only app-specific code)
- `chunk/` — individual page chunks unchanged

### Why This Matters for SEO
`vue-meta` manages all dynamic page `<title>` tags and meta descriptions. If it loads from cache (vendor.js), SEO meta tags appear instantly on navigation — no flash of missing metadata.



---

