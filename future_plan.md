# 🚀 Implementation Blueprint: F16s Freight Operations OS

This document outlines the step-by-step roadmap for upgrading the F16s platform into an inbox-driven logistics operating system. It is divided into three segments:
*   **Segment A: Core Operations OS (Phases 1-4)** — Multi-portal document workspace (Focus Air, Focus Sea), email inbox sync, Kanban workflows, and analytics.
*   **Segment B: Automated Financials & Reconciliation** — Payment tracking, bank statement/CASS reconciliation, ledger accounts, and anonymized AI analysis.
*   **Segment C: Future Expansion Modules** — Import management and direct carrier/airline bookings integrations.

> [!IMPORTANT]
> **Implementation Methodology (Small Increments & Testing)**: To maintain the stability of the platform, the code changes for each phase/segment must be kept small and incremental. Verify and check for errors at each step before moving to the next.


## 📖 Table of Contents

- [📈 Business Value & Optimization Strategy](#business-value-optimization-strategy)
  - [💰 Expected Client Financial Savings (Segment A ROI)](#expected-client-financial-savings-segment-a-roi)
  - [⚡ PDF Parsing Hybrid Engine Strategy](#pdf-parsing-hybrid-engine-strategy)
- [🗺️ Core Operations OS Roadmap (Segment A)](#core-operations-os-roadmap-segment-a)
- [🌲 Implementation Tree (Phase-by-Phase Component Roadmap)](#implementation-tree-phase-by-phase-component-roadmap)
- [🗄️ Database Schema Design (Segment A)](#database-schema-design-segment-a)
  - [Reused/Modified Existing Tables](#reusedmodified-existing-tables)
  - [New Segment A Tables to Create](#new-segment-a-tables-to-create)
  - [Database Views for Analytics](#database-views-for-analytics)
- [🎖️ Subscription Tier Feature Gates](#subscription-tier-feature-gates)
  - [Tier definitions:](#tier-definitions)
  - [Implementation Strategy:](#implementation-strategy)
- [🌲 Segment A: Component & Function Breakdown](#segment-a-component-function-breakdown)
  - [Phase 1: Document Processing, Database & AI Ingestion](#phase-1-document-processing-database-ai-ingestion)
  - [Phase 2: Gmail & Outlook Account Integration](#phase-2-gmail-outlook-account-integration)
  - [Phase 3: Operations & Pricing Workflows](#phase-3-operations-pricing-workflows)
  - [Phase 4: Executive dashboards, Target Metrics & Sales AI](#phase-4-executive-dashboards-target-metrics-sales-ai)
- [🎨 System Mockup: Toggled Drawer Workspace](#system-mockup-toggled-drawer-workspace)
- [🛠️ Phase 1: Document Processing, Database & AI Ingestion](#phase-1-document-processing-database-ai-ingestion)
  - [Phase 1a: Complete Database Foundation & Eloquent Models](#phase-1a-complete-database-foundation-eloquent-models)
  - [Phase 1b: FastAPI Parsing Engine](#phase-1b-fastapi-parsing-engine)
  - [Phase 1c: Laravel Integration & Vue Ingestion Modal](#phase-1c-laravel-integration-vue-ingestion-modal)
- [📧 Phase 2: Unified Gmail & Outlook Sync](#phase-2-unified-gmail-outlook-sync)
  - [2.1 Database & OAuth Schema](#21-database-oauth-schema)
  - [2.2 Background Polling Service](#22-background-polling-service)
  - [2.3 The Airline Exclusion Engine](#23-the-airline-exclusion-engine)
  - [2.4 Global Sidebar & Gmail-Inspired Workspace UI](#24-global-sidebar-gmail-inspired-workspace-ui)
  - [2.5 Quick Replies](#25-quick-replies)
  - [2.6 Vue 2 Frontend Drawer Workspace & Split-Pane Column Hiding](#26-vue-2-frontend-drawer-workspace-split-pane-column-hiding)
- [🗂️ Phase 3: Operations & Pricing Workflows](#phase-3-operations-pricing-workflows)
  - [3.0 Job Lifecycle & Transition Flow](#30-job-lifecycle-transition-flow)
  - [3.1 Kanban Board (OPS View)](#31-kanban-board-ops-view)
  - [3.2 Pricing / Triage Dashboard](#32-pricing-triage-dashboard)
- [📊 Phase 4: Executive Sales & Admin Dashboard](#phase-4-executive-sales-admin-dashboard)
  - [4.1 Aggregations & Status Reporting (DSR/MSR/YSR)](#41-aggregations-status-reporting-dsrmsrysr)
  - [4.2 Sales Dashboard & AI Client Insights](#42-sales-dashboard-ai-client-insights)
  - [4.3 Boss / Director Dashboard](#43-boss-director-dashboard)
  - [B.1 Accounts Database Schema & Isolation](#b1-accounts-database-schema-isolation)
  - [B.2 Bank Statement Ingestion (Plaid / Setu APIs)](#b2-bank-statement-ingestion-plaid-setu-apis)
  - [B.3 Automated Payment Reconciliation (Tallying Matching Engine)](#b3-automated-payment-reconciliation-tallying-matching-engine)
  - [B.4 Privacy-Masked AI Analytics (Anonymization Engine)](#b4-privacy-masked-ai-analytics-anonymization-engine)
  - [B.5 Financial Reports Engine (P&L, Balance Sheet, Trial Balance)](#b5-financial-reports-engine-pl-balance-sheet-trial-balance)
  - [B.6 Import DO & Airline Cost Auto-Calculation Rules](#b6-import-do-airline-cost-auto-calculation-rules)
  - [B.7 Decoupled Job Cost Sheet Workflow (Operational vs Financial Data)](#b7-decoupled-job-cost-sheet-workflow-operational-vs-financial-data)
  - [B.8 Logistics Invoicing, Reporting & Queue Specifications (Sea and Air)](#b8-logistics-invoicing-reporting-queue-specifications-sea-and-air)
  - [C.1 Air Import Documentation & Transmission](#c1-air-import-documentation-transmission)
  - [C.2 Direct Carrier & Airline Booking Integration](#c2-direct-carrier-airline-booking-integration)
- [🌐 Multi-Portal Scope Segregation (Air vs Sea)](#multi-portal-scope-segregation-air-vs-sea)
  - [1. Pre-Login Company Selection & Unified Authentication](#1-pre-login-company-selection-unified-authentication)
  - [2. Database Partitioning (`transport_mode`)](#2-database-partitioning-transport_mode)
  - [3. Contextual Drawer Workspace Forms](#3-contextual-drawer-workspace-forms)
- [🌊 Focus Sea: Database Schema Definitions](#focus-sea-database-schema-definitions)
  - [`sea_shipment_details` (Maritime Voyage & Cargo Metadata)](#sea_shipment_details-maritime-voyage-cargo-metadata)
  - [`job_entities` (Operational Party Contacts)](#job_entities-operational-party-contacts)
  - [`sea_containers` (ISO Container Grid)](#sea_containers-iso-container-grid)
  - [`sea_container_items` (Container Stuffing — HBL Allocation)](#sea_container_items-container-stuffing-hbl-allocation)
  - [`cargo_arrival_notices` (Pre-Arrival Notice Records) (New)](#cargo_arrival_notices-pre-arrival-notice-records-new)
  - [`ports` (UN/LOCODE Reference Directory)](#ports-unlocode-reference-directory)
- [🌊 Focus Sea: Export Form Sheet & Architectural Mapping](#focus-sea-export-form-sheet-architectural-mapping)
  - [1. Architectural Data Flow Overview](#1-architectural-data-flow-overview)
  - [2. Global Header Fields Architectural Mapping](#2-global-header-fields-architectural-mapping)
  - [3. Tab-by-Tab Functional & Database Breakdown](#3-tab-by-tab-functional-database-breakdown)
  - [4. Form Footer State Actions & Commit Workflows](#4-form-footer-state-actions-commit-workflows)
  - [5. Detailed Seeder & Dropdown Options Specification](#5-detailed-seeder-dropdown-options-specification)
  - [6. Field Validation & Character Limitations](#6-field-validation-character-limitations)
  - [7. Cargo Type Conditional UI & Field Locking Logic](#7-cargo-type-conditional-ui-field-locking-logic)
  - [8. Supplementary Field Locking Rules](#8-supplementary-field-locking-rules)
  - [9. Header UI Utilities & Session Control](#9-header-ui-utilities-session-control)
  - [10. Toolbar Utilities & Right-Side Shortcut Controls](#10-toolbar-utilities-right-side-shortcut-controls)
  - [11. Comprehensive Data Field Matrix](#11-comprehensive-data-field-matrix)
  - [12. HBL & MBL Data Mapping & Consolidation Workflow](#12-hbl-mbl-data-mapping-consolidation-workflow)
  - [13. Focus Sea Consolidation Page Design (`FocusSeaConsol.vue`)](#13-focus-sea-consolidation-page-design-focusseaconsolvue)
- [🌊 Focus Sea: Import Specifications](#focus-sea-import-specifications)
  - [1. Form Specification: Sea Import Consol](#1-form-specification-sea-import-consol)
  - [2. Form Specification: Delivery Order [Sea]](#2-form-specification-delivery-order-sea)
  - [3. Form Specification: CGM Filing (Sea)](#3-form-specification-cgm-filing-sea)
- [📊 Backend Analytical Tables & Business Intelligence Formulas](#backend-analytical-tables-business-intelligence-formulas)
  - [1. New Analytical Tables (Backend Reporting Targets)](#1-new-analytical-tables-backend-reporting-targets)
  - [2. Business Intelligence Formulas (Backend Metrics Engines)](#2-business-intelligence-formulas-backend-metrics-engines)
  - [3. Business Intelligence Dashboards: Knowing the Business (Sales vs. Admin Roles)](#3-business-intelligence-dashboards-knowing-the-business-sales-vs-admin-roles)
- [🗺️ Step-by-Step Implementation Roadmap](#step-by-step-implementation-roadmap)
  - [Phase 1: Core Document Parsing & Frontend Verification Form](#phase-1-core-document-parsing-frontend-verification-form)
  - [Phase 2: Inbox Sync & Split-Screen Workspace UI](#phase-2-inbox-sync-split-screen-workspace-ui)
  - [Phase 3: Workflow Automation, Kanban & Job Cost Sheets](#phase-3-workflow-automation-kanban-job-cost-sheets)
  - [Phase 4: Multi-Portal Access Scoping (Air, Sea)](#phase-4-multi-portal-access-scoping-air-sea)
  - [Phase 5: Automated Ledgers, CASS Reconciliations & Reports](#phase-5-automated-ledgers-cass-reconciliations-reports)
- [⚡ Speed & Efficiency Optimization Plan](#speed-efficiency-optimization-plan)
  - [1. In-Memory PDF Processing (FastAPI)](#1-in-memory-pdf-processing-fastapi)
  - [2. LLM Prompt Caching (Gemini API)](#2-llm-prompt-caching-gemini-api)
  - [3. Delta Email Syncing & Lazy-Loading Attachments](#3-delta-email-syncing-lazy-loading-attachments)
  - [4. Database Indexing & Query Optimizations](#4-database-indexing-query-optimizations)
  - [5. Eager Loading Optimization (N+1 Query Prevention)](#5-eager-loading-optimization-n1-query-prevention)
  - [6. Database Partitioning for Large Log & Ledger Tables](#6-database-partitioning-for-large-log-ledger-tables)
  - [7. Distributed Locks & Asynchronous Queue Workers](#7-distributed-locks-asynchronous-queue-workers)
- [🔒 Security, Integrity & Infrastructure Strategies](#security-integrity-infrastructure-strategies)
  - [1. Soft Deletes Policy](#1-soft-deletes-policy)
  - [2. API Resilience & Gateway Error Handling](#2-api-resilience-gateway-error-handling)
  - [3. Data Backup, Archival & Retention Strategy](#3-data-backup-archival-retention-strategy)
  - [4. Invoice Sequence Generation per Billing Type](#4-invoice-sequence-generation-per-billing-type)
- [📝 Technical Implementation Checklist](#technical-implementation-checklist)
  - [🏗️ Architectural Prerequisites & Decisions](#architectural-prerequisites-decisions)
  - [Phase 1a: Complete Database Foundation & Eloquent Models](#phase-1a-complete-database-foundation-eloquent-models)
  - [Phase 1b: FastAPI Parsing Engine (In-Memory Unstructured Extraction)](#phase-1b-fastapi-parsing-engine-in-memory-unstructured-extraction)
  - [Phase 1c: Laravel Integration & Vue Ingestion Modal](#phase-1c-laravel-integration-vue-ingestion-modal)
  - [🧪 Automated Testing Strategy](#automated-testing-strategy)

---







---

## 📈 Business Value & Optimization Strategy

### 💰 Expected Client Financial Savings (Segment A ROI)
By automating document processing and email workflows, a medium-sized freight forwarder processing **500 shipments per month** will achieve:
*   **Labor Savings:** Operations processing time drops from **20 minutes** (manual copying/keying) to **1.5 minutes** (drag-and-drop verification) per shipment. This saves **~153 hours per month**, allowing existing teams to handle up to 10x the cargo volume.
*   **Amendment Penalty Reductions:** Visual and LLM validation checks catch weight or port mismatches before submission. Eliminating just 5 AWB amendments per month saves **$250 - $750 (₹20,000 - ₹60,000)** in carrier/customs penalty fees.
*   **Increased Booking Conversions:** Tracking email responses via SLA countdowns prevents lost opportunities and increases inquiry-to-booking sales conversion rates by 10-15%.

### ⚡ PDF Parsing Hybrid Engine Strategy
To maximize processing speed and server efficiency under concurrent loads, we implement a hybrid parsing layer:
*   **Unstructured Documents (Invoices/PLs):** Use **PyMuPDF (`fitz`)**. It is written in C and is **10x to 50x faster** than `pdfplumber`, extracting full text blocks in milliseconds to feed directly to the LLM.
*   **Structured Documents (AWBs):** Retain **`pdfplumber`** for [extract_awb_new.py](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/python/extract_awb_new.py) to preserve the existing coordinate-based cell extraction logic.

---

## 🗺️ Core Operations OS Roadmap (Segment A)

```mermaid
graph TD
    P1a[Phase 1a: Complete Database Foundation & Eloquent Models] --> P1b[Phase 1b: FastAPI Parsing Engine]
    P1b --> P1c[Phase 1c: Laravel Integration & Vue Ingestion Modal]
    P1c --> P2[Phase 2: Gmail & Outlook OAuth Sync & Drawer Workspace]
    P2 --> P3[Phase 3: Role Workflows: OPS & Pricing Kanban]
    P3 --> P4[Phase 4: Executive dashboards, DSR/MSR/YSR, Sales AI]
```

---

## 🌲 Implementation Tree (Phase-by-Phase Component Roadmap)

This folder structure indicates exactly which backend/frontend components are introduced or modified in each phase.

```text
📦 F16s Freight OS Implementation Tree
 ┣ 📂 Phase 1: Document Processing Foundation (Core MVP)
 ┃ ┗ 📂 Backend Updates
 ┃   ┣ 🐍 FastAPI: PyMuPDF integration & /extract-unstructured endpoint
 ┃   ┣ 🐍 FastAPI: Pydantic schemas (Invoice & Packing List definitions)
 ┃   ┣ 🐘 database/migrations: Reuse existing pdf_processing_jobs columns (document_type, extracted_data)
 ┃   ┗ 🐘 app/Jobs/ProcessPdfOcrJob.php: Hook up unstructured parser API dispatches
 ┣ 📂 Phase 2: Gmail & Outlook Account Integration & Drawer Workspace
 ┃ ┣ 📂 Database Models
 ┃ ┃ ┗ 🐘 app/Models: mailbox_connections, inbound_emails, inbound_attachments
 ┃ ┣ 📂 Backend Services
 ┃ ┃ ┣ 🐘 app/Console/Commands: mailboxes:poll daemon (Google API & MS Graph integration)
 ┃ ┃ ┣ 🐘 app/Services: Airline exclusion filtering (domain blocklist & Regex checks)
 ┃ ┃ ┗ 🐘 app/Http/Controllers: OAuth account connect controllers & Token Lifecycle
 ┃ ┗ 📂 Frontend Views & Workspace Updates
 ┃   ┣ 🎨 MailboxSettings.vue: Account OAuth connection configurations
 ┃   ┣ 🎨 JobInbox.vue: Gmail-inspired 3-column layout (Queue list, thread feed, reply box)
 ┃   ┣ 🎨 JobInbox.vue: Slide-out Drawer Workspace with file Dropzone & Click-to-Upload
 ┃   ┣ 🎨 JobInbox.vue: Top-right Split-Window toggle button & Navigation Tabs
 ┃   ┣ 🎨 FocusAir.vue: Verification form & validation inputs (orange-warning highlights)
 ┃   ┣ 🎨 FocusAirImport.vue: Air Import verification, Arrival Notice & DO generation form
 ┃   ┗ 🎨 FocusAir.vue / HouseWayBill.vue: Form pre-population triggers
 ┣ 📂 Phase 3: Operations & Pricing Workflows
 ┃ ┣ 📂 Backend APIs
 ┃ ┃ ┣ 🐘 app/Http/Controllers: Job status transition and user assignment endpoints
 ┃ ┃ ┗ 🐘 app/Http/Controllers: Staff active load & completion duration API
 ┃ ┗ 📂 Frontend Views
 ┃   ┣ 🎨 OpsDashboard.vue: Kanban Workflow Board (vuedraggable columns)
 ┃   ┣ 🎨 PricingDashboard.vue: Load tracker and task allocator interface
 ┃   ┗ 🎨 DashboardWidgets: Staff utilization graphs (apexcharts)
 ┗ 📂 Phase 4: Executive dashboards, Target Metrics & Sales AI
   ┣ 📂 Backend Analytics
   ┃ ┣ 🐘 database/migrations: DB views for DSR (Daily), MSR (Monthly), YSR (Yearly) reports
   ┃ ┣ 🐘 app/Console/Commands: Weekly sales opportunity analysis cron (Weekly AI)
   ┃ ┗ 🐘 app/Console/Commands: Weekly executive brief compiler (Weekly Admin AI)
   ┗ 📂 Frontend Dashboards
     ┣ 🎨 SalesDashboard.vue: Customer metrics grid & on-demand AI customer summarizer
     ┣ 🎨 SalesDashboard.vue: Weekly AI Sales opportunity notifications feed
     ┣ 🎨 BossDashboard.vue: Branch comparative overview, Target settings, & Executive Brief widget
     ┗ 🎨 FocusSeaConsol.vue: Sea consolidation manager to group multiple HBLs under an MBL
```

> ℹ️ **Road Transport** (`FocusRoadWaybill.vue` / `TruckManifest.vue`) is deferred to a later phase and is not in scope for the current implementation.

## 🗄️ Database Schema Design (Segment A)

To minimize database bloat and leverage F16s' existing data structures, the system will reuse existing schemas where possible and create lightweight, isolated tables for mailbox integration and job tracking:

### Reused/Modified Existing Tables

1.  **`pdf_processing_jobs` (Existing Table):**
    *   *Usage:* Stores OCR processing jobs and intermediate draft metadata.
    *   *Fields:*
        *   `extracted_data` (JSON): Caches the raw AI-extracted draft payload returned by the Gemini/FastAPI engine before validation.
        *   `document_type` (String): Tracks sub-types (`MAWB`, `HAWB`, `Invoice`, `Packing List`).
        *   `status` (String): Tracks the active AI parsing states (`pending`, `processing`, `completed`, `failed`).
2.  **`air_way_bills` & `house_way_bills` (Existing Tables):**
    *   *Usage:* Stores the finalized, verified airway bill records.
    *   *Reused Fields:* `status` (`draft` or `send`), `t_id`, `send_created`, `send_status`, and `agent_id` (representing the branch for tenant isolation).
    *   *New Columns to Add:*
        *   `uuid` (UUID, nullable, unique): Safe random identifier for public tracking and APIs.
        *   `job_id` (BigInteger, nullable, foreign key): References `jobs.id` to link the waybill back to its parent operational job.
3.  **`agents_info` & `companies` (Existing Tables):**
    *   *Usage:* Tenant management, branch isolation, and customer alignment. All lists, metrics, and actions are filtered by `agent_id` and `company_id`.
    *   *New Columns to Add to `companies`:*
        *   `tier` (String, default: `'viper_core'`): Controls feature access levels (`basic`, `professional`, or `enterprise`).
        *   `email_domain` (String, Nullable): The authorized corporate email domain (e.g., `'xyzcompany.com'`) used to restrict OAuth mailbox connections for Tier 2 and Tier 3.
        *   `credit_limit` (Decimal(15,2), default: 0.00): Maximum outstanding receivable balance allowed.
        *   `credit_currency` (String, 3 chars, default: `'INR'`): Currency of the credit limit.
        *   `default_payment_terms` (String, max 20, Nullable): Default billing terms (e.g., `'Net 30'`, `'COD'`).
        *   `credit_status` (Enum: `'active'`, `'hold'`, `'suspended'`, default: `'active'`): Controls billing eligibility.
        *   `gstin` (String, max 15, Nullable): Indian GST Identification Number for tax compliance.
        *   `state_code` (String, max 5, Nullable): GST state code prefix (e.g., `'33-TN'` for Tamil Nadu).
4.  **`airlines` (Existing Table):**
    *   *Usage:* Used by the exclusion engine to block standard system/airline notice emails.
5.  **`users` (Existing Table):**
    *   *Usage:* Stores operational user accounts, roles, and profiles.
    *   *New Columns to Add:*
        *   `origin_port_id` (BigInteger, Nullable, FK referencing `ports.id`): Stores the user's designated default origin port (airport or seaport).
        *   `pima_address` (String, max 20, Nullable): Printer / Messaging Routing Address for SITA/IATA Type B messaging (e.g. `'MAAF16S'`). Configurable by administrative backend when editing user profiles.

### New Segment A Tables to Create

All core tables (operational, side-details, and financial chart tables) are migrated early during **Phase 1a** to ensure database schema integrity from the start.

1.  **`mailbox_connections`**:
    *   *Purpose:* Manages connected mailboxes (Gmail/Outlook) and their OAuth token state.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `user_id` (BigInteger, FK referencing `users.id`): Connects a mailbox connection to a specific operator/user.
        *   `provider` (String): Indicates the email provider (`gmail`, `outlook`).
        *   `email_address` (String, Unique): The synced email address.
        *   `access_token` (Text): OAuth access token (encrypted at rest).
        *   `refresh_token` (Text): Refresh token to fetch new access tokens (encrypted at rest).
        *   `expires_at` (Timestamp, Nullable): Expiration time of the current access token.
        *   `is_active` (Boolean, default: true): Active status flag (gating tier downgrades).
        *   `created_at`, `updated_at` (Timestamps)
2.  **`inbound_emails`**:
    *   *Purpose:* Local database cache for messages pulled from mail servers, forming the basis of the inbox thread reader.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level isolation.
        *   `mailbox_connection_id` (BigInteger, FK referencing `mailbox_connections.id` on delete cascade)
        *   `message_id` (String, Unique): Unique provider message identifier.
        *   `thread_key` (String, Index): Unique hash matching back-and-forth messages in the same conversation thread.
        *   `from` (String): Sender address.
        *   `to` (String): Recipient address.
        *   `subject` (String, Nullable): Email subject.
        *   `body_text` (LongText, Nullable): Plain text email content.
        *   `body_html` (LongText, Nullable): Rich HTML email content (sanitized server-side using HTMLPurifier before storage to prevent stored XSS).
        *   `received_at` (Timestamp): Timestamp when the email was received.
        *   `created_at`, `updated_at` (Timestamps)
3.  **`email_threads`** (New):
    *   *Purpose:* Cache and group incoming/outgoing message feeds contextually. Rather than running slow subqueries or `GROUP BY` aggregates on million-row `inbound_emails` tables, operational dashboards query this table for rapid inbox timelines.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level isolation.
        *   `thread_key` (String, Unique, Index): Matches messages grouped in the same conversational thread.
        *   `subject` (String, Nullable)
        *   `latest_message_received_at` (Timestamp, Index): Chronological sorting.
        *   `participant_emails` (JSON): Inbound/outbound addresses.
        *   `status` (Enum: `'unread'`, `'read'`, `'replied'`, `'archived'`, default: `'unread'`)
        *   `assigned_operator_id` (BigInteger, Nullable, FK referencing `users.id`): Syncs operator queue assignment.
        *   `job_id` (BigInteger, Nullable, FK referencing `jobs.id` on delete set null): Operational link.
        *   `first_reply_at` (Timestamp, Nullable): Tracks the timestamp of the first outbound email reply sent by staff (immutable once set; protected from updates).
        *   `first_triage_at` (Timestamp, Nullable): Tracks the timestamp when the email thread was first triaged (assigned an enquiry number) (immutable once set; protected from updates).
        *   `created_at`, `updated_at` (Timestamps)
    *   *Indexes:* Composite index on `(agent_id, status, latest_message_received_at)` to load scoped operator folders in milliseconds.
4.  **`inbound_attachments`**:
    *   *Purpose:* Indexes all attachment files linked to inbound emails.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `inbound_email_id` (BigInteger, FK referencing `inbound_emails.id` on delete cascade)
        *   `filename` (String): Original name of the attachment file.
        *   `file_path` (String): Storage path on disk (e.g. `attachments/file-uuid.pdf`).
        *   `mime_type` (String): The file's MIME type (e.g. `application/pdf`, `image/png`) to filter parseable formats.
        *   `file_size` (Integer): File size in bytes.
        *   `created_at`, `updated_at` (Timestamps)
4.  **`jobs`**:
    *   *Purpose:* Represents the operational job folder created when an email inquiry or file is triaged for execution, tracking the lifecycle from initial enquiry to final shipment execution.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment): Unique internal identifier.
        *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation key. All queries are scoped by this.
        *   `transport_mode` (Enum: `'air'`, `'sea'`): Mode of logistics. Used for query scoping and sequence partitioning.
        *   `direction` (Enum: `'export'`, `'import'`, default: `'export'`): Shipment direction.
        *   `enquiry_no` (String, Unique): Auto-generated unique enquiry number assigned at intake.
            *   *Air Sequence:* `ENQA-26-0001` (Incremented separately from Sea)
            *   *Sea Sequence:* `ENQS-26-0001` (Incremented separately from Air)
        *   `execution_job_no` (String, Unique, Nullable): Auto-generated unique execution job number assigned only when the shipment is confirmed/executed.
            *   *Air Sequence:* `JOBA-26-0001` (Incremented separately from Sea)
            *   *Sea Sequence:* `JOBS-26-0001` (Incremented separately from Air)
        *   `awb_number` (String, Nullable): Reference to the assigned Air Waybill (for Air) or Bill of Lading (for Sea) identifier.
        *   `client_id` (BigInteger, Nullable, FK referencing `companies.id`): Canonical billing debtor for this job.
        *   `operator_id` (BigInteger, Nullable, FK referencing `users.id` on delete set null): The user (operator) assigned to manage the job (enforced at the DB level via a trigger ensuring the user holds an operator/execution role).
        *   `job_owner_id` (BigInteger, Nullable, FK referencing `users.id`): Ownership assignee for visibility filtering (enforced at the DB level via a trigger ensuring the user holds a sales/agent/owner role).
        *   `doc_user_id` (BigInteger, Nullable, FK referencing `users.id`): Document validation owner.
        *   `planned_clearance_date` (Date, Nullable): Targeted date for customs clearance.
        *   `completed_at` (Timestamp, Nullable): Date/time when the job reached `Completed` status.
        *   `parent_job_id` (BigInteger, Nullable, FK referencing `jobs.id`, self-referencing): Links House shipments to Master parent.
        *   `is_sub_shipment` (Boolean, default: false): Indicates child House record under consolidation.
        *   `is_consolidation` (Boolean, default: false): Indicates parent Master record accepting child Houses.
        *   `status` (String): Tracks the active operational stage (e.g. `Intake`, `AI Extraction`, `Verification`, `Generation`, `PDF Generated`, `Sent to Airline`, `Airline Confirmed`, `Completed`, `Lost`).
        *   `lost_reason` (Enum: `'rates_high'`, `'delay_in_response'`, `'client_cancelled'`, `'capacity_issue'`, `'other'`, Nullable): Reason why the enquiry/job was lost.
        *   `lost_reason_custom` (String, max 255, Nullable): Custom reason details when `lost_reason` is set to `'other'`.
        *   `lost_at` (Timestamp, Nullable): Timestamp when the job was marked as lost.
        *   `created_at`, `updated_at`, `deleted_at` (Timestamps) — Uses Laravel `SoftDeletes`.
    *   *Note:* Mode-specific columns like `cargo_type`, `delivery_mode`, `vessel_name`, and `flight_number` are split into polymorphic details tables: `sea_shipment_details` and `air_shipment_details`.

5.  **`sea_shipment_details`** (New):
    *   *Purpose:* Holds maritime-specific voyage and container details associated with a Job.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade, Unique)
        *   `consol_type` (Enum: `'agent_consol'`, `'buyers_consol'`, `'direct'`, `'back_to_back'`, `'none'`, Nullable)
        *   `cargo_type` (String, max 20, Nullable): e.g., `'fcl'`, `'lcl'`, `'break_bulk'`
        *   `delivery_mode` (Enum: `'fcl'`, `'lcl'`, Nullable)
        *   `vessel_name` (String, max 100, Nullable)
        *   `voyage_no` (String, max 30, Nullable)
        *   `vessel_flag` (String, max 50, Nullable)
        *   `imo_number` (String, max 7, Nullable)
        *   `por_code` (String, max 6, Nullable)
        *   `pol_code` (String, max 6, Nullable)
        *   `pod_code` (String, max 6, Nullable)
        *   `del_code` (String, max 6, Nullable)
        *   `empty_depot` (String, max 100, Nullable)
        *   `delivery_address` (String, max 500, Nullable)
        *   `do_given_to` (String, max 100, Nullable)
        *   `piece_count` (Integer, default: 0)
        *   `gross_weight` (Decimal(10,3), default: 0.000)
        *   `net_weight` (Decimal(10,3), default: 0.000)
        *   `volume_cbm` (Decimal(8,3), default: 0.000)
        *   `created_at`, `updated_at` (Timestamps)

6.  **`air_shipment_details`** (New):
    *   *Purpose:* Holds flight and air cargo details associated with a Job.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade, Unique)
        *   `flight_number` (String, max 20, Nullable)
        *   `flight_date` (Timestamp, Nullable)
        *   `carrier_name` (String, max 100, Nullable)
        *   `pol_code` (String, max 6, Nullable)
        *   `pod_code` (String, max 6, Nullable)
        *   `do_given_to` (String, max 100, Nullable)
        *   `piece_count` (Integer, default: 0)
        *   `gross_weight` (Decimal(10,3), default: 0.000)
        *   `chargeable_weight` (Decimal(10,3), default: 0.000)
        *   `volume_cbm` (Decimal(8,3), default: 0.000)
        *   `created_at`, `updated_at` (Timestamps)

7.  **`llm_usage_logs`** (New):
    *   *Purpose:* Records Gemini API request token counts and cost auditing details.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `job_id` (BigInteger, FK referencing `jobs.id` on delete set null, Nullable)
        *   `model` (String, max 50)
        *   `tokens_in` (Integer, default: 0)
        *   `tokens_out` (Integer, default: 0)
        *   `cost_usd` (Decimal(8,6), default: 0.000000)
        *   `created_at`, `updated_at` (Timestamps)
6.  **`chart_of_accounts`** (New):
    *   *Purpose:* Master table defining the chart of accounts for double-entry bookkeeping. All `account_code` references in `accounts_ledger_entries` are validated against this table.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation.
        *   `account_code` (String, max 30, Unique per agent): e.g., `'1200-AR'`, `'4000-Freight-Revenue'`.
        *   `account_name` (String, max 100): Human-readable name (e.g., `'Accounts Receivable'`).
        *   `account_type` (Enum: `'asset'`, `'liability'`, `'equity'`, `'revenue'`, `'expense'`): Classification for financial report grouping.
        *   `parent_account_id` (BigInteger, Nullable, FK referencing `chart_of_accounts.id`): Self-referencing for hierarchical grouping (e.g., `4000-Freight-Revenue` under `4000-Revenue`).
        *   `is_system_account` (Boolean, default: false): Locks system-critical accounts from deletion.
        *   `is_active` (Boolean, default: true): Soft deactivation toggle.
        *   `created_at`, `updated_at` (Timestamps)
7.  **`accounting_periods`** (New):
    *   *Purpose:* Controls fiscal period open/close status for ledger posting validation. Prevents postings into closed months.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `agent_id` (BigInteger, FK referencing `agents_info.id`)
        *   `period_name` (String, max 30): e.g., `'June 2026'`, `'Q2 2026'`.
        *   `start_date` (Date): Period start.
        *   `end_date` (Date): Period end.
        *   `status` (Enum: `'open'`, `'closed'`, `'locked'`): Controls whether new ledger entries can be posted.
        *   `closed_by` (BigInteger, Nullable, FK referencing `users.id`): User who closed the period.
        *   `closed_at` (Timestamp, Nullable)
        *   `created_at`, `updated_at` (Timestamps)
8.  **`audit_logs`** (New):
    *   *Purpose:* Immutable activity trail for compliance tracking (enforced append-only via a database-level `BEFORE UPDATE OR DELETE` trigger that halts operations). Records all create/update/delete operations on business-critical models.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `agent_id` (BigInteger, FK referencing `agents_info.id`)
        *   `auditable_type` (String): Laravel morph class name (e.g., `'App\Models\Invoice'`, `'App\Models\Job'`).
        *   `auditable_id` (BigInteger): Record ID of the changed entity.
        *   `event` (Enum: `'created'`, `'updated'`, `'deleted'`, `'restored'`)
        *   `old_values` (JSON, Nullable): Snapshot of fields before the change.
        *   `new_values` (JSON, Nullable): Snapshot of fields after the change.
        *   `user_id` (BigInteger, Nullable, FK referencing `users.id`): Actor who triggered the change.
        *   `ip_address` (String, max 45, Nullable)
        *   `user_agent` (String, max 255, Nullable)
        *   `created_at` (Timestamp)
9.  **`job_documents`** (E-Docket Attachments) (New):
    *   *Purpose:* Central document management repository for all physical shipping documents attached to a job (replaces ad-hoc references to `e_docket_attachments`).
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `agent_id` (BigInteger, FK referencing `agents_info.id`)
        *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade)
        *   `document_type` (Enum: `'commercial_invoice'`, `'packing_list'`, `'certificate_of_origin'`, `'awb_copy'`, `'hawb_copy'`, `'bl_copy'`, `'delivery_order'`, `'customs_declaration'`, `'igm_manifest'`, `'arrival_notice'`, `'cover_letter'`, `'other'`)
        *   `file_name` (String, max 255): Original uploaded filename.
        *   `file_path` (String, max 500): Storage path on disk or S3.
        *   `mime_type` (String, max 50): e.g., `'application/pdf'`, `'image/png'`.
        *   `file_size` (Integer): Size in bytes.
        *   `uploaded_by` (BigInteger, FK referencing `users.id`)
        *   `created_at`, `updated_at` (Timestamps)
10. **`manifest_filings`** (Customs Manifest Submission Trackers) (New):
    *   *Purpose:* Central directory for recording digital manifest submissions (CGM/SCMTR) filed to ICEGATE. Shared across Air and Sea.
    *   *Columns:*
        *   `id` (BigInteger, PK, Auto-increment)
        *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level isolation.
        *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade): Master operational Consol job card link.
        *   `transport_mode` (Enum: `'air'`, `'sea'`)
        *   `filing_type` (Enum: `'CGM'`, `'SCMTR'`)
        *   `transaction_status` (Enum: `'pending'`, `'submitted'`, `'received'`, `'accepted'`, `'rejected'`, default: `'pending'`)
        *   `customs_house_code` (String, max 6): Port location code (e.g. `'INMAA4'`, `'INMAA1'`).
        *   `icegate_id` (String, max 30): Active corporate ICEGATE ID profile selected.
        *   `amendment_no` (Integer, default: 0): Sequence tracker for rejected or modified files.
        *   `sending_method` (Enum: `'auto'`, `'manual'`, `'email'`, default: `'manual'`)
        *   `flat_file_path` (String, max 500, Nullable): Saved XML/flat text file S3 path.
        *   `status_log` (Text, Nullable): Read-only log output from ICEGATE.
        *   `submitted_by` (BigInteger, FK referencing `users.id`)
        *   `submitted_at` (Timestamp, Nullable)
        *   `created_at`, `updated_at` (Timestamps)

### Database Views for Analytics

1.  **`dsr_funnel_view`** (Daily), **`msr_funnel_view`** (Monthly), and **`ysr_funnel_view`** (Yearly):
    *   *Purpose:* Materialized or database views that compile aggregate funnel stats.
    *   *Metrics compiled:* `Jobs Raised`, `Jobs Replied`, `Pending / Delayed` SLA counts, `Jobs Converted`, and `Conversion Rate %`.

---

## 🎖️ Subscription Tier Feature Gates

To monetize the platform and segregate capabilities based on the customer's selected tier, features will be restricted at the Database, Middleware, Background Job, and Frontend layers.

### Tier definitions:
*   **Tier 1 (`viper_core`):** Access to local coordinate-based PDF extraction (`pdfplumber` templates). No AI parsing, no email integrations, and no automated financials.
*   **Tier 2 (`viper_tactical`):** Access to AI-powered unstructured parsing (Gemini/PyMuPDF) via the upload button + Unified Gmail/Outlook email sync, automated operational workflows, and basic analytics widgets.
*   **Tier 3 (`viper_command`):** Access to all Tier 2 features + accounts tracking, bank statement reconciliation ledger, privacy-masked AI cashflow analytics, and Director/Boss dashboards.

### Implementation Strategy:

1.  **Database Migration & Configuration:**
    *   Add a `tier` column (String, default: `viper_core`) and `email_domain` column (String, Nullable) to the `companies` table.
    *   In the F16s Admin Portal, provide administrative options during company creation and editing to select the subscription tier and register the corporate email domain.
2.  **Laravel Route Middleware (`CheckCompanyTier`):**
    *   Protects APIs from unauthorized cross-tier calls. Registered in `app/Http/Kernel.php` as `'tier'`.
    *   *Examples:*
        *   `Route::group(['middleware' => 'tier:viper_tactical,viper_command'], ...)` handles mailbox sync and AI extraction endpoints.
        *   `Route::group(['middleware' => 'tier:viper_command'], ...)` handles Plaid reconciliation and accounts ledger endpoints.
3.  **Background Job Sync Filtering:**
    *   The `mailboxes:poll` daemon only queries refresh tokens and pulls new emails for connections whose company is flagged as `viper_tactical` or `viper_command`.
4.  **OCR Processing Branching (`ProcessPdfOcrJob.php`):**
    *   Before processing any uploaded document, the job executes strict server-side MIME-type sniffing using PHP's `finfo_file` (not just checking file extensions) to reject HTML, SVG, or other non-supported formats. It then checks the uploading user's company tier. If it is `viper_core`, it restricts extraction strictly to template-based `pdfplumber` cell coordinates. If `viper_tactical` or `viper_command`, the full Gemini unstructured prompt extraction is unlocked.
5.  **Frontend State & UI Teasers:**
    *   The user object returned on login (`currentUser`) includes `user.company.tier`.
    *   The Vue routing system blocks the `/inbox` (Unified Sync) and `/accounts` (Reconciliation) pages for disallowed tiers, rendering high-conversion "Upgrade Required" teaser panels instead.

---

## 🌲 Segment A: Component & Function Breakdown

Below is the functional specification for each database schema, backend service, and frontend view introduced in Segment A.

### Phase 1: Document Processing, Database & AI Ingestion

#### Phase 1a: Complete Database Foundation & Eloquent Models
*   **Schema Migration:** Migrates modified `companies` and `waybill` schemas, new operational structures (`jobs`, `sea_shipment_details`, `air_shipment_details`, `llm_usage_logs`), mailbox queues, and all Phase 6 accounting/ledger views early.
*   **Eloquent Models:** Creates PSR-4 standard models mapped directly in the `app/` root namespace (e.g., `Job`, `SeaShipmentDetail`, `AirShipmentDetail`, `LlmUsageLog`).
*   **Job Observers:** Tracks milestone timings automatically via the `JobObserver`.

#### Phase 1b: FastAPI Parsing Engine (In-Memory Unstructured Extraction)
*   **FastAPI `/extract-unstructured` Endpoint (`ocr_server.py`):**
    *   *Purpose:* Ingests uploaded PDF/image documents (Invoices and Packing Lists).
    *   *Function:* Uses `PyMuPDF` (`fitz`) to extract raw text blocks instantly. Feeds the extracted text into Gemini/OpenAI with a structured prompt layout to map metadata into JSON, returning confidence scores (high/medium/low) for each parsed field. Falls back to a vision LLM for scanned or photographed documents.
*   **FastAPI Pydantic Schemas:**
    *   *Purpose:* Declares data schemas for Invoices and Packing Lists.
    *   *Function:* Validates the structure, data types, and confidence metadata of LLM outputs before returning them to Laravel, ensuring consistency in field mapping.

#### Phase 1c: Laravel Integration & Vue Ingestion Modal
*   **Database Schema Reuse (`pdf_processing_jobs`):**
    *   *Purpose:* Reuses existing schema to store unstructured document categories.
    *   *Function:* Utilizes `document_type` to store document categories (MAWB, HAWB, Invoice, Packing List) and the `extracted_data` JSON column to cache parsed drafts before final generation.
*   **`ProcessPdfOcrJob.php`:**
    *   *Purpose:* Handles document extraction in Laravel's background queue.
    *   *Function:* Checks the company's tier before processing: If the company is Tier 1 (Viper Core), it bypasses the LLM and runs the fast coordinate-based extraction via `pdfplumber`. For Tier 2 & 3, it validates the file via strict server-side MIME sniffing (rejecting HTML, SVG, etc.) and dispatches to the FastAPI OCR server for PyMuPDF + Gemini AI extraction. Saves the structured JSON results (including confidence metadata) inside `pdf_processing_jobs.extracted_data` and dispatches real-time WebSocket alerts to the frontend upon completion. The Vue frontend workspace automatically highlights medium/low confidence fields in orange to force operator manual review. Calculates actual tokens utilized and logs cost and metadata into the `llm_usage_logs` table.
*   **F16s Admin Portal - Client AWB Tracking Tab:**
    *   *Purpose:* Provides global oversight of processed Air Waybills for administrative staff.
    *   *Function:* A dedicated UI tab in the admin dashboard to list all extracted/processed client AWBs. Includes date range filters (From/Till) and a data extraction/export button (e.g., CSV/Excel).


### Phase 2: Gmail & Outlook Account Integration
*   **Database Models (`mailbox_connections`, `inbound_emails`, `inbound_attachments`):**
    *   *Purpose:* Models Gmail/Outlook accounts, cached emails, and files.
    *   *Function:* Stores refresh tokens, matches inbound messages into single conversational threads using a unique `thread_key`, and indexes binary attachments.
*   **`mailboxes:poll` Artisan Daemon:**
    *   *Purpose:* Keeps the local inbox database synchronized with external mail servers.
    *   *Function:* Runs every minute via Laravel Scheduler. Uses Google API Client and Microsoft Graph API to poll new emails, refresh OAuth access tokens, and dispatch new attachment processing jobs.
*   **Airline Exclusion Service:**
    *   *Purpose:* Filters out non-actionable emails.
    *   *Function:* Runs Regex subject-matching and checks sender domains against an airline exclusion blocklist. Uses a cheap LLM call to classify ambiguous mail as either an automated system notification (ignored) or a customer inquiry (triaged).
*   **OAuth Controllers:**
    *   *Purpose:* Handles secure mailbox registration.
    *   *Function:* Manages OAuth redirect endpoints, exchange processes for code tokens, and connection validation scopes. For Tier 2 and Tier 3 companies, the controllers strictly enforce that the mailbox email address being connected contains the registered corporate email domain suffix (e.g. `@xyzcompany.com`) configured for the company. Connection is aborted with an error if the domains do not match.
*   **`MailboxSettings.vue`:**
    *   *Purpose:* Settings UI for connecting mailboxes.
    *   *Function:* Displays connected mailboxes, OAuth connection buttons for Google/Microsoft, and connection status alerts.
*   **`JobInbox.vue`:**
    *   *Purpose:* Three-column email dashboard.
    *   *Function:* Provides a navigation tree for folders, a chronological thread list showing customer status with SLA timers, and a detailed conversation view showing collapsible messages and a rich-text reply box.
*   **Vue 2 Slide-Out Drawer & Dropzone (`JobInbox.vue`):**
    *   *Purpose:* Collapsible document workspace drawer.
    *   *Function:* Toggled by a top-right header icon button. It opens a panel with a File Upload Dropzone supporting drag-and-drop or click-to-select PDF uploads.
*   **Drawer Navigation Menu:**
    *   *Purpose:* Swapping tools within the drawer workspace.
    *   *Function:* Renders a top tab bar in the drawer to switch between Focus Air, House Waybill, Search, or other tools.
*   **Vue 2 Verification Form (`FocusAir.vue` / `HouseWayBill.vue`):**
    *   *Purpose:* Data validation interface.
    *   *Function:* Renders editable text inputs loaded from the AI extraction draft. Applies inline warning outlines (orange highlights) to fields that fail format validation rules (e.g. invalid IATA airport codes, mismatched dimensions).
*   **Vue 2 Form Pre-population Triggers (`FocusAir.vue` / `HouseWayBill.vue`):**
    *   *Purpose:* Maps validated drafts to live forms.
    *   *Function:* Transfers the approved draft fields to the active local component state, populating input fields for generating Air Waybills or House Waybills.

### Phase 3: Operations & Pricing Workflows
*   **Job Transition & Assignment Controllers:**
    *   *Purpose:* Restful endpoints for job lifecycle management.
    *   *Function:* Handles email triage classifications (Merge, Job, Airline, Escalation) and updates operators, AWB numbers, and Planned Clearance Dates.
*   **Staff Active Load API:**
    *   *Purpose:* Monitors operations capacity.
    *   *Function:* Computes real-time workload counts per operator to prevent bottlenecking during job assignment.
*   **`OpsDashboard.vue`:**
    *   *Purpose:* Operations workflow visual board.
    *   *Function:* Features a Kanban board supporting draggable cards. Toggles between Process View (Stages) and Schedule View (Planned Clearance Date columns: Today, Tomorrow, Upcoming, Overdue).
*   **`PricingDashboard.vue`:**
    *   *Purpose:* Work management panel.
    *   *Function:* Renders unassigned jobs, staff load state summaries, and alerts for pending jobs that are overdue or close to SLA limits.
*   **`DashboardWidgets.vue`:**
    *   *Purpose:* Operational reporting visual widgets.
    *   *Function:* Employs `apexcharts` to chart staff response times, average milestone durations, and branch throughput volumes.

### Phase 4: Executive dashboards, Target Metrics & Sales AI
*   **Daily/Monthly/Yearly DB Views (`DSR`, `MSR`, `YSR`):**
    *   *Purpose:* Pre-aggregated reporting views.
    *   *Function:* Computes funnel performance counts (Jobs Raised, Replied, Delayed, Converted) and calculates conversion percentages across time intervals.
*   **`WeeklySalesOpportunityJob.php`:**
    *   *Purpose:* Automated lane analysis agent.
    *   *Function:* Evaluates shipment logs and generates consolidations cards (e.g. suggesting custom tariffs for active lanes).
*   **`WeeklyExecutiveBriefJob.php`:**
    *   *Purpose:* Background brief compilation.
    *   *Function:* Analyzes branch latencies, SLA breaches, and volume changes to draft a markdown summary for directors.
*   **`SalesDashboard.vue`:**
    *   *Purpose:* Branch-level sales interface.
    *   *Function:* Showcases branch-level analytics, customer lane trends, AI customer summarization widgets, and sales opportunities lists.
*   **`BossDashboard.vue`:**
    *   *Purpose:* Executive macro panel.
    *   *Function:* Provides cross-branch comparisons, operator audit reports, target assigners, and renders the AI Weekly Executive Brief.
*   **Focus Sea Document Manager (`FocusSeaMaster.vue` / `FocusSeaHouse.vue`):**
    *   *Purpose:* Renders forms for Master Bill of Lading (MBL) and House Bill of Lading (HBL) inside the workspace drawer when the active portal scope is `'sea'`.
*   **Focus Sea Consolidation Manager (`FocusSeaConsol.vue`):**
    *   *Purpose:* Allows operators to search for a Master Bill of Lading (MBL) and dynamically associate/disassociate multiple House Bills of Lading (HBL) for ocean cargo consolidations. Renders rolled-up weight summaries and container allocation panels.
*   **Focus Air Import Document Manager (`FocusAirImport.vue`):**
    *   *Purpose:* Renders forms for Air Import flight data confirmation, Arrival Notice (AN) generation, and Delivery Order (DO) releases when `active_portal_scope === 'air'` and `direction === 'import'`.

---

## 🎨 System Mockup: Toggled Drawer Workspace

Below is a visual mockup of the drawer workspace, showing the email thread in the center and the side-by-side view that opens once the top-right split-window icon is clicked.

![Freight OS Split-Pane Mockup](/Users/jomygeorge/.gemini/antigravity-ide/brain/326c7f72-2278-4662-a418-aa826e0a2515/collapsed_sidebar_split_view_1781084147273.png)

---

## 🛠️ Phase 1: Document Processing, Database & AI Ingestion
*Goal: Build the multi-phased database schemas (both operational and financial), isolate flight/voyage specifics, establish model mappings, and run the FastAPI OCR engine in isolation before integration.*

### Phase 1a: Complete Database Foundation & Eloquent Models
*   **Database Schema Ingestion:** Run migrations for `jobs`, `sea_shipment_details`, `air_shipment_details`, `llm_usage_logs`, mailbox sync, and all accounts/financial ledgers early.
*   **Eloquent Model Scaffolding:** Create PSR-4 compliant Eloquent models directly in the `app/` root folder matching the namespace of the existing project.
*   **Sequence counters:** Set up `EnquirySequenceService` with database row-level `FOR UPDATE` locking and caching. This service must act as the single, centralized transaction path for all sequence generation across the application to prevent duplicates/gaps (enforced and verified via parallel-process concurrency testing).

### Phase 1b: FastAPI Parsing Engine
*   **Dependency Addition:** Add `PyMuPDF` and `google-generativeai` package versions in python requirements.
*   **Pydantic Schema Validation:** Declare structured schemas (`schemas.py`) for Invoices and Packing Lists.
*   **In-Memory PDF Parsing:** Implement the `/extract-unstructured` endpoint in [ocr_server.py](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/python/ocr_server.py) utilizing Gemini API prompts.

### Phase 1c: Laravel Integration & Vue Ingestion Modal
*   **Tier Check Middleware:** Add Route middleware (`CheckCompanyTier`) blocking unstructured APIs on Tier 1 (Viper Core) companies.
*   **ProcessPdfOcrJob.php Routing:** Add tier-based extraction branching and log actual input/output token cost in `llm_usage_logs`.
*   **Vue Workspace dropzone:** Mount the file dropzone in the workspace drawer for uploading unstructured invoices and packing lists.
*   **Admin UI Tab:** Create a new Vue component in the F16s Admin Portal dedicated to tracking client AWBs.
*   **Filtering & Export:** Implement server-side filtering by date range and add an "Export" functionality to extract the AWB logs to CSV/Excel.

---

## 📧 Phase 2: Unified Gmail & Outlook Sync
*Goal: Securely connect user mailboxes, pull email threads, filter airline alerts, and display a fast, threaded communication dashboard.*

### 2.1 Database & OAuth Schema
*   Create `mailbox_connections` table to store `provider` (`gmail`, `outlook`), `email_address`, `access_token`, `refresh_token`, and token expiry dates.
*   Enforce domain checks: during the OAuth connection flow for Tier 2 and Tier 3 companies, the backend validates that the connected email matches the `@` domain pattern of the company (`email_domain` field) to prevent connecting unauthorized/personal email IDs.
*   Create `inbound_emails` and `inbound_attachments` tables to serve as our local cache.
*   Define a unique `thread_key` linking back-and-forth messages into single readable conversations.

### 2.2 Background Polling Service
*   Build a scheduled job `php artisan mailboxes:poll` that runs every minute.
*   If provider is **Gmail**: Connect using the **Google API Client** (OAuth2 token refresh logic) and fetch the latest messages via `/users/me/messages`.
*   If provider is **Outlook**: Connect using **Microsoft Graph API** and fetch messages via `/me/mailFolders/inbox/messages`.
*   Normalize the response headers (from/to, subject, body, attachment links) and store them in the database.

### 2.3 The Airline Exclusion Engine
Before creating a "Pricing/Operations Job" from a parsed email, run it through the following rules:
1.  **Blocklist Filter:** Check if the sender's domain matches standard airline domains stored in the database.
2.  **Subject Keywords:** Run regex searches to filter out automated airline notices (e.g., status updates, booking logs, flight changes).
3.  **LLM Classifier (Fallback):** Run a cheap Gemini Flash check for ambiguous addresses: *"Is this email a freight rate query from a customer or an automated system log? Reply only with 'customer' or 'system'."* If it is a system log, archive it and bypass job creation.
    *   *LLM API Unavailability Fallback:* If the Gemini API rate limit is hit, or the service is otherwise offline, the thread is gracefully kept in the inbox queue as `unread` and marked `unclassified` for manual operator triage, ensuring no business emails are dropped.
    *   *Cost & Execution Logic:* This classification **only runs once on the first email** of a new thread. It does not run on subsequent replies. At approximately 100 tokens per check, running a lightweight model like Gemini Flash costs less than **$0.10 per 10,000 incoming threads**, making it practically free.
    *   *Backend Workflow & Real-Time Sync:* Once the AI returns a classification (`job`, `airline`, or `clearance`), the **Laravel Background Queue** immediately updates the database. If it's a `job`, it creates a new entry in the `jobs` table. If it's an `airline` or `clearance` log, it updates the thread category and flags it as archived. Laravel then broadcasts a **WebSocket event** (via Laravel Echo/Pusher). The **Vue.js frontend** listens for this event and instantly moves the email into the correct category dropdown or Kanban column in real-time, without requiring the user to refresh the page.

### 2.4 Global Sidebar & Gmail-Inspired Workspace UI

To support global navigation and day-to-day operations, the layout is divided into a persistent app-level navigation sidebar and a contextual 3-column inbox workspace:

*   **Global Sidebar Navigation Panel (App-Level):**
    *   *Purpose:* The leftmost persistent sidebar of the F16s OS, allowing users to switch between major app modules:
        *   `[Mail/Inbox]` (Icon: `mailbox` - routes to `JobInbox.vue` 3-column workspace)
        *   `[Kanban Board]` (Icon: `kanban` - routes to the execution/schedule Kanban board)
        *   `[Focus Air]` (Icon: `file-earmark-text` - Standalone Master AWB generation)
        *   `[House Waybill]` (Icon: `file-earmark` - Standalone House AWB generation)
        *   `[Financials]` (Icon: `cash` - routes to ledger, reconciliation, and reports; hidden on Viper Core tier)
        *   `[Settings]` (Icon: `gear` - Mailbox OAuth connections and templates configurations)
*   **Gmail-Inspired Workspace UI (Contextual 3-Column Layout inside Mail/Inbox):**
    *   **Column 1 (Inbox Folders):** Folder navigation (`Inbox`, `Assigned`, `Unassigned`, `Processing`, `Awaiting Client`, `Completed`).
    *   **Column 2 (Thread Feed):** Chronological email feed showing customer names, subject lines, timestamps, and color-coded SLA alerts.
    *   **Column 3 (Conversation Feed):** Timeline displaying detailed email messages, collapsed history accordions, attachment chips, and the quick-reply editor.

---

### 2.5 Quick Replies
*   When a user clicks `[Send Reply]` in the conversation window, hit `POST /api/jobs/{id}/reply`.
*   The backend performs an explicit Policy authorization check (`$this->authorize('reply', $job)`) to verify that the authenticated operator owns or is authorized to send from the mailbox connected to that job thread.
*   Once authorized, the backend retrieves the credentials for that mailbox connection, compiles the HTML content, and uses the respective API (Gmail API or Graph API) to send the mail as a reply to the original thread.

---

### 2.6 Vue 2 Frontend Drawer Workspace & Split-Pane Column Hiding

To prevent screen clutter on standard monitors when editing documents, the interface employs a **Responsive Column-Collapse Strategy** when loading the slide-out drawer workspace:

*   **Split Window Toggle Button:** In the top-right header of the workspace/inbox, place a dedicated "split window" icon button.
*   **Slide-Out Drawer Container:** Clicking this button toggles open a right-side drawer panel.
*   **Responsive Column Hiding Logic:**
    *   When the drawer opens:
        *   The leftmost **Global Sidebar Navigation Panel** collapses into a compact, icon-only mini-sidebar (60px width) so users can still switch app routes.
        *   **Column 1 (Inbox Folders)** and **Column 2 (Thread Feed)** slide completely off-screen to the left.
        *   **Column 3 (Conversation Feed)** expands to occupy exactly **50% of the screen width** (Left Panel).
        *   The **Drawer Workspace Panel** slides in to occupy the other **50% of the screen width** (Right Panel).
    *   This provides a clean, side-by-side context view for data auditing without layout distortion or horizontal scrolling. Closing the drawer slides Columns 1 & 2 back out and expands the Global Sidebar to its full width.
*   **Initial Upload Dropzone Tab:** Upon opening the drawer, the default view is a File Upload Dropzone. Here, operators can drag and drop PDF attachments from the email thread (or their local machine) or click the dropzone to select files from their computer.
*   **Top Navigation Tab Bar:** At the top of the drawer (styled like a mobile app header/sidebar navigation bar), render tab selectors/menu options. Operators can click these options to switch views inside the drawer between:
    *   **Focus Air** (FocusAir.vue draft verification form)
    *   **House Waybill** (HouseWayBill.vue draft verification form)
    *   **Job Cost Sheet** (JobCostSheet.vue - to edit buy/sell rates, DO charges, cartage, and doc fees directly side-by-side with the email timeline).
    *   **Search** (Global search tab within the drawer to look up AWBs/Jobs)
    *   *Other document tools/forms*
*   **Actionable Embedded Form:** Selecting "Focus Air" or "House Waybill" loads the corresponding Vue forms inside the drawer. In this view, operators can review/edit data side-by-side with the email timeline and have full access to:
    *   **`[Save Draft]`**: Saves the record as a draft database entry to persist current changes.
    *   **`[Generate PDF]`**: Triggers the compilation and final generation of the Air Waybill document directly from the drawer workspace.
*   **Verification & Tally:** The loaded form is pre-populated with the extracted AI JSON values. Validation warnings (like unrecognized airport codes) are highlighted in orange inline.

---

## 🗂️ Phase 3: Operations & Pricing Workflows
*Goal: Turn email threads into trackable jobs, build work distribution interfaces, and track staff performance.*

### 3.0 Job Lifecycle & Transition Flow
1.  **Enquiry State (Inbound Email Triage):**
    *   **Unclassified Intake Queue:** New incoming emails sit in the `Unassigned / Inbox` queue as unclassified threads. The system does **not** automatically create an operational Job or card on the Kanban board.
    *   **Triage Dropdown (Top-Right):** In the top-right header of the email thread reader, a classification dropdown selector is displayed. The user must manually select a category:
        *   **`[Job / Enquiry]`**: Automatically instantiates a new Job record, determines the active transport mode, generates a sequential, unique Enquiry Number scoped to that mode (`ENQA-26-0001` for Focus Air or `ENQS-26-0001` for Focus Sea), and places it on the Kanban board.
        *   **`[Link to Existing Job]`**: Opens a search selector to merge the email thread directly into an active, existing Job ID (matching by enquiry number or execution job number).
        *   **`[Airline Mail]`**: Classifies it as system or carrier logs/notifications, bypassing job creation.
        *   **`[Escalation Mail]`**: Highlights the message as an escalation, triggering alerts for supervisor attention.
        *   **`[Clearance Mail]`**: Categorizes it as a customs clearance instruction.
2.  **Confirmed Shipment State (Execution):**
    *   **Top-Right Trigger:** Once the rate is approved, the operator clicks the **`[Confirm Shipment]`** button located in the **top-right header** of the thread workspace (leaving the bottom of the email timeline free for standard `[Reply]` / `[Reply All]` buttons).
    *   **Assign Task Popover:** This trigger opens a compact floating popover dialog directly below the button (avoiding a full side panel since only 3 inputs are required). The popover prompts the operator to configure:
        *   **AWB Number:** The allocated Air Waybill identifier (for Air) or Bill of Lading identifier (for Sea).
        *   **Assign Operator:** Selected staff member (displaying active workloads to prevent overload).
        *   **Planned Clearance Date:** A calendar selector to set the targeted date on which the shipment/customs clearance is planned to be completed, ensuring the assigned task is cleared on schedule.
    *   **Action Confirmation:** The operator clicks **`[Assign Task]`** inside the popover. The backend processes the confirmation, **auto-generates the Execution Job Number** scoped by transport mode (`JOBA-26-0001` for Focus Air or `JOBS-26-0001` for Focus Sea), links the AWB/MBL number, sets the operator and clearance date, and commits the transaction.
    *   **Workflow Progression:** Saving this task automatically transitions the job card on the Kanban board to the execution phase (`Processing`), launching the cargo milestone tracking. This allows operators to easily map records (e.g. `JOBA-26-0001` corresponds directly to `AWB-26-0001`, and `JOBS-26-0001` corresponds directly to `MBL-26-0001`).
    *   **Detailed Processing Stages (AWB Job Tracking):** The associated Job number dynamically tracks the exact stage of the document extraction and generation pipeline, leveraging your existing database schemas to avoid redundant tables:
        1.  **`[Intake]` (Pending Setup):** Email is classified as a new Job/Enquiry, but no PDFs have been uploaded yet (Job created, no linked AWB or PDF job).
        2.  **`[AI Extraction]` (OCR Parsing):** A PDF is uploaded and is currently being processed by the FastAPI OCR queue worker (Maps to `pdf_processing_jobs.status = 'processing'`).
        3.  **`[Verification]` (Draft Stage):** AI extraction is complete. The structured draft JSON payload is saved and awaits verification (Maps to `pdf_processing_jobs.status = 'completed'` and `pdf_processing_jobs.draft_payload` stored).
        4.  **`[Generation]` (Ready to Print):** The operator has reviewed, verified, and saved the draft (Maps to `air_way_bills.status = 'draft'` or `house_way_bills.status = 'draft'`).
        5.  **`[PDF Generated]`:** The PDF document is officially compiled and generated.
        6.  **`[Sent to Airline]`:** The compiled AWB/draft has been transmitted to the carrier/airline via EDI/XML or email.
        7.  **`[Airline Confirmed]`:** The carrier/airline has officially confirmed booking space/flight details for the AWB.
        8.  **`[Completed]` (Dispatched):** Shipment finalized and dispatched to carrier (Shipment executed state / cargo departure).
        9.  **`[Lost]` (Cancelled/Dropped):** The enquiry was marked as lost before confirmation/execution, recording the explicit reason (rates, delay, client, space, etc.).
3.  **Lost Enquiry State & Drop-off Reason Capture:**
    *   **Top-Right Trigger:** If the enquiry fails to convert (e.g. client rejects quotes, does not reply, or rate is uncompetitive), the operator clicks the **`[Mark as Lost]`** button next to `[Confirm Shipment]` in the workspace header.
    *   **Reason Selection Popover:** A compact popover requires selecting the primary reason for loss:
        *   `Rates High`: Quote rejected due to high pricing.
        *   `Delay in Response`: Enquiry was lost due to delayed response by internal staff.
        *   `Client Cancelled`: Client cancelled their shipping requirements entirely.
        *   `Space/Capacity Issue`: Unable to secure carrier/airline space.
        *   `Other`: Displays a text box to write a custom reason (saved to `lost_reason_custom`).
    *   **SLA & Transition Execution:** Submitting the form changes `jobs.status` to `Lost`, saves the reason codes, sets the `lost_at` timestamp, and halts all pending SLA timers for that thread. The card is removed from active Kanban workflow columns and placed into the "Lost/Archived" section for Boss Dashboard aggregations.
3.  **Role-Based Workspace Permissions:**
    *   **Pricing Staff View:** Pricing managers have dual capabilities. They see the **`[Confirm Shipment]`** trigger in the top-right header (which opens the compact floating popover to allocate AWB, assign task, and set the Planned Clearance Date) **and** have full access to the **`[Analyze PDF / Extract PDF]`** right sidebar drop zone. This allows pricing staff in smaller operations to act as operators and handle document parsing directly.
    *   **Operations (OPS) Staff View:** Operations staff have a restricted, action-oriented workspace:
        *   **Personalized Workload Queue:** Upon login, their dashboard automatically defaults to show only the jobs/AWB tasks assigned to their username, isolating their daily queue.
        *   **Click-to-Open Navigation:** Clicking any assigned card or task immediately opens the corresponding email thread workspace (revealing conversation history, attachments, and the PDF extraction zone).
        *   **PDF Generation Phase Auto-Detection:** The backend dynamically cross-checks the job's assigned `AWB Number` against AWB/HWB records saved as drafts via the Focus Air/House Waybill database. If a matching draft AWB number is found, the system concludes the task is in the **PDF Generation Phase**. It displays a prominent status badge (`[PDF Generation]`) on both the Kanban card and the email header, signaling that the data has been verified and the PDF draft is ready for final generation.
        *   **Restricted Panel Access:** The `[Confirm Shipment]` trigger and `[Assign Task]` popover are completely hidden. They **only** see the **`[Analyze PDF / Extract PDF]`** right sidebar drop zone to parse documents and save drafts.
        *   **OPS Workspace Visual Mockup:** Below is a visual representation of how the dashboard appears to an Operations staff member, showing the auto-detected `PDF Generation Phase` status badge and only the `Analyze PDF` workspace enabled on the right:
            ![Freight OS OPS Workspace Mockup](/Users/jomygeorge/.gemini/antigravity-ide/brain/a3b44097-17aa-4ad3-ad33-c4b8023da6b2/freight_os_ops_workspace_view_1781008648713.png)
*   **Job Transition Visual Mockup:** Below is a visual representation of the email thread workspace showing the auto-assigned Job ID in the top-right, the `Confirm Shipment` trigger, and the resulting compact floating popover allocation panel:
    ![Freight OS Job Transition Mockup](/Users/jomygeorge/.gemini/antigravity-ide/brain/a3b44097-17aa-4ad3-ad33-c4b8023da6b2/freight_os_popover_view_1780999571291.png)

### 3.1 Kanban Board (OPS View)
*   **Dual Kanban Workflow Toggle:** The dashboard provides a toggle to switch between two distinct Kanban board layouts:
    *   **Perspective A: Process View:** Standard operational columns (`[New]` ➔ `[Assigned]` ➔ `[Processing]` ➔ `[Awaiting Customer]` ➔ `[Completed]`).
    *   **Perspective B: Schedule View (Default OPS Home View):** Columns categorized dynamically based on the **Planned Clearance Date** set during task assignment:
        *   `[Overdue / Previous]` (🔴 Red: Target clearance date has passed and job is still pending).
        *   `[Today]` (🟡 Yellow/Orange: Target clearance date is the current day).
        *   `[Tomorrow]` (🔵 Blue: Target clearance date is tomorrow).
        *   `[Upcoming / Future]` (🟢 Green: Target clearance date is in the future).
*   **Card Anatomy & AWB Linking:** Each card displays the `Job ID`, the assigned `AWB Number` (if allocated), a **prominent status badge showing the current AWB processing stage** (e.g., `[Intake]`, `[Verification]`, `[PDF Generated]`, `[Completed]`), and customer metadata.
*   **Kanban Click Interactions:**
    *   **Clicking the AWB Number:** Slides open the cargo tracking drawer directly over the Kanban board, showing the live transport milestone feed (e.g., accepted, departed, cleared) without leaving the dashboard (see Section 3.2).
    *   **Clicking the Kanban Card (Body):** Navigates the operator to the **Job Workspace** (the 3-column email/timeline layout) for that specific job.
        *   Upon landing, the workspace header displays the active processing stage badge.
        *   The right panel drawer automatically slides open and loads the correct Vue view matching the stage (e.g., if the stage is `[Verification]`, the Focus Air draft form displays pre-populated; if the stage is `[PDF Generated]`, it renders the final compiled AWB PDF preview for review side-by-side with the email thread).
*   **Triple Filtering Controls:** Top controls allowing the pricing manager to:
    *   **Filter by Staff:** Isolate cards belonging to a specific operator (e.g., show only Ravi's cards).
    *   **Filter by Progress & Processed State:** Segment cards by active workflow columns or view fully **Processed / Finalized** jobs.
    *   **Filter by Date Range:** A calendar picker enabling date-specific searches, featuring a quick-action **`[Today]`** shortcut button that immediately restricts the board to only the current day's work.
*   **Staff Workload & Overload Prevention:** Show live workload count badges next to the staff filters. Highlight staff load states:
    *   `Ravi: 18 Jobs` (🔴 **Overloaded** — exceeds capacity cap of 15 jobs, visual warning to prevent new assignments).
    *   `Priya: 7 Jobs` (🟢 **Available** — under cap, safe for new job assignment).
*   **Filtered Staff Detail Widget:** When the board is filtered by a specific staff member, F16s displays a summary banner showing:
    *   **Active Jobs Count:** Number of jobs currently being drafted or processed.
    *   **Pending Jobs Count:** Number of jobs awaiting staff action or customer replies.
    *   **Idle Duration (Pending Age Tracker):** A list of all pending cards showing exactly how long they have been in a pending state (e.g. `Job #10234: Pending for 2h 15m`, `Job #10238: Pending for 45m`) so the pricing manager can immediately see who is stuck or lagging.
*   **Visual Board Mockup:** Below is a visual representation of the Kanban layout:
    *   **Viper Core Kanban Layout:**
        ![Freight OS Kanban Mockup](/Users/jomygeorge/.gemini/antigravity-ide/brain/a3b44097-17aa-4ad3-ad33-c4b8023da6b2/freight_os_kanban_view_1780996594858.png)
    *   **Active Cargo Tracking & Staff Load Filters View:**
        ![Freight OS Kanban Tracking Mockup](/Users/jomygeorge/.gemini/antigravity-ide/brain/a3b44097-17aa-4ad3-ad33-c4b8023da6b2/freight_os_kanban_tracking_view_1780996896520.png)
    *   **Operator Schedule Kanban View (Clearance-Date-Based):**
        ![Freight OS Schedule Kanban Mockup](/Users/jomygeorge/.gemini/antigravity-ide/brain/a3b44097-17aa-4ad3-ad33-c4b8023da6b2/freight_os_schedule_kanban_view_1781008780981.png)

### 3.2 Pricing / Triage Dashboard
*   **Job Assignment UI:** Give pricing managers a list of unassigned jobs. They can assign the job to an operations staff member with a single click, taking staff workload indicators (from Section 3.1) into account to prevent bottlenecking.
*   **Staff Load View:** Display a grid of all staff members detailing active jobs assigned to them, pending email replies, and SLA breaches.
*   **Click-to-Track AWB Drawer (Cargo Progress):** Clicking any AWB number on a job card slides open a tracking drawer. This shows a vertical milestone progress feed representing the shipment's physical progress, polled from carrier status entries:
    *   `[Cargo Accepted]` -> `[Manifested]` -> `[Departed]` -> `[Arrived at Destination]` -> `[Customs Cleared]` -> `[Out for Delivery]` -> `[Delivered]`
*   **AWB Milestone Filter Dashboard:** A dedicated dashboard filter view displaying all active shipments grouped by their current transport milestone. This allows pricing managers to see exactly where all cargo is globally and identify delayed shipments instantly (e.g. showing only AWBs flagged as "Customs Hold" or "Delayed").
*   **Real-Time Assignment Notifications:** Build a real-time notification trigger (using WebSockets/Laravel Echo or database-polling alerts). Any time a pricing manager assigns a new incoming email or operational job to an operations staff member, an immediate pop-up notification is pushed to the assignee's dashboard header and alert feed, ensuring instant operational awareness.
*   **Automated Overdue & SLA Alerts:** If any active job is left pending beyond its SLA reply limit or misses its designated **Planned Clearance Date** without completion, the system automatically triggers real-time alerts. These notifications are pushed directly to:
    *   The **assigned Operations (OPS) staff member** (warning them of backlog tasks requiring immediate clearance).
    *   The **respective Sales staff member** managing that customer account (allowing them to proactively coordinate with clients during operational delays).

---

## 📊 Phase 4: Executive Sales & Admin Dashboard
*Goal: Provide executive analytics, branch target monitoring, and AI business analysis.*

### 4.1 Aggregations & Status Reporting (DSR/MSR/YSR)
*   Create database views to aggregate metrics: Daily Status Report (DSR), Monthly Status Report (MSR), and Yearly Status Report (YSR).
*   **Enquiry Conversion Funnel Metrics:** The reporting database aggregates the following indicators:
    *   **Jobs Raised:** Total number of customer email inquiries triaged and assigned an Enquiry Number (count of non-null `enquiry_no`, grouped by transport mode).
    *   **Jobs Replied:** Total inquiries that received a draft proposal or reply email sent back to the client.
    *   **Pending / Delayed:** Enquiries currently awaiting operator action, highlighting those close to or beyond SLA response limits.
    *   **Jobs Converted:** Enquiries successfully transitioned to confirmed shipments (count of non-null `execution_job_no`, grouped by transport mode).
    *   **Conversion Rate %:** Automated conversion ratios calculated as:
        $$\text{Conversion Rate} = \frac{\text{Count of } \mathtt{execution\_job\_no}}{\text{Count of } \mathtt{enquiry\_no}} \times 100\%$$
        Calculated across daily, monthly, and yearly intervals, and partitioned separately for Focus Air and Focus Sea.

### 4.2 Sales Dashboard & AI Client Insights
*   **Sales Representative Visibility (Branch-Level):** Sales representatives have **branch-level** visibility across the operational workspace. They can view customer files, email threads, pricing queries, and dashboard metrics for all clients within the branch, ensuring seamless coverage and collaboration.
*   **Account Funnel Tracker:** Sales staff see the core funnel metrics (Jobs Raised, Replied, Pending/Delayed, Converted) at the branch level, allowing them to track overall branch targets and volume performance.
*   **On-Demand Client Summary:** A button on the customer page that calls the LLM with the customer's metrics: *"Summarize Customer X's activity over the last quarter."*
*   **Opportunity Engine:** Run a weekly scheduled task that analyzes customer lanes and outputs text cards: *"Client Y has shipped to Frankfurt 5 times this week. Consider offering a consolidated Europe tariff."*

### 4.3 Boss / Director Dashboard
*   **Company-Wide Audit Matrix:** The Boss has macro access to filter and compare these core metrics (Jobs Raised, Replied, Pending/Delayed, Converted) across the **entire organization**. They can aggregate metrics by:
    *   **Branch/Location:** Compare different office locations.
    *   **Individual Staff:** Audit response times, pending counts, and conversion success rates per operator to balance resources.
*   **Target Assigner:** Form fields allowing the administrator to assign quarterly sales targets (by revenue or tonnage) to branches or individual staff.
*   **AI Weekly Executive Brief:** A scheduled cron job that runs once a week. It gathers all operations and pricing metrics and compiles an executive summary highlighting system bottlenecks: *"Frankfurt lane grew by 18% this week. Pricing response times increased by 22% on average. 14 client queries remained unanswered beyond SLA."*

---

# 💰 Segment B: Automated Financials & Statement Reconciliation
*Goal: Build an independent accounting tracking framework that links sent Air Waybills (AWBs), imports, Delivery Orders (DOs), and local services with unique job numbers, reconciles bank statements via Plaid/Setu APIs (keeping other Indian and international alternative services), and runs privacy-masked AI cashflow analytics.*

### B.1 Accounts Database Schema & Isolation

To handle complex logistics transactions (where one operational job contains both receivables from clients and payables to vendors/carriers), we establish a dual-entry financial folder structure anchored by the parent `jobs` record.

#### 1. `accounts_invoices` — Canonical Schema (Receivables & Billing Documents):
*   *Purpose:* Unified table for all client-facing billing documents: **Invoices**, **Revenue Debit Notes**, **Revenue Credit Notes**, **Brokerage Invoices**, and **Consol Invoices**. Differentiated by the `type` discriminator column.
*   *Sequence Number Generation:* Each `type` maintains its own independent counter per `agent_id` and fiscal year:
    *   Invoice: `INV-26-0001`, Debit Note: `DN-26-0001`, Credit Note: `CN-26-0001`, Brokerage: `BRK-26-0001`, Consol: `CSINV-26-0001`.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation. **Required on all financial tables.**
    *   `transport_mode` (Enum: `'air'`, `'sea'`): Inherited from parent `jobs.transport_mode`.
    *   `type` (Enum: `'invoice'`, `'debit_note'`, `'credit_note'`, `'brokerage'`, `'consol_invoice'`): Discriminator column. Determines sequence prefix, validation rules, and ledger posting pattern.
    *   `invoice_no` (String, max 30, Unique per agent): Sequential formatted document number.
    *   `document_date` (Date): Issuance date. Validated against `accounting_periods` to block postings in closed months.
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade): Anchor link to the operational job.
    *   `client_id` (BigInteger, FK referencing `companies.id`): The entity ID being billed (debtor). Maps to customer, agent, or carrier.
    *   `billed_party_role` (String, max 20, default: `'client'`): Discriminates role of billed entity. Valid values: `'client'`, `'carrier'`, `'agent'`.
        *   *Semantic Rules:*
            *   `type = 'invoice'` → `billed_party_role = 'client'`
            *   `type = 'brokerage'` → `billed_party_role = 'carrier'` or `'agent'`
            *   `type = 'consol_invoice'` → `billed_party_role = 'agent'`
    *   `parent_invoice_id` (BigInteger, Nullable, FK referencing `accounts_invoices.id`): Self-referencing link used by Debit/Credit Notes to trace back to the original Invoice.
    *   `currency` (String, 3 chars): Active currency code (e.g. `USD`, `INR`, `EUR`).
    *   `exchange_rate` (Decimal(12,6), default: 1.000000): Conversion factor to base currency.
    *   `billing_address` (Text, Nullable): Snapshot of client billing address at issuance time.
    *   `tax_registration_no` (String, max 20, Nullable): GSTIN or VAT number of the billed party.
    *   `payment_terms` (String, max 20, Nullable): e.g., `'Net 30'`, `'COD'`. Defaults from `companies.default_payment_terms`.
    *   `subtotal` (Decimal(15,2)): Net total before tax.
    *   `tax_amount` (Decimal(15,2)): Total tax.
    *   `grand_total` (Decimal(15,2)): Total billing amount.
    *   `status` (Enum: `'draft'`, `'finalized'`, `'sent'`, `'paid'`, `'partially_paid'`, `'void'`): Billing lifecycle state.
    *   `is_posted` (Boolean, default: false): Whether double-entry ledger lines have been committed.
    *   `due_date` (Date)
    *   `created_by` (BigInteger, FK referencing `users.id`): Initiating user.
    *   `created_at`, `updated_at`, `deleted_at` (Timestamps) — Uses Laravel `SoftDeletes`.
*   *Note:* Brokerage-specific and consolidation-specific billing columns are decoupled from the main invoice table into dedicated 1-to-1 extension tables to ensure database normalization and avoid sparse NULLs on high volume transactions:

#### 1a. `accounts_invoice_brokerage_details` (New):
*   *Purpose:* Extension table to hold carrier/agent brokerage details.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `invoice_id` (BigInteger, FK referencing `accounts_invoices.id` on delete cascade, Unique)
    *   `brokerage_basis` (Enum: `'percentage_of_freight'`, `'flat_rate'`, `'per_kg'`, `'per_container'`)
    *   `commission_rate` (Decimal(8,4)): Percentage or unit rate.
    *   `base_freight_cost` (Decimal(15,2)): The freight amount the commission is computed against.
    *   `created_at`, `updated_at` (Timestamps)

#### 1b. `accounts_invoice_consol_details` (New):
*   *Purpose:* Extension table to hold consolidation profit sharing details.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `invoice_id` (BigInteger, FK referencing `accounts_invoices.id` on delete cascade, Unique)
    *   `profit_share_ratio` (Decimal(5,2)): Percentage share for the agent in a co-loaded consolidation.
    *   `partner_agent_id` (BigInteger, FK referencing `companies.id`): The counterpart co-loading agent.
    *   `created_at`, `updated_at` (Timestamps)

#### 2. `accounts_invoice_items` (Invoice Line Items — Sell Rates):
*   *Purpose:* Details individual service, freight, and administrative charges billed to the client.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `invoice_id` (BigInteger, FK referencing `accounts_invoices.id` on delete cascade)
    *   `house_job_id` (BigInteger, Nullable, FK referencing `jobs.id`): Links line items to specific House shipments within a Consol Invoice.
    *   `charge_type` (Enum): Categorizes the charge. Supported values:
        *   `air_freight`: Freight rate based on chargeable weight from AWB.
        *   `ocean_freight`: Freight rate based on container size or CBM.
        *   `delivery_order_fee`: Flat fee issued on import arrivals for cargo release.
        *   `customs_clearance`: Charges for customs filings, duty handling, or broker fees.
        *   `cartage`: Cartage, container drayage, and local trucking charges.
        *   `terminal_handling`: Port/airport loading and ground handling charges (THC).
        *   `storage_demurrage`: Warehouse rent charged for delayed pickups.
        *   `documentation`: Fees for issuing AWB, HAWB, or certificates of origin.
        *   `miscellaneous`: Strap/seal charges, fuel surcharges, or miscellaneous handling.
    *   `hsn_sac_code` (String, max 10, Nullable): HSN/SAC code for Indian GST compliance.
    *   `description` (Text): Custom billing line narration.
    *   `charge_basis` (Enum: `'per_container'`, `'per_cbm'`, `'per_bl'`, `'flat_rate'`, `'per_weight_ton'`, Nullable): Unit of measurement for the charge.
    *   `quantity` (Decimal(10,3)): Chargeable weight (from AWB/HAWB) or number of units.
    *   `rate` (Decimal(15,4)): The unit price or **Sell Rate** billed to the client.
    *   `amount` (Decimal(15,2)): Total billing amount for this line (Quantity × Rate).
    *   `tax_percentage` (Decimal(5,2))
    *   `tax_amount` (Decimal(15,2)): Computed tax for this line item.
    *   `net_amount` (Decimal(15,2)): Amount + Tax.

#### 3. `accounts_purchase_vouchers` (Payables — Vendor/Carrier Bills):
*   *Purpose:* Tracks costs incurred for vendor services (co-loaders, airlines, custom brokers, trucking companies).
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation.
    *   `transport_mode` (Enum: `'air'`, `'sea'`): Inherited from parent `jobs.transport_mode`.
    *   `voucher_no` (String, max 30, Unique per agent): Internal voucher tracker (e.g. `PV-2026-0001`).
    *   `document_date` (Date): Validated against `accounting_periods`.
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade)
    *   `vendor_id` (BigInteger, FK referencing `companies.id`): The vendor being paid.
    *   `currency` (String, 3 chars): Currency code.
    *   `exchange_rate` (Decimal(12,6), default: 1.000000): Conversion factor.
    *   `subtotal` (Decimal(15,2)): Net total before tax.
    *   `tax_amount` (Decimal(15,2)): Total tax.
    *   `total_amount` (Decimal(15,2)): Invoice total billed by vendor.
    *   `status` (Enum: `'unpaid'`, `'paid'`, `'partially_paid'`, `'void'`): Payment status.
    *   `is_posted` (Boolean, default: false): Whether ledger lines are committed.
    *   `due_date` (Date)
    *   `created_by` (BigInteger, FK referencing `users.id`)
    *   `created_at`, `updated_at`, `deleted_at` (Timestamps) — Uses Laravel `SoftDeletes`.

#### 4. `accounts_purchase_items` (Voucher Line Items — Buy Rates):
*   *Purpose:* Breaks down details of vendor/carrier cost charges representing our cost of sales.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `purchase_voucher_id` (BigInteger, FK referencing `accounts_purchase_vouchers.id` on delete cascade)
    *   `house_job_id` (BigInteger, Nullable, FK referencing `jobs.id`): Links cost items to specific House shipments.
    *   `charge_type` (Enum): Matches the categories listed in `accounts_invoice_items`.
    *   `hsn_sac_code` (String, max 10, Nullable): HSN/SAC code for GST.
    *   `description` (Text): Detail narration.
    *   `quantity` (Decimal(10,3)): Chargeable weight or unit count.
    *   `rate` (Decimal(15,4)): The cost price or **Buy Rate**.
    *   `amount` (Decimal(15,2)): Total cost for this line (Quantity × Rate).
    *   `tax_percentage` (Decimal(5,2))
    *   `tax_amount` (Decimal(15,2))
    *   `net_amount` (Decimal(15,2))

#### 5. `accounts_ledger_entries` (General Ledger — Double-Entry Bookkeeping):
*   *Purpose:* General ledger record for all debit/credit postings triggered by invoice/voucher finalization or payments.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation.
    *   `posting_date` (Date): Validated against `accounting_periods.status = 'open'`.
    *   `reference` (String, max 30): Source document number (e.g. `INV-2026-0001`, `PV-2026-0001`, `PAY-501`).
    *   `reference_type` (String, max 30): Laravel morph type (e.g., `'Invoice'`, `'PurchaseVoucher'`, `'Payment'`).
    *   `reference_id` (BigInteger): FK to the source document ID.
    *   `account_code` (String, max 30, FK referencing `chart_of_accounts.account_code`): Validated against the chart of accounts master.
    *   `debit` (Decimal(15,2), default: 0.00)
    *   `credit` (Decimal(15,2), default: 0.00)
    *   `narration` (Text)
    *   `created_at`, `updated_at` (Timestamps)

#### 6. `accounts_cass_statements` (Airline IATA CASS Billing Data):
*   *Purpose:* Stores uploaded billing statements sent by IATA CASS (Cargo Accounts Settlement System) to reconcile airline freight charges.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation.
    *   `airline_id` (BigInteger, FK to `airlines.id`): The billing airline.
    *   `awb_number` (String, Index): The Air Waybill number referenced in the CASS statement.
    *   `billing_period` (String): Billing cycle identifier (e.g., `2026-06-W2`).
    *   `cass_gross_weight` (Decimal): Chargeable/gross weight reported by the airline.
    *   `cass_rate` (Decimal): Rate per kg billed by the airline.
    *   `cass_freight_charges` (Decimal): Total freight charge.
    *   `cass_other_charges` (Decimal): Tax, fuel, and security surcharges reported by the airline.
    *   `grand_total` (Decimal): Total amount billed.
    *   `reconciliation_status` (Enum): Match state (`unmatched`, `matched`, `rate_mismatch`, `weight_mismatch`).
    *   `matched_voucher_id` (BigInteger, Nullable, FK to `accounts_purchase_vouchers.id` on delete set null): References the matched expense voucher.
    *   `created_at`, `updated_at` (Timestamps)

#### 7. `invoice_sequences` (Tenant Billing Counters) (New):
*   *Purpose:* Manages safe, sequential billing numbers across different document types without concurrent lock contention or gap duplicates.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Tenant isolation.
    *   `type` (Enum: `'invoice'`, `'debit_note'`, `'credit_note'`, `'brokerage'`, `'consol_invoice'`): Invoice discriminator category.
    *   `fiscal_year` (String, max 10): e.g., `'2026'`, `'26-27'`.
    *   `counter` (Integer, default: 0): The active sequence counter.
    *   `created_at`, `updated_at` (Timestamps)
*   *Unique Index:* `(agent_id, type, fiscal_year)` to optimize locking lookups and prevent duplicate sequence files.

#### 8. `bank_transactions` (Ingested Statements Tracker) (New):
*   *Purpose:* Holds bank account transaction records imported via Plaid API, driving the automated payment matching and reconciliation engine.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Tenant isolation.
    *   `plaid_transaction_id` (String, Unique): The unique reference string returned by Plaid.
    *   `plaid_account_id` (String, Index): Token matching back to the connected bank account profile.
    *   `transaction_date` (Date, Index): Value posting date.
    *   `amount` (Decimal(15,2)): Currency volume (positive for deposits, negative for payouts).
    *   `currency` (String, 3 chars): e.g., `'INR'`, `'USD'`.
    *   `payee_name` (String): Raw billing text parsed from transaction statement.
    *   `reconciliation_status` (Enum: `'unreconciled'`, `'matched'`, `'disputed'`, `'ignored'`, default: `'unreconciled'`)
    *   `matched_invoice_id` (BigInteger, Nullable, FK to `accounts_invoices.id` on delete set null): Links deposit receipts to receivables invoices.
    *   `matched_voucher_id` (BigInteger, Nullable, FK to `accounts_purchase_vouchers.id` on delete set null): Links payouts to payables carriers invoices.
    *   `created_at`, `updated_at` (Timestamps)

#### 9. Account-Level Isolation (Default):
*   Sales representatives can only view customer directories, invoicing sheets, transaction histories, payment alerts, and AI margin suggestions for clients they are directly assigned to. They have no visibility into other representatives' clients.

---

### B.2 Bank Statement Ingestion (Plaid / Setu APIs)
*   **Connector Integration:** Connects with Plaid (international) and Setu (Indian) read-only endpoints, keeping other Indian/international alternatives customizable.
*   **Polling Frequency:** Laravel scheduler command runs every 3 days, polling new statements and populating the `bank_statements` table:
    *   **`bank_statements` Table Columns:** `id`, `plaid_transaction_id` (unique, representing provider transaction ID), `booking_date`, `value_date`, `amount` (credit/debit), `sender_reference` (memo text), `status` (`unreconciled`, `reconciled`, `flagged`).

---

### B.3 Automated Payment Reconciliation (Tallying Matching Engine)
*   Build a rule-based Matching Engine in PHP to compare bank credits against pending invoice balances:
    *   **Level 1 matching (Direct):** Direct string regex searches for Job Number (e.g., `Job #10234`) or Air Waybill Number (e.g., `17612345678`) mentioned in the wire transfer memo.
    *   **Level 2 matching (Fuzzy/Amount):** Matches exact payment amounts combined with the client's name or code.
*   Successfully reconciled items update `accounts_invoices.status` to `paid`/`partially_paid`, write corresponding debit/credit records to `accounts_ledger_entries` (reducing receivables and increasing cash account), and flag the `bank_statement` transaction as `reconciled`.

---

### B.4 Privacy-Masked AI Analytics (Anonymization Engine)
*   **PII Masking Layer:** Replace real client names and identifiers with secure random placeholder tags (e.g., `Client_A`, `Client_B`) before preparing payment histories and transaction metrics for AI analysis.
*   **Trend Analysis:** Send the anonymized numerical trends (payment delays, volume changes, due cycles) to the Gemini/OpenAI API:
    *   *Example prompt:* `"Analyze the risk profile: Client_A has an average payment delay of 45 days, volume has decreased 15%. Client_B pays in 10 days, volume is up 20%."`
*   **Unmasking and Display:** The AI-generated risk suggestions are mapped back to the real customer names in the backend, and displayed securely in:
    *   **Respective Sales Dashboard:** Visual alerts showing payment due dates and follow-up recommendations at the branch level (restricted to assigned accounts if Account-Level Isolation is active).
    *   **Boss View:** Macro cash flow reports and overall AI client financial risk assessments.

---

### B.5 Financial Reports Engine (P&L, Balance Sheet, Trial Balance)

To support complete administrative oversight, the accounting system compiles double-entry ledger inputs inside `accounts_ledger_entries` into standard dynamic financial reports:

*   **Income Statement / Profit & Loss (P&L):**
    *   *Function:* Sums credits from revenue accounts (e.g. `4000-Freight-Revenue`, `4100-Import-DO-Fees`, `4200-Customs-Clearance`) and subtracts debits from cost/expense accounts (e.g. `5000-Freight-Cost`, `5100-Cartage-Expense`).
    *   *Filtering:* Direct filtering by Date Range, Branch (Agent ID), Customer (Company ID), or specific Job ID to measure individual shipment profitability.
*   **Balance Sheet:**
    *   *Function:* Dynamically calculates assets, liabilities, and equity:
        *   *Assets:* Plaid bank cash balances + Accounts Receivable balance (debits - credits on code `1200-AR`).
        *   *Liabilities:* Accounts Payable balance (credits - debits on code `2100-AP`).
        *   *Equity:* Reinvested earnings.
*   **Trial Balance:**
    *   *Function:* Compiles all accounts to ensure overall Debit and Credit entries balance before auditing.

---

### B.6 Import DO & Airline Cost Auto-Calculation Rules
 
To speed up operations and ensure billing accuracy, standard charges are auto-calculated from operations data:
 
*   **Import Delivery Order (DO) Rules:**
    *   When an import shipment is processed (Segment C.1) and the operator clicks the DO Release button, the system automatically inserts a `delivery_order_fee` line item under the job's invoice draft (`accounts_invoice_items`) based on preset agent tariffs.
*   **Airline Cost & CASS Pre-matching:**
    *   Upon AWB verification and draft generation (Phase 1/2), the system automatically compiles the expected airline cost voucher:
        $$\text{Estimated Purchase Cost} = (\text{AWB Chargeable Weight} \times \text{Airline Net Contract Rate}) + \text{Security Surcharge} + \text{Fuel Surcharge}$$
    *   This is saved in `accounts_purchase_vouchers` as `unpaid`. When the monthly IATA CASS statement is uploaded into `accounts_cass_statements`, the tallying engine compares the estimated voucher amount with the actual CASS charge. Any discrepancy in weight or rate flags the record as `weight_mismatch` or `rate_mismatch` for manager review.
 
---
 
### B.7 Decoupled Job Cost Sheet Workflow (Operational vs Financial Data)
 
To allow pricing managers and sales reps to adjust final buy/sell figures freely without corrupting IATA customs manifests, the platform enforces a **strict decoupling of operational documents from accounting invoice items**:
 
1.  **Data Isolation Rules:**
    *   **Operational Manifests:** `air_way_bills`, `house_way_bills`, and `delivery_orders` store the official cargo weights, dimensions, and carriers as parsed. Changing accounting rates does not modify these fields, keeping legal compliance clean.
    *   **Financial Cost Sheet:** `accounts_invoice_items` (sell side) and `accounts_purchase_items` (buy side) store the billing items.
2.  **Auto-Populated Intake:**
    *   As soon as a document is verified in Phase 1/2, a backend trigger spawns a **Draft Job Cost Sheet**.
    *   It copies initial values from the AWB (like Chargeable Weight into `quantity`) and suggests default tariff buy/sell rates.
3.  **Pricing/Sales Editing Pane:**
    *   The pricing manager or sales rep opens the **Job Cost Sheet UI** in the workspace.
    *   They can manually override any pre-populated fields (e.g. adjust the buy rate, increase the sell rate, add new local charges like cartage or documentation fees).
    *   These modifications update the cost sheet draft directly in the `accounts_` tables.
4.  **Finalization & Ledger Lock:**
    *   Once finalized by the pricing/sales agent, the cost sheet compiles into the final invoice/purchase voucher. This locks the billing data, preventing further edits, and posts the journal entry to the double-entry `accounts_ledger_entries` ledger.
 
---

### B.8 Logistics Invoicing, Reporting & Queue Specifications (Sea and Air)

To support full freight accounting operations, the system implements ten core billing document types, registers, and queues. These share operational metadata from the parent `jobs` record (differentiated by `transport_mode` as `'air'` or `'sea'`) but maintain distinct database schemas, validation rules, and double-entry ledger posting rules.

```mermaid
erDiagram
    JOBS ||--o{ ACCOUNTS_INVOICES : "has many"
    JOBS ||--o{ ACCOUNTS_PURCHASE_VOUCHERS : "has many"
    JOBS ||--o{ OPERATIONAL_COVER_LETTERS : "has many"
    COMPANIES ||--o{ ACCOUNTS_INVOICES : "billed as client"
    COMPANIES ||--o{ ACCOUNTS_PURCHASE_VOUCHERS : "paid as vendor"
    COMPANIES ||--o{ GST_LEDGER_ENTRIES : "party details"
    USERS ||--o{ ACCOUNTS_INVOICES : "created by"
    USERS ||--o{ OPERATIONAL_COVER_LETTERS : "prepared by"
    USERS ||--o{ APPROVED_DRAFTS_QUEUE : "approved by"

    ACCOUNTS_INVOICES ||--o{ ACCOUNTS_INVOICE_ITEMS : "contains"
    ACCOUNTS_INVOICES ||--|{ ACCOUNTS_LEDGER_ENTRIES : "generates reference"
    ACCOUNTS_INVOICES ||--o{ GST_LEDGER_ENTRIES : "polymorphic source"
    ACCOUNTS_INVOICES ||--o{ UNPOSTED_TRANSACTIONS_QUEUE : "polymorphic draft"
    ACCOUNTS_INVOICES ||--o{ APPROVED_DRAFTS_QUEUE : "polymorphic draft source"

    ACCOUNTS_PURCHASE_VOUCHERS ||--o{ ACCOUNTS_PURCHASE_ITEMS : "contains"
    ACCOUNTS_PURCHASE_VOUCHERS ||--|{ ACCOUNTS_LEDGER_ENTRIES : "generates reference"
    ACCOUNTS_PURCHASE_VOUCHERS ||--o{ GST_LEDGER_ENTRIES : "polymorphic source"
    ACCOUNTS_PURCHASE_VOUCHERS ||--o{ UNPOSTED_TRANSACTIONS_QUEUE : "polymorphic draft"
    ACCOUNTS_PURCHASE_VOUCHERS ||--o{ APPROVED_DRAFTS_QUEUE : "polymorphic draft source"

    ACCOUNTS_INVOICES }|--o| ACCOUNTS_INVOICES : "parent adjusting reference (Debit/Credit Notes)"
    ACCOUNTS_INVOICE_ITEMS ||--o| JOBS : "house_job_id (Consol splits)"
```

---

#### 1. Customer Invoice (Standard Invoice)

*   **Purpose:** Primary billing document issued to the Shipper, Consignee, or Third-Party Client for freight services and local charges (THC, cartage, customs clearance).
*   **Database Mapping:** Stored in the canonical `accounts_invoices` table (defined in [Section B.1](#1-accounts_invoices--canonical-schema-receivables--billing-documents)) with `type = 'invoice'`. Line items are stored in `accounts_invoice_items` with `charge_type` values matching standard operational sales (e.g. `'air_freight'`, `'ocean_freight'`, etc.).
*   **Eloquent Relationships:**
    *   `Invoice` belongsTo `Job` via `job_id`
    *   `Invoice` belongsTo `Company` as `client` via `client_id`
    *   `Invoice` belongsTo `User` as `creator` via `created_by`
    *   `Invoice` hasMany `InvoiceItem` via `invoice_id`
    *   `Invoice` hasMany `LedgerEntry` (polymorphic tracking) via `invoice_no` matching `ledger_entries.reference`
*   **Validation Rules:**
    *   `document_date` is required and must be a valid open date in `accounting_periods`.
    *   `due_date` must be greater than or equal to `document_date`.
    *   `client_id` must reference a company where `role` matches `'client'` or has active credit status.
    *   `job_id` is required for standard operational invoicing.
    *   Each line item must have a valid `charge_type`, `hsn_sac_code`, and positive `rate` / `quantity`.
*   **General Ledger Postings (On Finalization):**
    *   *Debit:* Accounts Receivable (`1200-AR`) for `grand_total` in base currency.
    *   *Credit:* Respective Revenue Account (e.g., `4000-Freight-Revenue`, `4200-Customs-Clearance-Revenue`) for line items' aggregated base `amount` values.
    *   *Credit:* GST Output Liability Account (`2200-GST-Output`) for total `tax_amount`.

#### 2. Revenue Debit Note

*   **Purpose:** Issued to raise additional billing charges to a client *after* the primary invoice has been finalized/sent (e.g., for unexpected demurrage, weight corrections, or customs examination fees).
*   **Database Mapping:** Stored in `accounts_invoices` where `type = 'debit_note'`. Uses columns `parent_invoice_id` (linking to the original invoice) and `debit_reason` (String, max 100, explaining the charge correction).
*   **Eloquent Relationships:**
    *   `DebitNote` belongsTo `Invoice` as `parentInvoice` via `parent_invoice_id`
    *   `DebitNote` belongsTo `Company` as `client` via `client_id` (auto-locked to match `parentInvoice.client_id`)
    *   `DebitNote` belongsTo `Job` via `job_id` (auto-locked to match `parentInvoice.job_id`)
    *   `DebitNote` hasMany `InvoiceItem` via `invoice_id`
*   **Validation Rules:**
    *   `parent_invoice_id` is required and the target invoice status must be `finalized` or `sent`.
    *   `debit_reason` is required.
    *   Items must contain positive amounts representing additional billed charges.
*   **General Ledger Postings (On Finalization):**
    *   *Debit:* Accounts Receivable (`1200-AR`) for debit note `grand_total`.
    *   *Credit:* Respective Revenue Account (e.g., `4500-Storage-Demurrage-Revenue`, `4000-Freight-Revenue`) for line items' net `amount`.
    *   *Credit:* GST Output Liability Account (`2200-GST-Output`) for `tax_amount`.

#### 3. Revenue Credit Note

*   **Purpose:** Issued to reduce or write off charges already billed to a client (e.g., due to rate disputes, invoicing errors, or service goodwill).
*   **Database Mapping:** Stored in `accounts_invoices` where `type = 'credit_note'`. Uses `parent_invoice_id` and `credit_reason` (String, max 100).
*   **Eloquent Relationships:**
    *   `CreditNote` belongsTo `Invoice` as `parentInvoice` via `parent_invoice_id`
    *   `CreditNote` belongsTo `Company` as `client` via `client_id` (auto-locked to `parentInvoice.client_id`)
    *   `CreditNote` hasMany `InvoiceItem` via `invoice_id`
*   **Validation Rules:**
    *   `parent_invoice_id` is required and must reference a finalized invoice.
    *   `credit_reason` is required.
    *   Total Credit Note `grand_total` cannot exceed: `parent_invoice.grand_total - sum(previous_credit_notes_against_invoice.grand_total)`.
*   **General Ledger Postings (On Finalization):**
    *   *Debit:* Sales Returns / Revenue Adjustments (`4900-Sales-Adjustments`) for credit `subtotal`.
    *   *Debit:* GST Output Liability Account (`2200-GST-Output`) for credit `tax_amount`.
    *   *Credit:* Accounts Receivable (`1200-AR`) for `grand_total` (reducing customer receivables ledger balance).

#### 4. Brokerage Invoice

*   **Purpose:** Billed to carriers (shipping lines or airlines) or overseas agents to collect sales commission, booking brokerage, or handling commissions.
*   **Database Mapping:** Stored in `accounts_invoices` where `type = 'brokerage'`. Relational data is linked 1-to-1 in `accounts_invoice_brokerage_details` storing `brokerage_basis`, `commission_rate`, and `base_freight_cost`.
*   **Eloquent Relationships:**
    *   `BrokerageInvoice` belongsTo `Company` as `carrierAgent` via `client_id` (where the company's role is `'carrier'` or `'agent'`)
    *   `BrokerageInvoice` belongsTo `Job` via `job_id` (links to the master operational carrier booking)
    *   `BrokerageInvoice` hasOne `AccountsInvoiceBrokerageDetail` as `brokerageDetails` via `invoice_id`
    *   `BrokerageInvoice` hasMany `InvoiceItem` via `invoice_id`
*   **Validation Rules:**
    *   `client_id` (representing the carrier/agent debtor) is required and must reference a company where `role` matches `'carrier'` or `'agent'`.
    *   `brokerageDetails.brokerage_basis` and `brokerageDetails.commission_rate` are required.
    *   `job_id` must represent a valid operational shipment containing a carrier.
*   **General Ledger Postings (On Finalization):**
    *   *Debit:* Accounts Receivable - Commission Accrued (`1210-Commission-Receivable`) for brokerage `grand_total`.
    *   *Credit:* Brokerage Commission Revenue (`4800-Commission-Revenue`) for `subtotal`.
    *   *Credit:* GST Output Liability Account (`2200-GST-Output`) for `tax_amount`.

#### 5. Consol Invoice

*   **Purpose:** Issued to an overseas agent, co-loader, or counterpart office to settle charges, local handling splits, and profit shares across *multiple* House shipments (HBLs/HAWBs) bundled under a single Consol Job.
*   **Database Mapping:** Stored in `accounts_invoices` where `type = 'consol_invoice'`. Relational profit sharing parameters are stored in `accounts_invoice_consol_details` mapping `profit_share_ratio` and `partner_agent_id` (linked to `accounts_invoices.id`).
*   **Eloquent Relationships:**
    *   `ConsolInvoice` belongsTo `Company` as `agent` via `client_id` (where role is `'agent'`)
    *   `ConsolInvoice` belongsTo `Job` via `job_id` (must reference a Master Job where `is_consolidation = true`)
    *   `ConsolInvoice` hasOne `AccountsInvoiceConsolDetail` as `consolDetails` via `invoice_id`
    *   `ConsolInvoice` hasMany `InvoiceItem` via `invoice_id`
    *   `InvoiceItem` belongsTo `Job` as `houseJob` via `house_job_id` (maps charges to individual HAWBs/HBLs)
*   **Validation Rules:**
    *   `job_id` is required and must point to a master job card containing active child jobs.
    *   All invoice line items must declare a valid child `house_job_id` belonging to the consolidation container.
*   **General Ledger Postings (On Finalization):**
    *   *Debit:* Accounts Receivable - Agents (`1220-AR-Agents`) for `grand_total`.
    *   *Credit:* Consol Freight Revenue (`4050-Consol-Revenue`) for agent share of freight receivables.
    *   *Debit/Credit:* Agent Profit Share Expense (`5050-Agent-Profit-Share-Expense`) for profit split adjustment differences.
    *   *Credit:* GST Output Liability Account (`2200-GST-Output`) for `tax_amount` (if agent is domestic).

#### 6. GST Register (`gst_ledger_entries`)

*   **Purpose:** Standard report generating historical records of CGST, SGST, and IGST liabilities on all outbound client invoices, debit notes, and credit notes for Indian Customs (ICEGATE) and GSTR-1 tax compliance.
*   **Database Schema (`gst_ledger_entries`):**
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation.
    *   `voucher_id` (BigInteger, Index) — Polymorphic ID referencing standard invoice, debit/credit note, or purchase voucher.
    *   `voucher_type` (String, max 30) — `'Invoice'`, `'Debit Note'`, `'Credit Note'`, `'Purchase Voucher'`.
    *   `voucher_no` (String, max 30) — Source invoice or voucher document code.
    *   `voucher_date` (Date) — Transaction date.
    *   `company_id` (BigInteger, FK referencing `companies.id`, Index) — Transacted client or vendor.
    *   `company_name` (String) — Client/vendor billing name captured at time of posting.
    *   `company_gstin` (String, max 15) — 15-character GSTIN.
    *   `place_of_supply` (String, max 5) — Two-character state code prefix (e.g. `'33-TN'`).
    *   `hsn_sac_code` (String, max 8) — Standard tax code classification.
    *   `taxable_value` (Decimal(15,2)) — Base item value before tax.
    *   `cgst_rate` (Decimal(5,2)), `cgst_amount` (Decimal(15,2)) — Central Tax split.
    *   `sgst_rate` (Decimal(5,2)), `sgst_amount` (Decimal(15,2)) — State Tax split.
    *   `igst_rate` (Decimal(5,2)), `igst_amount` (Decimal(15,2)) — Integrated Tax split.
    *   `is_reverse_charge` (Boolean, default false) — Reverse charge flag.
    *   `total_value` (Decimal(15,2)) — Total gross transaction value.
    *   `created_at` (Timestamp)
*   **Eloquent Relationships:**
    *   `GstLedgerEntry` belongsTo `Company` via `company_id`
    *   `GstLedgerEntry` morphTo `voucher` via `voucher_id` and `voucher_type`
*   **Business Logic & GST Splits:**
    *   Entry is compiled dynamically and committed to the GST register whenever a parent invoice, debit note, credit note, or purchase voucher moves to finalized status.
    *   **Split Rule:** If the first two digits of `company_gstin` match our own company profile branch state GST code, CGST and SGST are applied (each at 50% of the total tax code rate). If the state code does not match, IGST is applied (100% of the tax code rate).

#### 7. UnPosted Transactions Queue

*   **Purpose:** A validation queue containing billing records that have been draft-saved or authorized but are not yet posted to the General Ledger. Ensures strict control over double-entry accounting integrity.
*   **Database Schema (`unposted_transactions_queue`):**
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation.
    *   `source_id` (BigInteger, Index) — Polymorphic ID to `accounts_invoices` or `accounts_purchase_vouchers`.
    *   `source_type` (String, max 30) — `'Invoice'`, `'Debit Note'`, `'Credit Note'`, `'Purchase Voucher'`.
    *   `source_no` (String, max 30) — Source invoice/voucher number.
    *   `document_date` (Date)
    *   `company_id` (BigInteger, FK referencing `companies.id`, Index) — Customer/Vendor party.
    *   `net_amount` (Decimal(15,2)) — Net total before tax.
    *   `tax_amount` (Decimal(15,2)) — Total tax.
    *   `grand_total` (Decimal(15,2)) — Total transaction value.
    *   `created_by` (BigInteger, FK referencing `users.id`) — Initiating user.
    *   `status` (Enum: `'draft'`, `'approved_draft'`, `'needs_revalidation'`) — Current queue state.
    *   `validation_errors` (JSON, Nullable) — Array of error flags blocking ledger integration (e.g. `{"fiscal_period": "closed", "currency": "exchange rate missing"}`).
    *   `created_at`, `updated_at` (Timestamps)
*   **Eloquent Relationships:**
    *   `UnpostedTransaction` belongsTo `Company` via `company_id`
    *   `UnpostedTransaction` belongsTo `User` as `creator` via `created_by`
    *   `UnpostedTransaction` morphTo `source` via `source_id` and `source_type`
*   **Workflow:**
    *   Creating a new billing document inserts a draft queue entry.
    *   Moving document status to approved updates queue to `'approved_draft'`.
    *   Executing **[Post Ledger]** triggers validation rules. If validation passes, double-entry lines are written to `accounts_ledger_entries`, and the queue record is deleted.

#### 8. Cover Letter (Operational Handover Form)

*   **Purpose:** Generates structured document transit packets containing physical shipping documents (AWBs, Manifests, Custom clear notes) forwarded to counterpart agents or brokers.
*   **Database Schema (`operational_cover_letters`):**
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation.
    *   `cover_letter_no` (String, Unique, Index, max 30) — Sequential ID (e.g. `CL-26-0001`).
    *   `date` (Date) — Issuance date.
    *   `recipient_company_id` (BigInteger, FK referencing `companies.id`, Index) — Target broker or agent.
    *   `recipient_address` (Text) — Shipping delivery address.
    *   `contact_person` (String, max 100) — Direct contact person.
    *   `subject` (String, max 255) — Subject line.
    *   `body_text` (Text) — Narration blocks.
    *   `job_id` (BigInteger, FK referencing `jobs.id`, Index) — Operational job card link.
    *   `checklist_items` (JSON) — Array of checkboxes for enclosed physical documents (e.g. `["Original MBL", "Packing List", "Import DO Copy"]`).
    *   `prepared_by` (BigInteger, FK referencing `users.id`) — Authoring operator.
    *   `created_at`, `updated_at` (Timestamps)
*   **Eloquent Relationships:**
    *   `CoverLetter` belongsTo `Job` via `job_id`
    *   `CoverLetter` belongsTo `Company` as `recipient` via `recipient_company_id`
    *   `CoverLetter` belongsTo `User` as `author` via `prepared_by`
*   **Business Integration:**
    *   Submitting a cover letter triggers a background worker that fetches the checked document PDF templates, grabs files from `job_documents` (E-Docket) associated with `job_id` (verifying that they belong to the same `agent_id` tenant to prevent cross-tenant data leakage), merges them, and emails the complete packet to the recipient contact.

#### 9. Approved Drafts Queue

*   **Purpose:** Temporary staging area holding verified OCR document extractions, draft waybills, and invoice calculations that have been audited and signed off by a supervisor but not yet finalized as printable PDFs.
*   **Database Schema (`approved_drafts_queue`):**
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level tenant isolation.
    *   `source_id` (BigInteger, Index) — Polymorphic FK to source drafts (`air_way_bills.id`, `house_way_bills.id`, `accounts_invoices.id`).
    *   `source_type` (String, max 30) — `'AWB'`, `'HAWB'`, `'Invoice'`, `'Purchase Voucher'`.
    *   `operational_ref` (String, max 50) — AWB serial number, invoice reference, etc.
    *   `job_id` (BigInteger, FK referencing `jobs.id`, Index) — Parent job link.
    *   `approved_by` (BigInteger, FK referencing `users.id`) — Supervisor ID.
    *   `approved_at` (Timestamp) — Date/Time of approval sign-off.
    *   `promotion_status` (Enum: `'pending_promotion'`, `'promoted'`, `'rejected'`) — Staging state.
    *   `rejection_reason` (Text, Nullable) — Reason for rejection.
    *   `created_at`, `updated_at` (Timestamps)
*   **Eloquent Relationships:**
    *   `ApprovedDraft` belongsTo `Job` via `job_id`
    *   `ApprovedDraft` belongsTo `User` as `approver` via `approved_by`
    *   `ApprovedDraft` morphTo `source` via `source_id` and `source_type`
*   **Workflow:**
    *   Once a supervisor approves a draft invoice or waybill, it moves to this queue.
    *   Promoting a draft freezes modifications, sets `is_approved = true` on the source document, generates the locked legal PDF, and pushes it to the ledger (for financials) or EDI gateways (for waybills).

#### 10. Unbilled Jobs (Billing Delay Queue)

*   **Purpose:** Financial tracking screen highlighting operational jobs that have reached execution milestones (e.g., vessel arrived, customs cleared) but have not had their client sales invoices generated.
*   **Database & Query Structure (Database View / CTE Query):**
    *   Queries `jobs` where `jobs.status` is completed or `clearance_date` is not null.
    *   Left-joins `accounts_invoices` on `jobs.id = accounts_invoices.job_id`.
    *   Filters where `accounts_invoices.id IS NULL` or where invoices exist only in `'draft'` / `'void'` status.
*   **Calculated Display Fields:**
    *   `job_id` (BigInteger) — Sourced from `jobs.id`.
    *   `execution_job_no` (String) — Job code.
    *   `transport_mode` (Enum: `'air'`, `'sea'`).
    *   `job_status` (String) — Current job workflow stage.
    *   `completed_date` (Timestamp) — Date when operational job card was closed.
    *   `client_id` (BigInteger) — Intended client debtor ID.
    *   `mbl_mawb_no` (String) — Master Waybill / BL identifier.
    *   `delay_days` (Integer) — Calculated as `DATEDIFF(now(), jobs.completed_at)`.
    *   `estimated_costs` (Decimal(15,2)) — Sum of all buy-rate items logged in `accounts_purchase_items` associated with `job_id`.
    *   `expected_revenue` (Decimal(15,2)) — Sum of expected sell rates estimated.
*   **Eloquent Relationships (on target Job Model):**
    *   `Job` hasMany `Invoice` via `job_id`
    *   `Job` belongsTo `Company` as `client` via `client_id`
*   **Business Rules:**
    *   If `delay_days` > 7, flags warning on the billing dashboard.
    *   Double-clicking an unbilled job opens the split-pane job cost sheet drawer to immediately finalize rates and trigger invoice generation.

---

---

# 🔮 Segment C: Future Expansion Modules (Later Stage)
*Goal: Allocate space for additional modular services that extend the platform's core freight capacities.*

### C.1 Air Import Documentation & Transmission

To support complete import operations alongside exports, we introduce the Air Import module under the active portal scope `'air'` with a new direction scope `direction = 'import'`. This module manages the cargo landing cycle, import documentation, and automated electronic messaging for airline and customs networks.

#### A. Database Schema & Migration Extensions
1.  **`jobs` & `pdf_processing_jobs` Extensions:**
    *   Add `direction` column (Enum: `'export'`, `'import'`, default: `'export'`).
2.  **`air_import_details` Table (New):**
    *   `id` (BigInteger, PK, Auto-increment)
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade)
    *   **Flight Arrival Info:**
      - `flight_number` (String, max 10)
      - `arrival_date` (Timestamp)
      - `carrier_prefix` (String, 3 chars)
      - `mawb_number` (String, 8 chars)
      - `handling_agent_id` (BigInteger, FK referencing `companies.id` / airline ground handlers)
      - `free_storage_days` (Integer, default: 2)
      - `storage_charges_start_date` (Date)
    *   **Customs Filing Info:**
      - `igm_number` (String, max 20) (Import General Manifest)
      - `igm_date` (Date)
      - `customs_filing_status` (Enum: `'not_filed'`, `'filed'`, `'cleared'`, `'rejected'`)
    *   **Cargo Release Info:**
      - `delivery_order_no` (String, Unique)
      - `delivery_order_date` (Timestamp)
      - `do_status` (Enum: `'hold'`, `'released'`, `'cargo_collected'`)
      - `do_release_fee` (Decimal(10,2), default: 0.00)

#### B. Document Workspace & Forms
When `direction === 'import'`, the workspace drawer swaps export AWB forms for import-focused Vue templates:
1.  **Air Import Manager Form (`FocusAirImport.vue`):**
    *   Pulls incoming MAWB data (origin airport, flight manifests, weight totals) via FastAPI OCR unstructured parsing from airline cargo flight plans.
    *   Validates airline prefix codes and UN/LOCODE airport codes.
2.  **Arrival Notice (AN) Generator:**
    *   Renders and exports a branded PDF notice containing flight arrival times, local storage grace periods, cargo terminal details, and estimated local release fees.
    *   Automates email distribution to the **Consignee** and their customs broker once the flight arrival is confirmed:
        `POST /api/import-shipments/{id}/send-arrival-notice`
3.  **Delivery Order (DO) Release Form:**
    *   Renders the legal DO document authorizing cargo release.
    *   Automatically calculates local warehouse handling and DO release charges, injecting line items into the decoupled invoice items (`accounts_invoice_items`) prior to document issuance.

#### C. Form Specification: Air Import Consol (`FocusAirImport.vue`)

Based on the layout and fields of the Air Import Consol form, below is the detailed specification of available fields, dropdown contents, tabbed navigation, field relationships/logic, and character limitations.

##### 1. Primary Form Fields & Dropdown Contents

Apart from the global header, the form is divided into entry fields, a tabbed navigation bar, and specific entity panels.

###### Top-Level & Entity Sub-Tab Fields Specification

| Field Name | Type | Options / Relationships / Rules | Character Limit | Database Target |
| --- | --- | --- | --- | --- |
| **Consol No** | Text Input / Auto-generated | System-generated unique identifier for the consolidation job. | Max 30 chars alphanumeric. | `jobs.execution_job_no` |
| **Date Field** | Date Picker | Defaults to current creation date. | `DD-MMM-YYYY` format. | `jobs.planned_clearance_date` |
| **Cargo Type** | Dropdown | Options: `Loose` (default), `ULD`, `(Blank)`. | Standard dropdown. | `jobs.cargo_type` |
| **Consol Owner** | Search Lookup | Predictive search to assign the managing user. | Max 50 chars. | `jobs.job_owner_id` (FK → `users.id`) |
| **Consol Type** | Dropdown | Options: `Agent Consolidation` (default), `Buyer's Consolidation`, `(Blank)`. | Standard dropdown. | `jobs.consol_type` |
| **Destination Agent** | Search Lookup | Auto-populated default destination handler. | Address block. | `job_entities` (role: `'dest_agent'`, FK → `companies.id` & `address`) |
| **Origin Agent** | Search Lookup | Selecting the loading port handler agent. | Address block. | `job_entities` (role: `'origin_agent'`, FK → `companies.id` & `address`) |
| **Selling Agent** | Search Lookup | Links the agent for commission and profit splits. | Address block. | `job_entities` (role: `'selling_agent'`, FK → `companies.id` & `address`) |

##### 2. Navigational Tab Architecture

The form utilizes a horizontal tab system to organize the lifecycle of the consolidation job. The available fields are split into these logical categories:

| Tab Name | Purpose / Expected Content |
| --- | --- |
| **Entity** | *Current View:* Identifies the key agents (Origin, Destination, Selling) handling the cargo. |
| **Shipping Details** | Flight numbers, Air Waybill (MAWB) details, ETAs, ETDs, and carrier info. |
| **Routing** | Transshipment points, airport codes, and multi-leg journey details. |
| **Attached House** | Association of individual House Air Waybills (HAWBs) bundled into this Consol. |
| **Packing Details** | Piece counts, gross weight, chargeable weight, and dimensions ($L \times W \times H$). |
| **DI** | Delivery Instructions or Delivery Order parameters. |
| **Charges** | Freight charges, local handling fees, and prepaid/collect splits. |
| **Financials** | Invoicing, cost allocation, profit share details, and multi-currency exchange rates. |
| **Customs** | IATA Cargo-XML status, EDI messaging filing, and customs clearance tracking. |
| **E-Docket** | Digital repository for uploading and viewing physical cargo documents. |

##### 3. Relationships & Logic Between Fields

In air freight forwarding workflows, these fields interact through a strict operational hierarchy:
*   **Consol Type vs. Entity Roles:** Choosing `Agent Consolidation` implies that an **Origin Agent** (at the loading airport) is consolidating multiple shipments to send to the **Destination Agent** (`KSR Freight Forwarders`). If it were changed to `Buyer's Consolidation`, the system logic would shift focus toward a single buyer acquiring goods from multiple suppliers.
*   **Cargo Type vs. Packing Details:** Selecting `Loose` cargo vs. `ULD` changes how the volumetric math is validated in the *Packing Details* tab. A `ULD` selection usually requires specific container tare weights and ULD numbers, whereas `Loose` requires individual box/pallet dimensions to calculate chargeable weight:
    $$\text{Chargeable Weight} = \max\left(\text{Gross Weight}, \frac{\text{Volume in } cm^3}{6000}\right)$$
*   **Destination Agent (Chennai) vs. EDI:** The designated Destination Agent dictates the specific EDI customs gateway (indicated by the **EDI** hyperlink below the Chennai address) where the electronic manifest and Cargo-XML data must be transmitted prior to the flight landing.
*   **Attached House Dependency:** This master "Consol" file acts as a parent record. You cannot finalize the *Financials* or *Charges* tabs accurately until multiple individual House Air Waybills are linked under the *Attached House* tab to split the master freight costs.

##### 4. Character Limitations & Schema Constraints

To determine the exact character limitations of the input fields on this form, standard industry software design and specific database schema constraints typically used by logistics platforms like MyLogisys apply:

###### Top-Level Header Fields
*   **Consol No:** **15 to 20 characters**
    *   *Context:* Usually auto-generated by the system using a prefix formula (e.g., `MIA-2606001`), but if editable, it is strictly capped to prevent layout breaking on printed manifests.
*   **Date Field:** **10 to 11 characters**
    *   *Context:* Strictly formatted via the calendar picker component to follow `DD-MMM-YYYY` (e.g., `12-Jun-2026`), rejecting any extra inputs.
*   **Consol Owner:** **50 to 100 characters**
    *   *Context:* A predictive search input linked to an internal employee database. The text box allows typing a full name, but the underlying system ID is what gets saved.

###### Entity Tab Search Fields (Origin, Destination, & Selling Agents)
These blocks consist of two distinct UI elements with different character behaviors:
*   **Agent Name / Search Box (Top Field with Lookup Glass):** **100 to 150 characters**
    *   *Context:* This field allows you to type out the official registered company name (e.g., `KSR FREIGHT FORWARDERS PVT. LTD- INDIA`). It is tied to a master entity database, meaning any free-text typed here must match an existing master record.
*   **Address Display Box (Large Multi-line Text Area):** **250 to 500 characters**
    *   *Context:* When an agent is selected, this box automatically populates with the branch's physical address, city, pin code, and country. In most logistics databases, this is split into 3 or 4 lines of `VARCHAR(50)` or a single `VARCHAR(250)` block to comply with international customs and airline EDI transmitting limits. Extra long addresses are typically truncated or forced to use abbreviations.

###### Operational Best Practice for Character Limits
> ⚠️ **IATA Systems Note:** Many background components in freight software pass data directly to standard IATA Cargo-XML or Cargo-IMP messages. These electronic formats enforce a legacy constraint of **35 characters per line** for company names and addresses. If you type or paste text longer than this without line breaks, the system will either truncate it automatically or trigger an EDI transmission error when you attempt to push the data to the *Customs* tab.

#### D. Form Specification: Delivery Order [Air]

Based on the interface provided for the **Delivery Order [Air]** module, below is a comprehensive breakdown of the fields, dropdowns, character limitations, and the relational logic across the **Entity**, **Shipment**, and **Payment** tabs.

##### 1. Entity Tab Details

This tab maps the key parties, logistics providers, and handling locations involved in the delivery process.

| Field Name | Type / Control | Character Limit (Est.) | Description / Relational Logic | Database Target |
| --- | --- | --- | --- | --- |
| **Consignee** | Search Lookup / Text Area | 250–500 chars | The ultimate receiver of the goods. Relates directly to the master **Customer/Client database**. | `job_entities` (role: `'consignee'`, FK → `companies.id` & `address`) |
| **Transporter** | Search Lookup / Text Area | 250–500 chars | The trucking/logistics company hired for final mileage. Relates to the **Vendor/Transporter master list**. | `job_entities` (role: `'transporter'`, FK → `companies.id` & `address`) |
| **High Sea Buyer** | Search Lookup / Text Area | 250–500 chars | Used if the shipment underwent a High Seas Sale prior to customs clearance. Relates to the **Customer master**. | `job_entities` (role: `'high_sea_buyer'`, FK → `companies.id` & `address`) |
| **Custom Broker** | Search Lookup / Text Area | 250–500 chars | The Customs House Agent (CHA) clearing the cargo. Relates to the **Vendor/Agent master list**. | `job_entities` (role: `'customs_broker'`, FK → `companies.id` & `address`) |
| **Pick Up** | Search Lookup / Text Area | 250–500 chars | Origin address where the cargo is collected (e.g., Airport Warehouse/CFS). Relates to **Warehouse/Port Location masters**. | `jobs.pickup_address` (Text, Nullable) |
| **Delivery Add.** | Free-text Area | 500 chars | Final physical address for delivery. Inherits data if a standard Consignee address is selected, but allows manual overriding. | `jobs.delivery_address` (Text, Nullable) |

##### 2. Shipment Tab Details

*(Note: While the exact visual sub-fields for this tab are hidden behind the active view, standard MyLogisys Air Import architecture populates the following fields upon entering a valid Shipment or Consol Number).*

*   **House Air Waybill (HAWB) Number**
    *   *Type:* Alpha-numeric Text Field (Read-only / Auto-populated)
    *   *Limit:* 15–20 characters.
*   **Master Air Waybill (MAWB) Number**
    *   *Type:* Alpha-numeric Text Field (Read-only / Auto-populated)
    *   *Limit:* 11 characters (Standard IATA format: `3-digit airline code` + `8-digit serial`).
*   **Flight Number & Date**
    *   *Type:* Alpha-numeric & Date Field
    *   *Limit:* 10 characters (Flight) / `DD-MMM-YYYY` (Date).
*   **Gross Weight / Chargeable Weight**
    *   *Type:* Numeric Decimal Field
    *   *Limit:* 10-12 digits (including 3 decimal places for precision).
*   **Packages / Commodity**
    *   *Type:* Numeric (integer) & Text Field
    *   *Limit:* 5 digits (Packages) / 100 characters (Commodity description).

##### 3. Payment Tab Details

This section manages financial clearance before the physical Delivery Order can be legally generated or printed.

*   **Payment Status / Mode**
    *   *Type:* Dropdown Menu
    *   *Options:* `Cash`, `Cheque`, `Bank Transfer/NEFT`, `Credit Account`, `Pending`.
*   **Invoice Number / Amount**
    *   *Type:* Alpha-numeric (Invoice) & Numeric Decimal (Amount)
    *   *Limit:* 20 characters (Invoice) / 15 digits (Amount).
*   **Receipt Number**
    *   *Type:* Alpha-numeric Text Field
    *   *Limit:* 20 characters.
*   **Credit Approval / Status**
    *   *Type:* Dropdown / Toggle
    *   *Relational Logic:* Tied to the **Consignee’s Credit Limit Profile** in the financial ledger. If credit is exceeded, the "Print DO" action remains locked until overridden by accounts.

##### 4. Relational Logic & Data Flow

The form operates on a strict relational hierarchy triggered by the core header selections:

```
[Shipment No / Consol No]  ---> Fetches ---> HAWB/MAWB, Weight, and Default Consignee
       │
       ├─> Links to [CAN Number] ---------> Validates Cargo Arrival Notice details
       │
       └─> Links to [Consignee Master] ----> Populates Entity Tab (Addresses/Brokers)
                 │
                 └─> Links to [Credit Master] -> Validates Payment Tab (Release vs Hold)
```

1.  **Header to Tab Dependency:** Choosing a **Shipment No** or **Consul No** acts as the primary key. It auto-queries the operational database to populate the *Consignee* and *Custom Broker* fields inside the *Entity* tab automatically.
2.  **Entity to Delivery Validation:** The **Delivery Add.** box is dynamically dependent on the *Consignee* selection. If the chosen Consignee has multiple registered branches, a secondary lookup allows selecting the specific branch profile.
3.  **Payment Gatekeeping:** The **[Print DO]** and **[Print Receipt]** action buttons are programmatically conditional. They read data from the **Payment** tab; if an invoice is marked as "Pending" or a client is over their credit limit, the system locks the printing functionality to prevent unauthorized cargo release.

#### E. Form Specification: CGM Filing (Air)

##### 1. Top Section Filters / Grid Search Fields Specification

| Field Name | Type / Control | Character Limit / Format | Description / Relational Logic | Database Query Target |
| --- | --- | --- | --- | --- |
| **Consol Job No.** | Alphanumeric Text Input | Max 15 chars | Pulls up a specific consolidation job from the Air Import module. | `jobs.execution_job_no` (where `transport_mode = 'air'`) |
| **Transaction** | Dropdown | Options: `(Both)`, `Submitted`, `Received` | Filters grid by transmission log status. | `manifest_filings.transaction_status` |
| **Custom House** | Searchable Dropdown | Strictly 6 chars port code | Standard Indian Customs port code (e.g. `INMAA4` for Chennai Air). | `manifest_filings.customs_house_code` |
| **From Date / To Date** | Date Pickers | `DD-MMM-YYYY` | Filters job lists by creation or flight date range. | Query bounds on `jobs.created_at` |

##### 2. "Submit CGM Data" Window Specification

| Field Name | Type / Control | Character Limit / Format | Description / Relational Logic | Database Target |
| --- | --- | --- | --- | --- |
| **Date & Time** | Split Text Inputs | `DD-MM-YYYY` / `HH:MM PM/AM` | Submission timestamp record. | `manifest_filings.submitted_at` |
| **Consol No.** | Search Lookup | Max 16 chars | Master reference; links the submission to the consol job. | `manifest_filings.job_id` (FK → `jobs.id` where MAWB details reside) |
| **Custom House** | Searchable Dropdown | Strictly 6 chars | Target Indian Customs location port. | `manifest_filings.customs_house_code` |
| **Sending Method** | Radio Buttons | Options: `Auto File`, `Manual`, `Email` | Dictates manifest distribution method. | `manifest_filings.sending_method` |
| **Status / Display Box** | Read-Only Text Area | Large text block | Shows validations, errors, or DSC signing logs. | `manifest_filings.status_log` |

##### 3. Form Action Buttons

*   **Submit:** Validates the underlying house data totals against the master record and compiles the raw message string.
*   **Send for Signature:** Routes the generated manifest file directly to your local encryption utility to wrap the data with your Digital Signature Certificate (**DSC Token**).
*   **Get Signature Tool:** A utility link to download or initialize the mandatory background signing driver required to bridge your physical USB DSC token with the Logi-Sys web page.
*   **Close:** Instantly minimizes or kills the pop-up modal without saving uncommitted generation steps.

##### 4. Behind-the-Scenes Data Fields & Character Limitations

When hitting **Submit**, the system pulls raw data from the *Air Import > Consol & Shipment* modules to build the mandatory ICEGATE layout. Indian Customs strictly enforces the following character limits and rules on those underlying records:

###### Core References
*   **MAWB Number:** 11 characters.
    *   *Format:* `NNN-NNNNNNNN` (3-digit airline prefix + 8-digit serial number). Must strictly match the airline's physical manifest.
*   **HAWB Number:** Maximum **20 characters**. Alphanumeric. Special characters or spaces are highly restricted, as they will cause ICEGATE file rejections.
*   **ICEGATE ID:** Maximum **20 characters**. Alphanumeric format identifying your specific agency registration.

###### Entity Information
*   **Organisation / Agent Name:** Maximum **50 characters**.
*   **Shipper & Consignee Names:** Maximum **50 characters** per line.
*   **Address Fields:** Maximum **500 characters** cumulative (usually broken down into multiple 35-to-70 character lines depending on the specific Cargo-XML message type).

###### Cargo Metrics
*   **Package Count (Pieces):** Numeric only. The combined piece count of all underlying HAWBs *must perfectly match* the total pieces declared on the Master AWB record.
*   **Gross Weight:** Decimal numeric value. Must match the airline's physical flight weight manifest within tight tolerances.

If any of these underlying background criteria fail the character type or length rules, a validation error flag will print directly inside that large blue-bordered **Status** window.

#### F. EDI & Transmission Protocols
To maintain synchronization with international airline networks and local customs gateways, the system supports these electronic message transmissions:

```mermaid
sequenceDiagram
    participant AG as Origin Agent / Carrier
    participant SYS as F16s Import OS
    participant CUST as Customs Gateway (ICEGATE)
    participant CONS as Consignee / Broker

    AG->>SYS: Incoming Cargo XML (FWB/FHL message)
    SYS->>SYS: Parse & Auto-create Import Job
    SYS->>SYS: Flight Arrival Confirmed (Status Update)
    SYS->>CUST: Submit IGM Manifest XML
    CUST-->>SYS: IGM Clearance Accepted
    SYS->>CONS: Transmit Arrival Notice (PDF Email)
    CONS->>SYS: Settle Local Port Charges
    SYS->>CONS: Issue Delivery Order (DO)
    SYS->>AG: Send FSU Message (ARR / DLV status update)
```

1.  **IGM (Import General Manifest) Filing:**
    *   Generates the standardized customs XML containing flight details and sub-manifests (HBL items).
    *   Transmits the manifest electronically to the local customs gateway (e.g. ICEGATE in India) for import clearances:
        `POST /api/customs/file-igm`
2.  **FSU (Freight Status Update) Message Dispatch:**
    *   Automates status update transmission back to the origin booking systems or airline network.
    *   Fires Cargo-XML messaging for these milestones:
        *   `ARR` (Arrived at Airport) - triggered on flight arrival confirmation.
        *   `RCF` (Received from Flight) - triggered on cargo check-in at the ground handling warehouse.
        *   `AWD` (Documents Delivered) - triggered on document handover to customs broker.
        *   `DLV` (Cargo Delivered) - triggered upon issuing the Delivery Order (DO).

### C.2 Direct Carrier & Airline Booking Integration
*   Integration with Cargo Booking portals, Shipping Line portals, and Airline APIs (e.g., Cargo.one, WebCargo, or direct EDI/XML channels).
*   Enables booking confirmations and immediate e-Booking requests directly from the shipment workspace without leaving the F16s console.

---

## 🌐 Multi-Portal Scope Segregation (Air vs Sea)

To isolate operational dashboards, document feeds, and financial ledgers between the different modes of transport, the system applies strict portal-level session partitioning:

### 1. Pre-Login Company Selection & Unified Authentication with Scoped Session Routing
*   **Pre-Login Company Selection:** Before logging in, the user must select their company from a secure list of registered tenant companies.
*   **Scoped Entry Points & Tenant Subdomain Resolution:**
    *   **Scope-Specific Subdomains:** The platform defines dedicated subdomains for the main entry points:
        *   `focusair.f16sefreight.com`: Routes users directly to the **Focus Air** dashboard/portal. Upon entry/login, the system binds `active_portal_scope = 'air'` to the user session.
        *   `focussea.f16sefreight.com`: Routes users directly to the **Focus Sea** dashboard/portal. Upon entry/login, the system binds `active_portal_scope = 'sea'` to the user session.
        *   `admin.f16sefreight.com`: Routes administrative staff to the global **Admin Portal**. Serves administrative configuration panels (managing companies, selecting subscription tiers, registering email domains, and editing user settings to assign PIMA addresses).
*   **Session Binding:** Upon successful authentication, the backend binds the `active_portal_scope` (Enum: `'air'`, `'sea'`) and the `company_id` to the user's session state.

### 1.1 Company Registration & User Onboarding Flow
*   **Company Registration & Domain Setup:** Companies can register their corporate details on the platform, defining their official corporate `@` email domain used for routing.
*   **User Self-Registration:** Once the parent company is registered, individual users (employees) can register and create their own user IDs under that company context.
*   **Origin Port Designation:** During the user registration/onboarding process, users are required to select their default designated **origin port** (airport or seaport, which matches to `ports.id` or UN/LOCODE directory). This value is stored in `users.origin_port_id`.
*   **Admin PIMA Configuration:** In the backend administrative dashboard, when editing user profiles, the administrator can assign or modify the **PIMA address** (Printer / Messaging Routing Address, max 20 characters) stored in `users.pima_address` to facilitate automated transmission routing.

### 2. Database Partitioning (`transport_mode`)
*   **Database Tagging:** We introduce a `transport_mode` column (String/Enum: `'air'`, `'sea'`) to the `jobs`, `pdf_processing_jobs`, `accounts_invoices`, and `accounts_purchase_vouchers` tables.
*   **Global Query Scoping:** Laravel models automatically apply a global query scope based on the active session's portal context:
    ```php
    static::addGlobalScope('portal_scope', function (Builder $builder) {
        $builder->where('transport_mode', session('active_portal_scope', 'air'));
    });
    ```
*   This ensures a user logged into **Focus Air** *only* sees air transport jobs, air billing items, and air invoices, while a user logged into **Focus Sea** *only* sees maritime manifests and sea invoices.

### 3. Contextual Drawer Workspace Forms
The drawer workspace dynamically swaps views based on the active portal context:
*   **Focus Air Workspace:** Loads AWB forms (`FocusAir.vue`, `HouseWayBill.vue`) and calls the air cargo OCR models.
*   **Focus Sea Workspace:** Loads maritime forms (`FocusSeaMaster.vue`, `FocusSeaHouse.vue`), consolidation pages (`FocusSeaConsol.vue`), and calls ocean container B/L models.

---

## 🌊 Focus Sea: Database Schema Definitions

Before mapping UI fields to database columns, we define the core Sea-specific tables that support maritime shipment operations.

### `sea_shipment_details` (Maritime Voyage & Cargo Metadata)
*   *Purpose:* Stores all maritime-specific operational data for a sea shipment job. One-to-one relationship with `jobs`.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade, Unique): Parent operational job link.
    *   `vessel_name` (String, max 100, Nullable): Name of the carrying vessel.
    *   `voyage_no` (String, max 20, Nullable): Carrier-assigned voyage identifier.
    *   `vessel_flag` (String, 2 chars, Nullable): ISO 3166-1 alpha-2 country code of vessel registration.
    *   `imo_number` (String, max 7, Nullable): 7-digit IMO vessel identification number.
    *   `carrier_id` (BigInteger, Nullable, FK referencing `companies.id`): Shipping line/carrier company.
    *   `service_contract_no` (String, max 30, Nullable): Carrier service contract reference.
    *   `por_code` (String, max 5, Nullable): Place of Receipt UN/LOCODE.
    *   `pol_code` (String, max 5, Nullable): Port of Loading UN/LOCODE.
    *   `pod_code` (String, max 5, Nullable): Port of Discharge UN/LOCODE.
    *   `del_code` (String, max 5, Nullable): Place of Delivery UN/LOCODE.
    *   `hub1_code`, `hub2_code`, `hub3_code` (String, max 5, Nullable): Transshipment hub codes.
    *   `transshipment_required` (Boolean, default: false)
    *   `etd` (Date, Nullable): Estimated Time of Departure.
    *   `eta` (Date, Nullable): Estimated Time of Arrival.
    *   `transit_days` (Integer, Nullable): Calculated transit duration.
    *   `commodity_description` (Text, Nullable): Customs manifest goods declaration.
    *   `marks_and_numbers` (Text, Nullable): Pallet/container stencil marks.
    *   `hs_code` (String, max 10, Nullable): Harmonized System tariff code.
    *   `imdg_class` (String, max 5, Nullable): IMDG hazmat class (e.g., `'3'` for flammable liquids).
    *   `un_number` (String, max 4, Nullable): 4-digit UN dangerous goods number.
    *   `package_type` (String, max 10, Nullable): e.g., `'BOX'`, `'PLT'`, `'CRT'`.
    *   `piece_count` (Integer, Nullable): Total package/piece count.
    *   `gross_weight` (Decimal(10,3), Nullable): Total gross weight.
    *   `net_weight` (Decimal(10,3), Nullable): Total net weight.
    *   `chargeable_weight` (Decimal(10,3), Nullable): Billing weight.
    *   `weight_unit` (Enum: `'KGS'`, `'LBS'`, default: `'KGS'`)
    *   `volume_cbm` (Decimal(8,3), Nullable): Total volume in cubic meters.
    *   `volume_unit` (Enum: `'CBM'`, `'CFT'`, default: `'CBM'`)
    *   `hbl_number` (String, max 30, Nullable): House Bill of Lading number.
    *   `mbl_number` (String, max 30, Nullable): Master Bill of Lading number.
    *   `bl_type` (Enum: `'HBL'`, `'MBL'`, Nullable)
    *   `bl_release_type` (Enum: `'original'`, `'telex'`, `'seaway'`, Nullable)
    *   `freight_terms` (Enum: `'prepaid'`, `'collect'`, Nullable)
    *   `haulage_provider_id` (BigInteger, Nullable, FK referencing `companies.id`)
    *   `pickup_address` (Text, Nullable)
    *   `delivery_address` (Text, Nullable)
    *   `empty_depot` (String, max 100, Nullable)
    *   `do_given_to` (String, max 100, Nullable)
    *   `shipping_bill_number` (String, max 30, Nullable)
    *   `shipping_bill_date` (Date, Nullable)
    *   `filing_status` (Enum: `'not_filed'`, `'submitted'`, `'cleared'`, `'rejected'`, default: `'not_filed'`)
    *   `created_at`, `updated_at` (Timestamps)

### `job_entities` (Operational Party Contacts)
*   *Purpose:* Polymorphic entity grid linking companies (shippers, consignees, agents, brokers) to a job in specific roles. Shared across Air and Sea.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade, Index)
    *   `company_id` (BigInteger, FK referencing `companies.id`, Index): The linked company profile.
    *   `role` (Enum: `'shipper'`, `'consignee'`, `'customer'`, `'origin_agent'`, `'dest_agent'`, `'selling_agent'`, `'notify_party'`, `'customs_broker'`, `'consigned_order'`, `'transporter'`, `'high_sea_buyer'`): Role of the entity in this shipment.
    *   `address` (Text, Nullable): Snapshot of the company address at the time of selection (read-only until entity is selected).
    *   `contact_person` (String, max 100, Nullable)
    *   `created_at`, `updated_at` (Timestamps)
*   *Unique Constraint:* Conditional unique index: `(job_id, role)` excluding `role = 'notify_party'` (which may have multiples per job).

### `sea_containers` (ISO Container Grid)
*   *Purpose:* Stores container records for FCL/containerized sea shipments. One-to-many relationship with `jobs`.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade, Index)
    *   `container_number` (String, 11 chars): ISO 6346 standard format (4 letters + 7 digits with check digit).
    *   `seal_number` (String, max 30, Nullable): Customs/mechanical seal identifier.
    *   `size_type` (Enum: `'20GP'`, `'40GP'`, `'40HC'`, `'20RF'`, `'40RF'`, `'20TK'`, `'40OT'`): Container size and type classification.
    *   `tare_weight` (Decimal(10,3), Nullable): Empty container weight.
    *   `payload_weight` (Decimal(10,3), Nullable): Cargo weight inside the container.
    *   `vgm_weight` (Decimal(10,3), Nullable): Verified Gross Mass (SOLAS regulation).
    *   `created_at`, `updated_at` (Timestamps)

### `sea_container_items` (Container Stuffing — HBL Allocation)
*   *Purpose:* Maps individual House shipments (HBLs) to containers for consolidation stuffing tracking.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Branch-level isolation.
    *   `container_id` (BigInteger, FK referencing `sea_containers.id` on delete cascade)
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade): The child HBL job.
    *   `stuffed_pieces` (Integer, default: 0)
    *   `stuffed_weight` (Decimal(10,3), default: 0.000)
    *   `stuffed_volume` (Decimal(8,3), default: 0.000)
    *   `created_at`, `updated_at` (Timestamps)

### `cargo_arrival_notices` (Pre-Arrival Notice Records) (New)
*   *Purpose:* Stores Cargo Arrival Notice (CAN) records issued to consignees and custom brokers upon flight/vessel arrival.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Tenant isolation.
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade, Unique): Link to operational job card.
    *   `can_no` (String, Unique, Index, max 30): Formatted tracking number (e.g. `CAN-26-0001` or `CANS-26-0001`).
    *   `document_date` (Date): Issuance date.
    *   `free_storage_days` (Integer, default: 2): Storage grace period in port warehouse.
    *   `storage_charges_start_date` (Date, Nullable): Date when demurrage starts.
    *   `sent_to_consignee_at` (Timestamp, Nullable): Tracking email dispatch time.
    *   `created_at`, `updated_at` (Timestamps)

### `ports` (UN/LOCODE Reference Directory)
*   *Purpose:* Master reference table for international port codes used in routing lookups.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `locode` (String, 5 chars, Unique, Index): UN/LOCODE identifier (e.g., `'INMAA'` for Chennai, `'SGSIN'` for Singapore).
    *   `port_name` (String, max 100): Full port/location name.
    *   `country_code` (String, 2 chars): ISO 3166-1 alpha-2 country code.
    *   `port_type` (Enum: `'sea'`, `'air'`, `'inland'`, `'multi'`): Classification.
    *   `is_active` (Boolean, default: true)
    *   `created_at`, `updated_at` (Timestamps)

---

## 🌊 Focus Sea: Export Form Sheet & Architectural Mapping

To seamlessly integrate maritime logistics into the F16s OS, we map the **LogiLENS / Logisys** Sea Export interface fields and tabs directly onto our Laravel-FastAPI architecture. The Sea Export portal runs under the session scope `active_portal_scope = 'sea'`, and the layout is rendered via `FocusSeaMaster.vue` (for Master shipments) and `FocusSeaHouse.vue` (for House shipments).

### 1. Architectural Data Flow Overview

The following diagram illustrates how raw email attachments or manual uploads traverse the OCR engine, populate the Vue 2 Sea Export form, commit to the partitioned database, and flow into the decoupled financial billing sheets:

```mermaid
graph TD
    A[Inbound Email Attachment / PDF Upload] -->|Trigger OCR| B[FastAPI /extract-unstructured]
    B -->|PyMuPDF + Gemini SeaSchema| C[Extracted Draft JSON]
    C -->|Auto-Populate| D[FocusSeaMaster.vue / FocusSeaHouse.vue]
    D -->|User Edits & Validations| E[Laravel REST API: POST /api/sea-shipments]
    E -->|Database Commit| F[jobs table transport_mode='sea']
    F -->|Splits into Tab Relational Tables| G[sea_shipment_details]
    F -->|Relates Entities| H[job_entities]
    F -->|Spawns Containers| I[sea_containers]
    F -->|Decoupled Financials| J[Draft Job Cost Sheet]
    J -->|Buy/Sell overrides| K[accounts_invoice_items / accounts_purchase_items]
    K -->|Finalize Invoice| L[accounts_ledger_entries / Double-Entry Ledger]
```

---

### 2. Global Header Fields Architectural Mapping

These fields are anchored at the top of `FocusSeaMaster.vue` / `FocusSeaHouse.vue` and govern the shipment lifecycle.

| Field Name | UI Control Type | Data Type / Format | Character Limit / Options | Database Target (Table & Column) | Functional Logic & Connections |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Shipment No** | Text Input (Read-only on New) | String (e.g., `SSEA-26-0001`) | Max 30 chars | `jobs.execution_job_no` | Auto-generated on Save using `php artisan sequence:generate --mode=sea`. Overseen by custom check gates for override privileges. |
| **Shipment Date** | Date Picker | Date (`YYYY-MM-DD`) | N/A | `jobs.planned_clearance_date` | Defaults to `Carbon::now()`. Laravel validator checks against `accounting_periods` to prevent postings in closed months. |
| **Consol Type** | Dropdown | Enum | `agent_consol`, `buyers_consol`, `direct`, `back_to_back`, `none` | `jobs.consol_type` | Governs downstream financial cost splitting. e.g., `agent_consol` triggers automated Manifest splitting across HBLs. |
| **Cargo Type** | Dropdown | Enum | `liquid_cont`, `fcl`, `lcl`, `break_bulk`, `liquid_bulk`, `bulk`, `ro_ro` | `jobs.cargo_type` | UI layout controller: selecting `fcl` or `liquid_cont` displays Tab 7 (Container Grid) and makes it a required section. |
| **Job Order No.** | Lookup + Search Button | String (Foreign Key) | Max 30 chars | `jobs.job_order_no` | Clicking **"Initialize"** calls `GET /api/bookings/{no}`. Mapped routes, HS codes, and entities are copied to form state. |
| **Delivery Mode** | Dropdown | Enum | `fcl`, `lcl` | `jobs.delivery_mode` | Mapped dynamically based on `cargo_type`. Controls unit conversion calculations (e.g., LCL enforces CBM calculations). |
| **Booking Thru** | Dropdown | Enum | `self`, `agent` | `jobs.booking_thru` | Dictates commission routing. Mapped in pricing engine to calculate broker profit-shares on Tab 10. |
| **Job Owner** | Lookup Box | String / User ID | Max 50 chars | `jobs.job_owner_id` | Defaults to active `auth()->id()`. Enforces row-level visibility filtering based on user branch (`agent_id`). |
| **Quotation No.** | Lookup + Search Button | String (Foreign Key) | Max 30 chars | `jobs.quotation_no` | Hits `GET /api/quotations/{no}`. Auto-inserts pre-agreed Buy/Sell charge line items directly into Tab 9 (Charges). |
| **Doc User** | Lookup Box | String / User ID | Max 50 chars | `jobs.doc_user_id` | Assigns document validation ownership. Triggers operational email alerts if document deadlines are near. |
| **Sub Shipment** | Checkbox | Boolean | `true` / `false` | `jobs.is_sub_shipment` | When checked, displays a Parent Master Job Search Lookup, inserting parent-child links in `jobs.parent_job_id`. |

---

### 3. Tab-by-Tab Functional & Database Breakdown

#### Tab 1: Entity (Operational Contacts Grid)
*   **UI Control:** 2-column BootstrapVue grid of search boxes (Max 100 chars) paired with address textareas (Max 500 chars).
*   **Database Mapping:** Linked via the `job_entities` table.
*   **Architectural Connections:**
    *   Selecting a Shipper, Consignee, or Customer queries the `companies` database table (`GET /api/companies?type=client`).
    *   Origin/Destination Agents are filtered by partner networks (`GET /api/companies?type=agent`).
    *   The **Customer** field is the critical anchor: it sets the default debtor ID in `accounts_invoices.client_id`.
    *   **"Add/Remove Entity"** dynamically appends items to the `form.entities` array, which Laravel inserts as additional rows in `job_entities` with roles like `notify_party` or `customs_broker`.

#### Tab 2: Shipping Dtls. (Maritime Voyage Details)
*   **UI Control:** Vessel Name (Text Lookup), Voyage No (Text), Vessel Flag (Text), IMO Number (7-digit number validation), Shipping Line/Carrier (Search Lookup), Service Contract No (Text).
*   **Database Mapping:** Mapped to columns in `sea_shipment_details`.
*   **Architectural Connections:**
    *   IMO Number validated with regex: `^[0-9]{7}$`.
    *   Carrier Lookup queries shipping line vendors (`GET /api/companies?type=carrier`).
    *   Service Contract No. is cross-checked on save to audit pre-configured contract rates in the pricing module.

#### Tab 3: Routing (UN/LOCODE Transit Paths)
*   **UI Control:** POR, POL, POD, and DEL lookup dropdowns with search, plus transshipment hubs (Hub 1, 2, 3), ETA and ETD date pickers.
*   **Database Mapping:** Mapped to columns in `sea_shipment_details`.
*   **Architectural Connections:**
    *   Ports are queried from a local `ports` directory table populated with UN/LOCODE codes (e.g., `INMAA` for Chennai, `SGPIN` for Singapore).
    *   ETA / ETD trigger frontend calculation of transit duration:
        ```javascript
        computed: {
            transitDays() {
                if (!this.form.etd || !this.form.eta) return 0;
                const diffTime = Math.abs(new Date(this.form.eta) - new Date(this.form.etd));
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
        }
        ```

#### Tab 4: Goods Dtls. (Customs Declarations & Hazmat)
*   **UI Control:** Commodity Description (Textarea), HS Code (6/8/10 digit input), Marks & Numbers (Textarea), Hazmat/IMDG class dropdown, UN Number (4-digit numeric input).
*   **Database Mapping:** Mapped to columns in `sea_shipment_details`.
*   **Architectural Connections:**
    *   HS Code checks: Must match a numeric regex: `^\d{6,10}$`.
    *   Hazmat activation: Selecting an IMDG class triggers a strict validation gate. The system marks the shipment as high-risk, requires a UN number, and alerts the compliance officer via WebSockets.

#### Tab 5: Item (Cargo Unit Metric Calculator)
*   **UI Control:** Package Type dropdown, Piece Count (Integer), Gross/Net/Chargeable Weight (Decimals), Weight Unit Switcher (KGS/LBS), Volume CBM (Decimal).
*   **Database Mapping:** Mapped to columns in `sea_shipment_details`.
*   **Architectural Connections:**
    *   Frontend computes total volume dynamically if dimensions (Length, Width, Height) are entered:
        $$\text{CBM} = \frac{\text{Length (cm)} \times \text{Width (cm)} \times \text{Height (cm)}}{1,000,000} \times \text{Pieces}$$
    *   The computed **Chargeable Weight** is the default quantity multiplier passed to ocean freight charge calculations on Tab 9.

#### Tab 6: BL Info (Bill of Lading Details)
*   **UI Control:** HBL Number (Text), MBL Number (Text), BL Release Type dropdown (Telex, Original, Seaway), Freight Terms dropdown (Prepaid, Collect).
*   **Database Mapping:** Mapped to columns in `sea_shipment_details`.
*   **Architectural Connections:**
    *   Freight Terms dictate automated billing direction:
        *   `Prepaid`: System generates invoices targeting the **Shipper** (`accounts_invoices.client_id = shipper_id`).
        *   `Collect`: System generates invoices targeting the **Consignee** (`accounts_invoices.client_id = consignee_id`).

#### Tab 7: Container (ISO Container Grid)
*   **UI Control:** Table component allowing dynamic row additions for Container Number (Text), Seal Number (Text), Size & Type dropdown.
*   **Database Mapping:** Mapped to rows in `sea_containers`.
*   **Architectural Connections:**
    *   **ISO 6346 Validation:** The container number input is validated client-side on change to ensure it matches the international format (4 letters, 6 digits, 1 check digit).
    *   Check-digit validation helper:
        ```javascript
        validateISO6346(containerNum) {
            if (!/^[A-Z]{4}[0-9]{7}$/.test(containerNum)) return false;
            let sum = 0;
            const alphabet = "0123456789A?BCDEFGHIJK?LMNOPQRSTUV?WXYZ";
            for (let i = 0; i < 10; i++) {
                let charCode = alphabet.indexOf(containerNum[i]);
                sum += charCode * Math.pow(2, i);
            }
            const checkDigit = (sum % 11) % 10;
            return checkDigit === parseInt(containerNum[10]);
        }
        ```

#### Tab 8: Pick Up (Inland Logistics)
*   **UI Control:** Inland Haulage Provider lookup, Pick-up Address textarea, Empty Depot text input.
*   **Database Mapping:** Mapped to columns in `sea_shipment_details`.
*   **Architectural Connections:**
    *   Haulage Provider dropdown queries trucking vendors (`GET /api/companies?type=trucker`).

#### Tab 9: Charges (Job Cost Sheet Portal)
*   **UI Control:** Dynamic financial table showing Charge Code dropdown, Currency dropdown, Exchange Rate (Decimal), Buy Rate (Cost), Sell Rate (Revenue), Tax Code/GST dropdown.
*   **Database Mapping:** Creates draft entries in `accounts_invoice_items` and `accounts_purchase_items`.
*   **Architectural Connections:**
    *   Directly connects to the decoupled Job Cost Sheet ledger workflow (Section B.7). Adjustments here do not modify the cargo manifests on Tab 5 or 6, protecting legal customs filings.

#### Tab 10: Financials (Accounting Summary Console)
*   **UI Control:** Read-only total displays: Total Revenue, Total Cost, Estimated Profit. Status Banner: Credit limit alerts, Invoice Generation Buttons.
*   **Database Mapping:** Fetches aggregates from `accounts_invoice_items` and `accounts_purchase_items`.
*   **Architectural Connections:**
    *   **Credit Warning Logic:** When the tab is active, the system fetches the customer's credit details:
        ```javascript
        axios.get(`/api/companies/${this.form.customer_id}/credit-check`)
            .then(res => {
                if (res.data.is_over_limit) {
                    this.creditWarning = `Warning: Customer has exceeded their credit limit of ${res.data.credit_limit} ${res.data.currency}!`;
                }
            });
        ```
    *   **Invoice Generator:** Clicking "Generate Invoice" maps the verified Sell rates to `accounts_invoices` and locked journal records in `accounts_ledger_entries`.

#### Tab 11: Customs (Border Clearances)
*   **UI Control:** Shipping Bill Number (Numeric), Shipping Bill Date (DatePicker), Filing Status dropdown (Not Filed, Submitted, Cleared).
*   **Database Mapping:** Mapped to columns in `sea_shipment_details`.
*   **Architectural Connections:**
    *   Updating the filing status to `Cleared` triggers a background dispatch checking for outstanding charges and sends an automated release email to the consignee.

#### Tab 12: E-Docket (DMS Attachments)
*   **UI Control:** File Upload Dropzone (Drag-and-drop container), Document Type labeling dropdown (Commercial Invoice, Packing List, Certificate of Origin).
*   **Database Mapping:** Mapped to rows in `job_documents` (E-Docket Attachments table).
*   **Architectural Connections:**
    *   Ingests uploaded PDFs, PNGs, or JPGs. Uploading a document here triggers FastAPI extraction fallback if unstructured data processing is required.

---

### 4. Form Footer State Actions & Commit Workflows

The form footer provides 4 persistent buttons to handle form mutations and SQL database transactions:

```mermaid
stateDiagram-v2
    [*] --> FormOpen
    FormOpen --> SavePressed : Click Save
    SavePressed --> ValidateClient : Run Form Rules
    ValidateClient --> POST_API : Pass
    ValidateClient --> FormOpen : Fail (Highlight Warnings)
    POST_API --> DB_Commit : SQL Insert/Update
    DB_Commit --> FormOpen : Stay (Success Toast)
    
    FormOpen --> SaveClosePressed : Click Save & Close
    SaveClosePressed --> ValidateClient
    DB_Commit --> DashboardRedirect : Route to Shipment List
    
    FormOpen --> SaveNewPressed : Click Save & New
    SaveNewPressed --> ValidateClient
    DB_Commit --> ClearState : Reset Form fields
    ClearState --> FormOpen : Reset sequence
    
    FormOpen --> ClosePressed : Click Close
    ClosePressed --> ReleaseLocks : Release server row locks
    ReleaseLocks --> DashboardRedirect
```

*   **1. Save:**
    *   **Action:** Runs client-side validation rules (e.g., ISO container checksum, HS codes format). If passed, dispatches a `POST /api/sea-shipments` request.
    *   **Payload:** Entire form object matching `sea_shipments`, `job_entities`, and `sea_containers` structures.
    *   **Response:** Success toast notification. Keeps the user on the current screen, caching the newly returned database ID to transition from "New" to "Edit" mode.
*   **2. Save & Close:**
    *   **Action:** Runs the same validation and POST endpoints as Save.
    *   **Callback:** Upon receiving a success response, redirects the router back to the primary *Shipments Dashboard* list: `this.$router.push({ name: 'SeaShipmentDashboard' })`.
*   **3. Save & New:**
    *   **Action:** Commits the current form state to the database.
    *   **Callback:** Clears the form local state object, keeping company defaults (such as current branch ID, date, and user details) and auto-incrementing the shipment number to prepare a blank form for immediate reuse.
*   **4. Close:**
    *   **Action:** Dispatches an API call to unlock the row `POST /api/jobs/{id}/unlock` (preventing concurrent editing locks).
    *   **Callback:** Discards unsaved modifications and routes the user back to the *Shipments Dashboard*.

---

### 5. Detailed Seeder & Dropdown Options Specification

To populate the database migrations/seeders and initialize the frontend BootstrapVue selects, the system uses these exact standardized enums, array keys, and values.

#### A. Global Header Dropdowns

##### 1. Consol Type
*   **Database Target:** `jobs.consol_type` (Enum)
*   **Vue Data Model:** `form.consol_type`
*   **Options Array:**
    ```javascript
    consolTypes: [
        { value: 'agent_consol', text: 'Agent Consolidation' }, // Default
        { value: 'buyers_consol', text: "Buyer's Consolidation" },
        { value: 'direct', text: 'Direct' },
        { value: 'back_to_back', text: 'Back To Back' },
        { value: 'none', text: 'None' }
    ]
    ```

##### 2. Cargo Type
*   **Database Target:** `jobs.cargo_type` (Enum)
*   **Vue Data Model:** `form.cargo_type`
*   **Options Array:**
    ```javascript
    cargoTypes: [
        { value: 'liquid_cont', text: 'Liquid (Cont)' }, // Default
        { value: 'fcl', text: 'FCL' },
        { value: 'lcl', text: 'LCL' },
        { value: 'break_bulk', text: 'Break Bulk' },
        { value: 'liquid_bulk', text: 'Liquid Bulk' },
        { value: 'bulk', text: 'Bulk' },
        { value: 'ro_ro', text: 'Ro-Ro' }
    ]
    ```

##### 3. Delivery Mode
*   **Database Target:** `jobs.delivery_mode` (Enum)
*   **Vue Data Model:** `form.delivery_mode`
*   **Options Array:**
    ```javascript
    deliveryModes: [
        { value: 'fcl', text: 'FCL' }, // Default
        { value: 'lcl', text: 'LCL' }
    ]
    ```

##### 4. Booking Thru
*   **Database Target:** `jobs.booking_thru` (Enum)
*   **Vue Data Model:** `form.booking_thru`
*   **Options Array:**
    ```javascript
    bookingOptions: [
        { value: 'self', text: 'Self' }, // Default
        { value: 'agent', text: 'Agent' }
    ]
    ```

---

#### B. Tab-by-Tab Dropdown Specification

##### 1. Vessel Flag (Tab 2: Shipping Dtls.)
*   **Database Target:** `sea_shipment_details.vessel_flag` (String, ISO 3166-1 alpha-2)
*   **Vue Data Model:** `form.shipping_details.vessel_flag`
*   **Options List:** Seeded from ISO standard countries list (e.g., `US` - United States, `IN` - India, `SG` - Singapore, `PA` - Panama, `LR` - Liberia).

##### 2. Transshipment Required (Tab 3: Routing)
*   **Database Target:** `sea_shipment_details.transshipment_required` (Boolean)
*   **Vue Data Model:** `form.routing.transshipment_required`
*   **Options Array:**
    ```javascript
    transshipmentOptions: [
        { value: false, text: 'No' }, // Default
        { value: true, text: 'Yes' }
    ]
    ```

##### 3. Package Type (Tab 5: Goods/Item)
*   **Database Target:** `sea_shipment_details.package_type` (String, max 10)
*   **Vue Data Model:** `form.item.package_type`
*   **Options Array:**
    ```javascript
    packageTypes: [
        { value: 'BOX', text: 'BOX (Boxes)' },
        { value: 'PLT', text: 'PLT (Pallets)' },
        { value: 'CRT', text: 'CRT (Crates)' },
        { value: 'DRM', text: 'DRM (Drums)' },
        { value: 'BAG', text: 'BAG (Bags)' },
        { value: 'UNT', text: 'UNT (Unpacked Units)' }
    ]
    ```

##### 4. Weight & Volume UOM (Tab 5: Item)
*   **Database Targets:** `sea_shipment_details.weight_unit` (Enum), `sea_shipment_details.volume_unit` (Enum)
*   **Vue Data Models:** `form.item.weight_unit`, `form.item.volume_unit`
*   **Options Arrays:**
    ```javascript
    weightUnits: [
        { value: 'KGS', text: 'KGS (Kilograms)' },
        { value: 'LBS', text: 'LBS (Pounds)' }
    ],
    volumeUnits: [
        { value: 'CBM', text: 'CBM (Cubic Meters)' },
        { value: 'CFT', text: 'CFT (Cubic Feet)' }
    ]
    ```

##### 5. Hazmat / IMDG Class (Tab 4: Goods Dtls.)
*   **Database Target:** `sea_shipment_details.imdg_class` (String, Nullable)
*   **Vue Data Model:** `form.goods.imdg_class`
*   **Options Array:**
    ```javascript
    imdgClasses: [
        { value: null, text: 'Non-Hazardous' },
        { value: '1', text: 'Class 1 - Explosives' },
        { value: '2', text: 'Class 2 - Gases' },
        { value: '3', text: 'Class 3 - Flammable Liquids' },
        { value: '4', text: 'Class 4 - Flammable Solids' },
        { value: '5', text: 'Class 5 - Oxidizing / Peroxides' },
        { value: '6', text: 'Class 6 - Toxic / Infectious' },
        { value: '7', text: 'Class 7 - Radioactive' },
        { value: '8', text: 'Class 8 - Corrosives' },
        { value: '9', text: 'Class 9 - Misc Dangerous Goods' }
    ]
    ```

##### 6. BL Type & Release Option (Tab 6: BL Info)
*   **Database Targets:** `sea_shipment_details.bl_type` (Enum), `sea_shipment_details.bl_release_type` (Enum)
*   **Vue Data Models:** `form.bl_info.bl_type`, `form.bl_info.bl_release_type`
*   **Options Arrays:**
    ```javascript
    blTypes: [
        { value: 'HBL', text: 'HBL (House Bill of Lading)' },
        { value: 'MBL', text: 'MBL (Master Bill of Lading)' }
    ],
    blReleaseTypes: [
        { value: 'original', text: 'Original BL Required' },
        { value: 'telex', text: 'Telex Release' },
        { value: 'seaway', text: 'Seaway Bill' }
    ]
    ```

##### 7. Freight Terms (Tab 6: BL Info)
*   **Database Target:** `sea_shipment_details.freight_terms` (Enum)
*   **Vue Data Model:** `form.bl_info.freight_terms`
*   **Options Array:**
    ```javascript
    freightTerms: [
        { value: 'prepaid', text: 'Prepaid' },
        { value: 'collect', text: 'Collect' }
    ]
    ```

##### 8. Size & Type (Tab 7: Container)
*   **Database Target:** `sea_containers.size_type` (Enum)
*   **Vue Data Model:** `containerRow.size_type`
*   **Options Array:**
    ```javascript
    containerTypes: [
        { value: '20GP', text: '20GP - 20ft General Purpose' },
        { value: '40GP', text: '40GP - 40ft General Purpose' },
        { value: '40HC', text: '40HC - 40ft High Cube' },
        { value: '20RF', text: '20RF - 20ft Reefer' },
        { value: '40RF', text: '40RF - 40ft Reefer' },
        { value: '20TK', text: '20TK - 20ft ISO Tank' }, // Auto-selected if cargo_type is 'liquid_cont'
        { value: '40OT', text: '40OT - 40ft Open Top' }
    ]
    ```

##### 9. Currency Code (Tab 9: Charges)
*   **Database Targets:** `accounts_invoice_items.currency`, `accounts_purchase_items.currency`
*   **Vue Data Model:** `chargeRow.currency`
*   **Options List:** Seeded from global currencies list (e.g., `INR`, `USD`, `EUR`, `SGD`, `AED`).

##### 10. Charge Basis & Tax Status (Tab 9: Charges)
*   **Database Targets:** `accounts_invoice_items.charge_basis` (Enum), `accounts_invoice_items.tax_status` (Enum)
*   **Vue Data Models:** `chargeRow.charge_basis`, `chargeRow.tax_status`
*   **Options Arrays:**
    ```javascript
    chargeBases: [
        { value: 'per_container', text: 'Per Container' },
        { value: 'per_cbm', text: 'Per CBM' },
        { value: 'per_bl', text: 'Per Bill of Lading' },
        { value: 'flat_rate', text: 'Flat Rate' },
        { value: 'per_weight_ton', text: 'Per Weight Ton' }
    ],
    taxStatuses: [
        { value: 'taxable', text: 'Taxable' },
        { value: 'exempt', text: 'Exempt' },
        { value: 'zero_rated', text: 'Zero-Rated' }
    ]
    ```

##### 11. Filing / EDI Status (Tab 11: Customs)
*   **Database Target:** `sea_shipment_details.filing_status` (Enum)
*   **Vue Data Model:** `form.customs.filing_status`
*   **Options Array:**
    ```javascript
    filingStatuses: [
        { value: 'not_filed', text: 'Not Filed' },
        { value: 'submitted', text: 'Submitted / Pending' },
        { value: 'cleared', text: 'Cleared' },
        { value: 'rejected', text: 'Rejected / Amendment Required' }
    ]
    ```

---

### 6. Field Validation & Character Limitations

To prevent database truncation issues and guide client-side input validation, the following maximum character limits, database datatypes, and validation formats are enforced across all Focus Sea forms:

| Field Group | Field Name | Datatype / Limit | Format / Validation Rule | Database Column |
| :--- | :--- | :--- | :--- | :--- |
| **Global Header** | Shipment No | `VARCHAR(30)` | Alphanumeric; prefix validation | `jobs.execution_job_no` |
| | Job Order No | `VARCHAR(30)` | Alphanumeric; foreign key link | `jobs.job_order_no` |
| | Quotation No | `VARCHAR(30)` | Alphanumeric; CRM/Quotation link | `jobs.quotation_no` |
| | Job Owner | `VARCHAR(50)` | Alphanumeric User Account ID | `jobs.job_owner_id` |
| | Doc User | `VARCHAR(50)` | Alphanumeric User Account ID | `jobs.doc_user_id` |
| **Entities (Tab 1)**| Entity Lookups | `VARCHAR(100)`| Autocomplete profile search | N/A |
| | Address Fields | `VARCHAR(500)`| Text area; newlines allowed | `job_entities.address` |
| **Shipping Dtls. (Tab 2)**| Vessel Name | `VARCHAR(100)`| Alphanumeric vessel name | `sea_shipment_details.vessel_name` |
| | Voyage No | `VARCHAR(20)` | Alphanumeric carrier voyage string | `sea_shipment_details.voyage_no` |
| | Vessel Flag | `CHAR(2)` | ISO 2-letter country code (`^[A-Z]{2}$`)| `sea_shipment_details.vessel_flag` |
| | IMO Number | `VARCHAR(7)` | 7-digit numeric IMO sequence (`^[0-9]{7}$`) | `sea_shipment_details.imo_number` |
| | Service Contract | `VARCHAR(30)` | Alphanumeric carrier contract number | `sea_shipment_details.service_contract_no` |
| **Routing (Tab 3)** | Port Codes (POL, etc.)| `CHAR(5)` | UN/LOCODE standard (`^[A-Z]{5}$`) | `sea_shipment_details.pol_code` / `pod_code` |
| | Transit Days | `INT` | Read-only calculated transit days | `sea_shipment_details.transit_days` |
| **Goods (Tab 4)** | Commodity Desc | `TEXT` or `VARCHAR(500)` | Text area manifest declaration | `sea_shipment_details.commodity_description`|
| | Marks & Numbers | `TEXT` or `VARCHAR(500)` | Text area stencils / pallet IDs | `sea_shipment_details.marks_and_numbers` |
| | HS Code | `VARCHAR(10)` | 6, 8, or 10-digit tariff code (`^\d{6,10}$`)| `sea_shipment_details.hs_code` |
| | Hazmat UN No | `VARCHAR(4)` | 4-digit numeric code (`^[0-9]{4}$`) | `sea_shipment_details.un_number` |
| **Item (Tab 5)** | No. of Pieces | `INT(6)` | Up to 6 digits (max 999,999) | `sea_shipment_details.piece_count` |
| | Gross Weight | `DECIMAL(10,3)`| Weight total down to grams/ounces | `sea_shipment_details.gross_weight` |
| | Net Weight | `DECIMAL(10,3)`| Weight total down to grams/ounces | `sea_shipment_details.net_weight` |
| | Chargeable Weight| `DECIMAL(10,3)`| Used for freight calculations | `sea_shipment_details.chargeable_weight` |
| | Volume (CBM) | `DECIMAL(8,3)` | Space dimensions (max 99999.999) | `sea_shipment_details.volume_cbm` |
| **BL Info (Tab 6)** | HBL Number | `VARCHAR(30)` | House Bill of Lading number | `sea_shipment_details.hbl_number` |
| | MBL Number | `VARCHAR(30)` | Master Bill of Lading number | `sea_shipment_details.mbl_number` |
| **Container (Tab 7)**| Container No | `CHAR(11)` | ISO 6346 standard checksum format | `sea_containers.container_number` |
| | Seal Number | `VARCHAR(30)` | Alphanumeric customs seal code | `sea_containers.seal_number` |

---

### 7. Cargo Type Conditional UI & Field Locking Logic

The physical characteristics of the chosen **Cargo Type** dictate which sections and input elements of the Vue forms are active. A watcher on `form.cargo_type` handles this responsive field locking:

```javascript
watch: {
    'form.cargo_type': {
        immediate: true,
        handler(newCargoType) {
            this.applyCargoTypeLogic(newCargoType);
        }
    }
}
```

#### A. Cargo Type Behavior Matrix

| Cargo Type Selected | Delivery Mode Field Status | Container Tab Status | Item / Goods Tab Status |
| :--- | :--- | :--- | :--- |
| **`liquid_cont`** or **`fcl`** | Locked to **`fcl`** (FCL-only mode) | **Enabled & Required** | **Enabled** (tracks cargo totals within container) |
| **`lcl`** | Locked to **`lcl`** (LCL-only mode) | **Disabled & Cleared** (box managed at Master Job level) | **Enabled & Mandated** (requires package dimensions and **CBM**) |
| **`break_bulk`**, **`liquid_bulk`**, **`bulk`** | **Disabled & Cleared** (Inapplicable) | **Disabled & Cleared** | **Enabled** (Vessel voyage details take priority) |

#### B. Watcher Method Implementation Details
```javascript
methods: {
    applyCargoTypeLogic(cargoType) {
        if (cargoType === 'liquid_cont' || cargoType === 'fcl') {
            this.form.delivery_mode = 'fcl';
            this.isDeliveryModeDisabled = true;
            this.isContainerTabDisabled = false;
        } else if (cargoType === 'lcl') {
            this.form.delivery_mode = 'lcl';
            this.isDeliveryModeDisabled = true;
            // Clear and lock containers
            this.form.containers = [];
            this.isContainerTabDisabled = true;
        } else if (['break_bulk', 'liquid_bulk', 'bulk', 'ro_ro'].includes(cargoType)) {
            this.form.delivery_mode = '';
            this.isDeliveryModeDisabled = true;
            this.form.containers = [];
            this.isContainerTabDisabled = true;
        }
    }
}
```

---

### 8. Supplementary Field Locking Rules

To keep shipment states valid and prevent user input errors, the following form control constraints are applied:

1.  **Status Indicator (`Active`):**
    *   **Logic:** Locked as disabled/read-only on the UI when creating a **New** shipment.
    *   **Reason:** Prevents users from flagging a shipment status before it has been persisted inside the database. The field unlocks in **Edit** mode only.
2.  **Address Textarea Fields (Tab 1: Entity):**
    *   **Logic:** Locked as **Read-Only** by default.
    *   **Reason:** Standardizes address details and prevents manual typing overrides. The address field only populates and unlocks once the user selects a valid company profile from the corresponding **Entity Lookup** autocomplete box directly above it.

---

### 9. Header UI Utilities & Session Control

To maintain system security, concurrent editing controls, and visual validation warnings, the following elements are implemented in the header panel:

*   **Session Timeout Counter & Row Locking:**
    *   **UI Control:** Dynamic timer display at the top right (e.g., `38 Mins Left`).
    *   **Backend Architecture:** On opening a shipment for editing, the system establishes a Redis-based optimistic lock:
        ```php
        Cache::put("shipment_lock:{$jobId}", auth()->id(), now()->addMinutes(45));
        ```
    *   **Heartbeat API:** The frontend sends a periodic keep-alive ping: `POST /api/jobs/{id}/heartbeat`. If the timer expires or the lock is released, the form redirects the user back to the dashboard and unlocks the row.
*   **Inline Validation Banner:**
    *   **UI Control:** Alert placeholder displayed dynamically below the `Task: New` indicator (e.g., `[Cannot change status for new shipment.]`).
    *   **Logic:** Locks the adjacent Status dropdown to `Active` (read-only) while the shipment's database ID is not yet created.

---

### 10. Toolbar Utilities & Right-Side Shortcut Controls

These auxiliary controls streamline the operational workflow and provide shortcuts to external integrations directly from the shipment form context:

#### A. Top-Left Toolbar Panel
*   **Copy Job Utility:** An icon button that duplicates the active shipment details. Dispatches a `POST /api/jobs/{id}/copy` request, cloning the header fields, routing information, and goods details to a new draft while generating a new Shipment Number.
*   **Module Quick-Switcher:** A dropdown list that allows operators to navigate directly to linked modules (e.g., Invoice ledger, Container tracking feed, XML output builder) while maintaining the current shipment ID in the router session state.

#### B. Origin Agent Card Actions (Tab 1: Entity)
*   **Branch Hub Link (`CHENNAI`):** Clicking this local hub shortcut queries `/api/hubs/CHENNAI`, automatically populating default Port of Loading (`INMAA`), default custom house brokers, and local terminal details on the Routing tab.
*   **EDI Status Check Link (`EDI`):** Triggers an asynchronous check: `GET /api/companies/{id}/edi-status` to verify if the selected vendor profile is cleared for automated electronic customs filings. Displays a green (Cleared) or red (Not Setup) badge inline.

#### C. Right-Side Tab Navigation Controls
*   **Geofence / Vessel Map Icon ($\oplus$):** Queries the Global Maritime schedules API using the shipment's **IMO Number** to load coordinates and render the vessel's live location on a leaflet map popup.
*   **History / Audit Log Icon:** Opens a slide-over drawer displaying an audit trail of user activity (who changed what field, old vs new values, timestamps) fetched from the `audit_logs` database table.
*   **Pop-out / Expansion Utility:** Maximizes the container grid workspace (Tab 7) or the charges ledger (Tab 9) into a distraction-free fullscreen overlay modal.

---

### 11. Comprehensive Data Field Matrix

To coordinate frontend development and database schema creation, the following matrix maps all components of the primary Sea Export workspace layout:

| System Section | Visible Field Label | UI Control Type | Technical / DB Target Column | Validation & Behavioral Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Top Bar** | Session Timer | Dynamic Text | Redis Lock Cache / Heartbeat | Updates every min; locks form at `0` |
| **Top Bar** | Status | Dropdown (Locked) | `jobs.status` | Read-only `Active` on `New` state |
| **Header Grid**| Shipment No | Text (Read-Only) | `jobs.execution_job_no` | Auto-generated via prefix engine |
| **Header Grid**| Shipment Date | Date Picker | `jobs.planned_clearance_date` | Date format: `DD-MMM-YYYY` |
| **Header Grid**| Consol Type | Dropdown select | `jobs.consol_type` | Enums: `agent_consol`, `buyers_consol` |
| **Header Grid**| Cargo Type | Dropdown select | `jobs.cargo_type` | Triggers tab/delivery mode locks |
| **Header Grid**| Job Order No. | Search + Icon button | `jobs.job_order_no` | Queries `/api/bookings` |
| **Header Grid**| Delivery Mode | Dropdown select | `jobs.delivery_mode` | Locked conditionally based on Cargo Type |
| **Header Grid**| Booking Thru | Dropdown select | `jobs.booking_thru` | Enums: `self`, `agent` |
| **Header Grid**| Job Owner | Search Input | `jobs.job_owner_id` (FK) | Defaults to current login user |
| **Header Grid**| Quotation No | Search + Icon button | `jobs.quotation_no` | Auto-populates Tab 9 Charges |
| **Header Grid**| Doc User | Search Input | `jobs.doc_user_id` (FK) | Operational owner assignment |
| **Header Grid**| Sub Shipment | Checkbox | `jobs.is_sub_shipment` | Toggles Parent Master search field |
| **Entity Tab** | Shipper Name | Search Box | `job_entities` where role='shipper' | Autocomplete searches `companies` |
| **Entity Tab** | Shipper Address | Text Area | `job_entities.address` | Read-only until Shipper is selected |
| **Entity Tab** | Consignee Name | Search Box | `job_entities` where role='consignee'| Autocomplete searches `companies` |
| **Entity Tab** | Consignee Address| Text Area | `job_entities.address` | Read-only until Consignee is selected |
| **Entity Tab** | Customer Name | Search Box | `job_entities` where role='customer' | Maps default debtor to invoices |
| **Entity Tab** | Customer Address | Text Area | `job_entities.address` | Read-only until Customer is selected |
| **Entity Tab** | Origin Agent Name| Search Box | `job_entities` where role='origin_agent'| Autocomplete searches `companies` |
| **Entity Tab** | Origin Agent Address| Text Area | `job_entities.address` | Read-only until Origin Agent is selected |
| **Entity Tab** | Branch Hub Link | Hyperlink | UI Route Click Handler | Triggers default Chennai hub settings |
| **Entity Tab** | EDI Protocol Status| Hyperlink | API check endpoint click | Runs EDI connection status check |
| **Entity Tab** | Dest. Agent Name | Search Box | `job_entities` where role='dest_agent' | Autocomplete searches `companies` |
| **Entity Tab** | Dest. Agent Address| Text Area | `job_entities.address` | Read-only until Dest. Agent is selected |
| **Entity Tab** | Notify Name | Search Box | `job_entities` where role='notify' | Autocomplete searches `companies` |
| **Entity Tab** | Notify Address | Text Area | `job_entities.address` | Read-only until Notify is selected |
| **Entity Tab** | Consigned To Order| Search Box | `job_entities` where role='consigned_order'| Autocomplete searches `companies` |
| **Entity Tab** | Consigned Address| Text Area | `job_entities.address` | Read-only until Consigned is selected |
| **Entity Tab** | Selling Agent Name| Search Box | `job_entities` where role='selling_agent'| Autocomplete searches internal users |
| **Entity Tab** | Selling Agent Address| Text Area| `job_entities.address` | Read-only until Selling Agent is selected |
| **Footer Grid**| Dynamic Rows Util | Button Link | Array Append/Pop Handler | Triggers `Add / Remove Entity` |
| **Bottom Bar** | Save | Form Button | SQL `INSERT`/`UPDATE` Dispatch | Client validation check + state cache |
| **Bottom Bar** | Save & Close | Form Button | SQL Commit + Redirect | Routes to `SeaShipmentDashboard` |
| **Bottom Bar** | Save & New | Form Button | SQL Commit + State Reset | Resets form fields; increments Job No |
| **Bottom Bar** | Close | Form Button | State Clean + Exit | Unlocks row + redirects to dashboard |

---

### 12. HBL & MBL Data Mapping & Consolidation Workflow

In ocean freight forwarding, managing House Bills of Lading (HBL) and Master Bills of Lading (MBL) requires strict data alignment. For **Agent Consolidation** shipments in **LCL** mode, multiple HBL records are linked back to a single parent MBL record. The system automates this relationship using the following rules:

#### A. HBL vs. MBL Entity Mapping
The system maps different company records to the same relational fields depending on whether the document context is House (HBL) or Master (MBL):

| Entity Role | House Bill of Lading (HBL) | Master Bill of Lading (MBL) |
| :--- | :--- | :--- |
| **Shipper** | The actual exporter / manufacturer profile selected from the `companies` lookup. | The Freight Forwarder branch itself (defaults to your branch company ledger entry). |
| **Consignee** | The actual overseas buyer / importing company selected from the `companies` lookup. | The counterpart Destination Agent (defaults to the agent profile configured on the shipment). |
| **Notify Party** | The actual buyer or their designated local customs broker. | Same as Consignee (the counterpart Destination Agent profile). |

#### B. Cargo Consolidation Roll-up Engine
When a sub-shipment (HBL) is saved, its package counts, weights, and volumes are automatically summed and rolled up to the parent shipment (MBL) record. This is handled on the backend via a Laravel Model Observer on the `sea_shipment_details` table:

```php
namespace App\Observers;

use App\Models\SeaShipmentDetail;

class SeaShipmentDetailObserver
{
    public function saved(SeaShipmentDetail $detail)
    {
        if ($detail->job->is_sub_shipment && $detail->job->parent_job_id) {
            $parentJobId = $detail->job->parent_job_id;
            $lockKey = "job_rollup_lock:{$parentJobId}";
            
            // Debouncing: only dispatch a job if one wasn't queued in the last 2 seconds
            if (Cache::add($lockKey, true, 2)) {
                ProcessConsolRollupJob::dispatch($parentJobId)->delay(now()->addSeconds(2));
            }
        }
    }
}
```

#### C. Routing & Vessel Details Cascading
To prevent manifest mismatches, routing details (POR, POL, POD, DEL, Vessel, Voyage, IMO, Flag) must be identical. When these values are updated on the parent MBL shipment record, they automatically cascade to all associated child HBL records:

```php
public function saved(SeaShipmentDetail $detail)
{
    if (!$detail->job->is_sub_shipment) {
        SeaShipmentDetail::whereIn('job_id', function($query) use ($detail) {
            $query->select('id')->from('jobs')->where('parent_job_id', $detail->job_id);
        })->update([
            'vessel_name' => $detail->vessel_name,
            'voyage_no' => $detail->voyage_no,
            'vessel_flag' => $detail->vessel_flag,
            'imo_number' => $detail->imo_number,
            'por_code' => $detail->por_code,
            'pol_code' => $detail->pol_code,
            'pod_code' => $detail->pod_code,
            'del_code' => $detail->del_code,
        ]);
    }
}
```

#### D. Operational Workflow Sequence
```
[Triage Inbox/Email]
       │
       ▼
[Create Job / Enquiry] ──► Auto-generates unique Enquiry No (e.g. ENQS-26-0001)
       │
       ▼
[Tab 1: Entity Form] ──► Input actual Shipper & Consignee (HBL Scope)
       │
       ▼
[Confirm Shipment] ──► Generates Execution Job No & HBL No (e.g. JOBS-26-0001)
       │
       ▼
[Tab 2/3/4/5: Cargo] ──► Input Ports, Vessel/Voyage, Weights & Volume CBM
       │
       ▼
[Link Master BL Details] ──► Input Carrier Name & Carrier-issued MBL number
       │
       ▼
[Submit / Print Docs] ──► Roll up LCL weights ──► Print HBL for Client ──► Submit EDI to Shipping Line
```

---

### 13. Focus Sea Consolidation Page Design (`FocusSeaConsol.vue`)

To support shipping consolidations, we introduce `FocusSeaConsol.vue` loaded inside the drawer workspace (under scope `'sea'`). This page allows operators to manage container stuffing and group multiple HBLs under a single parent MBL.

#### A. Page Layout & UI Modules
1.  **MBL Search & Identification Header:**
    *   Search input box to lookup active Master Jobs by `execution_job_no` or `mbl_number`.
    *   Displays high-level MBL routing/cargo summary: POL, POD, Vessel/Voyage, total weight, CBM, and container quantities.
2.  **Consolidated HBL List Grid:**
    *   A dynamic table rendering all child HBL shipments currently linked to the MBL.
    *   Columns: Action (Unlink/Edit), HBL No, Shipper Name, Consignee Name, Piece Count, Weight, CBM, Nature of Goods.
3.  **HBL Association Panel:**
    *   An autocomplete search box querying unassociated House shipments:
        `GET /api/jobs?transport_mode=sea&is_sub_shipment=true&unassociated=true`
    *   Clicking **"Link HBL"** triggers `POST /api/jobs/{master_id}/link-hbl` with payload `{ child_job_id }`, establishing the `parent_job_id` relation in the database.
4.  **Container Stuffing & Association Matrix:**
    *   Provides a grid mapping each consolidated HBL record to the containers declared under the MBL (Tab 7).
    *   Enables operators to allocate stuffed pieces, weight, and volume for each HBL-container connection, writing to a `sea_container_items` joint table.

#### B. Database Schema: Container Stuffing (`sea_container_items`)
*   `id` (BigInteger, PK, Auto-increment)
*   `container_id` (BigInteger, FK referencing `sea_containers.id` on delete cascade)
*   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade) (The child HBL job)
*   `stuffed_pieces` (Integer, default: 0)
*   `stuffed_weight` (Decimal(10,3), default: 0.000)
*   `stuffed_volume` (Decimal(8,3), default: 0.000)
*   `created_at`, `updated_at` (Timestamps)

---

## 🌊 Focus Sea: Import Specifications

### 1. Form Specification: Sea Import Consol

Based on the **Entity** tab currently visible in the **Sea Import Consol** window, below is a breakdown of the visible fields, dropdowns, relationships, and structural details.

#### A. Top Header Fields & Dropdowns

These fields remain fixed at the top of the page regardless of which tab is selected.

| Field Name | Type | Options / Relationships / Rules | Character Limit | Database Target |
| --- | --- | --- | --- | --- |
| **Consol No** | Text Input / Auto-generated | System-generated upon saving with an **Edit icon** (pencil) for manual override if permissions allow. | Max 30 chars alphanumeric. | `jobs.execution_job_no` |
| **Date Field** | Date Picker | Defaults to the current date. Features a calendar icon shortcut. | `DD-MMM-YYYY` format. | `jobs.planned_clearance_date` |
| **Cargo Type** | Dropdown | Selects the nature of the cargo. Options: `General`, `Hazmat`, `Perishable`, `Loose`, `ULD`. | Standard dropdown. | `jobs.cargo_type` |
| **Consol Owner** | Search / Text Input | Features a **Magnifying Glass lookup icon**. Links to the internal user/employee database. | Max 50 chars. | `jobs.job_owner_id` (FK → `users.id`) |
| **Consol Type** | Dropdown | `Agent Consolidation` (default), `Buyer's Consolidation`. | Standard dropdown. | `jobs.consol_type` |

#### B. Tab Navigation Structure

The page uses a multi-tab architecture to organize freight data. The visible tabs are:

1.  **Entity** *(Active)*
2.  **Shipping Details**
3.  **Routing**
4.  **Container**
5.  **Attached House**
6.  **Packing Details**
7.  **DI Charges**
8.  **Financials**
9.  **Customs**
10. **E-Docket**

#### C. Active Tab Analysis: "Entity"

This tab handles the primary stakeholders involved in the shipment. It relies heavily on **Master Data Lookup Relations** (indicated by the magnifying glass icons), which auto-populate complete address profiles when an entity is selected.

##### Field & Dropdown Breakdown

*   **Destination Agent:**
    *   *Type:* Search Lookup Field (Magnifying glass icon) + Multi-line Text Display.
    *   *Current Value:* `KSR FREIGHT FORWARDERS PVT. LTD- INDIA` (Chennai branch address: *48/39, Rajaji Salai, Wavoo Mansion 6th Floor, Parrys, Chennai - 600001*).
    *   *Relations & Behavior:* Selecting a Destination Agent automatically populates the text area below it with the company's registered address, branch location (**CHENNAI**), country flag indicator, and triggers any electronic data interchange (**EDI**) rules mapped to that specific agent.
    *   *Character Limits:* The text box dynamically holds standard multi-line addresses (typically up to 250–500 characters in logistics ERPs).
*   **Origin Agent:**
    *   *Type:* Search Lookup Field (Magnifying glass icon) + Multi-line Text Display.
    *   *Relations & Behavior:* Selecting an Origin Agent will pull information from your global agent master database. It establishes the origin-side routing rules for the Consolidation.
    *   *Character Limits:* Standard master-data address block constraints.
*   **Selling Agent:**
    *   *Type:* Search Lookup Field (Magnifying glass icon) + Multi-line Text Display.
    *   *Relations & Behavior:* Links the job to an internal sales representative or external co-loader/broker master file for profit-sharing and commission tracking.
    *   *Character Limits:* Standard master-data address block constraints.
*   **Dynamic Actions:**
    *   *Add / Remove Entity:* A hyperlinked text action button that allows you to add custom entity roles (like *Notify Party* or *Main Line Carrier*) or remove optional ones from this specific job view.

#### D. Page Action Controls

Located at both the top-left and bottom-right of the viewport:

*   **Save:** Commits data to the database and keeps the current page open.
*   **Save & Close:** Commits data and returns you to the Consol search grid.
*   **Save & New:** Commits data and clears the fields to immediately start another entry.
*   **Close:** Aborts the current operation (discards changes if unsaved).

---

### 2. Form Specification: Delivery Order [Sea]

Based on the active interface for the **Delivery Order [Sea]** module (URL: `DOAirImp.aspx?Mode=S`), below is a detailed breakdown of all the fields, dropdowns, related inputs, tabs, and their character/validation constraints below the main top header row:

#### A. Document Identification Fields (Upper Section) Specification

| Field Name | Type / Control | Character Limit / Format | Description / Relational Logic | Database Target |
| --- | --- | --- | --- | --- |
| **Shipment No / Consol No** | Dropdown Toggle & Search | Max 30-50 chars alphanumeric | Toggle selection. Filters lookup for individual shipment or consol job. | `jobs.execution_job_no` (where `transport_mode = 'sea'`) |
| **CAN Number / Invoice No.** | Dropdown Toggle & Search | Max 30-50 chars alphanumeric | Toggle selection. Links the DO to pre-arrival CAN or billing invoice. | `cargo_arrival_notices.can_no` / `accounts_invoices.invoice_no` |
| **DO Given To** | Free-text Input | Max 100 chars | Recipient representative picking up the legal delivery order. | `sea_shipment_details.do_given_to` |

#### B. Form Tabs

The lower section contains a multi-tabbed interface to categorize entities, logistics tracking, and financial status:
*   **Entity Tab** *(Currently Active)*: Used to assign the organizational parties involved in the cargo release chain.
*   **Shipment Tab**: Contains operational shipping details (e.g., container numbers, weight, volume, Bill of Lading details).
*   **Payment Tab**: Contains financial indicators (e.g., credit status, pending invoices, collected charges) to ensure the shipment is financially cleared for release.
*   **History Tab**: An audit trail showing generation dates, modifications, and user logs.

#### C. Entity Tab Fields & Inputs Specification

Every field block under this tab contains a **Search/Code input box** (top line with lookup) and a large **Address/Name text area** (bottom block) which auto-populates.

| Field Name | Type / Control | Character Limit / Format | Description / Relational Logic | Database Target |
| --- | --- | --- | --- | --- |
| **Consignee** | Search Lookup / Text Area | 250-500 chars address block | Billed party or receiver authorized to claim the cargo. | `job_entities` (role: `'consignee'`, FK → `companies.id` & `address`) |
| **Transporter** | Search Lookup / Text Area | 250-500 chars address block | Trucking / haulage company moving the cargo inland. | `job_entities` (role: `'transporter'`, FK → `companies.id` & `address`) |
| **High Sea Buyer** | Search Lookup / Text Area | 250-500 chars address block | In-transit buyer under high seas sale (overrides Consignee). | `job_entities` (role: `'high_sea_buyer'`, FK → `companies.id` & `address`) |
| **Custom Broker** | Search Lookup / Text Area | 250-500 chars address block | Licensed Customs House Agent (CHA) clearing customs. | `job_entities` (role: `'customs_broker'`, FK → `companies.id` & `address`) |
| **Pick Up** | Search Lookup / Text Area | 250-500 chars address block | Warehouse, CFS, or terminal storage origin coordinates. | `sea_shipment_details.empty_depot` / `pickup_address` |
| **Delivery Add.** | Free-text Area | 500 chars editable block | Final physical address for cargo delivery. Manual override allowed. | `sea_shipment_details.delivery_address` |

#### D. Page Action Buttons

Located at the bottom right of the module view, these buttons execute the primary system tasks:

*   **[Generate]**: Validates all input data and processes the creation of the Delivery Order record.
*   **[Save & New]**: Saves the current record and refreshes the form back to a blank `----NEW ENTRY----` state.
*   **[Save & Close]**: Saves the current record and closes the window/returns to the dashboard directory.
*   **[Print DO]**: Becomes clickable only after the record is generated/saved **and** the Payment Tab status requirements (Paid or Approved Credit) are fully satisfied.
*   **[Print Receipt]**: Becomes active once a financial ledger payment transaction is mapped against the DO.
*   **[Close]**: Exits the module without saving changes.

#### E. Page State & Session Meta

*   **Task Mode:** `New` (Indicates a completely fresh record entry session).
*   **Session Timeout:** A countdown timer sits in the top right corner showing the active window validity before automatic session expiry.

---

### 3. Form Specification: CGM Filing (Sea)

Based on the active Logi-Sys screen for **CGM Filing (Sea)** under the **Sea Import** module, below is a complete breakdown of every field, the specific dropdown options available, how the fields interact with each other, and the rigid character/data limitations enforced by Indian Customs (**ICEGATE / SCMTR** rules).

#### A. Top Section Filter Grid (Search Bar) Specification

| Field Name | Type / Control | Character Limit / Format | Description / Relational Logic | Database Query Target |
| --- | --- | --- | --- | --- |
| **Filing Type** | Dropdown | `CGM`, `SCMTR` | Determines traditional ICEGATE vs. SCMTR regulatory validation. | `manifest_filings.filing_type` |
| **Consol Job No.** | Alphanumeric Text Input | Max 15 chars | Sourced from sea consolidation job lookup. | `jobs.execution_job_no` (where `transport_mode = 'sea'`) |
| **Transaction** | Dropdown | Options: `(Both)`, `Submitted`, `Received` | Filters grid based on electronic logging. | `manifest_filings.transaction_status` |
| **Custom House** | Searchable Dropdown | Strictly 6 chars ICEGATE code | Location port (e.g. `INMAA1` for Chennai Port). | `manifest_filings.customs_house_code` |
| **From Date / To Date** | Date Pickers | `DD-MMM-YYYY` | Filters cargo manifest search bounds. | Query bounds on `jobs.created_at` |
| **ICEGATE Id** | Dropdown | Max 20 chars alphanumeric | Selects corporate profile authorized to transmit. | `manifest_filings.icegate_id` |

#### B. "Submit CGM Data" Window (The Processing Modal) Specification

| Field Name | Type / Control | Character Limit / Format | Description / Relational Logic | Database Target |
| --- | --- | --- | --- | --- |
| **Date & Time** | Split Text Inputs | `DD-MM-YYYY` / `HH:MM PM/AM` | Transmission timestamp tracking. | `manifest_filings.submitted_at` |
| **Consol No.** | Search Lookup | Max 16 chars | Master consolidated job card link. | `manifest_filings.job_id` (FK → `jobs.id` where `transport_mode = 'sea'`) |
| **Amend Job Number** | Numeric Input | Max 2 digits | Incremented sequence counter for amendments. | `manifest_filings.amendment_no` |
| **CGM File At** | Searchable Dropdown | Strictly 6 chars | Target port terminal station LOCODE code. | `manifest_filings.customs_house_code` |
| **Sending Method** | Radio Buttons | Options: `Auto File`, `Manual`, `Email` | Chosen EDI gateway channel. | `manifest_filings.sending_method` |
| **Status Box** | Read-Only Text Area | Large text block | Local validation error desk / status tracker. | `manifest_filings.status_log` |

#### C. Underlying Sea Import Data Limits (Enforced on Submit)

When hitting **[Submit]** or **[Send for Signature]**, Logi-Sys compiles a flat file. If the underlying data imported from your sea operations exceeds these rigid ICEGATE character lengths, the file will fail structural validation:

| Field Name | Data Type | Character Limit | Validation & Relationship Rules | Database Target |
| --- | --- | --- | --- | --- |
| **MBL Number** | Alphanumeric | **20 chars** | Must match the shipping line's physical manifest perfectly. No spaces. | `sea_shipment_details.mbl_number` |
| **HBL Number** | Alphanumeric | **20 chars** | Unique number identifying the actual importer's cargo slip. | `sea_shipment_details.hbl_number` |
| **Container Number** | Alphanumeric | **11 chars** | Must follow standard ISO prefix tracking rules (e.g., 4 letters + 7 numbers like `MSKU1234567`). | `sea_containers.container_number` |
| **Seal Number** | Alphanumeric | **15 chars** | The mechanical/customs bolt seal ID. Must be logged accurately for sea freight container clearance. | `sea_containers.seal_number` |
| **Package Code** | Alphanumeric | **3 chars** | Standard customs package code type (e.g., `BOX`, `PAL`, `CNT`). | `sea_shipment_details.package_type` |
| **Gross Weight** | Decimal | **14 digits total** | Up to 3 decimal points (e.g., `9999999999.999`). Must match total HBL weight roll-ups. | `sea_shipment_details.gross_weight` |

---

## 📊 Backend Analytical Tables & Business Intelligence Formulas

To power the executive metrics dashboards (DSR/MSR/YSR), provide direct client margin tracking, and monitor operational performance, we define dedicated analytical schema structures and calculate mathematical metrics on the backend.

### 1. New Analytical Tables (Backend Reporting Targets)

#### A. `llm_usage_logs` (Gemini API usage logging) (New)
*   *Purpose:* Records detailed prompt inputs, outputs, models, and costs for API auditing.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete set null, Nullable)
    *   `model` (String, max 50)
    *   `tokens_in` (Integer)
    *   `tokens_out` (Integer)
    *   `cost_usd` (Decimal(8,6))
    *   `created_at`, `updated_at` (Timestamps)

#### B. `financial_snapshots` (Tenant-Level Financial Performance Snapshot) (New)
*   *Purpose:* Pre-aggregates daily financial indicators to speed up high-level Executive Dashboards (Tier 3) without scanning heavy transaction ledgers on request.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`): Tenant isolation.
    *   `snapshot_date` (Date, Index): Snapshot logging date.
    *   `accounting_period_id` (BigInteger, Nullable, FK referencing `accounting_periods.id` on delete set null): Links snapshot to active accounting period to verify locks.
    *   `total_receivables` (Decimal(15,2)): Total outstanding client invoices (`accounts_invoices` where status != paid).
    *   `total_payables` (Decimal(15,2)): Total outstanding vendor vouchers (`accounts_purchase_vouchers` where status != paid).
    *   `net_cash_flow` (Decimal(15,2)): Net changes in cash balances on this date.
    *   `cash_on_hand` (Decimal(15,2)): Sum of matched reconciled deposits.
    *   `unbilled_revenue` (Decimal(15,2)): Sum of estimated sell charges for operational jobs that have reached "Completed" status but have not had standard client invoices issued yet.
    *   `accrued_expenses` (Decimal(15,2)): Sum of estimated buy rates for jobs where vendor purchase vouchers are still pending.
    *   `last_computed_at` (Timestamp): Date/time the snapshot values were last computed (used for staleness alerts on frontend dashboards if data is older than 1 hour).
    *   `created_at`, `updated_at` (Timestamps)
*   *Unique Index:* `(agent_id, snapshot_date)`

#### B. `milestone_performance_logs` (SLA & Latency Tracker) (New)
*   *Purpose:* Records chronological transitions of jobs through milestones, feeding the ApexCharts staff capacity, milestone duration widgets, and document generation speed reports.
*   *Columns:*
    *   `id` (BigInteger, PK, Auto-increment)
    *   `agent_id` (BigInteger, FK referencing `agents_info.id`)
    *   `job_id` (BigInteger, FK referencing `jobs.id` on delete cascade, Index)
    *   `stage` (Enum: `'Intake'`, `'AI Extraction'`, `'Verification'`, `'Generation'`, `'PDF Generated'`, `'Sent to Airline'`, `'Airline Confirmed'`, `'Completed'`, `'Lost'`): The active operational stage.
    *   `operator_id` (BigInteger, Nullable, FK to `users.id`): Operating agent assigned during this milestone.
    *   `entered_at` (Timestamp): Stage entry time.
    *   `left_at` (Timestamp, Nullable): Stage exit time.
    *   `duration_seconds` (Integer, Nullable): System-calculated duration (`left_at` - `entered_at`).
    *   `sla_limit_seconds` (Integer): The target SLA limit for this milestone.
    *   `is_sla_breached` (Boolean, default: false)
    *   `created_at`, `updated_at` (Timestamps)
*   *Telemetry Logic for OPS Document Generation & Airline Speed:*
    *   **Start of Verification/Generation:** Logged when the operator opens the validated draft.
    *   **Document Generation Time:** Logged as the duration in the `'Generation'` stage (from when the operator verified the data until the PDF compiled state `'PDF Generated'` is achieved). Measures how fast the operations staff is compiling AWB/HAWB files.
    *   **Airline Transmission Latency:** Logged as the duration in the `'PDF Generated'` stage (from file compilation until the operator transmits/sends the file to the airline/carrier: transition to `'Sent to Airline'`).
    *   **Airline Confirmation Latency:** Logged as the duration in the `'Sent to Airline'` stage (from transmission until the airline replies and booking/space is officially confirmed: transition to `'Airline Confirmed'`).
    *   **Completed Dispatch Latency:** Logged as the duration in the `'Airline Confirmed'` stage (from confirmation until cargo departure and job marks as `'Completed'`).

---

### 2. Business Intelligence Formulas (Backend Metrics Engines)

#### A. Segment A: Operational & SLA Analytics
*   **Email Triage Response SLA:**
    $$\text{Response Latency} = \text{FirstReplyTime} - \text{EmailReceivedTime}$$
    *Goal:* Must be under 15 minutes (`900` seconds) for Tier 2/3 accounts.
*   **Job Intake-to-Execution Conversion Rate (CR):**
    $$\text{Conversion Rate (\%)} = \left( \frac{\text{Total Jobs with } \texttt{execution\_job\_no}}{\text{Total Jobs Created (Intake state)}} \right) \times 100$$
*   **Operator Active Load Index (OLI):**
    $$\text{OLI} = \sum_{j \in \text{AssignedActiveJobs}} \left( \text{Weight}_j \times \text{Complexity}_j \right)$$
    *Complexity Multipliers:*
    *   Air Export = `1.0`
    *   Air Import = `1.5`
    *   Sea Export = `2.0`
    *   Sea Import = `2.5`
    *   *Weight Metric ($W$):* Chargeable cargo mass in metric tons.

#### B. Segment B: Automated Financials & Margin Control
*   **Gross Margin per Operational Job:**
    $$\text{Gross Profit (\%)} = \left( \frac{\text{Sales Revenue} - \text{Cost of Sales}}{\text{Sales Revenue}} \right) \times 100$$
    *   *Sales Revenue:* Aggregated `accounts_invoice_items.net_amount` mapped to `job_id`.
    *   *Cost of Sales:* Aggregated `accounts_purchase_items.net_amount` mapped to `job_id`.
*   **Days Sales Outstanding (DSO - Debt Collection Ratio):**
    $$\text{DSO} = \left( \frac{\text{Average Accounts Receivable for Period}}{\text{Total Credit Sales Billed in Period}} \right) \times \text{Days in Period}$$
*   **CASS Cargo Weight Reconciliation Variance Rate:**
    $$\text{Weight Variance (\%)} = \left( \frac{\text{CASS Gross Weight} - \text{AWB Chargeable Weight}}{\text{AWB Chargeable Weight}} \right) \times 100$$
    *Action Threshold:* Discrepancies exceeding $\pm 1.0\%$ trigger a validation override block.

#### C. Segment C: Import Clearance Demurrage Safeguards
*   **Port Warehouse Demurrage Countdown:**
    $$\text{Demurrage Countdown (Days)} = \text{Storage Start Date} - \text{Current Date}$$
    *Alert Rule:* If Countdown $\le 1$ day, the UI displays a critical red storage warn outline on the workspace panel.
*   **Custom House Release Velocity (CHRV):**
    $$\text{CHRV} = \text{Customs Clearance Date} - \text{Vessel/Flight Arrival Date}$$

### 3. Business Intelligence Dashboards: Knowing the Business (Sales vs. Admin Roles)

To translate raw database tables and backend formulas into actionable operational insights, the frontend exposes scoped dashboard workspaces tailored for Sales Representatives and Operations/Branch Administrators.

#### A. The Sales Team Cockpit (Customer & Revenue Optimization)
Sales representatives use the cockpit to track customer account health, maximize booking conversions, and catch margin leaks:
*   **Quotation-to-Booking Win Ratio:** Renders the conversion funnel from initial email enquiries to finalized operational jobs. Highlights where client enquiries drop off, allowing reps to identify uncompetitive carrier rates or delayed response times.
*   **Client Margin & Wallet Share Leaderboards:** Renders client accounts sorted by cumulative gross margin (Sales Revenue - Cost of Sales) alongside tonnage volumes. This exposes:
    *   *High-Volume, Low-Margin Accounts:* Targets for rate renegotiations.
    *   *Low-Volume, High-Margin Accounts:* High-potential candidates for active sales expansion.
*   **Proactive Credit Health Monitor:** Compares active client accounts receivable balances against their set credit limits (`companies.credit_limit`). Alerts sales reps when a client reaches 80% of their limit, enabling proactive collections follow-ups before the system freezes their pending delivery orders.
*   **AI-Generated Lane Consolidation Leads:** Feeds a list of recurring LCL/loose shipments on identical lanes (e.g. weekly cargo to identical ports/airports) that can be merged into a single consolidated FCL container or ULD, boosting margin captures by up to 35-40%.

#### B. The Admin & Director Cockpit (Branch & Workflow Optimization)
Branch directors, pricing managers, and operations leads use this cockpit to balance staff load, eliminate bottleneck latencies, and prevent financial leakage:
*   **Staff Workload Balancing Grid:** Visualizes current active operator assignments scoped by the Operator Load Index (OLI). Highlights overloaded team members, allowing branch managers to dynamically reassign inbound jobs and prevent SLA breaches.
*   **Milestone Latency Heatmap:** Charts the average duration spent in each operational stage (Intake, Extraction, Verification, Generation, Completion). Breaks down where process blockages occur (e.g., highlighting if verification is bottlenecked due to scanned image OCR failures).
*   **Revenue Leakage Queue (Unbilled Jobs Tracker):** Displays completed jobs that have not had standard sales invoices issued yet, sorted by `delay_days`. Directly monitors working capital health, alerting directors when a branch's billing lag exceeds 7 days.
*   **Carrier Auditing & Dispute Panel:** Summarizes rate and weight discrepancies flagged during CASS statement uploads and Plaid bank matching processes. Exposes instances where carriers overcharged estimated rates or applied incorrect exchange rate multipliers.

---

## 🗺️ Step-by-Step Implementation Roadmap

### Phase 1: Core Document Ingestion, Database Foundation & Models
*   **Step 1.1:** Upgrade FastAPI server to support `PyMuPDF` (`fitz`) and Pydantic validation schemas. Implement Gemini model integrations with cached prompts for unstructured invoices/packing lists. Check for Python microservice errors.
*   **Step 1.2:** Run database migrations to add `tier`, `email_domain`, and `transport_mode` columns to `companies` and `pdf_processing_jobs` tables.
*   **Step 1.3:** Run database migrations to add `origin_port_id` (referencing `ports.id`) and `pima_address` columns to the `users` table. Check for schema mapping errors.
*   **Step 1.4:** Create the drag-and-drop file upload handler inside `OcrUploadModal.vue`. The modal hits the backend, triggers the extraction task, saves the result to `pdf_processing_jobs.extracted_data`, and returns the JSON payload to pre-populate form fields in `FocusAir.vue` and `HouseWayBill.vue` inline.
*   **Step 1.5:** Run validation tests and sanity check each model and endpoint for errors before moving to Phase 2.

### Phase 2: Inbox Sync, OAuth Validation & Split-Screen Workspace UI
*   **Step 2.1:** Run migration tasks for `mailbox_connections`, `inbound_emails`, and `inbound_attachments`. Ensure constraints are verified.
*   **Step 2.2:** Build the scheduled `mailboxes:poll` Artisan command to sync Google/Microsoft accounts, extract attachments, and classify threads (utilizing domain exclusions and regex filters).
*   **Step 2.3:** Build `MailboxOAuthController` callbacks. Enforce corporate email domain verification: verify that the domain of the connected mailbox exactly matches the selected company's `email_domain` for Tier 2 and 3 connections. Reject and return `403` on mismatch. Test this restriction in isolation for errors.
*   **Step 2.4:** Build `JobInbox.vue` (3-column inbox layout) and check routing endpoints.
*   **Step 2.5:** Implement the **Split-Pane Column Hiding Logic**: opening the drawer slides the sidebar/thread list off-screen and presents a 50/50 split of the email timeline on the left and form verification (Focus Air / HAWB) on the right.
*   **Step 2.6:** Execute verification tests for inbox sync and OAuth callbacks, ensuring domain verification behaves correctly, checking for errors after each step.

### Phase 3: Workflow Automation, Kanban & Job Cost Sheets
*   **Step 3.1:** Create `jobs` table migration. Implement triage actions (e.g. converting email thread to Job) and assign task dialog (clearance dates, assigned operator, AWB association). Verify relationships for errors.
*   **Step 3.2:** Build `OpsDashboard.vue` (Kanban cards workflow supporting both Process View and Schedule clearance-date View) and test component drag-and-drop behavior.
*   **Step 3.3:** Run migrations for `accounts_invoices`, `accounts_invoice_items`, `accounts_purchase_vouchers`, and `accounts_purchase_items`.
*   **Step 3.4:** Build the **Job Cost Sheet UI** inside the workspace drawer tab. Auto-populate charging quantities from AWB weight and DO details, allowing reps to manually adjust Buy/Sell rates.
*   **Step 3.5:** Validate the integrity of database status logs, task allocations, and accounting ledger inputs, checking for errors.

### Phase 4: Multi-Portal Access Scoping & User Onboarding
*   **Step 4.1:** Build company registration and user self-registration/onboarding flows. Mandate selection of the designated origin port (`origin_port_id`) referencing `ports.id` during user registration. Verify input constraints for errors.
*   **Step 4.2:** Build the pre-login company selection dropdown page. Bind the selected `company_id` and the scoped `active_portal_scope` dynamically to user sessions. Check session storage operations for errors.
*   **Step 4.3:** Create user profile editing forms in the admin portal backend to allow administrators to assign/edit the `pima_address` for routing.
*   **Step 4.4:** Apply Global Laravel Query Scopes to filter `jobs`, `pdf_processing_jobs`, and accounting tables by `transport_mode` in real-time.
*   **Step 4.5:** Build sea templates (`FocusSeaMaster.vue` / `FocusSeaHouse.vue` / `FocusSeaConsol.vue`) to load dynamically inside the drawer workspace depending on the active portal. Register route navigation paths in `router.js` contextually.
*   **Step 4.6:** Verify session scoping, onboarding port selections, and admin edits, checking for errors in each step.

### Phase 5: Automated Ledgers, CASS Reconciliations & Reports
*   **Step 5.1:** Run migrations for `accounts_ledger_entries` and `accounts_cass_statements` and audit triggers.
*   **Step 5.2:** Build Plaid/Setu sync service to poll raw bank statements every 3 days. Implement matching engines to reconcile receipts against invoice balances. Check connection endpoints for errors.
*   **Step 5.3:** Build CASS file upload portal. Reconcile reported AWB charges with estimated cost vouchers, flagging weight/rate mismatches.
*   **Step 5.4:** Compile financial balance sheets, trial balance sheets, and Profit & Loss reports from the ledger.
*   **Step 5.5:** Run reconciliation runs and report computations, validating results and checking for errors at each point.

---

## ⚡ Speed & Efficiency Optimization Plan

To keep the application highly responsive, low-latency, and cost-effective, we will implement the following optimizations:

### 1. In-Memory PDF Processing (FastAPI)
*   **Optimization:** Avoid saving uploaded files to local disk on the FastAPI server. Use `fitz.open(stream=...)` to process the binary buffer in-memory directly.
*   **Impact:** Speeds up document parsing by eliminating disk I/O bottlenecks.

### 2. LLM Prompt Caching (Gemini API)
*   **Optimization:** Cache the system instructions and data output schemas (e.g., AWB mapping coordinates and Invoice formatting structures) in Gemini's context cache.
*   **Impact:** Reduces LLM response latency from ~4 seconds to under 1.5 seconds and cuts prompt input costs by up to 80%.

### 3. Delta Email Syncing & Lazy-Loading Attachments
*   **Optimization:**
    *   Use Microsoft delta queries and Google history IDs to sync only *new* emails, preventing full mailbox scans.
    *   Only download attachment files to disk when a user explicitly initiates document parsing or selects the extraction tab, avoiding bandwidth and storage bloat.
*   **Impact:** Keeps the `mailboxes:poll` background job execution time under 1–2 seconds and reduces server disk space.

### 4. Database Indexing & Query Optimizations
*   **Optimization:**
    *   Create single-column indexes on highly searched columns: `inbound_emails.message_id`, `email_threads.thread_key`, `manifest_filings.icegate_id`, `jobs.transport_mode`, and `pdf_processing_jobs.status`.
    *   Create composite indexes to speed up multi-condition filter queries on dashboards:
        *   Inbox Folders View: `email_threads[agent_id, status, latest_message_received_at]`
        *   Kanban Board View: `jobs[agent_id, transport_mode, status]`
        *   Ledger Scans: `accounts_ledger_entries[agent_id, posting_date, account_code]`
    *   Avoid using slow SQL aggregation queries (`COUNT`, `SUM`, `AVG`) on live transactional tables. Instead, query materialized database views (`dsr_funnel_view`) or aggregate results inside Redis keys that are updated via model observers on creation/deletion.
*   **Impact:** Decreases search query latencies from seconds to milliseconds, shielding databases from scaling bottlenecks under concurrent operator workflows.

### 5. Eager Loading Optimization (N+1 Query Prevention)
*   **Optimization:**
    *   Enforce standard Laravel Eloquent query audits to prevent N+1 query loops. Ensure relations are eager loaded using `with()` or lazy eager loaded via `load()`.
    *   *Core Eager Load Profiles:*
        *   Loading Inbox feeds: `EmailThread::with(['assignedOperator', 'job'])`
        *   Loading Job drawers: `Job::with(['client', 'operator', 'waybill', 'entities.company', 'containers'])`
        *   Loading Invoices: `Invoice::with(['client', 'items'])`
*   **Impact:** Reduces the count of SQL round-trips from dozens per request to exactly 1 or 2 queries, accelerating page rendering speeds.

### 6. Database Partitioning for Large Log & Ledger Tables
*   **Optimization:**
    *   Implement **Range/List Partitioning** on tables expected to hold millions of rows: `inbound_emails` and `accounts_ledger_entries`.
    *   *Strategy:* Partition `inbound_emails` by year/month range (e.g. `PARTITION p2026_06 VALUES LESS THAN ('2026-07-01')`) and `accounts_ledger_entries` by `agent_id` list values.
*   **Impact:** Limits queries scanning historic records to search within a single partition file, minimizing index sizes and disk read constraints.

### 7. Distributed Locks & Asynchronous Queue Workers
*   **Optimization:**
    *   Use **Redis Distributed Locks** (via Laravel Cache lock interface) on critical operations: sequence increments (if outside database transactions) and Plaid webhook ingestions.
    *   Decouple non-blocking tasks from the HTTP lifecycle using Redis queues. Dispatch email ingestion parsing, AWB PDF compilation, CASS statement tally runs, and audit logging tasks directly to background workers using Laravel Horizon.
*   **Impact:** Safeguards data consistency from concurrent duplication conflicts and keeps HTTP response latency under 100 milliseconds.

---

## 🔒 Security, Integrity & Infrastructure Strategies

### 1. Soft Deletes Policy
To preserve the auditing and historical integrity of logistics and financial operations, the system enforces a split soft deletes framework:
*   **Operational Tables (Soft Delete Enabled):** Tables like `jobs`, `sea_shipment_details`, `job_entities`, `sea_containers`, `mailbox_connections`, and `companies` use Laravel's `SoftDeletes` trait (`deleted_at` timestamp).
    *   *Cascade Deletion:* When an operational model is soft-deleted, a background model observer automatically dispatches a queued cascade task to soft-delete associated child structures (e.g., deleting a Consol Job soft-deletes its `job_entities` and links).
*   **Financial Tables (Soft Delete Forbidden):** Tables representing finalized legal accounting states—specifically `accounts_invoices`, `accounts_purchase_vouchers`, `accounts_ledger_entries`, and `gst_ledger_entries`—**must never use soft deletes**.
    *   *Audit Trail Integrity:* Once committed, financial entries are immutable. Any cancellation, rate reduction, or correction must be executed via credit notes, debit notes, or formal counter-journal ledger postings.

### 2. API Resilience & Gateway Error Handling
When interacting with external APIs (FastAPI unstructured OCR, Gmail, Microsoft Graph, Plaid, and ICEGATE gateways), the Laravel app implements the following resilience pattern:
*   **Decoupled Jobs with Retry Queues:** All network-bound API calls are wrapped inside Laravel Queue Jobs using the database or Redis queue driver.
*   **Exponential Backoff with Jitter:** Failed API calls automatically retry with a delay formula:
    $$\text{Delay} = 2^{\text{attempt}} \times 100 \text{ ms} \pm \text{Random Jitter}$$
    Capped at a maximum of 5 retry attempts.
*   **Circuit Breaker Pattern:** For critical endpoints like Plaid bank imports or FastAPI OCR server, a circuit breaker (via Redis keys) triggers after 5 consecutive failures, immediately failing fast and warning operators for 15 minutes before attempting automated recovery checks.
*   **Dead Letter Queue (DLQ):** If retries exhaust, jobs transition to a `failed_jobs` table, dispatching real-time notifications to branch admins with raw request payload contexts.

### 3. Data Backup, Archival & Retention Strategy
*   **Database Snapshots:** Daily incremental backups and hourly transactional log shipping to an isolated AWS S3 bucket encrypted with AWS-KMS. Backups are retained for 30 days.
*   **Ledger Archiving:** Financial year-end closure triggers a batch process that exports auditing-locked `accounts_ledger_entries` and `gst_ledger_entries` into read-only, compressed JSON/Parquet archives saved in S3 with Object Lock enabled (Compliance WORM - Write Once, Read Many).
*   **E-Docket Document Retention:** Historical file uploads in `job_documents` are kept in hot storage for 12 months, then automatically moved to Amazon S3 Glacier Flexible Retrieval for 5 years to meet statutory customs compliance, before final automated purging.

### 4. Invoice Sequence Generation per Billing Type
To prevent duplicate invoice numbers under concurrent request spikes, billing sequence numbers are generated through a strict concurrency lock:
*   **Sequential Naming Layout:**
    *   Standard Invoice: `INV-{FY}-{INCREMENT}` (e.g. `INV-26-00001`)
    *   Revenue Debit Note: `DN-{FY}-{INCREMENT}` (e.g. `DN-26-00001`)
    *   Revenue Credit Note: `CN-{FY}-{INCREMENT}` (e.g. `CN-26-00001`)
    *   Brokerage Invoice: `BRK-{FY}-{INCREMENT}` (e.g. `BRK-26-00001`)
    *   Consol Invoice: `CSINV-{FY}-{INCREMENT}` (e.g. `CSINV-26-00001`)
*   **Tenant-Scoped Counter Table (`invoice_sequences`):**
    A tracking table increments counters uniquely scoped by `(agent_id, type, fiscal_year)`.
*   **Concurrency Locking Mechanics:**
    To block race conditions, sequence calculation uses a database transaction row lock:
    ```sql
    SELECT counter FROM invoice_sequences 
    WHERE agent_id = ? AND type = ? AND fiscal_year = ? 
    FOR UPDATE;
    ```
    This blocks concurrent invoice saves from generating overlapping numbers. Once the incremented number is retrieved and committed to the invoice header, the transaction releases.
*   **Fiscal Boundary Rollover:** Fiscal years roll over based on regional compliance (e.g., April 1st for Indian GSTIN operations), resetting increment counters to `00001` automatically.

---

---

---

## 📝 Technical Implementation Checklist

> *Below is the precise, step-by-step checklist converting the blueprint above into database migrations, models, services, controllers, and frontend views.*

This plan converts the conceptual [future_plan.md](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/future_plan.md) blueprint into a precise, step-by-step execution checklist. Every step references exact file paths, database schemas, Pydantic/Eloquent models, and testing protocols.

---

## 🏗️ Architectural Prerequisites & Decisions

These decisions represent core architectural gates that must be resolved before writing functional logic.

> [!IMPORTANT]
> **1. Queue Connection & Lock Driver:**
> - **Configuration:** Verified `.env` contains `QUEUE_CONNECTION=redis`.
> - **Architecture:** Redis is the official driver for queues, cache, and distributed locking. Redis locks (`Cache::lock`) will be used for sequence generators and database concurrency controls.

> [!IMPORTANT]
> **2. Broadcasting & WebSockets:**
> - **Driver Configuration:** `.env` should set `BROADCAST_DRIVER=pusher`.
> - **Server:** Use a Pusher-compatible server (e.g. self-hosted Node-based **Soketi** or standard **Pusher SaaS**).
> - **Frontend Echo Setup:** Set up `laravel-echo` and `pusher-js` in `package.json` to listen on custom Soketi host/port configurations.

> [!IMPORTANT]
> **3. Model Namespacing:**
> - **Standard:** Match the existing codebase where models are placed in the `app/` root directory (e.g. `app/AirwayBills.php`, `app/PdfProcessingJob.php`).
> - **Rule:** Place all new models (`app/Job.php`, `app/EmailThread.php`, etc.) in the root `app/` directory under namespace `App`.

> [!IMPORTANT]
> **4. Morph Map Registration:**
> - **Rule:** Register short-string polymorphic source types in `AppServiceProvider::boot()` via `Relation::morphMap` to ensure clean lookups on `approved_drafts_queue`, `unposted_transactions_queue`, and `gst_ledger_entries`.

> [!IMPORTANT]
> **5. Third-Party Credentials:**
> - **Environment Variables:** Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, and `GEMINI_API_KEY` in `.env`.

> [!IMPORTANT]
> **6. Granular Phase Execution & Verification:**
> - **Rule:** The changes for each phase must be kept small and incremental.
> - **Validation:** Test and check for errors at every single step before moving to the next.

---

## Existing Codebase Inventory

| Layer | What Exists Today | Key Files |
|---|---|---|
| **Framework** | Laravel 7+ / Vue 2.7.16 / Laravel Mix | [package.json](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/package.json) |
| **FastAPI** | `/extract` endpoint using `pdfplumber` | [ocr_server.py](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/python/ocr_server.py) |
| **Models** | In `app/` root: `AirwayBills.php`, `HousewayBills.php`, `PdfProcessingJob.php` | [app/AirwayBills.php](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/app/AirwayBills.php) |

---

## Phase 1a: Complete Database Foundation & Eloquent Models

> **Goal:** Run all database migrations (Operational, Mode-Specific details, LLM usage logging, and Financial ledgers) first to build a solid schema foundation. Add matching Eloquent models and sequence counters.

### Step 1a.1 — Modify Existing Tables (3 Migrations)
- Add `tier` and credit columns to `companies`.
- Add `uuid` and `job_id` to `air_way_bills` and `houseway_bills` tables.
- Add `direction` to `pdf_processing_jobs`.

### Step 1a.2 — Create New Operational Tables
- **Migration 1: `sequence_counters` table (Timestamp: `2026_06_14_000000_create_sequence_counters_table.php`)**
  ```php
  Schema::create('sequence_counters', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('agent_id');
      $table->string('prefix', 10);
      $table->string('fiscal_year', 4);
      $table->unsignedInteger('current_value')->default(0);
      $table->timestamps();
      $table->unique(['agent_id', 'prefix', 'fiscal_year']);
      $table->foreign('agent_id')->references('id')->on('agents_info');
  });
  ```
- **Migration 2: `ports` (Timestamp: `2026_06_14_000004_create_ports_table.php` — UN/LOCODE Reference)**
  ```php
  Schema::create('ports', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('locode', 5)->unique()->index();
      $table->string('port_name', 100);
      $table->string('country_code', 2);
      $table->enum('port_type', ['sea', 'air', 'inland', 'multi']);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
  });
  ```
- **Migration 3: `jobs` (Core operational card — uses status enum constraint and DB-level role triggers)**
  ```php
  Schema::create('jobs', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('agent_id');
      $table->enum('transport_mode', ['air', 'sea']);
      $table->enum('direction', ['export', 'import'])->default('export');
      $table->string('enquiry_no')->unique();
      $table->string('execution_job_no')->unique()->nullable();
      $table->unsignedBigInteger('client_id')->nullable();
      $table->unsignedBigInteger('operator_id')->nullable();
      $table->unsignedBigInteger('job_owner_id')->nullable();
      $table->unsignedBigInteger('doc_user_id')->nullable();
      $table->enum('status', ['Intake', 'AI Extraction', 'Verification', 'Generation', 'PDF Generated', 'Sent to Airline', 'Airline Confirmed', 'Completed', 'Lost'])->default('Intake');
      $table->enum('lost_reason', ['rates_high', 'delay_in_response', 'client_cancelled', 'capacity_issue', 'other'])->nullable();
      $table->string('lost_reason_custom')->nullable();
      $table->timestamp('lost_at')->nullable();
      $table->unsignedBigInteger('parent_job_id')->nullable();
      $table->boolean('is_sub_shipment')->default(false);
      $table->boolean('is_consolidation')->default(false);
      $table->timestamps();
      $table->softDeletes();

      $table->foreign('agent_id')->references('id')->on('agents_info');
      $table->foreign('client_id')->references('id')->on('companies');
      $table->foreign('operator_id')->references('id')->on('users')->onDelete('set null');
      $table->foreign('job_owner_id')->references('id')->on('users');
      $table->foreign('doc_user_id')->references('id')->on('users');
      $table->foreign('parent_job_id')->references('id')->on('jobs');
  });

  // DB-level triggers to validate user roles on operator_id and job_owner_id to prevent database mismatch
  DB::unprepared("
      CREATE TRIGGER validate_job_roles_before_insert
      BEFORE INSERT ON jobs
      FOR EACH ROW
      BEGIN
          -- DB check trigger validates user roles from user_roles/permissions table
      END;
  ");
  ```
- **Migration 4: `mailbox_connections` (Timestamp: `2026_06_14_100002_create_mailbox_connections_table.php` — includes `is_active` column)**
  ```php
  Schema::create('mailbox_connections', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('user_id');
      $table->string('provider');
      $table->string('email_address')->unique();
      $table->text('access_token'); // Encrypted at rest in Model
      $table->text('refresh_token'); // Encrypted at rest in Model
      $table->timestamp('expires_at')->nullable();
      $table->boolean('is_active')->default(true); // Gating downgrades
      $table->timestamps();
      $table->foreign('user_id')->references('id')->on('users');
  });
  ```
- **Migration 5: `inbound_emails` (Timestamp: `2026_06_14_100003_create_inbound_emails_table.php` — includes `agent_id` column and FK)**
  ```php
  Schema::create('inbound_emails', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('agent_id')->after('id');
      $table->unsignedBigInteger('mailbox_connection_id');
      $table->string('message_id')->unique();
      $table->string('thread_key')->index();
      $table->string('from');
      $table->string('to');
      $table->string('subject')->nullable();
      $table->longText('body_text')->nullable();
      $table->longText('body_html')->nullable(); // HTML content is sanitized using HTMLPurifier before storage to prevent XSS
      $table->timestamp('received_at');
      $table->timestamps();

      $table->foreign('agent_id')->references('id')->on('agents_info');
      $table->foreign('mailbox_connection_id')->references('id')->on('mailbox_connections')->onDelete('cascade');
  });
  ```
- **Migration 6: `email_threads`**
- **Migration 7: `inbound_attachments`**
- **Migration 8: `job_documents`**
- **Migration 9: `milestone_performance_logs`**
- **Migration 10: `audit_logs` (Timestamp: `2026_06_14_100008_create_audit_logs_table.php` — Append-Only Trigger enforced)**
  An append-only database constraint trigger is registered during migration:
  ```sql
  DB::unprepared("
      CREATE TRIGGER audit_logs_prevent_update_delete
      BEFORE UPDATE OR DELETE ON audit_logs
      FOR EACH ROW
      BEGIN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'audit_logs is append-only';
      END;
  ");
  ```
- **Migration 11: `sea_containers` (Timestamp: `2026_06_14_100010_create_sea_containers_table.php` — ISO Containers Header)**
  ```php
  Schema::create('sea_containers', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('job_id')->index();
      $table->string('container_number', 11);
      $table->string('seal_number', 30)->nullable();
      $table->enum('size_type', ['20GP', '40GP', '40HC', '20RF', '40RF', '20TK', '40OT']);
      $table->decimal('tare_weight', 10, 3)->nullable();
      $table->decimal('payload_weight', 10, 3)->nullable();
      $table->decimal('vgm_weight', 10, 3)->nullable();
      $table->timestamps();
      $table->softDeletes();
      $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
  });
  ```
- **Migration 12: `sea_container_items` (Timestamp: `2026_06_14_100011_create_sea_container_items_table.php` — Canonical Single Definition)**
  ```php
  Schema::create('sea_container_items', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('agent_id');
      $table->unsignedBigInteger('container_id');
      $table->unsignedBigInteger('job_id');
      $table->integer('stuffed_pieces')->default(0);
      $table->decimal('stuffed_weight', 10, 3)->default(0.000);
      $table->decimal('stuffed_volume', 8, 3)->default(0.000);
      $table->timestamps();

      $table->foreign('agent_id')->references('id')->on('agents_info');
      $table->foreign('container_id')->references('id')->on('sea_containers')->onDelete('cascade');
      $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
  });
  ```
- **Migration 13: `cargo_arrival_notices` (Timestamp: `2026_06_14_100013_create_cargo_arrival_notices_table.php` — CAN pre-arrival notices)**
  ```php
  Schema::create('cargo_arrival_notices', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('agent_id');
      $table->unsignedBigInteger('job_id')->unique();
      $table->string('can_no', 30)->unique()->index();
      $table->date('document_date');
      $table->integer('free_storage_days')->default(2);
      $table->date('storage_charges_start_date')->nullable();
      $table->timestamp('sent_to_consignee_at')->nullable();
      $table->timestamps();
      $table->foreign('agent_id')->references('id')->on('agents_info');
      $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
  });
  ```
- **Migration 14: `job_entities` (Timestamp: `2026_06_14_100014_create_job_entities_table.php` — Party contacts)**
  ```php
  Schema::create('job_entities', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('job_id');
      $table->unsignedBigInteger('company_id');
      $table->enum('role', ['shipper', 'consignee', 'customer', 'origin_agent', 'dest_agent', 'selling_agent', 'notify_party', 'customs_broker', 'consigned_order', 'transporter', 'high_sea_buyer']);
      $table->text('address')->nullable();
      $table->string('contact_person', 100)->nullable();
      $table->timestamps();

      $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
      $table->foreign('company_id')->references('id')->on('companies');
  });
  ```

### Step 1a.3 — Create Financial Tables (Early Schema Ingestion)
- **Migration 15: `chart_of_accounts`**
- **Migration 16: `accounting_periods`**
- **Migration 17: `accounts_invoices` (Timestamp: `2026_06_14_300001_create_accounts_invoices_table.php` — includes `billed_party_role` column)**
  ```php
  Schema::create('accounts_invoices', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('agent_id');
      $table->enum('transport_mode', ['air', 'sea']);
      $table->enum('type', ['invoice', 'debit_note', 'credit_note', 'brokerage', 'consol_invoice']);
      $table->string('invoice_no')->unique();
      $table->date('document_date');
      $table->unsignedBigInteger('job_id');
      $table->unsignedBigInteger('client_id');
      $table->string('billed_party_role', 20)->default('client');
      $table->string('currency', 3);
      $table->decimal('exchange_rate', 12, 6)->default(1.000000);
      $table->text('billing_address')->nullable();
      $table->string('tax_registration_no', 20)->nullable();
      $table->string('payment_terms', 20)->nullable();
      $table->decimal('subtotal', 15, 2);
      $table->decimal('tax_amount', 15, 2);
      $table->decimal('grand_total', 15, 2);
      $table->string('status')->default('draft');
      $table->boolean('is_posted')->default(false);
      $table->date('due_date');
      $table->unsignedBigInteger('created_by');
      $table->timestamps();
      $table->softDeletes();
  });
  ```
- **Migration 18: `accounts_invoice_brokerage_details` (Timestamp: `2026_06_14_300014_create_accounts_invoice_brokerage_details_table.php` — 1-to-1 Decoupled details)**
  ```php
  Schema::create('accounts_invoice_brokerage_details', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('invoice_id')->unique();
      $table->enum('brokerage_basis', ['percentage_of_freight', 'flat_rate', 'per_kg', 'per_container']);
      $table->decimal('commission_rate', 8, 4)->default(0.0000);
      $table->decimal('base_freight_cost', 15, 2)->default(0.00);
      $table->timestamps();
      $table->foreign('invoice_id')->references('id')->on('accounts_invoices')->onDelete('cascade');
  });
  ```
- **Migration 19: `accounts_invoice_consol_details` (Timestamp: `2026_06_14_300015_create_accounts_invoice_consol_details_table.php` — 1-to-1 Decoupled details)**
  ```php
  Schema::create('accounts_invoice_consol_details', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('invoice_id')->unique();
      $table->decimal('profit_share_ratio', 5, 2)->default(0.00);
      $table->unsignedBigInteger('partner_agent_id');
      $table->timestamps();
      $table->foreign('invoice_id')->references('id')->on('accounts_invoices')->onDelete('cascade');
      $table->foreign('partner_agent_id')->references('id')->on('companies');
  });
  ```
- **Migration 20: `accounts_invoice_items`**
- **Migration 21: `accounts_purchase_vouchers`**
- **Migration 22: `accounts_purchase_items`**
- **Migration 23: `accounts_ledger_entries`**
- **Migration 24: `invoice_sequences`**
- **Migration 25: `gst_ledger_entries`**
- **Migration 26: `financial_snapshots` (Timestamp: `2026_06_14_300012_create_financial_snapshots_table.php` — includes `accounting_period_id` column, `last_computed_at` indicator, and FK)**
  ```php
  Schema::create('financial_snapshots', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('agent_id');
      $table->date('snapshot_date')->index();
      $table->unsignedBigInteger('accounting_period_id')->nullable();
      // ... financial totals ...
      $table->timestamp('last_computed_at')->useCurrent();
      $table->timestamps();
      $table->foreign('agent_id')->references('id')->on('agents_info');
      $table->foreign('accounting_period_id')->references('id')->on('accounting_periods')->onDelete('set null');
  });
  ```
- **Migration 27: `manifest_filings`**
- **Migration 28: `accounts_cass_statements` (Timestamp: `2026_06_14_300013_create_accounts_cass_statements_table.php` — Tenant isolated & FK to standard airlines.id)**
  ```php
  Schema::create('accounts_cass_statements', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('agent_id');
      $table->unsignedBigInteger('airline_id');
      $table->string('awb_number')->index();
      $table->string('billing_period');
      $table->decimal('cass_gross_weight', 10, 3)->default(0.000);
      $table->decimal('cass_rate', 10, 4)->default(0.0000);
      $table->decimal('cass_freight_charges', 15, 2)->default(0.00);
      $table->decimal('cass_other_charges', 15, 2)->default(0.00);
      $table->decimal('grand_total', 15, 2)->default(0.00);
      $table->enum('reconciliation_status', ['unmatched', 'matched', 'rate_mismatch', 'weight_mismatch'])->default('unmatched');
      $table->unsignedBigInteger('matched_voucher_id')->nullable();
      $table->timestamps();

      $table->foreign('agent_id')->references('id')->on('agents_info');
      $table->foreign('airline_id')->references('id')->on('airlines');
      $table->foreign('matched_voucher_id')->references('id')->on('accounts_purchase_vouchers')->onDelete('set null');
  });
  ```

### Step 1a.4 — Create Eloquent Models
Create all PHP models in `app/` namespace `App`:
- `Job.php`, `SeaShipmentDetail.php`, `AirShipmentDetail.php`, `LlmUsageLog.php`, `MailboxConnection.php`, `InboundEmail.php`, `EmailThread.php`, `InboundAttachment.php`, `JobDocument.php`, `MilestonePerformanceLog.php`, `AuditLog.php`, `ChartOfAccount.php`, `AccountingPeriod.php`, `SequenceCounter.php`, `AccountsInvoiceBrokerageDetail.php`, `AccountsInvoiceConsolDetail.php`, `AccountsCassStatement.php`, `Port.php`, `SeaContainer.php`, `CargoArrivalNotice.php`, `JobEntity.php`.

**Model Token Encryption & Enums:**
In `app/MailboxConnection.php`, encrypt OAuth credentials at rest.
In `app/Job.php`, cast status to a PHP-backed Enum to prevent debug issues:
```php
// In app/MailboxConnection.php
protected $casts = [
    'access_token' => 'encrypted',
    'refresh_token' => 'encrypted',
    'is_active' => 'boolean',
    'expires_at' => 'datetime',
];

// In app/Job.php
protected $casts = [
    'status' => \App\Enums\JobStatus::class,
];
```

### Step 1a.5 — Observers and AppServiceProvider Map
- Register `app/Observers/JobObserver.php` in `AppServiceProvider`.
- Add polymorphic morph maps in `AppServiceProvider::boot()` to resolve source types:
  ```php
  use Illuminate\Database\Eloquent\Relations\Relation;

  Relation::morphMap([
      'AWB'              => \App\AirwayBills::class,
      'HAWB'             => \App\HousewayBills::class,
      'Invoice'          => \App\AccountsInvoice::class,
      'DebitNote'        => \App\AccountsInvoice::class,
      'CreditNote'       => \App\AccountsInvoice::class,
      'PurchaseVoucher'  => \App\AccountsPurchaseVoucher::class,
  ]);
  ```
- **Debounced Observer Roll-ups:**
  The `SeaShipmentDetailObserver` roll-up triggers a deferred and debounced queue job `QueueRollupJob` using a unique cache lock key `job_rollup:{job_id}`:
  ```php
  // Debouncing algorithm:
  $lockKey = "job_rollup_lock:{$parentJobId}";
  if (!Cache::add($lockKey, true, 2)) {
      // Debounced: skip if triggered within 2 seconds
      return;
  }
  ProcessConsolRollupJob::dispatch($parentJobId)->delay(now()->addSeconds(2));
  ```
- **Immutability of SLA Timestamps:**
  `EmailThreadObserver@updating` checks `$thread->isDirty()` and locks `first_triage_at` and `first_reply_at` once populated, preventing silent tampering.

---

## Phase 1b: FastAPI Parsing Engine (In-Memory Unstructured Extraction)

- **Step 1b.1:** Add python dependencies (`PyMuPDF`, `google-generativeai`).
- **Step 1b.2:** Create Pydantic schemas in `python/schemas.py`.
  *   **Confidence Scores:** Every parsed field includes extraction confidence metadata (`confidence`: high/medium/low based on whether the string matched exact coordinates vs structure extrapolation).
- **Step 1b.3:** Expose `/extract-unstructured` in `ocr_server.py`. Process PDF text in-memory via `fitz.open(stream=...)` and send it to Gemini using prompt caching. Return confidence score fields.

---

## Phase 1c: Laravel Integration & Vue Ingestion Modal

- **Step 1c.1:** Add route tier check middleware `CheckCompanyTier`.
- **Step 1c.2:** Ingest `ProcessPdfOcrJob.php` tier branching logic, write execution cost to `llm_usage_logs`.
  *   **MIME Validation:** Validate that the uploaded document is a genuine PDF or image before queue ingestion. Run strict server-side MIME-type sniffing using php's `finfo_file` (not just file extension checking). SVG/HTML and other non-supported formats must be rejected immediately to block injection/parser exploits.
  *   **XSS Sanitization:** All inbound HTML email contents (`body_html` in `inbound_emails`) are sanitized using server-side HTMLPurifier before persistence to mitigate stored XSS payloads before rendering.
- **Step 1c.3:** Add the dropzone verification modal in `OcrUploadModal.vue`.
  *   **Confidence UI Highlights:** The Vue UI displays extraction fields and automatically highlights any medium/low confidence fields in orange, forcing operator manual review even if the string format is valid.

---

## Phase 2: Gmail & Outlook Account Inbound Ingestion

- **Step 2.1:** Build `PollMailboxes` sync daemon command. If a mailbox connection is set to `is_active = false` (tier downgrade flag), it is immediately bypassed.
- **Step 2.2:** Build `AirlineExclusionService` matching exclusions.
  *   **API Classification Fallback:** If the Gemini API rate limit is breached or the endpoint returns a status error, classification fails gracefully by keeping the email thread `unread` and marked as `unclassified` in the operator inbox, instead of silently dropping it.
- **Step 2.3:** Build `MailboxOAuthController` callbacks. Enforce corporate email domain verification: parse the authenticated mailbox address and verify that its domain (the suffix after `@`) exactly matches the selected company's `email_domain` (e.g. `@xyzcompany.com`) for Tier 2 and Tier 3 connections. Return a `403` validation error on mismatch.

---

## Phase 3: Operations & Pricing Workflows & Kanban Board

- **Step 3.1:** Create `JobController.php` containing store triage, confirmTask, and markLost.
  *   **Policy Authorization Checks:** The mail reply endpoint `POST /api/jobs/{id}/reply` performs explicit Policy checks `$this->authorize('reply', $job)` verifying the authenticated operator has permissions and matches the mailbox connection associated with the job thread.
  *   **Tenant Sandboxing on Document Merging:** The cover letter merges files from `job_documents` only after executing an explicit `agent_id` scope verification check on both job and documents to block cross-tenant leakage.
- **Step 3.2:** Build `JobInbox.vue` 3-column email feed.
- **Step 3.3:** Add the **Split-Pane Column Hiding Logic** in `JobInbox.vue` to slide inbox feeds and mini-size side navigation when the drawer workspace expands to 50%.
- **Step 3.4:** Build `OpsDashboard.vue` Kanban board.
- **Step 3.5:** Create **Job Cost Sheet UI** writing directly to Phase 1a accounts tables.

---

## Phase 4: Multi-Portal Scoping & Air-Sea Segregation

- **Step 4.1:** Apply global Laravel scopes on `Job` model to filter records by `transport_mode`.
- **Step 4.2:** Build contextual Vue pages inside the drawer workspace (`FocusSeaMaster.vue`, `FocusSeaHouse.vue`, `FocusSeaConsol.vue`, `FocusAirImport.vue`) loaded based on active portal context.
- **Step 4.3:** Build and execute `PortSeeder.php` to seed the `ports` table with standard UN/LOCODE reference data.

---

## Phase 5: Dashboards, Target Metrics & Analytics

- **Step 5.1:** Set up `AnalyticsDashboard.vue` plotting Enquiry Funnel, Lost Reason, and response times using `vue-apexcharts`.
- **Step 5.2:** Create `BossDashboard.vue` with cross-branch metrics. The dashboard performs staleness checking comparing the financial snapshot's `last_computed_at` timestamp with current time, displaying an alert banner if data is older than 1 hour.

---

## Phase 6: Financial Ledgers & Reconciliation Engine

- **Step 6.1:** Build `InvoiceController` and `PurchaseVoucherController`.
- **Step 6.2:** Create `InvoiceObserver` triggering double-entry ledger postings (`accounts_ledger_entries`) and CGST/SGST/IGST tax splits (`gst_ledger_entries`).
- **Step 6.3:** Build `ReconciliationController` with Plaid/Setu transaction matching engines.
- **Step 6.4:** Implement financial statements (Trial Balance, P&L, Balance Sheet).

---

## 🧪 Automated Testing Strategy

To guarantee accounting integrity, concurrency safety, and layout reliability, we implement targeted test coverages.

### 1. Laravel Backend Feature Tests

#### A. Job Triage & Milestones
- **File:** `tests/Feature/JobTriageTest.php`
- **Actions Verified:**
  - `POST /api/jobs` creates an Intake Job.
  - Enquiry number sequence auto-generation matches `ENQA-26-0001` (Air) or `ENQS-26-0001` (Sea).
  - Observer fires successfully and seeds the initial "Intake" record in `milestone_performance_logs`.

#### B. Invoicing & Ledger Posting
- **File:** `tests/Feature/InvoiceFinalizeTest.php`
- **Actions Verified:**
  - `POST /api/invoices/{id}/finalize` marks invoice as finalized.
  - Concurrency sequence locks prevent duplicate invoice numbers.
  - Double-entry logs successfully post matching assets and revenue debits/credits to `accounts_ledger_entries`.
  - GST split matches 9% CGST + 9% SGST for intrastate, and 18% IGST for interstate.
  - Postings to locked/closed `accounting_periods` return a `403 Forbidden` response.

#### C. OCR Pipeline Tier Routing
- **File:** `tests/Feature/PdfOcrTierBranchingTest.php`
- **Actions Verified:**
  - Triggering `ProcessPdfOcrJob` for a Viper Core Tier company executes coordinate-based template parsing.
  - Triggering for a Viper Tactical Tier company routes HTTP requests to FastAPI `/extract-unstructured` and successfully inserts usage metadata in `llm_usage_logs`.

#### D. Concurrency & Integrity Safety
- **File:** `tests/Feature/EnquirySequenceConcurrencyTest.php`
- **Actions Verified:**
  - **Single Entry-point Sequence Constraint:** Enquiry/Invoice sequence generation strictly routes through `EnquirySequenceService` (documented on service).
  - **Locking Concurrency:** Multi-process requests made in parallel to sequential numbers generate non-overlapping sequential numbers without race conditions or gap duplicates.

### 2. Frontend Vue / Jest Unit Tests

#### A. Split-Pane Drawer & Column Collapse
- **File:** `tests/Unit/JobInboxDrawer.spec.js`
- **Actions Verified:**
  - Initial `isDrawerOpen` state is `false`.
  - Triggering column split-toggle method changes `isDrawerOpen` to `true`.
  - Side navigation class transitions to `sidebar-collapsed` (60px).
  - Columns 1 & 2 are hidden from DOM, and Column 3 width matches exactly `50%`.

---

## Proposed Changes Summary

| Phase | Files to Create | Files to Modify | Verification Commands |
|---|---|---|---|
| **Phase 1a** | 26 Migrations, 21 Models, `JobObserver`, `EnquirySequenceService` | `AppServiceProvider.php`, `Company.php` | `php artisan migrate`, `php artisan tinker` |
| **Phase 1b** | `python/schemas.py` | `python/requirements.txt`, `python/ocr_server.py` | `uvicorn python.ocr_server:app`, `curl` |
| **Phase 1c** | `CheckCompanyTier.php` | `ProcessPdfOcrJob.php`, `OcrUploadModal.vue` | `php artisan test` |
| **Phase 2** | `PollMailboxes.php`, `AirlineExclusionService.php`, `MailboxOAuthController.php` | `Kernel.php` | `php artisan mailboxes:poll` |
| **Phase 3** | `JobController.php`, `JobInbox.vue`, `OpsDashboard.vue`, `JobCostSheet.vue` | `routes/api.php` | `npm run dev`, `php artisan test` |
| **Phase 4** | `FocusSeaMaster.vue`, `FocusSeaHouse.vue`, `FocusSeaConsol.vue`, `FocusAirImport.vue`, `PortSeeder.php` | `router.js` | `npm run dev` |
| **Phase 5** | `AnalyticsDashboard.vue`, `BossDashboard.vue` | `router.js`, `Aside.vue` | `npm run dev` |
| **Phase 6** | `InvoiceController.php`, `ReconciliationController.php`, `InvoiceObserver.php` | `routes/api.php` | `php artisan test` |

---

## Execution Priority Order (Migration Order Checklist)

Run in this exact order — earlier timestamps = earlier execution:
```
2026_06_14_000000  create_sequence_counters_table               ← NEW, must be first
2026_06_14_000001  add_tier_domain_and_credit_columns_to_companies
2026_06_14_000004  create_ports_table                           ← NEW, ports UN/LOCODE master
2026_06_14_000005  add_port_and_pima_columns_to_users           ← references ports table
2026_06_14_100001  create_jobs_table
2026_06_14_100002  create_mailbox_connections_table             ← includes is_active column
2026_06_14_100003  create_inbound_emails_table                  ← includes agent_id column
2026_06_14_100004  create_email_threads_table
2026_06_14_100005  create_inbound_attachments_table
2026_06_14_100006  create_job_documents_table
2026_06_14_100007  create_milestone_performance_logs_table
2026_06_14_100008  create_audit_logs_table                      ← triggers append-only constraint
2026_06_14_100009  create_chart_of_accounts_table
2026_06_14_100010  create_accounting_periods_table
2026_06_14_100011  create_sea_containers_table                  ← NEW, ISO container headers
2026_06_14_100012  create_sea_container_items_table             ← single canonical definition
2026_06_14_100013  create_cargo_arrival_notices_table           ← NEW, arrival CAN notices
2026_06_14_100014  create_job_entities_table                    ← NEW, polymorphic party contacts
2026_06_14_000002  add_uuid_and_job_id_to_waybill_tables        ← needs jobs table to exist first
2026_06_14_300001  create_accounts_invoices_table               ← add billed_party_role column
2026_06_14_300002  create_accounts_invoice_items_table
2026_06_14_300003  create_accounts_purchase_vouchers_table
2026_06_14_300004  create_accounts_purchase_items_table
2026_06_14_300005  create_accounts_ledger_entries_table
2026_06_14_300006  create_invoice_sequences_table
2026_06_14_300007  create_gst_ledger_entries_table              ← GST splits entries
2026_06_14_300012  create_financial_snapshots_table             ← add accounting_period_id & last_computed_at
2026_06_14_300013  create_accounts_cass_statements_table        ← includes agent_id column
2026_06_14_300014  create_accounts_invoice_brokerage_details    ← brokerage 1-to-1 decoupling
2026_06_14_300015  create_accounts_invoice_consol_details       ← consol 1-to-1 decoupling
2026_06_14_100101  create_sea_shipment_details_table            ← operational sea details
2026_06_14_100102  create_air_shipment_details_table            ← operational air details
2026_06_14_100103  create_llm_usage_logs_table                  ← operational LLM logs
```
