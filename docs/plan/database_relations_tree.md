# F16s Freight OS — Complete Table Schema & Relational Tree

This document provides a comprehensive column-level schema reference for all **59 database tables** (current and future), tracing foreign key connection links directly.

> [!IMPORTANT]
> **This file is the sole owner of schema.** Product rationale, workflows, roles and UI behaviour live in [`PRD.md`](file:///Users/jomygeorge/Desktop/f16sefreight/PRD.md); the ordered build sequence lives in [`implementation_guide.md`](file:///Users/jomygeorge/Desktop/f16sefreight/implementation_guide.md); interface design lives in [`ui_ux_guide.md`](file:///Users/jomygeorge/Desktop/f16sefreight/ui_ux_guide.md). Neither of those files may restate a column definition.
>
> Every table appears **twice** in this document, and the two must stay in sync: once in the *Relational Tables Mappings* tree below, and once in the *Raw SQL DDL Script* near the end. The DDL is authoritative on types and constraints; the tree is authoritative on foreign-key intent.

---

## 📦 Containerized Database Persistence & Networking

When running the database in a containerized environment (e.g., Docker/Docker Compose), the following rules and configurations apply to ensure data persistence, high performance, and proper connection routing:

### 1. Network Name Resolution
In the local Docker network (`f16s-network`), database connections do not use `localhost` or `127.0.0.1`. Instead, the application containers resolve the database server dynamically using the Docker service name as the hostname:
*   **Database Host:** `db` (port `3306`)
*   **Redis Host:** `redis` (port `6379`)
*   **AI Server Host:** `ai-server` (port `8000` / Ollama `11434`)

Laravel configuration (`config/database.php`) resolves these dynamically using environment variables:
```php
'mysql' => [
    'host' => env('DB_HOST', 'db'),
    'port' => env('DB_PORT', '3306'),
    // ...
],
```

### 2. Volume-Based Data Persistence
To prevent data loss when a database container is stopped, restarted, or rebuilt, the MySQL container must write its tables and system logs to a persistent Docker volume mounted on the host machine:
*   **Volume Definition:** `db_data`
*   **Container Path:** `/var/lib/mysql`
*   **Mount Configuration (`docker-compose.yml`):**
    ```yaml
    services:
      db:
        image: mysql:8.0
        volumes:
          - db_data:/var/lib/mysql
    volumes:
      db_data:
        driver: local
    ```

### 3. Automated Containerized Backups
For production and staging deployments, an independent backup helper container runs adjacent to the database container to execute periodic logical snapshots (using `mysqldump`) and ship them encrypted to an isolated Amazon S3 bucket.

---

## 🌳 Database Relational Tables Mappings

### 1. `companies` (PK: `id`)
*Note: This table stores Platform Tenants (the forwarding companies subscribing to F16s OS) and their SaaS settings.*

```text
  Column                        | Type         | Key | Connection Links
  ------------------------------|--------------|-----|----------------------------------------
  id                            | BIGINT       | PK  | ──► agents_info.company_id (Tenant office branches)
                                |              |     | ──► gst_ledger_entries.company_id
                                |              |     | ──► unposted_transactions_queue.company_id
                                |              |     | ──► customers.company_id (Onboarded client customers)
                                |              |     | ──► partners.company_id (Onboarded partner companies)
                                |              |     | ──► ocr_credit_transactions.company_id
                                |              |     | ──► sla_policies.company_id
  name                          | VARCHAR(100) |     |
  code                          | VARCHAR(6)   | UK  | (Company abbreviation. Prefixed to
                                |              |     |  agents_info.branch_code to form the
                                |              |     |  {agent_code} in every document number
                                |              |     |  — PRD §6.3. Unique globally)
  tier                          | VARCHAR(30)  |     | (core, tactical, command)
  email_domain                  | VARCHAR(100) |     | (Verification suffix)
  ocr_credits_balance           | INT          |     | (Remaining vision OCR balance)
  ocr_credits_monthly_allowance | INT          |     | (Monthly credit quota)
  ocr_credits_limit             | INT          |     | (Overdraft limit threshold, default: 0)
  created_at                    | TIMESTAMP    |     |
  updated_at                    | TIMESTAMP    |     |
```

### 1a. `customers` (PK: `id`)
*Note: This table stores the shippers, consignees, notify parties, and debtors onboarded by the platform tenants.*

```text
  Column             | Type          | Key | Connection Links
  -------------------|---------------|-----|----------------------------------------
  id                 | BIGINT        | PK  | ──► jobs.customer_id
                     |               |     | ──► accounts_invoices.customer_id
                     |               |     | ──► accounts_invoices.billed_party_id (Polymorphic; when billed_party_type = 'customer')
                     |               |     | ──► operational_cover_letters.recipient_customer_id
                     |               |     | ──► job_entities.party_id (Polymorphic; when party_type = 'customer')
                     |               |     | ──► rate_cards.party_id (Polymorphic; when party_type = 'customer')
                     |               |     | ──► customer_performance_snapshots.customer_id
                     |               |     | ──► customer_lane_stats.customer_id
                     |               |     | ──► customer_cadence_profiles.customer_id
                     |               |     | ──► sales_action_queue.customer_id
                     |               |     | ──► customer_contacts.customer_id (Cascade delete)
  company_id         | BIGINT        | FK  | ◄── companies.id (Tenant company owning this client)
  name               | VARCHAR(100)  |     |
  email_domain       | VARCHAR(100)  | IDX | (Client's corporate domain, captured at onboarding. THREE jobs:
                     |               |     |  1. inbound sender @suffix → customer → sales_id attribution
                     |               |     |  2. domain-suffix client search
                     |               |     |  3. ** THE CLIENT-GROUP KEY ** — every customers row sharing
                     |               |     |     (company_id, email_domain) is ONE client company with
                     |               |     |     multiple branches. The group is DERIVED from this pair;
                     |               |     |     there is deliberately no parent_customer_id column.
                     |               |     |     Accepts a comma-separated list where a client uses several
                     |               |     |     domains (globex.com, globex.co.in), same convention as
                     |               |     |     companies.email_domain.
                     |               |     |  Covered by idx_customers_domain (company_id, email_domain).
                     |               |     |  NOT companies.email_domain — that is the tenant's own
                     |               |     |  OAuth-verification domain)
  email              | VARCHAR(100)  |     | (Operations/billing email)
  phone              | VARCHAR(30)   |     | (Contact phone number)
  address            | TEXT          |     | (Registered physical office address)
  gst_no             | VARCHAR(30)   |     | (GSTIN Tax Identification number)
  pan_no             | VARCHAR(20)   |     | (Permanent Account Number)
  duns_no            | VARCHAR(20)   |     | (Dun & Bradstreet Number for credit checks)
  bank_name          | VARCHAR(100)  |     | (Bank name for invoice settlements)
  bank_account_no    | TEXT          |     | (🔐 Encrypted at rest via the Eloquent `encrypted`
                     |               |     |  cast. TEXT, NOT VARCHAR — corrected 2026-08-27 after
                     |               |     |  measuring: a 10-char a/c no encrypts to 200 chars and a
                     |               |     |  34-char IBAN (ISO 13616 max) to 256, so the VARCHAR(50)
                     |               |     |  once written here failed on EVERY row and the DDL's
                     |               |     |  VARCHAR(255) truncated real IBANs by one character)
  bank_ifsc_code     | TEXT          |     | (🔐 Encrypted at rest. TEXT for the same reason)
  payment_terms_days | INT           |     | (Default credit invoice payment terms e.g., 30)
  credit_limit       | DECIMAL(15,2) |     | (Maximum allowed AR outstanding. PER BRANCH — the credit gate
                     |               |     |  blocks on this row's own exposure, never the group total.
                     |               |     |  Separate GSTINs are separate billing entities; one branch's
                     |               |     |  overdue invoice must not freeze another branch's cargo.
                     |               |     |  Group exposure is DISPLAYED as a roll-up, never enforced on)
  default_port_id    | BIGINT        | FK  | ◄── ports.id (Preferred destination port)
  branch_id          | BIGINT        | FK  | ◄── agents_info.id (Auto-resolved proximity branch)
  sales_id           | BIGINT        | FK  | ◄── users.id (Assigned account manager; auto-set on onboarding. Drives the Command-tier client-book sales view; ignored by the Tactical branch-level view)
  created_at         | TIMESTAMP     |     |
  updated_at         | TIMESTAMP     |     |
```

### 1b. `partners` (PK: `id`)

> 🔴 **`agent_id` added 2026-09-03 — a partner belongs to a BRANCH, not a company.**
> GST registration is per state, so the same customs broker carries a different GSTIN in
> Maharashtra and in Tamil Nadu: separate registrations, separate returns. One row per
> company could hold only one of them, whichever branch saved last would overwrite the
> other, and the purchase voucher raised against it would claim input credit under the
> wrong registration. `company_id` is kept so a company-wide view needs no join, but the
> tenant filter is `agent_id` (`Partner::$tenantColumn`).
>
> ⚠️ **Carriers do NOT belong here.** An airline's prefix, name and domain are the same for
> every forwarder on earth, so they are platform reference data in `airlines`, curated by
> F16s at `/superadmin/airlines`. A tenant adding an airline as a partner used to be the
> only way to teach the domain directory; it is not any more.
>
> ⚠️ **`GET /api/user/partners/siblings`** lets a branch copy a partner another branch of
> the same company already has — name, type, address and phone only. **Never `gst_no`,
> `pan_no` or bank details**: those are the other branch's registration, and the copying
> branch must enter its own.

### 1c. `airlines` (PK: `id`) — platform reference data

```text
  Column          | Type         | Key | Connection Links
  ----------------|--------------|-----|----------------------------------------
  id              | BIGINT       | PK  |
  name            | VARCHAR(100) |     | (Emirates SkyCargo)
  code            | VARCHAR(5)   |     | (IATA designator — EK. NOT unique: designators
                  |              |     |  are reassigned after an airline folds)
  prefix          | VARCHAR(5)   | UK  | (IATA numeric prefix — 176. UNIQUE: two carriers
                  |              |     |  sharing one would make an AWB number ambiguous
                  |              |     |  about who is carrying the freight)
  country         | VARCHAR(100) |     |
  domain          | VARCHAR(255) |     | 🔴 Added 2026-09-03. The carrier's email domain,
                  |              |     |  read by GlobalDomainDirectory. NOT unique — a
                  |              |     |  group operating several prefixes from one office
                  |              |     |  is ordinary. NULL is fine: the prefix and name
                  |              |     |  are useful long before anyone knows the domain,
                  |              |     |  and a carrier without one classifies nothing
  is_active       | BOOLEAN      |     | (also how a carrier is retired)
  airline_address | TEXT         |     | (printed on the waybill)
```

> 🔴 **NOT tenant-scoped, and curated only by F16s.** `176` is Emirates whoever is looking.
> A curated airline classifies mail **without** the approval step that a learned proposal
> needs — somebody decided when they typed it — and it **outranks** any learned entry for
> the same domain, so one tenant's data entry cannot silently redefine a carrier for
> everybody.

*Note: This table stores carriers, airlines, vendors, agents, brokers, and transporters onboarded by platform tenants.*

```text
  Column          | Type         | Key | Connection Links
  ----------------|--------------|-----|----------------------------------------
  id              | BIGINT       | PK  | ──► accounts_purchase_vouchers.vendor_id
                  |              |     | ──► sea_shipment_details.carrier_id
                  |              |     | ──► sea_shipment_details.customs_broker_id
                  |              |     | ──► sea_shipment_details.transporter_id
                  |              |     | ──► sea_shipment_details.haulage_provider_id
                  |              |     | ──► sea_shipment_details.handling_agent_id
                  |              |     | ──► accounts_cass_statements.airline_id
                  |              |     | ──► accounts_invoice_brokerage_details.partner_agent_id
                  |              |     | ──► accounts_invoice_consol_details.partner_agent_id
                  |              |     | ──► accounts_invoices.billed_party_id (Polymorphic; when billed_party_type = 'partner')
                  |              |     | ──► job_entities.party_id (Polymorphic; when party_type = 'partner')
                  |              |     | ──► rate_cards.party_id (Polymorphic; when party_type = 'partner')
  company_id      | BIGINT       | FK  | ◄── companies.id (Tenant company owning this partner)
  name            | VARCHAR(100) |     |
  partner_type    | VARCHAR(30)  |     | (airline, shipping_line, co-loader, transporter, customs_broker, agent, broker, vendor, other)
  email           | VARCHAR(100) |     |
  phone           | VARCHAR(30)  |     |
  address         | TEXT         |     |
  gst_no          | VARCHAR(30)  |     |
  pan_no          | VARCHAR(20)  |     |
  bank_name       | VARCHAR(100) |     |
  bank_account_no | TEXT         |     | (🔐 Encrypted at rest. TEXT, not VARCHAR — same
                  |              |     |  correction as customers, 2026-08-27: a 34-char IBAN
                  |              |     |  encrypts to 256 chars, one over VARCHAR(255))
  bank_ifsc_code  | TEXT         |     | (🔐 Encrypted at rest. TEXT for the same reason)
  created_at      | TIMESTAMP    |     |
  updated_at      | TIMESTAMP    |     |
```
```

### 1c. `customer_contacts` (PK: `id`)
*The per-client address book. Harvested from inbound mail and curated by staff — this is what the AI outreach engine CCs. `email_messages.from` is a raw log; **this** is the directory.*

```text
  Column          | Type          | Key | Connection Links
  ----------------|---------------|-----|----------------------------------------
  id              | BIGINT        | PK  |
  company_id      | BIGINT        | FK  | ◄── companies.id (tenant scope)
  customer_id     | BIGINT        | FK  | ◄── customers.id (Cascade delete — WHICH BRANCH
                  |               |     |  of the client group this person belongs to)
  email           | VARCHAR(255)  | UK  | (Unique per customer_id)
  name            | VARCHAR(100)  |     | (Parsed from the From header, editable)
  designation     | VARCHAR(100)  |     | (Free text — 'Logistics Manager')
  source          | VARCHAR(20)   |     | (inbound_harvest | manual | onboarding)
  is_primary      | BOOLEAN       |     | (The default To: recipient for this branch)
  include_in_cc   | BOOLEAN       |     | ** DEFAULT FALSE ** — an address is only CC'd on
                  |               |     |  outreach after a human ticks it. Harvesting is
                  |               |     |  automatic; CC'ing never is. See note below
  verified_at     | TIMESTAMP     |     | (When a human confirmed this is a real contact)
  last_seen_at    | TIMESTAMP     |     | (Last inbound mail from this address)
  message_count   | INT           |     | (How often we have heard from them — ranks the list)
  opted_out_at    | TIMESTAMP     |     | (DPDP / unsubscribe. Non-NULL ⇒ NEVER contacted,
                  |               |     |  overrides include_in_cc unconditionally)
  created_at      | TIMESTAMP     |     |
  updated_at      | TIMESTAMP     |     |
```

> **Why `include_in_cc` defaults to FALSE.** Harvesting every address ever seen on a `@globex.com` thread will eventually collect someone who has left the company, a personal address, a customs broker, or a competitor who was CC'd once on a quote. Blind-CC'ing that set is a commercial and DPDP-compliance incident. The system builds the list automatically; a human decides who is on it.

### 2. `agents_info` (PK: `id`)
```text
  Column        | Type         | Key | Connection Links
  --------------|--------------|-----|----------------------------------------
  id            | BIGINT       | PK  | ──► users.branch_name
                |              |     | ──► jobs.agent_id
                |              |     | ──► mailbox_connections.agent_id
                |              |     | ──► email_threads.agent_id
                |              |     | ──► chart_of_accounts.agent_id
                |              |     | ──► accounting_periods.agent_id
                |              |     | ──► accounts_invoices.agent_id
                |              |     | ──► accounts_purchase_vouchers.agent_id
                |              |     | ──► accounts_ledger_entries.agent_id
                |              |     | ──► gst_ledger_entries.agent_id
                |              |     | ──► sequence_counters.agent_id
                |              |     | ──► unposted_transactions_queue.agent_id
                |              |     | ──► approved_drafts_queue.agent_id
                |              |     | ──► operational_cover_letters.agent_id
                |              |     | ──► bank_transactions.agent_id
                |              |     | ──► financial_snapshots.agent_id
                |              |     | ──► accounts_cass_statements.agent_id
                |              |     | ──► milestone_performance_logs.agent_id
                |              |     | ──► audit_logs.agent_id
                |              |     | ──► sea_containers.agent_id
                |              |     | ──► sea_container_items.agent_id
  company_id    | BIGINT       | FK  | ◄── companies.id
  agent_name    | VARCHAR(100) |     |
  agent_address | TEXT         |     |
  created_at    | TIMESTAMP    |     |
  updated_at    | TIMESTAMP    |     |
```

### 3. `ports` (PK: `id`)
```text
  Column       | Type         | Key | Connection Links
  -------------|--------------|-----|----------------------------------------
  id           | BIGINT       | PK  | ──► users.origin_port_id
               |              |     | ──► customers.default_port_id
               |              |     | ──► rate_cards.origin_port_id
               |              |     | ──► rate_cards.destination_port_id
  locode       | CHAR(5)      | UK  | (UN/LOCODE, unique index)
  port_name    | VARCHAR(100) |     |
  country_code | CHAR(2)      |     |
  port_type    | VARCHAR(20)  |     | (air, sea, land)
  is_active    | BOOLEAN      |     |
  created_at   | TIMESTAMP    |     |
  updated_at   | TIMESTAMP    |     |
```

### 4. `users` (PK: `id`)
```text
  Column         | Type         | Key | Connection Links
  ---------------|--------------|-----|----------------------------------------
  id             | BIGINT       | PK  | ──► email_threads.assigned_ops_id
                 |              |     | ──► jobs.ops_id
                 |              |     | ──► jobs.pending_ops_id
                 |              |     | ──► jobs.pending_ops_requested_by
                 |              |     | ──► jobs.cancelled_by
                 |              |     | ──► jobs.pricing_id
                 |              |     | ──► notifications.notifiable_id (when notifiable_type = 'App\User')
                 |              |     | ──► customers.sales_id (Command-tier client book)
                 |              |     | ──► enquiries.sales_id (rep owning the enquiry)
                 |              |     | ──► sales_action_queue.sales_id
                 |              |     | ──► accounts_invoices.created_by
                 |              |     | ──► accounts_purchase_vouchers.created_by
                 |              |     | ──► unposted_transactions_queue.created_by
                 |              |     | ──► approved_drafts_queue.approved_by
                 |              |     | ──► operational_cover_letters.prepared_by
                 |              |     | ──► audit_logs.user_id
  name           | VARCHAR(100) |     |
  email          | VARCHAR(100) | UK  |
  password       | VARCHAR(255) |     |
  designation    | VARCHAR(20)  |     | (pricing, operations, sales, accounts, boss)
  company_name   | VARCHAR(100) |     |
  branch_name    | BIGINT       | FK  | ◄── agents_info.id
  origin_port_id | BIGINT       | FK  | ◄── ports.id (User's designated default origin port)
  pima_address   | VARCHAR(50)  |     | (For IATA Type B message routing)
  signature_text | TEXT         |     | (Custom email signature configured via User Profile Settings page)
  created_at     | TIMESTAMP    |     |
  updated_at     | TIMESTAMP    |     |
```

### 4a. `enquiries` (PK: `id`)
*Pre-conversion lifecycle — the sales funnel. Unconverted rows stay here permanently; they are the substrate for conversion %, lost-reason analysis and the Sales Intelligence Engine. **`Lost` exists only here; `Cancelled` only on `jobs`.***

```text
  Column                  | Type          | Key | Connection Links
  ------------------------|---------------|-----|----------------------------------------
  id                      | BIGINT        | PK  | ──► jobs.enquiry_id (1-to-MANY: one request may split
                          |               |     |     Attribution chain: enquiries.sales_id → jobs (via
                          |               |     |     enquiry_id) → air_way_bills/house_way_bills (via job_id),
                          |               |     |     so every AWB is traceable back to its sales rep
                          |               |     |     into several shipments, or a consol with houses)
                          |               |     | ──► email_threads.enquiry_id
                          |               |     | ──► pdf_processing_jobs.enquiry_id
                          |               |     | ──► llm_usage_logs.enquiry_id
                          |               |     | ──► ocr_credit_transactions.enquiry_id
  agent_id                | BIGINT        | FK  | ◄── agents_info.id
  transport_mode          | VARCHAR(10)   |     | (air, sea, road — selects the regex rule set AND the conversion
                          |               |     |  target: AIR ⇒ AWB/HAWB, SEA ⇒ MBL/HBL)
  direction               | VARCHAR(10)   |     | (export, import)
  enquiry_no              | VARCHAR(30)   | UK  | (ENQA-26-0001 air | ENQS-26-0001 sea; unique per agent)
  quotation_no            | VARCHAR(30)   |     |
  customer_id             | BIGINT        | FK  | ◄── customers.id (resolved via customers.email_domain;
                          |               |     |  NULL until the client company is registered)
  sales_id                | BIGINT        | FK  | ◄── users.id (sales rep owning this enquiry — COMMAND tier.
                          |               |     |  NULLABLE: a brand-new enquiry from an unregistered company has
                          |               |     |  no rep yet. Populated (and backfilled onto existing enquiries)
                          |               |     |  the moment accounts registers the customer and customers.sales_id
                          |               |     |  is set. The job and its AWB inherit the rep through
                          |               |     |  enquiry_id → job_id, so the whole chain is attributable)
  ops_id                  | BIGINT        | FK  | ◄── users.id (operations executor; NULL = unassigned pool)
  pricing_id              | BIGINT        | FK  | ◄── users.id (pricing owner; commercial authority)
  status                  | VARCHAR(20)   |     | (new, quoted, awaiting_client, converted, lost)
  extracted_pieces        | INT           |     | DECLARED cargo — what the client SAID. Never overwritten
  extracted_weight        | DECIMAL(10,3) |     | by actual shipped figures; the enquiry-vs-actual delta IS
  extracted_volume        | DECIMAL(8,3)  |     | the under-declaration signal, so both sides must survive.
  cargo_description       | TEXT          |     |
  cargo_type              | VARCHAR(20)   |     | (General, Hazmat, Perishable, ULD, FCL, LCL)
  cargo_data_source       | VARCHAR(10)   |     | (regex | ocr — Tier 3 'verified' lives on *_shipment_details)
  cargo_data_promoted_at  | TIMESTAMP     |     |
  origin_code             | CHAR(5)       |     | (LOCODE at enquiry time — lost enquiries never get
  dest_code               | CHAR(5)       |     |  shipment_details, so lane analytics need these)
  quoted_amount           | DECIMAL(15,2) |     | (Required to model rates_high: lost by HOW MUCH?)
  quoted_currency         | CHAR(3)       |     |
  lost_reason             | VARCHAR(30)   |     | (rates_high, delay_in_response, client_cancelled,
                          |               |     |  capacity_issue, other) — pre-conversion only
  lost_reason_custom      | VARCHAR(255)  |     |
  lost_at                 | TIMESTAMP     |     |
  reopened_at             | TIMESTAMP     |     | (Revived by trailing client mail; KEEPS original enquiry_no)
  stale_nudged_at         | TIMESTAMP     |     | (Inactivity-nudge debounce; cleared on new client reply)
  reinitiated_from_job_id | BIGINT        | FK  | ◄── jobs.id (re-quote lineage: a CANCELLED job spawns a
                          |               |     |     NEW enquiry — rates are time-sensitive)
  created_at              | TIMESTAMP     |     |
  updated_at              | TIMESTAMP     |     |
```

### 5. `jobs` (PK: `id`)
*Post-conversion lifecycle — confirmed shipments only. A row exists here **only** once the client confirms.*

```text
  Column                     | Type         | Key | Connection Links
  ---------------------------|--------------|-----|----------------------------------------
  id                         | BIGINT       | PK  | ──► sea_shipment_details.job_id (1-to-1)
                             |              |     | ──► air_shipment_details.job_id (1-to-1)
                             |              |     | ──► air_way_bills.job_id
                             |              |     | ──► house_way_bills.job_id
                             |              |     | ──► sea_containers.job_id
                             |              |     | ──► sea_container_items.job_id
                             |              |     | ──► email_threads.job_id
                             |              |     | ──► job_documents.job_id (Cascade delete)
                             |              |     | ──► milestone_performance_logs.job_id
                             |              |     | ──► llm_usage_logs.job_id
                             |              |     | ──► approved_drafts_queue.job_id
                             |              |     | ──► operational_cover_letters.job_id
                             |              |     | ──► accounts_invoices.job_id (Restricted delete)
                             |              |     | ──► accounts_purchase_vouchers.job_id (Restricted delete)
                             |              |     | ──► ocr_credit_transactions.job_id
                             |              |     | ──► jobs.parent_job_id (Self; consolidation)
                             |              |     | ──► enquiries.reinitiated_from_job_id (re-quote lineage:
                             |              |     |     a cancelled job spawns a NEW enquiry)
  agent_id                   | BIGINT       | FK  | ◄── agents_info.id
  enquiry_id                 | BIGINT       | FK  | ◄── enquiries.id (NOT NULL — every job traces to its
                             |              |     |     originating enquiry. "Converted" = a job row exists;
                             |              |     |     do NOT also store enquiries.converted_job_id)
  transport_mode             | VARCHAR(10)  |     | (air, sea, road — denormalized from the enquiry for scoping)
  direction                  | VARCHAR(10)  |     | (export, import)
  execution_job_no           | VARCHAR(30)  | UK  | (JOBA-26-0001 air | JOBS-26-0001 sea; unique per agent)
  job_order_no               | VARCHAR(30)  | UK  | (Client-side reference job order number)
  quotation_no               | VARCHAR(30)  |     | (Reference to quotation draft payload)
  customer_id                | BIGINT       | FK  | ◄── customers.id
  ops_id                     | BIGINT       | FK  | ◄── users.id (Live operator; assigned by pricing staff; reassignable)
  pending_ops_id             | BIGINT       | FK  | ◄── users.id (Staged reassignment awaiting pricing-owner approval; ops_id stays live until accepted)
  pending_ops_requested_by   | BIGINT       | FK  | ◄── users.id (Operator who requested the handover)
  pending_ops_requested_at   | TIMESTAMP    |     | (When the reassignment was requested)
  pricing_id                 | BIGINT       | FK  | ◄── users.id (Pricing owner; assignment authority)
  status                     | VARCHAR(30)  |     | (Intake, AI Extraction, Verification, Generation, PDF
                             |              |     |  Generated, Sent to Airline, Airline Confirmed, Completed,
                             |              |     |  Cancelled). 'Lost' is NOT valid here — it lives on
                             |              |     |  enquiries.status, making the split structural.
  cancellation_reason        | VARCHAR(30)  |     | (customs_hold_unresolved, client_cancelled, cargo_not_ready, documentation_incomplete, payment_or_credit_hold, carrier_space_lost, cargo_damaged, prohibited_regulatory, rate_expired_requote, duplicate, other) — post-conversion aborts only
  cancellation_reason_custom | VARCHAR(255) |     | (Free text when cancellation_reason = 'other')
  cancelled_at               | TIMESTAMP    |     | (When status set to Cancelled)
  cancelled_by               | BIGINT       | FK  | ◄── users.id (Operator/manager who cancelled)
  parent_job_id              | BIGINT       | FK  | ◄── jobs.id (Self-referencing Consol validation)
  is_sub_shipment            | BOOLEAN      |     | (Child House record under consolidation)
  is_consolidation           | BOOLEAN      |     | (Parent Master record accepting child Houses)
  cargo_type                 | VARCHAR(20)  |     | (Authoritative: General, Hazmat, Perishable, ULD, FCL, LCL)
  consol_type                | VARCHAR(20)  |     | (Authoritative: agent_consol, buyers_consol, direct, none)
  delivery_mode              | VARCHAR(20)  |     | (Authoritative: door-to-door, port-to-port, etc.)
  booking_thru               | VARCHAR(20)  |     | (self, agent — dictates commission routing / profit
                             |              |     |  share on the Charges tab. FocusSea header field)
  planned_clearance_date     | DATE         |     | (Clearance schedule tracker)
  awb_number                 | VARCHAR(20)  |     | (AIR only. Sea shipments carry MBL/HBL on
                             |              |     |  sea_shipment_details and never populate this.)
  pickup_address             | VARCHAR(500) |     | (Authoritative source address)
  delivery_address           | VARCHAR(500) |     | (Authoritative target address)
  completed_at               | TIMESTAMP    |     | (Timestamp when status reached Completed)
  created_at                 | TIMESTAMP    |     |
  updated_at                 | TIMESTAMP    |     |
```

### 6. `sea_shipment_details` (PK: `id`)
```text
  Column                 | Type          | Key | Connection Links
  -----------------------|---------------|-----|----------------------------------------
  id                     | BIGINT        | PK  |
  job_id                 | BIGINT        | FK  | ◄── jobs.id (Unique index)
  carrier_id             | BIGINT        | FK  | ◄── partners.id
  vessel_name            | VARCHAR(100)  |     |
  voyage_no              | VARCHAR(30)   |     |
  vessel_flag            | VARCHAR(50)   |     |
  imo_number             | VARCHAR(20)   |     |
  por_code               | CHAR(5)       |     | (LOCODE)
  pol_code               | CHAR(5)       |     | (LOCODE)
  pod_code               | CHAR(5)       |     | (LOCODE)
  del_code               | CHAR(5)       |     | (LOCODE)
  transshipment_required | BOOLEAN       |     |
  imdg_class             | VARCHAR(10)   |     | (Hazardous materials class)
  un_number              | VARCHAR(10)   |     | (UN identifier)
  hbl_number             | VARCHAR(30)   |     |
  mbl_number             | VARCHAR(30)   |     |
  freight_terms          | VARCHAR(20)   |     | (prepaid, collect)
  piece_count            | INT           |     |
  gross_weight           | DECIMAL(10,3) |     |
  net_weight             | DECIMAL(10,3) |     |
  chargeable_weight      | DECIMAL(10,3) |     |
  volume_cbm             | DECIMAL(8,3)  |     |
  filing_status          | VARCHAR(20)   |     | (pending, filed, accepted, rejected)
  customs_broker_id      | BIGINT        | FK  | ◄── partners.id
  transporter_id         | BIGINT        | FK  | ◄── partners.id
  haulage_provider_id    | BIGINT        | FK  | ◄── partners.id
  handling_agent_id      | BIGINT        | FK  | ◄── partners.id
  shipping_bill_no       | VARCHAR(30)   |     |
  shipping_bill_date     | DATE          |     |
  igm_no                 | VARCHAR(30)   |     | (Import General Manifest)
  igm_date               | DATE          |     |
  container_type         | VARCHAR(20)   |     | (FCL, LCL)
  created_at             | TIMESTAMP     |     |
  updated_at             | TIMESTAMP     |     |
```

### 7. `air_shipment_details` (PK: `id`)
```text
  Column            | Type          | Key | Connection Links
  ------------------|---------------|-----|----------------------------------------
  id                | BIGINT        | PK  |
  job_id            | BIGINT        | FK  | ◄── jobs.id (Unique index)
  flight_number     | VARCHAR(20)   |     |
  flight_date       | TIMESTAMP     |     |
  carrier_name      | VARCHAR(100)  |     |
  pol_code          | CHAR(5)       |     | (LOCODE)
  pod_code          | CHAR(5)       |     | (LOCODE)
  do_given_to       | VARCHAR(100)  |     |
  pickup_address    | VARCHAR(500)  |     |
  delivery_address  | VARCHAR(500)  |     |
  piece_count       | INT           |     |
  gross_weight      | DECIMAL(10,3) |     |
  chargeable_weight | DECIMAL(10,3) |     |
  volume_cbm        | DECIMAL(8,3)  |     |
  created_at        | TIMESTAMP     |     |
  updated_at        | TIMESTAMP     |     |
```

### 8. `air_way_bills` (PK: `id`)
```text
  Column     | Type        | Key | Connection Links
  -----------|-------------|-----|----------------------------------------
  id         | VARCHAR(20) | PK  | (awb_code + awb_no)
  uuid       | UUID        | UK  | (Secure tracker reference)
  job_id     | BIGINT      | FK  | ◄── jobs.id
  agent_id   | BIGINT      | FK  | ◄── agents_info.id
  awb_code   | CHAR(3)     |     |
  awb_no     | CHAR(8)     |     |
  created_at | TIMESTAMP   |     |
  updated_at | TIMESTAMP   |     |
```

### 9. `house_way_bills` (PK: `id`)
```text
  Column       | Type        | Key | Connection Links
  -------------|-------------|-----|----------------------------------------
  id           | VARCHAR(30) | PK  |
  uuid         | UUID        | UK  | (Secure tracker reference)
  job_id       | BIGINT      | FK  | ◄── jobs.id
  agent_id     | BIGINT      | FK  | ◄── agents_info.id
  reference_id | VARCHAR(50) |     |
  created_at   | TIMESTAMP   |     |
  updated_at   | TIMESTAMP   |     |
```

### 10. `mailbox_connections` (PK: `id`)
```text
  Column                | Type         | Key | Connection Links
  ----------------------|--------------|-----|----------------------------------------
  id                    | BIGINT       | PK  |
  agent_id              | BIGINT       | FK  | ◄── agents_info.id (Branch-level tenant isolation)
  user_id               | BIGINT       | FK  | ◄── users.id (Operator who owns this mailbox)
  email_address         | VARCHAR(100) | UK  |
  provider              | VARCHAR(20)  |     | (google, microsoft)
  access_token          | TEXT         |     | (Encrypted at rest)
  refresh_token         | TEXT         |     | (Encrypted at rest)
  expires_at            | TIMESTAMP    |     |
  is_active             | BOOLEAN      |     | (SUPERADMIN axis ONLY — false = paused by a tier downgrade
                        |              |     |  on companies.tier. Tokens KEPT so an upgrade restores sync
                        |              |     |  without re-auth. NEVER used for a user removing a mailbox)
  sync_cursor           | TEXT         |     | (Graph @odata.deltaLink or Gmail historyId. Seeded by
                        |              |     |  backfill, rewritten after each successful poll page.
                        |              |     |  Encrypted at rest — the Graph deltaLink embeds a token)
  last_synced_at        | TIMESTAMP    |     | (Last successful poll; the floor for cursor-expiry recovery)
  backfill_status       | VARCHAR(20)  |     | (pending, running, completed, failed. Polling refuses to
                        |              |     |  start until 'completed' so no gap message is lost)
  backfill_from         | TIMESTAMP    |     | (Window floor actually requested — default now() - 60 days.
                        |              |     |  Stored, not derived, so an onboarding can widen the window
                        |              |     |  and the audit trail records what was really pulled)
  backfill_completed_at | TIMESTAMP    |     |
  backfill_page_cursor  | TEXT         |     | ** RESUME POINT ** — Graph @odata.nextLink or Gmail
                        |              |     |  pageToken, rewritten after EVERY committed page. A
                        |              |     |  backfill interrupted by a dropped connection resumes
                        |              |     |  from here instead of restarting from zero
  backfill_processed    | INT          |     | (Messages committed so far — drives the progress bar)
  backfill_estimate     | INT          |     | (Approximate total, for progress display only)
  backfill_attempts     | INT          |     | (Consecutive failures; backoff, then auth_state=reauth_required
                        |              |     |  — `failed` is not a valid auth_state value; see PRD §5.2.3)
  watch_expires_at      | TIMESTAMP    |     | (Gmail users.watch() / Graph subscription expiry. Push dies
                        |              |     |  after ~7 days WITH NO ERROR, so mailboxes:renew-watch runs
                        |              |     |  DAILY and re-subscribes when this is < 48h away)
  signature_html        | TEXT         |     | (PER-MAILBOX signature, overriding users.signature_text.
                        |              |     |  A user with two connected mailboxes usually needs two.
                        |              |     |  Imported from Gmail where the scope allows; pasted in
                        |              |     |  for Outlook, which exposes no signature API)
  signature_source      | VARCHAR(20)  |     | (imported | pasted | manual — shown in settings so the
                        |              |     |  user knows whether it will drift from their mail client)
  auth_state            | VARCHAR(30)  |     | (not_connected, awaiting_admin_consent, connected,
                        |              |     |  reauth_required — drives MailboxSettings.vue directly.
                        |              |     |  SOLE connection-state column; a duplicate `status` column
                        |              |     |  was dropped 2026-08-26)
  disconnected_at       | TIMESTAMP    |     | (USER axis — stamped when the owning staff member removes
                        |              |     |  their own mailbox. Tokens are CLEARED. Distinct from
                        |              |     |  is_active: an upgrade must never undo this)
  disconnected_by       | BIGINT       | FK  | ◄── users.id
  created_at            | TIMESTAMP    |     |
  updated_at            | TIMESTAMP    |     |
```

**Backfill contract.** On OAuth callback the row is written with `backfill_status = 'pending'` and `backfill_from = now() - 60 days`, and `BackfillMailboxJob` is queued. It pages history into `email_messages` with `is_historical = true`, commits the terminal cursor to `sync_cursor`, then sets `backfill_status = 'completed'`. Only then does `mailboxes:poll` pick the connection up. A `failed` backfill is retryable from `MailboxSettings.vue` without re-authorization — the tokens are already valid.

### 11. `email_threads` (PK: `id`)
```text
  Column                      | Type         | Key | Connection Links
  ----------------------------|--------------|-----|----------------------------------------
  id                          | BIGINT       | PK  |
  agent_id                    | BIGINT       | FK  | ◄── agents_info.id
  assigned_ops_id             | BIGINT       | FK  | ◄── users.id (Auto-assigned to first email responder; reassignable)
  enquiry_id                  | BIGINT       | FK  | ◄── enquiries.id (set at triage — the thread spans BOTH
                              |              |     |  lifecycles. NULL together with job_id for airline /
                              |              |     |  clearance / trucking mail, which consumes no enquiry_no)
  job_id                      | BIGINT       | FK  | ◄── jobs.id (added on conversion; NULL pre-conversion)
  thread_key                  | VARCHAR(255) | UK  | ──► email_messages.thread_key
  provider_thread_id          | VARCHAR(255) | IDX | (Gmail threadId / Graph conversationId — matched
                              |              |     |  first, before any header or subject heuristic)
  read_state_synced_at        | TIMESTAMP    |     | (Last push of read/archive state upstream. The
                              |              |     |  PROVIDER is authoritative on conflict)
  status                      | VARCHAR(20)  |     | (unread, read, replied, archived, updates)
  classification              | VARCHAR(20)  |     | (customer_enquiry, airline, clearance, trucking_road)
  latest_message_received_at  | TIMESTAMP    |     | (Last INBOUND client message)
  first_response_at           | TIMESTAMP    |     | (First OUTBOUND reply to the client. Distinct from first_triage_at, which records internal triage, not a reply. Required to measure true response latency — the exact claim lost_reason='delay_in_response' makes; without it we can neither prove nor disprove our own SLA failures)
  first_triage_at             | TIMESTAMP    |     | (Immutable audit timestamp — internal triage, NOT a client reply)
  pending_client_notification | JSON         |     | (Staged draft email body, attachment list, and type awaiting user consent)
  created_at                  | TIMESTAMP    |     |
  updated_at                  | TIMESTAMP    |     |
```

### 12. `email_messages` (PK: `id`)
*Every message on a thread, **both directions**. Renamed from `inbound_emails` — the Sent folder is synced too, so this holds the whole conversation. Bodies live in object storage; only a snippet is inline.*
```text
  Column                | Type         | Key | Connection Links
  ----------------------|--------------|-----|----------------------------------------
  id                    | BIGINT       | PK  | ──► email_attachments.email_message_id
  agent_id              | BIGINT       | FK  | ◄── agents_info.id (Branch-level tenant isolation)
  mailbox_connection_id | BIGINT       | FK  | ◄── mailbox_connections.id (Cascade delete)
  thread_key            | VARCHAR(255) | IDX | ──► email_threads.thread_key (Composite index)
  provider_thread_id    | VARCHAR(255) | IDX | ** Gmail threadId / Graph conversationId ** — the native
                        |              |     |  grouping key. PRIMARY input to thread_key resolution;
                        |              |     |  header-chain matching is only the fallback
  direction             | VARCHAR(10)  |     | (inbound | outbound. The Sent folder is synced too, so a
                        |              |     |  reply typed in Outlook appears on the portal thread.
                        |              |     |  Set from the folder/label the message was synced from)
  sent_via_portal       | BOOLEAN      |     | (TRUE when we sent it — set at send time from the provider's
                        |              |     |  returned id, so the sync echo is recognised, not duplicated)
  idempotency_key       | CHAR(36)     | UK  | ** DOUBLE-SEND GUARD ** — minted client-side when the user hits
                        |              |     |  Send. A retried request (network blip, double-click, queue
                        |              |     |  redelivery) collides on this UNIQUE key and returns the
                        |              |     |  original result instead of sending the mail twice. Sending
                        |              |     |  a client the same message twice is unrecoverable
  send_state            | VARCHAR(20)  |     | (queued | sending | sent | failed | cancelled. Outbound only;
                        |              |     |  NULL for inbound. Drives the outbox UI)
  scheduled_send_at     | TIMESTAMP    |     | ** UNDO WINDOW ** — dispatch is held until this moment
                        |              |     |  (default +15s). Cancelling inside the window sets
                        |              |     |  send_state='cancelled' and nothing ever leaves
  send_attempts         | INT          |     | (Retry counter; exponential backoff)
  send_error            | VARCHAR(500) |     | (Last provider error, shown verbatim in the outbox)
  message_id            | VARCHAR(255) | UK  |
  from                  | VARCHAR(255) |     |
  to                    | VARCHAR(255) |     |
  subject               | VARCHAR(255) |     |
  body_snippet          | VARCHAR(500) |     | ** INLINE ** — first ~500 chars, plain text. Thread lists
                        |              |     |  and search previews read ONLY this, never the full body
  body_storage_path     | VARCHAR(500) |     | ** OFFLOADED ** — S3 key holding {text, html} as JSON,
                        |              |     |  HTMLPurifier-sanitised before write. Fetched only when a
                        |              |     |  user opens the message; cached in Redis 24h.
                        |              |     |  At ~50KB/mail × 1k mailboxes this is ~900GB/year — inline
                        |              |     |  LONGTEXT would make backup, restore and any ALTER on this
                        |              |     |  table progressively unusable
  body_purge_after      | TIMESTAMP    |     | (DPDP retention — transient mail text purged at 2 years.
                        |              |     |  Row and metadata survive; only the S3 object is deleted)
  received_at           | TIMESTAMP    |     |
  is_historical         | BOOLEAN      |     | (true = ingested by the onboarding backfill, not live polling.
                        |              |     |  Suppresses the SLA countdown, bell notifications and
                        |              |     |  auto-enquiry proposal. Classification, thread grouping and
                        |              |     |  sender attribution still run — the flag governs what FIRES,
                        |              |     |  never what is STORED)
  created_at            | TIMESTAMP    |     |
  updated_at            | TIMESTAMP    |     |
```

> **Why a column and not just a `received_at` age test.** "Older than the connection date" is not the same question as "arrived via backfill." A genuinely old message forwarded into the mailbox *after* connection is live mail and must start an SLA clock; a backfilled message that happens to be two days old must not. Only the ingest path knows which is which, so the ingest path records it.

### 13. `email_attachments` (PK: `id`)
*Renamed from `inbound_attachments` — attachments on outbound messages are indexed here too.*
***We are a cache, not the archive.** These files already live in the user's mailbox permanently. We hold a copy for the active window, then drop the bytes and re-fetch from the provider on demand. Contrast `job_documents`, which we generate ourselves and must retain by statute.*
```text
  Column           | Type         | Key | Connection Links
  -----------------|--------------|-----|----------------------------------------
  id               | BIGINT       | PK  |
  email_message_id | BIGINT       | FK  | ◄── email_messages.id (Cascade delete)
  filename         | VARCHAR(255) |     |
  file_path        | VARCHAR(255) |     | (S3 key while cached. NULLED when the cache expires — the
                   |              |     |  row survives so the attachment still shows on the thread)
  provider_attachment_id | VARCHAR(255) | | ** RE-FETCH KEY ** — Gmail attachmentId / Graph attachment
                   |              |     |  id. With the parent's message_id this is enough to pull the
                   |              |     |  file back from the mailbox on demand, so we never need to
                   |              |     |  store it permanently
  cache_expires_at | TIMESTAMP    |     | (Bytes dropped after this. Default +90 days from last access;
                   |              |     |  any download or preview pushes it out again)
  fetch_state      | VARCHAR(20)  |     | (cached | evicted | unavailable. 'unavailable' = re-fetch
                   |              |     |  failed — mailbox disconnected, message deleted, or the
                   |              |     |  staff member left. The UI must say so rather than 404)
  mime_type        | VARCHAR(50)  |     |
  created_at       | TIMESTAMP    |     |
  updated_at       | TIMESTAMP    |     |
```

### 14. `job_documents` (PK: `id`)
```text
  Column        | Type         | Key | Connection Links
  --------------|--------------|-----|----------------------------------------
  id            | BIGINT       | PK  | ──► document_share_links.job_document_id (Cascade delete)
  agent_id      | BIGINT       | FK  | ◄── agents_info.id (Branch-level tenant isolation)
  job_id        | BIGINT       | FK  | ◄── jobs.id (Cascade delete)
  document_type | VARCHAR(50)  |     | (commercial_invoice, packing_list, awb_copy, bl_copy, delivery_order, arrival_notice, cover_letter, other, ...)
  file_name     | VARCHAR(255) |     | (Original uploaded filename)
  file_path     | VARCHAR(500) |     | (Storage path on disk or S3)
  mime_type     | VARCHAR(50)  |     | (e.g. application/pdf, image/png)
  file_size     | INT          |     | (Size in bytes)
  uploaded_by   | BIGINT       | FK  | ◄── users.id
  created_at    | TIMESTAMP    |     |
  updated_at    | TIMESTAMP    |     |
```

### 14a. `document_share_links` (PK: `id`)
*Tokenised, expiring, revocable public links to a single `job_documents` row — so staff stop downloading and re-attaching the same PDF. Optionally carries a client approve / request-changes decision back into the system.*

```text
  Column           | Type         | Key | Connection Links
  -----------------|--------------|-----|----------------------------------------
  id               | BIGINT       | PK  |
  agent_id         | BIGINT       | FK  | ◄── agents_info.id (Branch-level isolation)
  job_document_id  | BIGINT       | FK  | ◄── job_documents.id (Cascade delete)
  job_id           | BIGINT       | FK  | ◄── jobs.id (Denormalized for scoping/audit)
  token_hash       | CHAR(64)     | UK  | ** SHA-256 of the token. The raw token exists ONLY in
                   |              |     |  the URL and is never stored — same discipline as a
                   |              |     |  password-reset token. Lookup hashes the incoming value
  created_by       | BIGINT       | FK  | ◄── users.id (Who generated the link)
  expires_at       | TIMESTAMP    |     | ** NOT NULL ** — every link expires (default +14 days).
                   |              |     |  An unauthenticated document URL must never be permanent
  revoked_at       | TIMESTAMP    |     | (Manual kill switch; independent of expiry)
  requires_approval| BOOLEAN      |     | (false = view only; true = client may Approve / Request changes)
  approval_status  | VARCHAR(20)  |     | (pending, approved, changes_requested — NULL when
                   |              |     |  requires_approval = false)
  approver_name    | VARCHAR(100) |     | (Typed by the client — they are NOT a system user)
  approver_email   | VARCHAR(255) |     | (Captured for audit; matched against customer_contacts)
  client_comment   | TEXT         |     | (What they want changed)
  responded_at     | TIMESTAMP    |     |
  first_viewed_at  | TIMESTAMP    |     | (Proof the client actually opened it)
  last_viewed_at   | TIMESTAMP    |     |
  view_count       | INT          |     |
  created_at       | TIMESTAMP    |     |
  updated_at       | TIMESTAMP    |     |
```

> **A link grants document access without a login, so it is treated as a credential.** 256-bit CSPRNG token, stored only as a hash, mandatory expiry, revocable, rate-limited, served `noindex, nofollow` with no directory listing. It exposes **one document** — never the job, the client's other shipments, or any pricing.

### 15. `milestone_performance_logs` (PK: `id`)
```text
  Column         | Type        | Key | Connection Links
  ---------------|-------------|-----|----------------------------------------
  id             | BIGINT      | PK  |
  agent_id       | BIGINT      | FK  | ◄── agents_info.id
  job_id         | BIGINT      | FK  | ◄── jobs.id
  milestone_name | VARCHAR(50) |     | (Intake, AI Extraction, Verification, etc.)
  entered_at     | TIMESTAMP   |     |
  created_at     | TIMESTAMP   |     |
  updated_at     | TIMESTAMP   |     |
```

### 15a. `sla_policies` (PK: `id`)
*Note: This table stores tenant-level SLA response parameters mapping maximum acceptable delay thresholds per subscription tier.*

```text
  Column                 | Type        | Key | Connection Links
  -----------------------|-------------|-----|----------------------------------------
  id                     | BIGINT      | PK  |
  company_id             | BIGINT      | FK  | ◄── companies.id
  tier                   | VARCHAR(30) |     | (core, tactical, command)
  max_reply_time_minutes | INT         |     | (Default: 15 minutes)
  created_at             | TIMESTAMP   |     |
  updated_at             | TIMESTAMP   |     |
```

### 15b. `tenant_policies` (PK: `id`)
*Every value `PRD.md` calls "admin-configurable" or "adjustable per branch" that previously had **no storage anywhere** — OLI coefficients (§5.5), undo-send window (§5.2.4), stale-enquiry window (§5.4), CASS tolerances (§6.5). `/settings/workload` was a screen with nothing behind it.*

```text
  Column                    | Type         | Key | Connection Links
  --------------------------|--------------|-----|----------------------------------------
  id                        | BIGINT       | PK  |
  company_id                | BIGINT       | FK  | ◄── companies.id
  agent_id                  | BIGINT       | FK  | ◄── agents_info.id (NULL = company-wide;
                            |              |     |  set = branch override, wins over company)
  oli_complexity_air_export | DECIMAL(4,2) |     | (all OLI columns: PRD §5.5, Boss-owned)
  oli_complexity_air_import | DECIMAL(4,2) |     |
  oli_complexity_sea_export | DECIMAL(4,2) |     |
  oli_complexity_sea_import | DECIMAL(4,2) |     |
  oli_dimension_factor      | DECIMAL(4,2) |     | (α — per distinct L×W×H line)
  oli_house_factor          | DECIMAL(4,2) |     | (β — per HAWB)
  oli_urgency_today         | DECIMAL(4,2) |     | (clearance today or overdue)
  oli_urgency_tomorrow      | DECIMAL(4,2) |     |
  oli_urgency_later         | DECIMAL(4,2) |     |
  oli_capacity_cap          | DECIMAL(6,2) |     | (above this, assignment warns)
  undo_send_seconds         | INT          |     | (PRD §5.2.4; 0 = send immediately)
  stale_enquiry_days        | INT          |     | (PRD §5.4)
  cass_weight_tolerance_pct | DECIMAL(5,2) |     | (PRD §6.5 — the only BRANCH-level pair,
  cass_rate_tolerance_pct   | DECIMAL(5,2) |     |  which is why agent_id exists here)
  policy_scope_gate         | BIGINT       | UK  | (GENERATED STORED = COALESCE(agent_id,0).
                            |              |     |  Backs UNIQUE(company_id, policy_scope_gate)
                            |              |     |  so only ONE company-wide row can exist —
                            |              |     |  a plain UNIQUE would allow many, since both
                            |              |     |  engines permit repeated NULLs in an index.
                            |              |     |  Same trick as job_entities.unique_role_gate)
  created_at                | TIMESTAMP    |     |
  updated_at                | TIMESTAMP    |     |
```

> **No `deleted_at`** — `PRD.md` §9.3 names exactly six soft-deleting tables and this is not one. Removing an override means NULLing the column so it falls through to the config default, never deleting the row.

> **Every column is NULLable with no SQL default, deliberately.** NULL means *"inherit from `config/f16s.php`"* — the same pattern `companies.ocr_credits_monthly_allowance` uses. Defaults live in **one** place; this table holds only deliberate overrides. Resolution is always **branch → company → config**.
>
> **Not merged with `sla_policies`**, which is keyed by `(company_id, tier)` — a different grain. `max_reply_time_minutes` stays there and must never be duplicated here.

### 16. `audit_logs` (PK: `id`)
```text
  Column     | Type         | Key | Connection Links
  -----------|--------------|-----|----------------------------------------
  id         | BIGINT       | PK  |
  agent_id   | BIGINT       | FK  | ◄── agents_info.id
  user_id    | BIGINT       | FK  | ◄── users.id
  action     | VARCHAR(255) |     |
  model_type | VARCHAR(100) |     |
  model_id   | BIGINT       |     |
  created_at | TIMESTAMP    |     |
  updated_at | TIMESTAMP    |     |
```

### 17. `chart_of_accounts` (PK: `id`)
```text
  Column       | Type         | Key | Connection Links
  -------------|--------------|-----|----------------------------------------
  id           | BIGINT       | PK  | ──► accounts_ledger_entries.chart_of_account_id
  agent_id     | BIGINT       | FK  | ◄── agents_info.id
  account_code | VARCHAR(30)  |     | (Unique per agent)
  account_name | VARCHAR(100) |     |
  created_at   | TIMESTAMP    |     |
  updated_at   | TIMESTAMP    |     |
```

### 18. `accounting_periods` (PK: `id`)
```text
  Column      | Type        | Key | Connection Links
  ------------|-------------|-----|----------------------------------------
  id          | BIGINT      | PK  | ──► accounts_ledger_entries.accounting_period_id
              |             |     | ──► financial_snapshots.accounting_period_id
  agent_id    | BIGINT      | FK  | ◄── agents_info.id
  period_name | VARCHAR(50) |     |
  start_date  | DATE        |     |
  end_date    | DATE        |     |
  status      | VARCHAR(20) |     | (open, closed)
  created_at  | TIMESTAMP   |     |
  updated_at  | TIMESTAMP   |     |
```

### 19. `sea_containers` (PK: `id`)
```text
  Column           | Type        | Key | Connection Links
  -----------------|-------------|-----|----------------------------------------
  id               | BIGINT      | PK  | ──► sea_container_items.container_id
  agent_id         | BIGINT      | FK  | ◄── agents_info.id
  job_id           | BIGINT      | FK  | ◄── jobs.id
  container_number | VARCHAR(20) |     |
  seal_number      | VARCHAR(30) |     |
  created_at       | TIMESTAMP   |     |
  updated_at       | TIMESTAMP   |     |
```

### 20. `sea_container_items` (PK: `id`)
```text
  Column       | Type      | Key | Connection Links
  -------------|-----------|-----|----------------------------------------
  id           | BIGINT    | PK  |
  agent_id     | BIGINT    | FK  | ◄── agents_info.id
  container_id | BIGINT    | FK  | ◄── sea_containers.id
  job_id       | BIGINT    | FK  | ◄── jobs.id (House child card)
  piece_count  | INT       |     |
  created_at   | TIMESTAMP |     |
  updated_at   | TIMESTAMP |     |
```

### 21. `cargo_arrival_notices` (PK: `id`)
```text
  Column        | Type        | Key | Connection Links
  --------------|-------------|-----|----------------------------------------
  id            | BIGINT      | PK  |
  agent_id      | BIGINT      | FK  | ◄── agents_info.id
  job_id        | BIGINT      | FK  | ◄── jobs.id
  notice_number | VARCHAR(30) | UK  | (Per-agent sequential CAN-YY-NNNN; unique per (agent_id, notice_number))
  created_at    | TIMESTAMP   |     |
  updated_at    | TIMESTAMP   |     |
```

### 22. `job_entities` (PK: `id`)
```text
  Column            | Type        | Key | Connection Links
  ------------------|-------------|-----|----------------------------------------
  id                | BIGINT      | PK  |
  agent_id          | BIGINT      | FK  | ◄── agents_info.id
  job_id            | BIGINT      | FK  | ◄── jobs.id
  party_type        | VARCHAR(50) |     | (customer, partner)
  party_id          | BIGINT      |     | (Polymorphic ID referencing customers.id or partners.id)
  role              | VARCHAR(30) |     | (shipper, consignee, notify_party, origin_agent, dest_agent, selling_agent, customs_broker, transporter, other)
  custom_role_label | VARCHAR(50) |     | (Optional label for custom roles when role = 'other')
  unique_role_gate  | VARCHAR(50) |     | (GENERATED STORED column — NULL when role = 'notify_party',
                    |             |     |  else = role. Backs a unique index on (job_id, unique_role_gate)
                    |             |     |  so each role is single-instance EXCEPT notify_party, which may repeat.
                    |             |     |  Expression is CASE WHEN — see the DDL; IF() would be MySQL-only)
  created_at        | TIMESTAMP   |     |
  updated_at        | TIMESTAMP   |     |
```

### 23. `accounts_invoices` (PK: `id`)
```text
  Column            | Type          | Key | Connection Links
  ------------------|---------------|-----|----------------------------------------
  id                | BIGINT        | PK  | ──► accounts_invoice_items.invoice_id (Cascade)
                    |               |     | ──► accounts_invoice_brokerage_details.invoice_id
                    |               |     | ──► accounts_invoice_consol_details.invoice_id
                    |               |     | ──► bank_transactions.matched_invoice_id
                    |               |     | ──► accounts_invoices.parent_invoice_id (Self-relation)
  agent_id          | BIGINT        | FK  | ◄── agents_info.id
  job_id            | BIGINT        | FK  | ◄── jobs.id (On Delete Restrict)
  transport_mode    | VARCHAR(10)   |     | (air, sea, road — inherited from parent jobs.transport_mode; scoping/partitioning)
  customer_id       | BIGINT        | FK  | ◄── customers.id (Customer debtor; NULLABLE — populated only for customer-billed docs, drives AR/collections/credit which are customer-only)
  billed_party_type | VARCHAR(20)   |     | (Polymorphic bill-to: 'customer' or 'partner')
  billed_party_id   | BIGINT        |     | (Polymorphic ID → customers.id or partners.id — the actual recipient; equals customer_id for customer invoices, a partner for brokerage/consol/agent invoices)
  parent_invoice_id | BIGINT        | FK  | ◄── accounts_invoices.id (Self-referencing credit notes)
  created_by        | BIGINT        | FK  | ◄── users.id (must hold designation = 'accounts'; posting authority
                    |               |     |  is accounts-only — pricing edits the cost sheet, accounts posts it)
  invoice_no        | VARCHAR(30)   | UK  | (Central Counter sequential prefix-YY-NNNN)
  type              | VARCHAR(20)   |     | (invoice, debit_note, credit_note, brokerage, consol_invoice)
  document_date     | DATE          |     |
  status            | VARCHAR(20)   |     | (draft, finalized, sent, partially_paid, paid, void)
  subtotal          | DECIMAL(15,2) |     | (Net billing amount before taxes)
  tax_amount        | DECIMAL(15,2) |     | (Accrued tax split)
  grand_total       | DECIMAL(15,2) |     | (Total amount payable in base currency)
  amount_paid       | DECIMAL(15,2) |     | (Cumulative settled amount; grand_total − amount_paid = outstanding balance)
  currency          | CHAR(3)       |     | (USD, INR, EUR, etc.)
  exchange_rate     | DECIMAL(10,4) |     | (Conversion multiplier to base currency)
  is_posted         | BOOLEAN       |     | (true = locked/posted to general ledger)
  billed_party_role | VARCHAR(30)   |     | (client, agent, broker, notify_party — semantic role label; pairs with billed_party_type/id)
  created_at        | TIMESTAMP     |     |
  updated_at        | TIMESTAMP     |     | (Soft deletes forbidden)
```

### 24. `accounts_invoice_items` (PK: `id`)
```text
  Column      | Type          | Key | Connection Links
  ------------|---------------|-----|----------------------------------------
  id              | BIGINT        | PK  |
  invoice_id      | BIGINT        | FK  | ◄── accounts_invoices.id (Cascade delete)
  house_job_id    | BIGINT        | FK  | ◄── jobs.id (Nullable — maps a line to a specific HOUSE
                  |               |     |  shipment inside a Consol Invoice; required on consol_invoice)
  charge_type     | VARCHAR(30)   |     | (air_freight, ocean_freight, delivery_order_fee,
                  |               |     |  customs_clearance, cartage, terminal_handling,
                  |               |     |  storage_demurrage, documentation, miscellaneous)
  charge_basis    | VARCHAR(20)   |     | (per_container, per_cbm, per_bl, flat_rate, per_weight_ton)
  hsn_sac_code    | VARCHAR(10)   |     | (Indian GST HSN/SAC classification)
  description     | VARCHAR(255)  |     | (Billing line narration)
  quantity        | DECIMAL(10,3) |     | (Chargeable weight, containers, or unit count)
  rate            | DECIMAL(15,4) |     | (Unit price — the SELL rate billed to the customer)
  amount          | DECIMAL(15,2) |     | (quantity × rate)
  tax_status      | VARCHAR(20)   |     | (taxable, exempt, zero_rated)
  tax_percentage  | DECIMAL(5,2)  |     |
  tax_amount      | DECIMAL(15,2) |     |
  net_amount      | DECIMAL(15,2) |     | (amount + tax_amount — the figure the gross-margin
                  |               |     |  and GST-register calculations aggregate)
  created_at      | TIMESTAMP     |     |
  updated_at      | TIMESTAMP     |     |
```

### 25. `accounts_invoice_brokerage_details` (PK: `id`)
```text
  Column           | Type        | Key | Connection Links
  -----------------|-------------|-----|----------------------------------------
  id               | BIGINT      | PK  |
  invoice_id       | BIGINT      | FK  | ◄── accounts_invoices.id (Unique index)
  partner_agent_id | BIGINT      | FK  | ◄── partners.id
  brokerage_basis  | VARCHAR(30) |     | (flat_rate, per_container)
  created_at       | TIMESTAMP   |     |
  updated_at       | TIMESTAMP   |     |
```

### 26. `accounts_invoice_consol_details` (PK: `id`)
```text
  Column           | Type        | Key | Connection Links
  -----------------|-------------|-----|----------------------------------------
  id               | BIGINT      | PK  |
  invoice_id       | BIGINT      | FK  | ◄── accounts_invoices.id (Unique index)
  partner_agent_id | BIGINT      | FK  | ◄── partners.id
  consol_basis     | VARCHAR(30) |     |
  created_at       | TIMESTAMP   |     |
  updated_at       | TIMESTAMP   |     |
```

### 26a. `rate_cards` (PK: `id`)
*Note: This table stores standard customer tariff cards and carrier contract rates used to auto-calculate invoice fees and costs.*

```text
  Column              | Type          | Key | Connection Links
  --------------------|---------------|-----|----------------------------------------
  id                  | BIGINT        | PK  |
  agent_id            | BIGINT        | FK  | ◄── agents_info.id
  party_type          | VARCHAR(20)   |     | (customer, partner)
  party_id            | BIGINT        |     | (Polymorphic ID referencing customers.id or partners.id)
  charge_type         | VARCHAR(50)   |     | (delivery_order_fee, air_freight, ocean_freight, customs_clearance, etc.)
  origin_port_id      | BIGINT        | FK  | ◄── ports.id
  destination_port_id | BIGINT        | FK  | ◄── ports.id
  cargo_type          | VARCHAR(20)   |     | (General, Hazmat, Perishable, ULD, FCL, LCL)
  weight_break_from   | DECIMAL(10,2) |     |
  weight_break_to     | DECIMAL(10,2) |     |
  rate                | DECIMAL(15,2) |     |
  currency            | CHAR(3)       |     |
  valid_from          | DATE          |     |
  valid_to            | DATE          |     |
  created_at          | TIMESTAMP     |     |
  updated_at          | TIMESTAMP     |     |
```

### 27. `accounts_purchase_vouchers` (PK: `id`)
```text
  Column         | Type        | Key | Connection Links
  ---------------|-------------|-----|----------------------------------------
  id             | BIGINT      | PK  | ──► accounts_purchase_items.purchase_voucher_id
                 |             |     | ──► accounts_cass_statements.matched_voucher_id
                 |             |     | ──► bank_transactions.matched_voucher_id
  agent_id       | BIGINT      | FK  | ◄── agents_info.id
  job_id         | BIGINT      | FK  | ◄── jobs.id (On Delete Restrict)
  transport_mode | VARCHAR(10) |     | (air, sea, road — inherited from parent jobs.transport_mode; scoping/partitioning)
  vendor_id      | BIGINT      | FK  | ◄── partners.id (Carrier/Vendor Creditor)
  created_by     | BIGINT      | FK  | ◄── users.id
  voucher_no     | VARCHAR(30) | UK  | (Central Counter sequential PV-YY-NNNN)
  document_date  | DATE        |     |
  status         | VARCHAR(20) |     | (unpaid, partially_paid, paid, void)
  created_at     | TIMESTAMP   |     |
  updated_at     | TIMESTAMP   |     | (Soft deletes forbidden)
```
```

### 28. `accounts_purchase_items` (PK: `id`)
```text
  Column              | Type          | Key | Connection Links
  --------------------|---------------|-----|----------------------------------------
  id                  | BIGINT        | PK  |
  purchase_voucher_id | BIGINT        | FK  | ◄── accounts_purchase_vouchers.id (Cascade delete)
  house_job_id        | BIGINT        | FK  | ◄── jobs.id (Nullable — cost attributable to a HOUSE
                      |               |     |  shipment within a consolidation)
  charge_type         | VARCHAR(30)   |     | (Same value set as accounts_invoice_items.charge_type)
  hsn_sac_code        | VARCHAR(10)   |     |
  description         | VARCHAR(255)  |     |
  quantity            | DECIMAL(10,3) |     |
  rate                | DECIMAL(15,4) |     | (Unit cost — the BUY rate. Never shown to sales)
  amount              | DECIMAL(15,2) |     | (quantity × rate)
  tax_percentage      | DECIMAL(5,2)  |     |
  tax_amount          | DECIMAL(15,2) |     |
  net_amount          | DECIMAL(15,2) |     | (amount + tax_amount — cost side of gross margin)
  created_at          | TIMESTAMP     |     |
  updated_at          | TIMESTAMP     |     |
```

### 29. `accounts_ledger_entries` (PK: `id`)
```text
  Column               | Type          | Key | Connection Links
  ---------------------|---------------|-----|----------------------------------------
  id                   | BIGINT        | PK  |
  agent_id             | BIGINT        | FK  | ◄── agents_info.id
  chart_of_account_id  | BIGINT        | FK  | ◄── chart_of_accounts.id
  accounting_period_id | BIGINT        | FK  | ◄── accounting_periods.id
  posting_date         | DATE          |     |
  debit_amount         | DECIMAL(15,2) |     |
  credit_amount        | DECIMAL(15,2) |     |
  source_id            | BIGINT        |     | (Polymorphic morphTo matching invoices/vouchers)
  source_type          | VARCHAR(50)   |     |
  created_at           | TIMESTAMP     |     |
  updated_at           | TIMESTAMP     |     |
```

### 30. `gst_ledger_entries` (PK: `id`)
```text
  Column       | Type          | Key | Connection Links
  -------------|---------------|-----|----------------------------------------
  id           | BIGINT        | PK  |
  agent_id     | BIGINT        | FK  | ◄── agents_info.id
  company_id   | BIGINT        | FK  | ◄── companies.id
  voucher_id   | BIGINT        |     | (Polymorphic morphTo matching invoices/vouchers)
  voucher_type | VARCHAR(50)   |     |
  cgst_amount  | DECIMAL(15,2) |     | (Accrued local CGST)
  sgst_amount  | DECIMAL(15,2) |     | (Accrued local SGST)
  igst_amount  | DECIMAL(15,2) |     | (Accrued interstate IGST)
  created_at   | TIMESTAMP     |     |
  updated_at   | TIMESTAMP     |     |
```

### 31. `sequence_counters` (PK: `id`)
```text
  Column        | Type        | Key | Connection Links
  --------------|-------------|-----|----------------------------------------
  id            | BIGINT      | PK  |
  agent_id      | BIGINT      | FK  | ◄── agents_info.id
  prefix        | VARCHAR(10) |     | (ENQA, ENQS, JOBA, JOBS, INV, DN, CN,
                |             |     |  BRK, CSINV, PV, CAN, CL, MF — see PRD §6.3.
                |             |     |  NOT 'ENQ'/'JOB': air and sea count separately)
  fiscal_year   | VARCHAR(6)  |     | (FISCAL year via fiscalYear(), April 1 rollover
                |             |     |  — '26' = FY 2026-27, not calendar 2026)
  current_value | INT         |     | (Increment counter value)
  created_at    | TIMESTAMP   |     |
  updated_at    | TIMESTAMP   |     |
```

### 32. `unposted_transactions_queue` (PK: `id`)
```text
  Column      | Type          | Key | Connection Links
  ------------|---------------|-----|----------------------------------------
  id          | BIGINT        | PK  |
  agent_id    | BIGINT        | FK  | ◄── agents_info.id
  company_id  | BIGINT        | FK  | ◄── companies.id
  created_by  | BIGINT        | FK  | ◄── users.id
  source_id   | BIGINT        |     | (Polymorphic morphTo matching invoices/vouchers)
  source_type | VARCHAR(50)   |     |
  net_amount  | DECIMAL(15,2) |     |
  created_at  | TIMESTAMP     |     |
  updated_at  | TIMESTAMP     |     |
```

### 33. `approved_drafts_queue` (PK: `id`)
```text
  Column          | Type        | Key | Connection Links
  ----------------|-------------|-----|----------------------------------------
  id              | BIGINT      | PK  |
  agent_id        | BIGINT      | FK  | ◄── agents_info.id
  job_id          | BIGINT      | FK  | ◄── jobs.id (Cascade delete)
  approved_by     | BIGINT      | FK  | ◄── users.id
  source_id       | BIGINT      |     | (Polymorphic: air_way_bills, house_way_bills, etc.)
  source_type     | VARCHAR(50) |     |
  operational_ref | VARCHAR(50) |     |
  created_at      | TIMESTAMP   |     |
  updated_at      | TIMESTAMP   |     |
```

### 34. `operational_cover_letters` (PK: `id`)
```text
  Column                | Type        | Key | Connection Links
  ----------------------|-------------|-----|----------------------------------------
  id                    | BIGINT      | PK  |
  agent_id              | BIGINT      | FK  | ◄── agents_info.id
  recipient_customer_id | BIGINT      | FK  | ◄── customers.id
  job_id                | BIGINT      | FK  | ◄── jobs.id (Cascade delete)
  prepared_by           | BIGINT      | FK  | ◄── users.id
  cover_letter_no       | VARCHAR(30) | UK  | (Per-agent sequential CL-YY-NNNN; unique per (agent_id, cover_letter_no))
  created_at            | TIMESTAMP   |     |
  updated_at            | TIMESTAMP   |     |
```

### 35. `bank_transactions` (PK: `id`)
```text
  Column                | Type          | Key | Connection Links
  ----------------------|---------------|-----|----------------------------------------
  id                    | BIGINT        | PK  |
  agent_id              | BIGINT        | FK  | ◄── agents_info.id
  matched_invoice_id    | BIGINT        | FK  | ◄── accounts_invoices.id (On Delete Set Null)
  matched_voucher_id    | BIGINT        | FK  | ◄── accounts_purchase_vouchers.id (On Delete Set Null)
  plaid_transaction_id  | VARCHAR(255)  | UK  |
  amount                | DECIMAL(15,2) |     |
  reconciliation_status | VARCHAR(20)   |     | (unreconciled, matched, disputed, ignored)
  created_at            | TIMESTAMP     |     |
  updated_at            | TIMESTAMP     |     |
```

### 35a. `exchange_rates` (PK: `id`)
*Note: This table stores daily currency conversion rates against the system base currency to enable multi-currency operations and calculate realized FX gain/loss.*

```text
  Column        | Type          | Key | Connection Links
  --------------|---------------|-----|----------------------------------------
  id            | BIGINT        | PK  |
  from_currency | CHAR(3)       |     | (Source currency)
  to_currency   | CHAR(3)       |     | (Target currency)
  rate_date     | DATE          |     | (Applicable date)
  rate          | DECIMAL(12,6) |     | (Exchange rate multiplier)
  created_at    | TIMESTAMP     |     |
  updated_at    | TIMESTAMP     |     |
```

### 36. `financial_snapshots` (PK: `id`)
```text
  Column               | Type          | Key | Connection Links
  ---------------------|---------------|-----|----------------------------------------
  id                   | BIGINT        | PK  |
  agent_id             | BIGINT        | FK  | ◄── agents_info.id
  accounting_period_id | BIGINT        | FK  | ◄── accounting_periods.id
  snapshot_date        | DATE          |     |
  total_receivables    | DECIMAL(15,2) |     | (Outstanding customer invoices)
  total_payables       | DECIMAL(15,2) |     | (Outstanding vendor vouchers)
  net_cash_flow        | DECIMAL(15,2) |     | (Net cash movement on this date)
  cash_on_hand         | DECIMAL(15,2) |     | (Sum of reconciled bank deposits)
  unbilled_revenue     | DECIMAL(15,2) |     | (Est. sell value of Completed jobs with no invoice
                       |               |     |  — the revenue-leakage figure)
  accrued_expenses     | DECIMAL(15,2) |     | (Est. buy cost where vendor vouchers are still pending)
  last_computed_at     | TIMESTAMP     |     | (Staleness banner if older than 1 hour)
  created_at           | TIMESTAMP     |     |
  updated_at           | TIMESTAMP     |     |
```

### 36a. `customer_performance_snapshots` (PK: `id`)
*Sales Intelligence Engine — Layer 1 nightly rollup. **Keyed by `transport_mode`; air, sea and road rows are never blended.** Written by `php artisan sales:compute-snapshots`; read directly by the sales dashboard (never aggregate `jobs` live).*

```text
  Column                         | Type          | Key | Connection Links
  -------------------------------|---------------|-----|----------------------------------------
  id                             | BIGINT        | PK  |
  agent_id                       | BIGINT        | FK  | ◄── agents_info.id
  customer_id                    | BIGINT        | FK  | ◄── customers.id (Cascade delete)
  transport_mode                 | VARCHAR(10)   | UK  | (air | sea | road — part of uk_cps_customer_mode_date)
  snapshot_date                  | DATE          | UK  |
  tonnage_mtd                    | DECIMAL(14,3) |     | (Gross weight month-to-date, this mode only)
  tonnage_ytd                    | DECIMAL(14,3) |     | (Gross weight year-to-date, this mode only)
  shipment_count_mtd             | INT           |     |
  enquiry_count_mtd              | INT           |     |
  win_rate                       | DECIMAL(5,2)  |     | (Converted / enquiries, trailing 90d)
  service_loss_rate              | DECIMAL(5,2)  |     | (delay_in_response share of losses — OUR fault)
  price_loss_rate                | DECIMAL(5,2)  |     | (rates_high share of losses — market)
  momentum                       | DECIMAL(6,3)  |     | (EWMA 90d vs 365d)
  lane_hhi                       | DECIMAL(5,3)  |     | (Herfindahl lane concentration)
  revenue_mtd                    | DECIMAL(15,2) |     | (Billed revenue month-to-date)
  revenue_ytd                    | DECIMAL(15,2) |     | (Billed revenue year-to-date)
  dso_days                       | INT           |     |
  payment_drift_days             | INT           |     | (dso − customers.payment_terms_days)
  outstanding_0_30               | DECIMAL(15,2) |     | (Aged receivable bucket: 0-30 days)
  outstanding_31_60              | DECIMAL(15,2) |     | (Aged receivable bucket: 31-60 days)
  outstanding_60_plus            | DECIMAL(15,2) |     | (Aged receivable bucket: 60+ days)
  credit_utilization             | DECIMAL(5,2)  |     | (outstanding / customers.credit_limit)
  ops_health                     | DECIMAL(5,2)  |     | (Stage latency vs branch median, same mode)
  declaration_accuracy           | DECIMAL(5,2)  |     | (enquiries declared vs *_shipment_details actual)
  client_health_score            | DECIMAL(5,2)  |     | (CHS — render components, never the bare number)
  last_computed_at               | TIMESTAMP     |     |
  created_at                     | TIMESTAMP     |     |
  updated_at                     | TIMESTAMP     |     |
```

### 36b. `customer_lane_stats` (PK: `id`)
*Per customer × lane × mode × month. Lanes come from `*_shipment_details` when converted, else from `enquiries.origin_code`/`dest_code` — which is why lost enquiries still carry lane analytics.*

```text
  Column            | Type          | Key | Connection Links
  ------------------|---------------|-----|----------------------------------------
  id                | BIGINT        | PK  |
  agent_id          | BIGINT        | FK  | ◄── agents_info.id
  customer_id       | BIGINT        | FK  | ◄── customers.id (Cascade delete)
  transport_mode    | VARCHAR(10)   | UK  | (air | sea | road)
  origin_code       | CHAR(5)       | UK  | (LOCODE)
  dest_code         | CHAR(5)       | UK  | (LOCODE)
  period_month      | DATE          | UK  | (First day of month)
  shipment_count    | INT           |     |
  enquiry_count     | INT           |     |
  tonnage           | DECIMAL(14,3) |     |
  revenue           | DECIMAL(15,2) |     |
  rates_high_losses | INT           |     | (Price pressure ON THIS LANE)
  avg_quoted        | DECIMAL(15,2) |     | (Requires enquiries.quoted_amount)
  avg_won           | DECIMAL(15,2) |     | (Quoted vs won ⇒ price elasticity)
  created_at        | TIMESTAMP     |     |
  updated_at        | TIMESTAMP     |     |
```

### 36c. `customer_cadence_profiles` (PK: `id`)
*Shipping-rhythm model — the earliest churn signal available. Median + MAD, never mean + stddev.*

```text
  Column            | Type         | Key | Connection Links
  ------------------|--------------|-----|----------------------------------------
  id                | BIGINT       | PK  |
  agent_id          | BIGINT       | FK  | ◄── agents_info.id
  customer_id       | BIGINT       | FK  | ◄── customers.id (Cascade delete)
  transport_mode    | VARCHAR(10)  | UK  | (air/sea/road rhythms differ; uk_ccp_customer_mode)
  expected_gap_days | DECIMAL(7,2) |     | (MEDIAN inter-shipment gap)
  volatility_mad    | DECIMAL(7,2) |     | (Median absolute deviation)
  last_shipment_at  | TIMESTAMP    |     |
  overdue_ratio     | DECIMAL(6,3) |     | (days_since_last / expected_gap_days)
  risk_band         | VARCHAR(10)  |     | (LOW, WATCH, AT_RISK, DORMANT)
  sample_size       | INT          |     | (Profile suppressed below 5 shipments)
  is_irregular      | BOOLEAN      |     | (volatility/expected > 1.2 ⇒ no rhythm; suppress alerts)
  last_computed_at  | TIMESTAMP    |     |
  created_at        | TIMESTAMP    |     |
  updated_at        | TIMESTAMP    |     |
```

### 36d. `sales_action_queue` (PK: `id`)
*Ranked next-best-actions — the rep's actual worklist. `customer_id` NULL = a branch-level action (Tactical tier). `narrated_text` NULL = Gemma unavailable; the dashboard degrades to numbers only.*

```text
  Column         | Type          | Key | Connection Links
  ---------------|---------------|-----|----------------------------------------
  id             | BIGINT        | PK  |
  agent_id       | BIGINT        | FK  | ◄── agents_info.id
  customer_id    | BIGINT        | FK  | ◄── customers.id (Cascade delete; NULL = branch action)
  sales_id       | BIGINT        | FK  | ◄── users.id (Command-tier scoping key)
  transport_mode | VARCHAR(10)   |     | (air | sea | road)
  audience       | VARCHAR(10)   |     | ** internal | client ** — the structural firewall. An
                 |               |     |  'internal' row (staff underperformance, our own SLA
                 |               |     |  failures) can NEVER produce a client draft. Enforced by
                 |               |     |  CHECK: draft_* columns must be NULL when audience='internal'
  action_type    | VARCHAR(40)   |     | (churn_outreach, rate_renegotiation, consolidation_pitch,
                 |               |     |  collections_call, cross_sell_lane, service_escalation)
  priority_score | DECIMAL(10,3) |     | (impact × urgency ÷ effort)
  impact_value   | DECIMAL(15,2) |     | (₹ or tonnage at stake)
  fact_packet    | JSON          |     | (Deterministic inputs handed to Gemma verbatim)
  narrated_text  | TEXT          |     | (Gemma output; NULL ⇒ numbers-only degradation)
  narrated_at    | TIMESTAMP     |     |
  draft_subject  | VARCHAR(255)  |     | (Client outreach draft — audience='client' only)
  draft_body     | TEXT          |     | (Professional prose, composed as if written by the rep)
  draft_to       | JSON          |     | (Resolved primary contact(s) at generation time)
  draft_cc       | JSON          |     | (customer_contacts where include_in_cc AND NOT opted_out.
                 |               |     |  Snapshotted at generation — the rep sees exactly who
                 |               |     |  will receive it before sending)
  draft_generated_at | TIMESTAMP |     |
  sent_at        | TIMESTAMP     |     | (NULL until the rep approves and sends)
  sent_by        | BIGINT        | FK  | ◄── users.id (the rep who actually sent it)
  sent_thread_key| VARCHAR(255)  |     | ──► email_threads.thread_key (replies land in the inbox,
                 |               |     |  so the outreach becomes a real two-way conversation)
  status         | VARCHAR(20)   |     | (open, acted, dismissed, expired)
  expires_at     | TIMESTAMP     |     |
  created_at     | TIMESTAMP     |     |
  updated_at     | TIMESTAMP     |     |
```

### 37. `accounts_cass_statements` (PK: `id`)
```text
  Column                | Type        | Key | Connection Links
  ----------------------|-------------|-----|----------------------------------------
  id                    | BIGINT      | PK  |
  agent_id              | BIGINT      | FK  | ◄── agents_info.id
  airline_id            | BIGINT      | FK  | ◄── partners.id (Carrier)
  matched_voucher_id    | BIGINT      | FK  | ◄── accounts_purchase_vouchers.id
  awb_number            | VARCHAR(20)   | IDX | (Matched to air_way_bills by STRING, not FK — CASS
                        |               |     |  statements arrive from IATA with no internal keys)
  billing_period        | VARCHAR(20)   |     | (Billing cycle identifier, e.g. '2026-06-W2')
  cass_chargeable_weight| DECIMAL(10,3) |     | (Weight the AIRLINE billed on. Compare against
                        |               |     |  air_shipment_details.chargeable_weight — like for like)
  cass_gross_weight     | DECIMAL(10,3) |     | (Gross weight as reported by the airline)
  cass_rate             | DECIMAL(10,4) |     | (Rate per kg billed by the airline)
  cass_freight_charges  | DECIMAL(15,2) |     | (Total freight charge)
  cass_other_charges    | DECIMAL(15,2) |     | (Tax, fuel and security surcharges)
  grand_total           | DECIMAL(15,2) |     | (Total amount billed by the airline)
  reconciliation_status | VARCHAR(20)   |     | (unmatched, matched, rate_mismatch, weight_mismatch)
  created_at            | TIMESTAMP     |     |
  updated_at            | TIMESTAMP     |     |
```

### 37a. `llm_usage_logs` (PK: `id`)
*Note: This table tracks token metrics, Latencies, models used, and execution cost logs for local and cloud LLM requests.*

```text
  Column       | Type         | Key | Connection Links
  -------------|--------------|-----|----------------------------------------
  id           | BIGINT       | PK  |
  enquiry_id   | BIGINT       | FK  | ◄── enquiries.id (On Delete Set Null) — extraction/narration
               |              |     |     billed against a PRE-conversion enquiry (common case)
  job_id       | BIGINT       | FK  | ◄── jobs.id (On Delete Set Null) — ...or a confirmed job.
               |              |     |     Exactly one of the two is set.
  model        | VARCHAR(50)  |     | (gemma-4b, gemini-2.5-flash, etc.)
  tokens_in    | INT          |     | (Input token count)
  tokens_out   | INT          |     | (Output token count)
  cost_usd     | DECIMAL(8,6) |     | (Computed USD cost)
  execution_ms | INT          |     | (Execution latency in milliseconds)
  created_at   | TIMESTAMP    |     |
  updated_at   | TIMESTAMP    |     |
```

### 38. `pdf_processing_jobs` (PK: `id`)
```text
  Column         | Type        | Key | Connection Links
  ---------------|-------------|-----|----------------------------------------
  id             | BIGINT      | PK  | ──► pdf_extraction_corrections.job_id
  user_id        | BIGINT      | FK  | ◄── users.id
  enquiry_id     | BIGINT      | FK  | ◄── enquiries.id (ON DELETE SET NULL) — extraction normally
                 |             |     |     runs PRE-conversion at status step 2, so this is the
                 |             |     |     common case. CargoDataPromotionService resolves the
                 |             |     |     target row from here first
  job_id         | BIGINT      | FK  | ◄── jobs.id (ON DELETE SET NULL) — set instead when the
                 |             |     |     document arrives AFTER confirmation. WITHOUT one of
                 |             |     |     these two the parsed payload is orphaned and no cargo
                 |             |     |     promotion is possible
  transport_mode | VARCHAR(10) |     | (air, sea, road — used for query scoping and sequence partitioning)
  document_type  | VARCHAR(50) |     | (MAWB, HAWB, Invoice, Packing List)
  extracted_data | JSON        |     | (JSON payload mapped by Gemma 4 / Gemini)
  status         | VARCHAR(20) |     | (pending, processing, completed, failed)
  created_at     | TIMESTAMP   |     |
  updated_at     | TIMESTAMP   |     |
```

### 39. `manifest_filings` (PK: `id`)
```text
  Column     | Type        | Key | Connection Links
  -----------|-------------|-----|----------------------------------------
  id         | BIGINT      | PK  |
  agent_id   | BIGINT      | FK  | ◄── agents_info.id
  job_id     | BIGINT      | FK  | ◄── jobs.id
  icegate_id | VARCHAR(50) |     |
  created_at | TIMESTAMP   |     |
  updated_at | TIMESTAMP   |     |
```

### 40. `email_classification_rules` (PK: `id`)
```text
  Column                | Type         | Key | Connection Links
  ----------------------|--------------|-----|----------------------------------------
  id                    | BIGINT       | PK  | ──► email_classification_overrides.matched_rule_id
  agent_id              | BIGINT       | FK  | ◄── agents_info.id
  rule_name             | VARCHAR(100) |     |
  rule_type             | VARCHAR(30)  |     | (domain_blocklist, subject_keyword, body_keyword, sender_pattern)
  pattern               | VARCHAR(500) |     |
  target_classification | VARCHAR(30)  |     |
  priority              | INT          |     |
  is_active             | BOOLEAN      |     |
  hit_count             | INT          |     |
  override_count        | INT          |     |
  created_at            | TIMESTAMP    |     |
  updated_at            | TIMESTAMP    |     |
```

### 41. `email_classification_overrides` (PK: `id`)
```text
  Column                   | Type         | Key | Connection Links
  -------------------------|--------------|-----|----------------------------------------
  id                       | BIGINT       | PK  |
  agent_id                 | BIGINT       | FK  | ◄── agents_info.id
  email_thread_id          | BIGINT       | FK  | ◄── email_threads.id
  matched_rule_id          | BIGINT       | FK  | ◄── email_classification_rules.id
  original_classification  | VARCHAR(30)  |     |
  corrected_classification | VARCHAR(30)  |     |
  email_subject            | VARCHAR(255) |     |
  sender_domain            | VARCHAR(100) |     |
  sender_email             | VARCHAR(255) |     |
  corrected_by             | BIGINT       | FK  | ◄── users.id
  created_at               | TIMESTAMP    |     |
```

### 42. `ocr_credit_transactions` (PK: `id`)
```text
  Column           | Type         | Key | Connection Links
  -----------------|--------------|-----|----------------------------------------
  id               | BIGINT       | PK  |
  company_id       | BIGINT       | FK  | ◄── companies.id
  enquiry_id       | BIGINT       | FK  | ◄── enquiries.id (On Delete Set Null) — OCR credits are
                   |              |     |     usually burned pre-conversion, on the enquiry
  job_id           | BIGINT       | FK  | ◄── jobs.id (On Delete Set Null)
  amount           | INT          |     | (Negative for usage, positive for recharge)
  transaction_type | VARCHAR(30)  |     | (monthly_grant, purchase, consumption, refund)
  notes            | VARCHAR(255) |     |
  created_at       | TIMESTAMP    |     |
```

### 43. `pdf_extraction_corrections` (PK: `id`)
```text
  Column           | Type        | Key | Connection Links
  -----------------|-------------|-----|----------------------------------------
  id               | BIGINT      | PK  |
  job_id           | BIGINT      | FK  | ◄── pdf_processing_jobs.id (Cascade delete)
  field_name       | VARCHAR(50) |     | (e.g. shipper_name, weight, volume, pieces, awb_no)
  original_value   | TEXT        |     | (Value extracted by the LLM)
  corrected_value  | TEXT        |     | (Value corrected and approved by operator)
  confidence_level | VARCHAR(10) |     | (high, medium, low)
  corrected_by     | BIGINT      | FK  | ◄── users.id
  created_at       | TIMESTAMP   |     |
```

### 44. `support_tickets` (PK: `id`)
*Note: This table stores customer/operator bug reports and complaints captured via the in-app chatbot and DOM selector.*

```text
  Column           | Type         | Key | Connection Links
  -----------------|--------------|-----|----------------------------------------
  id               | BIGINT       | PK  |
  agent_id         | BIGINT       | FK  | ◄── agents_info.id (Tenant branch)
  user_id          | BIGINT       | FK  | ◄── users.id (Reporter user)
  route            | VARCHAR(255) |     | (Active page URL/route)
  element_selector | VARCHAR(255) |     | (CSS selector path of clicked element)
  screenshot_path  | VARCHAR(500) |     | (S3 or local screenshot path)
  console_logs     | JSON         |     | (Array of captured console error logs)
  description      | TEXT         |     | (Reporter's problem statement)
  status           | VARCHAR(20)  |     | (open, investigating, resolved)
  created_at       | TIMESTAMP    |     |
  updated_at       | TIMESTAMP    |     |
```

### 45. `notifications` (PK: `id`)
*Note: Laravel `DatabaseNotification`-compatible store powering the bell/notification center — e.g. reassignment-approval requests, assignment changes, credit alerts. Pushed live via Soketi. Acceptance/reassignment-approval requests carry an elevated `priority` so they pin to the **top** of the bell above chronological alerts; the bell orders by `priority DESC, created_at DESC`. When the originating handover is **withdrawn** (the requesting operator reverts `pending_ops_id` back to himself) or otherwise resolved, the matching unread reassignment notification is **hard-deleted** so it auto-dissolves from the pricing owner's bell.*

```text
  Column          | Type         | Key | Connection Links
  ----------------|--------------|-----|----------------------------------------
  id              | CHAR(36)     | PK  | (UUID)
  agent_id        | BIGINT       | FK  | ◄── agents_info.id (Tenant branch isolation)
  type            | VARCHAR(255) |     | (Notification class, e.g. App\Notifications\ReassignmentRequested)
  notifiable_type | VARCHAR(100) |     | (Polymorphic morph — usually 'App\User')
  notifiable_id   | BIGINT       |     | (Recipient; when notifiable_type = 'App\User' → users.id)
  data            | JSON         |     | (Payload: job_id, from_ops_id, to_ops_id, requested_by, etc.)
  priority        | SMALLINT     |     | (Bell sort weight, default 0; elevated (e.g. 100) pins reassignment-approval requests to the top. Bell orders by priority DESC, created_at DESC)
  read_at         | TIMESTAMP    |     | (Null = unread; drives the bell unread badge)
  created_at      | TIMESTAMP    |     |
  updated_at      | TIMESTAMP    |     |
```

---

## 🧪 Polymorphic MorphTo Mapping Targets

#### 1. `voucher_id` / `voucher_type` in `gst_ledger_entries`
*   Accrues CGST/SGST/IGST tax breakdowns when billing finalized:
    *   `voucher_type = 'App\AccountsInvoice'` $\rightarrow$ `voucher_id` points to `accounts_invoices.id`
    *   `voucher_type = 'App\AccountsPurchaseVoucher'` $\rightarrow$ `voucher_id` points to `accounts_purchase_vouchers.id`

#### 2. `source_id` / `source_type` in `accounts_ledger_entries`
*   References the originating financial transaction for double-entry bookkeeping:
    *   `source_type = 'App\AccountsInvoice'` $\rightarrow$ `source_id` points to `accounts_invoices.id`
    *   `source_type = 'App\AccountsPurchaseVoucher'` $\rightarrow$ `source_id` points to `accounts_purchase_vouchers.id`

#### 3. `source_id` / `source_type` in `unposted_transactions_queue`
*   Holds staging transaction lines:
    *   `source_type = 'App\AccountsInvoice'` $\rightarrow$ `source_id` points to `accounts_invoices.id`
    *   `source_type = 'App\AccountsPurchaseVoucher'` $\rightarrow$ `source_id` points to `accounts_purchase_vouchers.id`

#### 4. `source_id` / `source_type` in `approved_drafts_queue`
*   Verifies supervisor OCR templates before printing PDFs:
    *   `source_type = 'App\AirwayBills'` $\rightarrow$ `source_id` points to `air_way_bills.id` (String PK)
    *   `source_type = 'App\HousewayBills'` $\rightarrow$ `source_id` points to `house_way_bills.id`
    *   `source_type = 'App\AccountsInvoice'` $\rightarrow$ `source_id` points to `accounts_invoices.id`
    *   `source_type = 'App\AccountsPurchaseVoucher'` $\rightarrow$ `source_id` points to `accounts_purchase_vouchers.id`

#### 5. `notifiable_id` / `notifiable_type` in `notifications`
*   Standard Laravel morph identifying the notification recipient:
    *   `notifiable_type = 'App\User'` $\rightarrow$ `notifiable_id` points to `users.id` (pricing owner receiving a reassignment request, operator receiving an accept/reject, etc.)

#### 6. `billed_party_id` / `billed_party_type` in `accounts_invoices`
*   Polymorphic bill-to recipient (so brokerage/consol/agent invoices can bill a partner, not just a customer):
    *   `billed_party_type = 'customer'` $\rightarrow$ `billed_party_id` points to `customers.id` (standard/debit/credit invoices; also mirrored in `customer_id`)
    *   `billed_party_type = 'partner'` $\rightarrow$ `billed_party_id` points to `partners.id` (brokerage, consol, or agent-billed invoices; `customer_id` is NULL)

---

## 💾 Raw SQL DDL Script (CREATE TABLE statements & Indexes)

> [!WARNING]
> **Do not run this script as-is. It is a reference schema, not an installer.** Two reasons, both hard:
>
> 1. **Six of these tables already exist in the live codebase** — `companies`, `agents_info`, `users`, `air_way_bills`, `house_way_bills`, `pdf_processing_jobs`. Their blocks below are marked **⚠️ EXISTS** and describe the *target* shape, not a table to create. Several already carry far more columns than shown (`agents_info` has 33 live vs. 4 here; `air_way_bills` ~50 vs. 8). Follow the ALTER instructions in `implementation_guide.md` §Batch 1a instead.
> 2. **This is MySQL dialect; local dev is SQLite.** Inline `INDEX …` inside `CREATE TABLE`, `AUTO_INCREMENT`, and `ON UPDATE CURRENT_TIMESTAMP` are all MySQL-only. Write **Laravel migrations** from this reference — `$table->index(…)` separately, `$table->timestamps()` — and both engines are satisfied from one source.
>
> Treat what follows as the authoritative statement of *columns, keys, constraints and indexes*. Treat `implementation_guide.md` as the authority on *how they get applied*.

```sql
-- 1. companies  ⚠️ EXISTS — ALTER only. Live table has: id, name, created_at, updated_at,
--    templates_config, in_testing_mode. Batch 1a adds tier, email_domain, the 3 ocr_credits_*
--    columns, deleted_at (migration 2026_08_27_010200) and code (2026_08_27_010300).
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(6) NULL UNIQUE, -- Company abbreviation, e.g. 'F16'. Concatenated with
                                 -- agents_info.branch_code to form {agent_code} in every
                                 -- document number (PRD §6.3): F16 + BOM -> ENQA-F16BOM-26-0001.
                                 -- NULLABLE ONLY UNTIL BACKFILLED — must be NOT NULL before
                                 -- EnquirySequenceService goes live (guide §4.4).
    tier VARCHAR(30) NOT NULL DEFAULT 'core', -- Platform subscription tier for tenants (core,
                                 -- tactical, command); ignored for client customers. NOT NULL so
                                 -- tier resolution stays TOTAL (guide §4.1.1) — there is no
                                 -- tenant-without-a-tier case to design around.
    email_domain VARCHAR(100) NULL, -- Suffix domain for verification
    ocr_credits_balance INT DEFAULT 0, -- Current balance. Reset monthly by credits:grant-monthly.
    -- The next two are NULL BY DEFAULT, and NULL is meaningful: "inherit the tier default"
    -- from config/f16s.php. A non-NULL value is a deliberate SUPERADMIN OVERRIDE pinned to
    -- this tenant. That distinction is what lets a tier upgrade lift the allowance
    -- automatically for ordinary tenants, while never silently overwriting a negotiated one.
    ocr_credits_monthly_allowance INT NULL, -- NULL = tier default; set = pinned override
    ocr_credits_limit INT NULL,             -- NULL = tier default; set = pinned override.
                                            -- Overdraft FLOOR, negative by design
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL -- SoftDeletes (PRD §9.3). Financial tables NEVER get this column.
);

-- 1a. customers
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL, -- The platform tenant owning this customer account
    name VARCHAR(100) NOT NULL,
    email_domain VARCHAR(100) NULL, -- Client's corporate domain (e.g. 'globex.com'), captured at onboarding. Inbound sender @suffix matches here to resolve customer + sales_id. NOT companies.email_domain (tenant's own OAuth domain)
    email VARCHAR(100) NULL, -- Operations/billing email
    phone VARCHAR(30) NULL, -- Contact phone number
    address TEXT NULL, -- Registered physical office address
    gst_no VARCHAR(30) NULL, -- GSTIN Tax Identification number
    pan_no VARCHAR(20) NULL, -- Permanent Account Number
    duns_no VARCHAR(20) NULL, -- Dun & Bradstreet Number for credit checks
    bank_name VARCHAR(100) NULL, -- Bank name for invoice settlements
    -- 🔐 TEXT, not VARCHAR — corrected 2026-08-27 by measuring the encrypted cast:
    --   10-char account no -> 200 chars | 31-char IBAN -> 228 | 34-char IBAN -> 256
    -- VARCHAR(255) therefore truncates a legal 34-char IBAN by exactly one character,
    -- losing the value unrecoverably. Never indexed, so TEXT costs nothing.
    -- ⚠️ The column type encrypts NOTHING. The `encrypted` cast on the model does.
    bank_account_no TEXT NULL,
    bank_ifsc_code TEXT NULL,
    payment_terms_days INT DEFAULT 30, -- Default credit invoice payment terms e.g., 30
    credit_limit DECIMAL(15,2) DEFAULT 0.00, -- Maximum allowed accounts receivable outstanding balance
    default_port_id BIGINT NULL, -- Preferred airport/seaport location
    branch_id BIGINT NULL, -- Proximity agent branch managing this customer
    sales_id BIGINT NULL, -- Assigned sales rep (account manager). Scopes the Command-tier client-book sales view and owns collections
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    -- Inbound-mail domain attribution: hit on every incoming enquiry, always tenant-scoped
    INDEX idx_customers_domain (company_id, email_domain),
    -- Command-tier sales dashboard: every client-book query filters sales_id = me
    INDEX idx_customers_sales (company_id, sales_id)
);

-- 1b. partners
CREATE TABLE partners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL, -- The platform tenant owning this partner account
    name VARCHAR(100) NOT NULL,
    partner_type VARCHAR(30) NOT NULL, -- 'airline', 'shipping_line', 'co-loader', 'transporter', 'customs_broker', 'agent', 'broker', 'vendor', 'other'
    email VARCHAR(100) NULL,
    phone VARCHAR(30) NULL,
    address TEXT NULL,
    gst_no VARCHAR(30) NULL,
    pan_no VARCHAR(20) NULL,
    bank_name VARCHAR(100) NULL,
    -- 🔐 TEXT, not VARCHAR — see the customers block for the measurements.
    -- Vendor payouts run through these, so a truncated account no is a payment to nowhere.
    -- ⚠️ The column type encrypts NOTHING. The `encrypted` cast on the model does.
    bank_account_no TEXT NULL,
    bank_ifsc_code TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 1c. customer_contacts (per-client address book; the CC source for sales outreach)
CREATE TABLE customer_contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NULL,
    designation VARCHAR(100) NULL,
    source VARCHAR(20) NOT NULL DEFAULT 'inbound_harvest', -- inbound_harvest | manual | onboarding
    is_primary BOOLEAN DEFAULT FALSE,
    include_in_cc BOOLEAN DEFAULT FALSE, -- harvesting is automatic; CC'ing requires a human tick
    verified_at TIMESTAMP NULL,
    last_seen_at TIMESTAMP NULL,
    message_count INT DEFAULT 0,
    opted_out_at TIMESTAMP NULL, -- DPDP: non-NULL overrides include_in_cc unconditionally
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_contact_customer_email (customer_id, email),
    INDEX idx_contacts_tenant_email (company_id, email),
    INDEX idx_contacts_cc (customer_id, include_in_cc, opted_out_at)
);

-- 2. agents_info
-- ⚠️ EXISTS — NO CHANGE NEEDED. The live table already carries 33 columns (IATA agent codes, HO
--    address, office designators, participant fields). The 4 below are only the ones this plan
--    references. Do not create, do not alter, do not drop anything.
CREATE TABLE agents_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    agent_address TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 3. ports
CREATE TABLE ports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    locode CHAR(5) NOT NULL UNIQUE,
    port_name VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL,
    port_type VARCHAR(20) NOT NULL, -- 'air', 'sea', 'land'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. users  ⚠️ EXISTS — ALTER only. Batch 1a adds origin_port_id, designation, signature_text.
--    pima_address ALREADY EXISTS — do not add it. Live table also has origin_airport_code (IATA),
--    is_active, can_send, latest_token, plan_expiry_date, daily_login_count — all retained.
--    branch_name is live as VARCHAR but holds agents_info.id; see CONTEXT.md §6 for the conversion.
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    origin_port_id BIGINT NULL,          -- Nullable: set during onboarding, references ports.id (user's designated default origin port)
    branch_name BIGINT NOT NULL, -- references agents_info.id
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    designation VARCHAR(20) NOT NULL DEFAULT 'operations', -- pricing, operations, sales, accounts, boss (superadmin is platform-level, not a designation)
    company_name VARCHAR(100) NOT NULL,
    pima_address VARCHAR(50) NULL,
    signature_text TEXT NULL, -- configured via User Profile Settings page
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (origin_port_id) REFERENCES ports(id),
    FOREIGN KEY (branch_name) REFERENCES agents_info(id)
);

-- 4a. enquiries (PRE-CONVERSION lifecycle — the sales funnel)
-- Holds every inbound client request, converted or not. An enquiry that never converts
-- stays here permanently: unconverted rows ARE the funnel and the substrate for the
-- Sales Intelligence Engine (conversion %, lost_reason, price elasticity, cadence).
-- 'Lost' exists ONLY here; 'Cancelled' exists ONLY on jobs. The split makes the
-- Lost/Cancelled analytic separation structural rather than policed by guard logic.
CREATE TABLE enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    transport_mode VARCHAR(10) NOT NULL, -- 'air', 'sea', 'road' — decides the regex rule set AND the conversion target (AWB vs MBL)
    direction VARCHAR(10) DEFAULT 'export', -- 'export', 'import'
    enquiry_no VARCHAR(30) NOT NULL, -- ENQA-26-0001 (air) | ENQS-26-0001 (sea)
    quotation_no VARCHAR(30) NULL,
    customer_id BIGINT NULL, -- Resolved from customers.email_domain; NULL until the company is registered
    sales_id BIGINT NULL,  -- COMMAND tier. Sales rep owning this enquiry. NULLABLE by design: an enquiry
                           -- from an unregistered company has no rep yet. Backfilled from customers.sales_id
                           -- when accounts registers the customer. Job + AWB inherit via enquiry_id → job_id
    ops_id BIGINT NULL, -- Operations executor. Responder-based auto-assignment; NULL = unassigned pool
    pricing_id BIGINT NULL, -- Pricing owner; assignment authority
    status VARCHAR(20) DEFAULT 'new', -- new, quoted, awaiting_client, converted, lost
    -- DECLARED cargo (what the client SAID). Written by the mode-specific regex at intake,
    -- refined by OCR. NEVER overwritten by actual shipped figures — the enquiry-vs-actual
    -- comparison is the under-declaration signal, so both sides must survive.
    extracted_pieces INT NULL,
    extracted_weight DECIMAL(10,3) NULL,
    extracted_volume DECIMAL(8,3) NULL,
    cargo_description TEXT NULL,
    cargo_type VARCHAR(20) NULL,
    cargo_data_source VARCHAR(10) NULL DEFAULT 'regex', -- regex | ocr (Tier 3 'verified' lives on *_shipment_details)
    cargo_data_promoted_at TIMESTAMP NULL,
    origin_code CHAR(5) NULL, -- LOCODE captured AT ENQUIRY — lost enquiries never get shipment_details,
    dest_code CHAR(5) NULL,   -- so lane-level win/loss analytics would be blind without these
    -- Commercial
    quoted_amount DECIMAL(15,2) NULL, -- Required to model rates_high losses (how much did we lose BY?)
    quoted_currency CHAR(3) NULL,
    -- Loss (pre-conversion only)
    lost_reason VARCHAR(30) NULL, -- rates_high, delay_in_response, client_cancelled, capacity_issue, other
    lost_reason_custom VARCHAR(255) NULL,
    lost_at TIMESTAMP NULL,
    reopened_at TIMESTAMP NULL, -- Revived in place by trailing client mail; KEEPS the original enquiry_no
    stale_nudged_at TIMESTAMP NULL, -- Inactivity-nudge debounce; cleared on any new client reply
    reinitiated_from_job_id BIGINT NULL, -- Re-quote lineage: a CANCELLED job spawns a NEW enquiry (freight rates
                                         -- are time-sensitive, so a cancelled shipment is re-quoted, never reopened)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- SoftDeletes (PRD §9.3). Financial tables NEVER get this column.
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (sales_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (ops_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (pricing_id) REFERENCES users(id) ON DELETE SET NULL,
    -- NOTE: reinitiated_from_job_id → jobs(id) is added via ALTER TABLE at the end of this
    -- script: enquiries and jobs reference each other, so the constraint cannot be inline.
    UNIQUE KEY uq_enq_agent_no (agent_id, enquiry_no),
    -- Structural guard: an enquiry can never hold a job/execution state.
    CONSTRAINT chk_enq_status CHECK (status IN ('new','quoted','awaiting_client','converted','lost')),
    -- Drift guard: transport_mode is the SOURCE (set from active_portal_scope before enquiry_no
    -- exists) and enquiry_no's prefix is generated FROM it — this just makes the two impossible
    -- to disagree once both are populated. transport_mode stays the column every scoped query and
    -- index reads; the prefix is only ever a display/audit format of the same fact.
    CONSTRAINT chk_enq_mode_prefix CHECK (
        (transport_mode = 'air'  AND enquiry_no LIKE 'ENQA-%') OR
        (transport_mode = 'sea'  AND enquiry_no LIKE 'ENQS-%') OR
        (transport_mode = 'road' AND enquiry_no LIKE 'ENQR-%')
    ),
    INDEX idx_enq_funnel (agent_id, transport_mode, status, created_at),
    INDEX idx_enq_customer (customer_id, transport_mode, created_at),
    INDEX idx_enq_sales (sales_id, transport_mode, status, created_at), -- Command sales-book queries
    INDEX idx_enq_stale (agent_id, status, stale_nudged_at)
);

-- 5. jobs (POST-CONVERSION lifecycle — confirmed shipments only)
-- A row exists here ONLY once the client confirms. Every job traces to its originating
-- enquiry via enquiry_id (NOT NULL). Cardinality is MANY jobs : ONE enquiry — a single
-- client request may split into multiple shipments or a consol with several house jobs.
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    enquiry_id BIGINT NOT NULL, -- Source of truth for conversion. "Converted" = a job row exists.
                                -- Do NOT also store enquiries.converted_job_id — two pointers drift.
    transport_mode VARCHAR(10) NOT NULL, -- denormalized from enquiry for scoping/partitioning
    direction VARCHAR(10) DEFAULT 'export',
    execution_job_no VARCHAR(30) NULL, -- JOBA-26-0001 (air) | JOBS-26-0001 (sea)
    job_order_no VARCHAR(30) NULL,
    quotation_no VARCHAR(30) NULL, -- Reference to the quotation draft payload; FocusSea header lookup
    customer_id BIGINT NULL,
    ops_id BIGINT NULL, -- Live operator; assigned by pricing staff; reassignable
    pending_ops_id BIGINT NULL, -- Staged reassignment awaiting pricing-owner approval
    pending_ops_requested_by BIGINT NULL,
    pending_ops_requested_at TIMESTAMP NULL,
    pricing_id BIGINT NULL, -- Pricing owner; assignment authority
    parent_job_id BIGINT NULL, -- Self-ref: consolidation master
    status VARCHAR(30) DEFAULT 'Intake', -- Intake, AI Extraction, Verification, Generation, PDF Generated,
                                         -- Sent to Airline, Airline Confirmed, Completed, Cancelled
                                         -- NOTE: 'Lost' is NOT valid here — it lives on enquiries.status
    cancellation_reason VARCHAR(30) NULL, -- post-conversion aborts only
    cancellation_reason_custom VARCHAR(255) NULL,
    cancelled_at TIMESTAMP NULL,
    cancelled_by BIGINT NULL,
    cargo_type VARCHAR(20) NULL, -- denormalized from enquiry; operationally authoritative once confirmed
    consol_type VARCHAR(20) NULL,
    delivery_mode VARCHAR(20) NULL,
    booking_thru VARCHAR(20) NULL, -- self | agent; drives commission routing on the Charges tab
    planned_clearance_date DATE NULL,
    awb_number VARCHAR(20) NULL, -- AIR only. Sea carries MBL/HBL on sea_shipment_details.
    pickup_address VARCHAR(500) NULL,
    delivery_address VARCHAR(500) NULL,
    is_sub_shipment BOOLEAN DEFAULT FALSE,
    is_consolidation BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- SoftDeletes (PRD §9.3). Financial tables NEVER get this column.
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (ops_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (pending_ops_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (pending_ops_requested_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (cancelled_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (pricing_id) REFERENCES users(id),
    FOREIGN KEY (parent_job_id) REFERENCES jobs(id),
    UNIQUE KEY uq_jobs_agent_job_no (agent_id, execution_job_no),
    UNIQUE KEY uq_jobs_agent_job_order (agent_id, job_order_no),
    -- Structural guard: 'Lost' is deliberately ABSENT — it is an enquiries.status value.
    -- A positive allow-list (rather than status <> 'Lost') also blocks typos and any
    -- future enquiry-phase state from leaking into the execution table.
    CONSTRAINT chk_jobs_status CHECK (status IN ('Intake','AI Extraction','Verification','Generation','PDF Generated','Sent to Airline','Airline Confirmed','Completed','Cancelled')),
    -- Drift guard: execution_job_no's prefix is generated FROM transport_mode (denormalized from
    -- the parent enquiry at conversion) — this makes the two impossible to disagree.
    CONSTRAINT chk_jobs_mode_prefix CHECK (
        (transport_mode = 'air'  AND execution_job_no LIKE 'JOBA-%') OR
        (transport_mode = 'sea'  AND execution_job_no LIKE 'JOBS-%') OR
        (transport_mode = 'road' AND execution_job_no LIKE 'JOBR-%') OR
        execution_job_no IS NULL
    ),
    INDEX idx_jobs_enquiry (enquiry_id),
    INDEX idx_jobs_board (agent_id, transport_mode, status, planned_clearance_date)
);

-- 6. sea_shipment_details
CREATE TABLE sea_shipment_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL UNIQUE,
    carrier_id BIGINT NULL,
    vessel_name VARCHAR(100) NULL,
    voyage_no VARCHAR(30) NULL,
    vessel_flag VARCHAR(50) NULL,
    imo_number VARCHAR(20) NULL,
    por_code CHAR(5) NULL,
    pol_code CHAR(5) NULL,
    pod_code CHAR(5) NULL,
    del_code CHAR(5) NULL,
    transshipment_required BOOLEAN DEFAULT FALSE,
    imdg_class VARCHAR(10) NULL,
    un_number VARCHAR(10) NULL,
    hbl_number VARCHAR(30) NULL,
    mbl_number VARCHAR(30) NULL,
    freight_terms VARCHAR(20) NULL,
    piece_count INT DEFAULT 0,
    gross_weight DECIMAL(10,3) DEFAULT 0.000,
    net_weight DECIMAL(10,3) DEFAULT 0.000,
    chargeable_weight DECIMAL(10,3) DEFAULT 0.000,
    volume_cbm DECIMAL(8,3) DEFAULT 0.000,
    filing_status VARCHAR(20) DEFAULT 'pending',
    customs_broker_id BIGINT NULL,
    transporter_id BIGINT NULL,
    haulage_provider_id BIGINT NULL,
    handling_agent_id BIGINT NULL,
    shipping_bill_no VARCHAR(30) NULL,
    shipping_bill_date DATE NULL,
    igm_no VARCHAR(30) NULL,
    igm_date DATE NULL,
    container_type VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- SoftDeletes (PRD §9.3). Financial tables NEVER get this column.
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (carrier_id) REFERENCES partners(id),
    FOREIGN KEY (customs_broker_id) REFERENCES partners(id),
    FOREIGN KEY (transporter_id) REFERENCES partners(id),
    FOREIGN KEY (haulage_provider_id) REFERENCES partners(id),
    FOREIGN KEY (handling_agent_id) REFERENCES partners(id)
);

-- 7. air_shipment_details
CREATE TABLE air_shipment_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL UNIQUE,
    flight_number VARCHAR(20) NULL,
    flight_date TIMESTAMP NULL,
    carrier_name VARCHAR(100) NULL,
    pol_code CHAR(5) NULL,
    pod_code CHAR(5) NULL,
    do_given_to VARCHAR(100) NULL,
    pickup_address VARCHAR(500) NULL,
    delivery_address VARCHAR(500) NULL,
    piece_count INT DEFAULT 0,
    gross_weight DECIMAL(10,3) DEFAULT 0.000,
    chargeable_weight DECIMAL(10,3) DEFAULT 0.000,
    volume_cbm DECIMAL(8,3) DEFAULT 0.000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 8. air_way_bills
-- ⚠️ EXISTS — ALTER only, and this block is STALE. The live PK is `id INTEGER AUTO_INCREMENT`,
--    NOT VARCHAR(20) of awb_code+awb_no, and the live table carries ~50 columns (routing legs,
--    handling info, send/status tracking). Batch 1a adds ONLY uuid and job_id.
--    Anything in the plan that treats air_way_bills.id as the AWB number is wrong against this codebase.
CREATE TABLE air_way_bills (
    id VARCHAR(20) PRIMARY KEY, -- awb_code + awb_no
    uuid CHAR(36) NULL UNIQUE, -- UUID unique index
    job_id BIGINT NULL,
    agent_id BIGINT NOT NULL,
    awb_code CHAR(3) NOT NULL,
    awb_no CHAR(8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (agent_id) REFERENCES agents_info(id)
);

-- 9. house_way_bills
-- ⚠️ EXISTS — ALTER only. Live PK `id` is VARCHAR (matches), and the table carries ~50 columns
--    including master_pcs/master_weight and the ho_* block. Batch 1a adds ONLY uuid and job_id.
CREATE TABLE house_way_bills (
    id VARCHAR(30) PRIMARY KEY,
    uuid CHAR(36) NULL UNIQUE, -- UUID unique index
    job_id BIGINT NULL, -- Nullable: waybill can be pre-registered before job linkage
    agent_id BIGINT NOT NULL,
    reference_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (agent_id) REFERENCES agents_info(id)
);

-- 10. mailbox_connections
CREATE TABLE mailbox_connections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,                       -- Branch-level tenant isolation
    user_id BIGINT NOT NULL,                        -- Operator who owns this mailbox
    email_address VARCHAR(100) NOT NULL UNIQUE,
    provider VARCHAR(20) NOT NULL, -- 'google', 'microsoft'
    access_token TEXT NULL,                         -- Encrypted at rest
    refresh_token TEXT NULL,                        -- Encrypted at rest
    expires_at TIMESTAMP NULL,
    -- SUPERADMIN / platform axis ONLY. false = paused by a tier downgrade, which is a
    -- platform-level action on companies.tier (PRD §2.3.7). Tokens are KEPT so an upgrade
    -- restores sync with no re-authorization. NEVER set this to represent a user removing
    -- their own mailbox — that is the disconnected_at axis below.
    is_active BOOLEAN DEFAULT TRUE,
    sync_cursor TEXT NULL,                          -- Graph @odata.deltaLink / Gmail historyId. Encrypted at rest
    last_synced_at TIMESTAMP NULL,                  -- Floor for recovery when a cursor ages out (410 Gone)
    backfill_status VARCHAR(20) DEFAULT 'pending',  -- 'pending','running','completed','failed'
    backfill_from TIMESTAMP NULL,                   -- Window floor requested; default now() - 60 days
    backfill_completed_at TIMESTAMP NULL,
    backfill_page_cursor TEXT NULL, -- resume point; rewritten after every committed page
    backfill_processed INT DEFAULT 0,
    backfill_estimate INT NULL,
    backfill_attempts INT DEFAULT 0,
    watch_expires_at TIMESTAMP NULL, -- Gmail watch()/Graph subscription expiry; renewed daily at <48h
    signature_html TEXT NULL, -- per-mailbox; overrides users.signature_text
    signature_source VARCHAR(20) NULL, -- imported | pasted | manual
    auth_state VARCHAR(30) DEFAULT 'not_connected', -- not_connected | awaiting_admin_consent | connected | reauth_required
    -- USER axis. Stamped when the owning staff member removes their own mailbox in
    -- /settings/mailboxes (PRD §2.3.7 — each user manages their own connection).
    -- On removal: clear access_token/refresh_token, set auth_state='not_connected',
    -- stamp these two. The row and its sync history survive for audit.
    disconnected_at TIMESTAMP NULL,
    disconnected_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (disconnected_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 11. email_threads
CREATE TABLE email_threads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    assigned_ops_id BIGINT NULL, -- Auto-assigned to first email responder; reassignable
    enquiry_id BIGINT NULL, -- Set at triage when classified customer_enquiry
    job_id BIGINT NULL,     -- Set additionally on conversion; the thread spans BOTH lifecycles.
                            -- Both NULL for airline/clearance/trucking mail — those never become work items.
    thread_key VARCHAR(255) NOT NULL UNIQUE,
    provider_thread_id VARCHAR(255) NULL, -- native Gmail/Graph thread id; matched before heuristics
    read_state_synced_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'unread', -- 'unread', 'read', 'replied', 'archived', 'updates'
    classification VARCHAR(20) DEFAULT 'customer_enquiry', -- 'customer_enquiry', 'airline', etc.
    latest_message_received_at TIMESTAMP NOT NULL, -- Last INBOUND client message
    first_response_at TIMESTAMP NULL, -- First OUTBOUND reply; powers true response-latency SLA measurement
    first_triage_at TIMESTAMP NULL, -- Internal triage timestamp (immutable), NOT a client reply
    pending_client_notification JSON NULL, -- JSON object storing staged draft body, attachments, & type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (assigned_ops_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    INDEX idx_threads_enquiry (enquiry_id),
    INDEX idx_threads_job (job_id)
);

-- 12. email_messages
CREATE TABLE email_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,                       -- Branch-level tenant isolation
    mailbox_connection_id BIGINT NOT NULL,          -- Source mailbox (cascade delete)
    thread_key VARCHAR(255) NOT NULL,
    provider_thread_id VARCHAR(255) NULL, -- Gmail threadId / Graph conversationId; primary thread key
    direction VARCHAR(10) NOT NULL DEFAULT 'inbound', -- inbound | outbound (Sent folder is synced too)
    sent_via_portal BOOLEAN DEFAULT FALSE,
    idempotency_key CHAR(36) NULL, -- UNIQUE; minted client-side, collapses retried sends
    send_state VARCHAR(20) NULL, -- queued | sending | sent | failed | cancelled (outbound only)
    scheduled_send_at TIMESTAMP NULL, -- undo-send hold, default +15s
    send_attempts INT DEFAULT 0,
    send_error VARCHAR(500) NULL, -- recognise our own sends echoing back through sync
    message_id VARCHAR(255) NOT NULL UNIQUE,
    `from` VARCHAR(255) NOT NULL,
    `to` VARCHAR(255) NULL,
    subject VARCHAR(255) NULL,
    body_snippet VARCHAR(500) NULL, -- inline preview; thread lists read only this
    body_storage_path VARCHAR(500) NULL, -- S3 key: {text, html} JSON, sanitised. ~900GB/yr at 1k mailboxes
    body_purge_after TIMESTAMP NULL, -- DPDP: purge the S3 object at 2 years, keep the row
    received_at TIMESTAMP NULL,
    is_historical BOOLEAN DEFAULT FALSE,             -- Ingested by onboarding backfill, not live polling.
                                                     -- Suppresses SLA countdown, notifications, enquiry proposal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (mailbox_connection_id) REFERENCES mailbox_connections(id) ON DELETE CASCADE,
    FOREIGN KEY (thread_key) REFERENCES email_threads(thread_key)
);

-- 13. email_attachments
CREATE TABLE email_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email_message_id BIGINT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NULL, -- S3 key while cached; NULL once evicted
    provider_attachment_id VARCHAR(255) NULL, -- Gmail attachmentId / Graph attachment id — the re-fetch key
    cache_expires_at TIMESTAMP NULL, -- default +90d from last access
    fetch_state VARCHAR(20) DEFAULT 'cached', -- cached | evicted | unavailable
    mime_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (email_message_id) REFERENCES email_messages(id) ON DELETE CASCADE
);

-- 14. job_documents
CREATE TABLE job_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,                        -- Branch-level tenant isolation
    job_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,                 -- Original uploaded filename
    file_path VARCHAR(500) NOT NULL,                 -- Disk or S3 path
    mime_type VARCHAR(50) NULL,                      -- e.g. application/pdf, image/png
    file_size INT NULL,                              -- Size in bytes
    uploaded_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- 14a. document_share_links (tokenised expiring public document links + client approval)
CREATE TABLE document_share_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_document_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    token_hash CHAR(64) NOT NULL, -- SHA-256; raw token lives only in the URL
    created_by BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL, -- mandatory; default +14 days
    revoked_at TIMESTAMP NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    approval_status VARCHAR(20) NULL, -- pending | approved | changes_requested
    approver_name VARCHAR(100) NULL,
    approver_email VARCHAR(255) NULL,
    client_comment TEXT NULL,
    responded_at TIMESTAMP NULL,
    first_viewed_at TIMESTAMP NULL,
    last_viewed_at TIMESTAMP NULL,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_document_id) REFERENCES job_documents(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY uk_share_token (token_hash),
    INDEX idx_share_job (job_id, created_at),
    INDEX idx_share_approval (job_id, approval_status),
    CONSTRAINT chk_share_approval CHECK (
        approval_status IS NULL OR approval_status IN ('pending','approved','changes_requested')
    )
);

-- 15. milestone_performance_logs
CREATE TABLE milestone_performance_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    milestone_name VARCHAR(50) NOT NULL,
    entered_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- 15a. sla_policies
CREATE TABLE sla_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    tier VARCHAR(30) NOT NULL, -- 'core', 'tactical', 'command'
    max_reply_time_minutes INT NOT NULL DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 15b. tenant_policies
-- Every knob PRD.md promises is "admin-configurable" or "adjustable per branch" but which
-- previously had NOWHERE to live: the OLI coefficients (§5.5), the undo-send window (§5.2.4),
-- the stale-enquiry window (§5.4) and the CASS tolerances (§6.5). /settings/workload was a
-- screen with no storage behind it, so those numbers would have ended up hardcoded.
--
-- EVERY COLUMN IS NULLABLE WITH NO SQL DEFAULT, AND THAT IS DELIBERATE.
-- NULL means "inherit the default from config/f16s.php" — exactly the pattern
-- companies.ocr_credits_monthly_allowance already uses. Defaults therefore live in ONE
-- place (config), and this table stores only deliberate overrides. Putting defaults in
-- both the config and the DDL would give two sources of truth that drift apart.
--
-- SCOPE: agent_id NULL = applies to the whole company. agent_id set = a branch override
-- that wins over the company row. Resolution is branch → company → config default.
-- NOT merged with sla_policies: that table is keyed by (company_id, tier), a different
-- grain. max_reply_time_minutes stays there and must never be duplicated here.
CREATE TABLE tenant_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    agent_id BIGINT NULL, -- NULL = company-wide; set = branch-level override

    -- Operator Load Index (PRD §5.5). Boss-owned, /settings/workload.
    oli_complexity_air_export DECIMAL(4,2) NULL,
    oli_complexity_air_import DECIMAL(4,2) NULL,
    oli_complexity_sea_export DECIMAL(4,2) NULL,
    oli_complexity_sea_import DECIMAL(4,2) NULL,
    oli_dimension_factor      DECIMAL(4,2) NULL, -- alpha, per distinct LxWxH line
    oli_house_factor          DECIMAL(4,2) NULL, -- beta, per HAWB
    oli_urgency_today         DECIMAL(4,2) NULL, -- clearance today or overdue
    oli_urgency_tomorrow      DECIMAL(4,2) NULL,
    oli_urgency_later         DECIMAL(4,2) NULL,
    oli_capacity_cap          DECIMAL(6,2) NULL, -- above this, assignment warns

    -- Composer (PRD §5.2.4). 0 is valid and means "send immediately, no undo".
    undo_send_seconds INT NULL,

    -- Enquiry hygiene (PRD §5.4) — window before enquiries:nudge-stale prompts a decision.
    stale_enquiry_days INT NULL,

    -- CASS reconciliation (PRD §6.5). The only genuinely BRANCH-level settings here,
    -- which is why agent_id exists on this table at all.
    cass_weight_tolerance_pct DECIMAL(5,2) NULL,
    cass_rate_tolerance_pct   DECIMAL(5,2) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- NO deleted_at, deliberately. PRD §9.3 names exactly six soft-deleting tables and
    -- this is not one. Removing an override means setting the COLUMN back to NULL so it
    -- falls through to the config default — not deleting the row. A soft-deleted policy
    -- row would also have to be excluded from every resolution query, which is a
    -- guaranteed source of "why is this branch still on the old tolerance?" bugs.
    -- Same generated-column trick as job_entities.unique_role_gate, and for the same
    -- reason: a plain UNIQUE(company_id, agent_id) permits MANY company-wide rows,
    -- because both MySQL and SQLite allow repeated NULLs in a unique index. Folding
    -- NULL to 0 makes "one company-wide row per company" enforceable at the database.
    -- ⚠️ VIRTUAL, NOT STORED — corrected 2026-08-27, and this is forced by MySQL, not a
    -- preference. MySQL 8 REFUSES `ON DELETE CASCADE` on a column that a STORED generated
    -- column depends on, and agent_id is BOTH the foreign-key column and this gate's base.
    -- The original `STORED` here therefore could not be created at all:
    --     ERROR 1215 Cannot add foreign key constraint
    -- Measured on MySQL 8.0.46:
    --     STORED  + ON DELETE CASCADE -> 1215 FAILS
    --     VIRTUAL + ON DELETE CASCADE -> works
    --     STORED  + RESTRICT          -> works
    -- VIRTUAL is chosen over dropping the CASCADE because the cascade is the correct
    -- semantic: an override belonging to a deleted branch is meaningless, and RESTRICT
    -- would let a stale policy row block deleting the branch itself. Secondary indexes on
    -- VIRTUAL columns are fully supported (MySQL 5.7.8+), so the UNIQUE below is
    -- unaffected — and SQLite can ADD COLUMN a virtual generated column, which STORED
    -- forbids, so this is strictly more portable too.
    -- NOTE job_entities.unique_role_gate stays STORED and is correct: its base columns are
    -- `role` and `deleted_at`, neither of which carries a foreign key.
    policy_scope_gate BIGINT GENERATED ALWAYS AS (COALESCE(agent_id, 0)) VIRTUAL,

    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id) ON DELETE CASCADE,
    UNIQUE KEY uq_tenant_policies_scope (company_id, policy_scope_gate)
);

-- 16. audit_logs
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    action VARCHAR(255) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    model_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 17. chart_of_accounts
CREATE TABLE chart_of_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    account_code VARCHAR(30) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    UNIQUE KEY uq_coa_agent_code (agent_id, account_code)
);

-- 18. accounting_periods
CREATE TABLE accounting_periods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    period_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id)
);

-- 19. sea_containers
CREATE TABLE sea_containers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    container_number VARCHAR(20) NOT NULL,
    seal_number VARCHAR(30) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- SoftDeletes (PRD §9.3). Financial tables NEVER get this column.
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- 20. sea_container_items
CREATE TABLE sea_container_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    container_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL, -- references House child card
    piece_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (container_id) REFERENCES sea_containers(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- 21. cargo_arrival_notices
CREATE TABLE cargo_arrival_notices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    notice_number VARCHAR(30) NOT NULL, -- CAN-YY-NNNN (per-agent sequence)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    UNIQUE KEY uq_can_agent_no (agent_id, notice_number)
);

-- 22. job_entities
CREATE TABLE job_entities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    party_type VARCHAR(50) NOT NULL, -- 'customer', 'partner'
    party_id BIGINT NOT NULL, -- Polymorphic ID referencing customers.id or partners.id
    role VARCHAR(30) NOT NULL, -- 'shipper', 'consignee', 'notify_party', 'origin_agent', 'dest_agent', 'selling_agent', 'customs_broker', 'transporter', 'other'
    custom_role_label VARCHAR(50) NULL, -- Custom role label when role = 'other'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- SoftDeletes (PRD §9.3). Financial tables NEVER get this column.
    -- Portable generated column. Was IF(role != 'notify_party', role, NULL) — IF() is MySQL-only
    -- and SQLite cannot parse it. CASE WHEN is ANSI and works on MySQL 8, SQLite 3.31+ and Postgres.
    -- UNIQUE ignores NULLs on all three, so nulling the gate for notify_party lets those rows repeat
    -- while every other role stays single-instance per job.
    -- ⚠️ Declare this in the CREATE, never in a later ALTER: SQLite cannot ADD a STORED generated column.
    -- ⚠️ Do NOT swap this for a partial index (... WHERE role <> 'notify_party') — SQLite and Postgres
    --    support those, MySQL does not. This generated column IS the MySQL-portable workaround.
    -- deleted_at is folded in DELIBERATELY: a soft-deleted row's gate becomes NULL, drops out of
    -- the unique index, and no longer blocks its replacement. Without this, soft-deleting a shipper
    -- would permanently prevent assigning a new one — a normal operation, broken by a tombstone.
    unique_role_gate VARCHAR(50) GENERATED ALWAYS AS (
        CASE WHEN deleted_at IS NULL AND role <> 'notify_party' THEN role END
    ) STORED,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY uq_job_entities_role (job_id, unique_role_gate)
);

-- 23. accounts_invoices
CREATE TABLE accounts_invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    transport_mode VARCHAR(10) NULL, -- 'air', 'sea' (inherited from parent jobs.transport_mode; scoping/partitioning)
    customer_id BIGINT NULL, -- Customer debtor; NULLABLE — populated only for customer-billed docs (AR/collections/credit are customer-only)
    billed_party_type VARCHAR(20) NULL, -- Polymorphic bill-to: 'customer' or 'partner'
    billed_party_id BIGINT NULL, -- Polymorphic → customers.id or partners.id (actual recipient; a partner for brokerage/consol/agent invoices)
    parent_invoice_id BIGINT NULL,
    created_by BIGINT NULL,
    invoice_no VARCHAR(30) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'invoice', 'debit_note', 'credit_note', 'brokerage', 'consol_invoice'
    document_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'finalized', 'sent', 'partially_paid', 'paid', 'void'
    subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    amount_paid DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Cumulative settled amount; grand_total − amount_paid = outstanding
    currency CHAR(3) DEFAULT 'INR',
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    is_posted BOOLEAN DEFAULT FALSE,
    billed_party_role VARCHAR(30) DEFAULT 'client', -- semantic role label (client, agent, broker, notify_party)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (parent_invoice_id) REFERENCES accounts_invoices(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY uq_invoice_agent_no (agent_id, invoice_no)
);

-- 24. accounts_invoice_items
CREATE TABLE accounts_invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    house_job_id BIGINT NULL, -- maps a line to a HOUSE shipment inside a consol invoice
    charge_type VARCHAR(30) NOT NULL, -- air_freight, ocean_freight, delivery_order_fee, customs_clearance,
                                      -- cartage, terminal_handling, storage_demurrage, documentation, miscellaneous
    charge_basis VARCHAR(20) NULL, -- per_container, per_cbm, per_bl, flat_rate, per_weight_ton
    hsn_sac_code VARCHAR(10) NULL, -- Indian GST HSN/SAC
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 3) DEFAULT 0.000,
    rate DECIMAL(15, 4) DEFAULT 0.0000, -- SELL rate
    amount DECIMAL(15, 2) NOT NULL, -- quantity × rate
    tax_status VARCHAR(20) DEFAULT 'taxable', -- taxable, exempt, zero_rated
    tax_percentage DECIMAL(5, 2) DEFAULT 0.00,
    tax_amount DECIMAL(15, 2) DEFAULT 0.00,
    net_amount DECIMAL(15, 2) DEFAULT 0.00, -- amount + tax_amount; aggregated by gross-margin & GST register
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES accounts_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (house_job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    INDEX idx_inv_items_charge (invoice_id, charge_type)
);

-- 25. accounts_invoice_brokerage_details
CREATE TABLE accounts_invoice_brokerage_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL UNIQUE,
    partner_agent_id BIGINT NOT NULL,
    brokerage_basis VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES accounts_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (partner_agent_id) REFERENCES partners(id)
);

-- 26. accounts_invoice_consol_details
CREATE TABLE accounts_invoice_consol_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL UNIQUE,
    partner_agent_id BIGINT NOT NULL,
    consol_basis VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES accounts_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (partner_agent_id) REFERENCES partners(id)
);

-- 26a. rate_cards
CREATE TABLE rate_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    party_type VARCHAR(20) NOT NULL, -- 'customer', 'partner'
    party_id BIGINT NOT NULL, -- Polymorphic ID referencing customers.id or partners.id
    charge_type VARCHAR(50) NOT NULL, -- 'delivery_order_fee', 'air_freight', 'ocean_freight', 'customs_clearance', etc.
    origin_port_id BIGINT NULL,
    destination_port_id BIGINT NULL,
    cargo_type VARCHAR(20) NULL,
    weight_break_from DECIMAL(10,2) DEFAULT 0.00,
    weight_break_to DECIMAL(10,2) DEFAULT 0.00,
    rate DECIMAL(15,2) NOT NULL,
    currency CHAR(3) DEFAULT 'INR',
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (origin_port_id) REFERENCES ports(id),
    FOREIGN KEY (destination_port_id) REFERENCES ports(id)
);

-- 27. accounts_purchase_vouchers
CREATE TABLE accounts_purchase_vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    transport_mode VARCHAR(10) NULL, -- 'air', 'sea' (inherited from parent jobs.transport_mode; scoping/partitioning)
    vendor_id BIGINT NOT NULL,
    created_by BIGINT NULL,
    voucher_no VARCHAR(30) NOT NULL,
    document_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid', -- 'unpaid', 'partially_paid', 'paid', 'void'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT,
    FOREIGN KEY (vendor_id) REFERENCES partners(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY uq_voucher_agent_no (agent_id, voucher_no)
);

-- 28. accounts_purchase_items
CREATE TABLE accounts_purchase_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_voucher_id BIGINT NOT NULL,
    house_job_id BIGINT NULL, -- cost attributable to a HOUSE shipment within a consolidation
    charge_type VARCHAR(30) NOT NULL, -- same value set as accounts_invoice_items.charge_type
    hsn_sac_code VARCHAR(10) NULL,
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 3) DEFAULT 0.000,
    rate DECIMAL(15, 4) DEFAULT 0.0000, -- BUY rate; never surfaced to sales
    amount DECIMAL(15, 2) NOT NULL, -- quantity × rate
    tax_percentage DECIMAL(5, 2) DEFAULT 0.00,
    tax_amount DECIMAL(15, 2) DEFAULT 0.00,
    net_amount DECIMAL(15, 2) DEFAULT 0.00, -- cost side of gross margin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_voucher_id) REFERENCES accounts_purchase_vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (house_job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    INDEX idx_pur_items_charge (purchase_voucher_id, charge_type)
);

-- 29. accounts_ledger_entries
CREATE TABLE accounts_ledger_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    chart_of_account_id BIGINT NOT NULL,
    accounting_period_id BIGINT NOT NULL,
    posting_date DATE NOT NULL,
    debit_amount DECIMAL(15, 2) NOT NULL,
    credit_amount DECIMAL(15, 2) NOT NULL,
    source_id BIGINT NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- Polymorphic relation morphTo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (chart_of_account_id) REFERENCES chart_of_accounts(id),
    FOREIGN KEY (accounting_period_id) REFERENCES accounting_periods(id)
);

-- 30. gst_ledger_entries
CREATE TABLE gst_ledger_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    voucher_id BIGINT NOT NULL,
    voucher_type VARCHAR(50) NOT NULL, -- Polymorphic relation morphTo
    cgst_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    sgst_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    igst_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- 31. sequence_counters
CREATE TABLE sequence_counters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    prefix VARCHAR(10) NOT NULL,
    fiscal_year VARCHAR(6) NOT NULL,
    current_value INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    UNIQUE KEY uq_counter_agent_prefix_fy (agent_id, prefix, fiscal_year)
);

-- 32. unposted_transactions_queue
CREATE TABLE unposted_transactions_queue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    source_id BIGINT NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- Polymorphic relation
    net_amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 33. approved_drafts_queue
CREATE TABLE approved_drafts_queue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    approved_by BIGINT NOT NULL,
    source_id BIGINT NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- Polymorphic relation
    operational_ref VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 34. operational_cover_letters
CREATE TABLE operational_cover_letters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    recipient_customer_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    prepared_by BIGINT NOT NULL,
    cover_letter_no VARCHAR(30) NOT NULL, -- CL-YY-NNNN (per-agent sequence)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (recipient_customer_id) REFERENCES customers(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (prepared_by) REFERENCES users(id),
    UNIQUE KEY uq_cl_agent_no (agent_id, cover_letter_no)
);

-- 35. bank_transactions
CREATE TABLE bank_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    matched_invoice_id BIGINT NULL,
    matched_voucher_id BIGINT NULL,
    plaid_transaction_id VARCHAR(255) NOT NULL UNIQUE,
    amount DECIMAL(15, 2) NOT NULL,
    reconciliation_status VARCHAR(20) DEFAULT 'unreconciled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (matched_invoice_id) REFERENCES accounts_invoices(id) ON DELETE SET NULL,
    FOREIGN KEY (matched_voucher_id) REFERENCES accounts_purchase_vouchers(id) ON DELETE SET NULL
);

-- 35a. exchange_rates
CREATE TABLE exchange_rates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_currency CHAR(3) NOT NULL,
    to_currency CHAR(3) NOT NULL,
    rate_date DATE NOT NULL,
    rate DECIMAL(12,6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_exchange_rate_date (from_currency, to_currency, rate_date)
);

-- 36. financial_snapshots
CREATE TABLE financial_snapshots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    accounting_period_id BIGINT NULL,
    snapshot_date DATE NOT NULL,
    total_receivables DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_payables DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    net_cash_flow DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    cash_on_hand DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    unbilled_revenue DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Completed jobs with no invoice = leakage
    accrued_expenses DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- vendor vouchers still pending
    last_computed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (accounting_period_id) REFERENCES accounting_periods(id) ON DELETE SET NULL
);

-- ============================================================
-- SALES INTELLIGENCE ENGINE (see the Sales Intelligence Engine section of PRD.md)
-- Deterministic rollups consumed by the tier-differentiated sales dashboard.
-- EVERY table is keyed by transport_mode: air sales staff see air only,
-- sea staff see sea only. Blended cross-mode metrics are NEVER stored —
-- a client's air and sea businesses have different cadences and competitors,
-- so an averaged figure describes neither.
-- ============================================================

-- 36a. customer_performance_snapshots (nightly per customer per mode)
CREATE TABLE customer_performance_snapshots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    transport_mode VARCHAR(10) NOT NULL,      -- 'air' | 'sea' — never blended
    snapshot_date DATE NOT NULL,
    -- Volume
    tonnage_mtd DECIMAL(14,3) DEFAULT 0.000,  -- gross weight, this mode only
    tonnage_ytd DECIMAL(14,3) DEFAULT 0.000,
    shipment_count_mtd INT DEFAULT 0,
    enquiry_count_mtd INT DEFAULT 0,
    -- Funnel
    win_rate DECIMAL(5,2) NULL,               -- converted / enquiries, trailing 90d
    service_loss_rate DECIMAL(5,2) NULL,      -- delay_in_response share of losses (our fault)
    price_loss_rate DECIMAL(5,2) NULL,        -- rates_high share of losses (market)
    -- Trend
    momentum DECIMAL(6,3) NULL,               -- EWMA 90d vs 365d
    lane_hhi DECIMAL(5,3) NULL,               -- Herfindahl concentration
    -- Money
    revenue_mtd DECIMAL(15,2) DEFAULT 0.00,
    revenue_ytd DECIMAL(15,2) DEFAULT 0.00,
    dso_days INT NULL,
    payment_drift_days INT NULL,              -- dso − payment_terms_days
    outstanding_0_30 DECIMAL(15,2) DEFAULT 0.00,
    outstanding_31_60 DECIMAL(15,2) DEFAULT 0.00,
    outstanding_60_plus DECIMAL(15,2) DEFAULT 0.00,
    credit_utilization DECIMAL(5,2) NULL,     -- outstanding / credit_limit
    -- Service quality (are WE the problem?)
    ops_health DECIMAL(5,2) NULL,             -- stage latency vs branch median, same mode
    declaration_accuracy DECIMAL(5,2) NULL,   -- declared (enquiries) vs actual (*_shipment_details) delta + CASS mismatches
    -- Composite
    client_health_score DECIMAL(5,2) NULL,    -- CHS; render components, never the bare number
    last_computed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_cps_customer_mode_date (customer_id, transport_mode, snapshot_date),
    INDEX idx_cps_scope (agent_id, transport_mode, snapshot_date)
);

-- 36b. customer_lane_stats (customer × lane × mode × month)
CREATE TABLE customer_lane_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    transport_mode VARCHAR(10) NOT NULL,
    origin_code CHAR(5) NOT NULL,             -- from *_shipment_details when converted, else enquiries.origin_code
    dest_code CHAR(5) NOT NULL,
    period_month DATE NOT NULL,               -- first day of month
    shipment_count INT DEFAULT 0,
    enquiry_count INT DEFAULT 0,
    tonnage DECIMAL(14,3) DEFAULT 0.000,
    revenue DECIMAL(15,2) DEFAULT 0.00,
    rates_high_losses INT DEFAULT 0,          -- price pressure ON THIS LANE
    avg_quoted DECIMAL(15,2) NULL,            -- needs jobs.quoted_amount
    avg_won DECIMAL(15,2) NULL,               -- quoted vs won ⇒ price elasticity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_cls_lane (customer_id, transport_mode, origin_code, dest_code, period_month),
    INDEX idx_cls_lane_scope (agent_id, transport_mode, origin_code, dest_code)
);

-- 36c. customer_cadence_profiles (shipping-rhythm model; earliest churn signal)
CREATE TABLE customer_cadence_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    transport_mode VARCHAR(10) NOT NULL,      -- air rhythm ≠ sea rhythm
    expected_gap_days DECIMAL(7,2) NULL,      -- MEDIAN inter-shipment gap (robust to seasonal spikes)
    volatility_mad DECIMAL(7,2) NULL,         -- median absolute deviation
    last_shipment_at TIMESTAMP NULL,
    overdue_ratio DECIMAL(6,3) NULL,          -- days_since_last / expected_gap_days
    risk_band VARCHAR(10) NULL,               -- LOW | WATCH | AT_RISK | DORMANT
    sample_size INT DEFAULT 0,                -- profile suppressed below 5 shipments
    is_irregular BOOLEAN DEFAULT FALSE,       -- volatility/expected > 1.2 ⇒ no rhythm; suppress alerts
    last_computed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_ccp_customer_mode (customer_id, transport_mode),
    INDEX idx_ccp_risk (agent_id, transport_mode, risk_band)
);

-- 36d. sales_action_queue (ranked next-best-actions; the rep's actual worklist)
CREATE TABLE sales_action_queue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    customer_id BIGINT NULL,                  -- NULL = branch-level action (Tactical tier)
    transport_mode VARCHAR(10) NOT NULL,
    sales_id BIGINT NULL,                 -- Command-tier scoping: customers.sales_id
    audience VARCHAR(10) NOT NULL DEFAULT 'internal', -- internal | client (structural firewall)
    action_type VARCHAR(40) NOT NULL,         -- churn_outreach, rate_renegotiation, consolidation_pitch,
                                              -- collections_call, cross_sell_lane, service_escalation
    priority_score DECIMAL(10,3) NOT NULL,    -- impact × urgency ÷ effort
    impact_value DECIMAL(15,2) NULL,          -- ₹ or tonnage at stake
    fact_packet JSON NOT NULL,                -- deterministic inputs handed to Gemma verbatim
    narrated_text TEXT NULL,                  -- Gemma output; NULL = numbers-only degradation
    narrated_at TIMESTAMP NULL,
    draft_subject VARCHAR(255) NULL,          -- client outreach draft; audience='client' only
    draft_body TEXT NULL,
    draft_to JSON NULL,
    draft_cc JSON NULL,                       -- snapshot of opted-in contacts at generation time
    draft_generated_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    sent_by BIGINT NULL,
    sent_thread_key VARCHAR(255) NULL,        -- replies return to the unified inbox
    status VARCHAR(20) DEFAULT 'open',        -- open, acted, dismissed, expired
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (sales_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (sent_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_saq_audience CHECK (audience IN ('internal','client')),
    -- THE FIREWALL: an internal finding can never carry a client-facing draft.
    CONSTRAINT chk_saq_internal_no_draft CHECK (
        audience = 'client' OR (draft_subject IS NULL AND draft_body IS NULL
                                AND draft_to IS NULL AND draft_cc IS NULL)
    ),
    INDEX idx_saq_sales_queue (sales_id, transport_mode, status, priority_score DESC),
    INDEX idx_saq_branch_queue (agent_id, transport_mode, status, priority_score DESC)
);

-- 37. accounts_cass_statements
CREATE TABLE accounts_cass_statements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    airline_id BIGINT NOT NULL,
    matched_voucher_id BIGINT NULL,
    awb_number VARCHAR(20) NOT NULL, -- string match to air_way_bills; IATA sends no internal keys
    billing_period VARCHAR(20) NULL, -- e.g. '2026-06-W2'
    cass_chargeable_weight DECIMAL(10, 3) DEFAULT 0.000, -- compare LIKE-FOR-LIKE with
                                                         -- air_shipment_details.chargeable_weight
    cass_gross_weight DECIMAL(10, 3) DEFAULT 0.000,
    cass_rate DECIMAL(10, 4) DEFAULT 0.0000,
    cass_freight_charges DECIMAL(15, 2) DEFAULT 0.00,
    cass_other_charges DECIMAL(15, 2) DEFAULT 0.00,
    grand_total DECIMAL(15, 2) DEFAULT 0.00,
    reconciliation_status VARCHAR(20) DEFAULT 'unmatched',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (airline_id) REFERENCES partners(id),
    FOREIGN KEY (matched_voucher_id) REFERENCES accounts_purchase_vouchers(id) ON DELETE SET NULL
);

-- 37a. llm_usage_logs
CREATE TABLE llm_usage_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enquiry_id BIGINT NULL, -- Extraction/narration billed against a pre-conversion enquiry
    job_id BIGINT NULL,     -- ...or a confirmed job. Exactly one is set.
    model VARCHAR(50) NOT NULL,
    tokens_in INT DEFAULT 0,
    tokens_out INT DEFAULT 0,
    cost_usd DECIMAL(8, 6) DEFAULT 0.000000,
    execution_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

-- 38. pdf_processing_jobs (Logs/Parser records)
-- Stores unstructured document category drafts parsed via PyMuPDF (text extraction) + Gemma 4 E4B (JSON mapping classification)
-- ⚠️ EXISTS — ALTER only. Batch 1b adds enquiry_id, job_id, transport_mode. The live table also has
--    original_filename, temp_file_path, queue_job_id, error_message, started_at, completed_at — all
--    actively used by app/Jobs/ProcessPdfOcrJob.php. Do NOT drop them; this block omits them only
--    because the plan does not reference them.
CREATE TABLE pdf_processing_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    enquiry_id BIGINT NULL, -- Extraction usually runs PRE-conversion (status step 2), so this is the
                            -- common case; CargoDataPromotionService writes declared cargo back here
    job_id BIGINT NULL,     -- Set instead when the document arrives after confirmation
    transport_mode VARCHAR(10) NULL, -- 'air', 'sea' (query scoping / sequence partitioning)
    document_type VARCHAR(50) NULL, -- MAWB, HAWB, Invoice, Packing List
    extracted_data JSON NULL, -- Structured JSON payload mapped by Gemma 4 / Gemini
    status VARCHAR(20) DEFAULT 'pending',
        -- pending | processing | awaiting_vision_consent | completed | failed | cancelled
        -- awaiting_vision_consent: no text layer found and vision NOT yet authorised. NOTHING
        -- has been spent. Waits for the operator (guide §4.1.1). The 30-minute stale sweep must
        -- NOT touch this state; it gets its own 24h expiry, which also deletes the temp PDF.
    extraction_path VARCHAR(20) NULL, -- coordinates | text | vision | none
        -- REPORTED BY FastAPI, never guessed by Laravel: only the parser knows whether the PDF
        -- had a usable text layer. 'none' = no text layer and vision was not authorised.
        -- Drives the credit decision (§3.4) and per-document cost analysis.
    page_count INT NULL, -- vision cost scales with pages; lets the consent prompt say
                         -- "3 pages, 1 credit" instead of an unexplained number
    failure_code VARCHAR(30) NULL, -- credits_exhausted | upgrade_required | unsupported_mime
        -- | extraction_failed | ai_unavailable. A CODE, not a sentence: error_message stays
        -- free text for humans, but tests and UI branch on this.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    INDEX idx_pdf_jobs_enquiry (enquiry_id),
    INDEX idx_pdf_jobs_job (job_id)
);

-- 39. manifest_filings (Phase 6 Custom reports)
CREATE TABLE manifest_filings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    icegate_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- 40. email_classification_rules
CREATE TABLE email_classification_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(30) NOT NULL, -- domain_blocklist, subject_keyword, body_keyword, sender_pattern
    pattern VARCHAR(500) NOT NULL,
    target_classification VARCHAR(30) NOT NULL,
    priority INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    hit_count INT DEFAULT 0,
    override_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id)
);

-- 41. email_classification_overrides
CREATE TABLE email_classification_overrides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    email_thread_id BIGINT NOT NULL,
    matched_rule_id BIGINT NULL,
    original_classification VARCHAR(30) NOT NULL,
    corrected_classification VARCHAR(30) NOT NULL,
    email_subject VARCHAR(255) NOT NULL,
    sender_domain VARCHAR(100) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    corrected_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (email_thread_id) REFERENCES email_threads(id),
    FOREIGN KEY (matched_rule_id) REFERENCES email_classification_rules(id) ON DELETE SET NULL,
    FOREIGN KEY (corrected_by) REFERENCES users(id)
);

-- 42. ocr_credit_transactions
CREATE TABLE ocr_credit_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    enquiry_id BIGINT NULL, -- OCR credits are usually burned pre-conversion, on the enquiry
    job_id BIGINT NULL,
    pdf_processing_job_id BIGINT NULL, -- WHICH extraction burned this credit. Without it
                                       -- "what did we spend this on?" is unanswerable.
    amount INT NOT NULL,
    transaction_type VARCHAR(30) NOT NULL, -- monthly_grant, purchase, consumption, refund, custom_override
    reverses_transaction_id BIGINT NULL UNIQUE, -- refund rows point at the consumption they undo.
        -- UNIQUE is the whole guard: a retried job physically CANNOT refund the same
        -- reservation twice. Enforced by the database, not by application care.
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    FOREIGN KEY (pdf_processing_job_id) REFERENCES pdf_processing_jobs(id) ON DELETE SET NULL,
    FOREIGN KEY (reverses_transaction_id) REFERENCES ocr_credit_transactions(id)
);

-- 43. pdf_extraction_corrections
CREATE TABLE pdf_extraction_corrections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    original_value TEXT NULL,
    corrected_value TEXT NULL,
    confidence_level VARCHAR(10) NULL, -- high, medium, low
    corrected_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES pdf_processing_jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (corrected_by) REFERENCES users(id)
);


-- 44. support_tickets
CREATE TABLE support_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    route VARCHAR(255) NOT NULL,
    element_selector VARCHAR(255) NULL,
    screenshot_path VARCHAR(500) NULL,
    console_logs JSON NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open', -- open, investigating, resolved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- 45. notifications (bell / notification center — Laravel DatabaseNotification compatible)
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY, -- UUID
    agent_id BIGINT NOT NULL,                        -- Tenant branch isolation
    type VARCHAR(255) NOT NULL,                      -- Notification class name
    notifiable_type VARCHAR(100) NOT NULL,           -- Polymorphic morph (usually 'App\User')
    notifiable_id BIGINT NOT NULL,                   -- Recipient id
    data JSON NOT NULL,                              -- Payload (job_id, from/to operator, requested_by, ...)
    priority SMALLINT NOT NULL DEFAULT 0,            -- Bell sort weight; elevated pins reassignment-approval requests to top (order by priority DESC, created_at DESC)
    read_at TIMESTAMP NULL,                          -- Null = unread
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id)
);


-- =====================================================================
-- PERFORMANCE & HIGH-SPEED OPTIMIZATION INDEXES
-- =====================================================================

-- Single-column indexes
CREATE INDEX idx_support_tickets_status ON support_tickets (status);
CREATE INDEX idx_email_messages_msg_id ON email_messages (message_id);
CREATE INDEX idx_email_threads_thread_key ON email_threads (thread_key);
CREATE INDEX idx_manifest_filings_icegate_id ON manifest_filings (icegate_id);
CREATE INDEX idx_jobs_transport_mode ON jobs (transport_mode);
CREATE INDEX idx_pdf_processing_jobs_status ON pdf_processing_jobs (status);

-- Composite Indexes
-- 1. Inbox Folders View index (Saves operator folder queues loading latency)
CREATE INDEX idx_threads_agent_status_received ON email_threads (agent_id, status, latest_message_received_at);

-- 2. Kanban Board View index (Eases Ops workload query scans)
CREATE INDEX idx_jobs_agent_mode_status ON jobs (agent_id, transport_mode, status);

-- 2a. Operator Load Index (OLI) scan — pricing staff load-balancing by operator + clearance date
CREATE INDEX idx_jobs_ops_clearance ON jobs (agent_id, ops_id, status, planned_clearance_date);

-- 2b. Bell / notification center unread lookup + priority-pinned ordering (priority DESC, created_at DESC)
CREATE INDEX idx_notifications_recipient_unread ON notifications (notifiable_type, notifiable_id, read_at, priority, created_at);

-- 3. General Ledger Scanning composite index
CREATE INDEX idx_ledger_agent_date_account ON accounts_ledger_entries (agent_id, posting_date, chart_of_account_id);

-- 4. Partner and Rate Card lookups
CREATE INDEX idx_partners_company_type ON partners (company_id, partner_type);
CREATE INDEX idx_rate_cards_lookup ON rate_cards (agent_id, party_type, party_id, charge_type);

-- Foreign Key Constraints for customers (to resolve cyclic dependency)
ALTER TABLE customers ADD CONSTRAINT fk_customers_default_port FOREIGN KEY (default_port_id) REFERENCES ports(id);
ALTER TABLE customers ADD CONSTRAINT fk_customers_branch FOREIGN KEY (branch_id) REFERENCES agents_info(id);
ALTER TABLE customers ADD CONSTRAINT fk_customers_sales FOREIGN KEY (sales_id) REFERENCES users(id);

-- Foreign Key Constraint for enquiries → jobs (cyclic: jobs.enquiry_id already points back to enquiries)
-- Re-quote lineage: a cancelled job spawns a NEW enquiry pointing at its cancelled predecessor.
ALTER TABLE enquiries ADD CONSTRAINT fk_enq_reinitiated_from_job FOREIGN KEY (reinitiated_from_job_id) REFERENCES jobs(id) ON DELETE SET NULL;
```

---

## 🔒 Triggers & Views

*Authored 2026-08-26. Previously specified in prose only — `implementation_guide.md` §1b·7, §3.4 and §1d referenced these, but no statement existed anywhere in this document.*

> ✅ **The SQLite forms below were executed and behaviourally tested, not just written.** 18 assertions, all passing: `UPDATE`/`DELETE`/`DELETE FROM` on `audit_logs` all rejected while `INSERT` still works; an `operations` user accepted on `ops_id` and a `sales` user rejected; an `accounts` user rejected on `pricing_id`; `NULL` accepted (the unassigned pool); reassignment between two operations users accepted; reassignment to sales rejected; an unrelated `UPDATE` on a job **not** re-validating; a day with no enquiries producing no row. Then, after the 2026-08-26 changes: a `sales` user rejected on `pending_ops_id`; a soft-deleted `job_entities` row releasing its unique slot so a replacement shipper is accepted, while a second *live* shipper is still rejected and a second `notify_party` still allowed; a soft-deleted enquiry excluded from the funnel counts; and `ysr_funnel_view` returning both bases correctly — four enquiries under `calendar 2026`, split 2/2 across `fiscal 2025-04-01` and `fiscal 2026-04-01`. The MySQL forms are dialect translations of the same logic and still need running against MySQL 8.

**Three enforcement rules, not three statements.** Each rule needs a trigger per operation per table, and the two engines differ:

| Rule | Required by | MySQL objects | SQLite objects |
|---|---|:---:|:---:|
| `audit_logs` is append-only | guide §1b·7, Step 8.4 | 2 | 2 |
| `jobs.ops_id` / `jobs.pricing_id` carry the right designation | guide §3.4 | 2 | 4 |
| `accounts_*.created_by` is an accounts user | guide §3.4 | 4 | 4 |
| | **total** | **8** | **10** |

MySQL can branch inside one trigger body with `IF`; SQLite cannot, so it needs one trigger per column per operation using `WHEN` guards.

### Applying them from Laravel

These cannot go through the schema builder — use `DB::unprepared()` and branch on the driver. Split each MySQL trigger into its own `unprepared()` call and **omit `DELIMITER`**, which is a `mysql` client directive, not SQL, and will fail through PDO.

```php
$driver = DB::connection()->getDriverName();   // 'mysql' | 'sqlite'
DB::unprepared($driver === 'mysql' ? $mysqlBody : $sqliteBody);
```

`down()` is `DROP TRIGGER IF EXISTS <name>;` — identical on both engines.

### A. `audit_logs` — append-only

**MySQL**

```sql
CREATE TRIGGER trg_audit_logs_no_update
BEFORE UPDATE ON audit_logs
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'audit_logs is append-only: UPDATE is forbidden';
END;

CREATE TRIGGER trg_audit_logs_no_delete
BEFORE DELETE ON audit_logs
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'audit_logs is append-only: DELETE is forbidden';
END;
```

**SQLite**

```sql
CREATE TRIGGER trg_audit_logs_no_update
BEFORE UPDATE ON audit_logs
FOR EACH ROW
BEGIN
    SELECT RAISE(ABORT, 'audit_logs is append-only: UPDATE is forbidden');
END;

CREATE TRIGGER trg_audit_logs_no_delete
BEFORE DELETE ON audit_logs
FOR EACH ROW
BEGIN
    SELECT RAISE(ABORT, 'audit_logs is append-only: DELETE is forbidden');
END;
```

> **Three things these triggers do *not* stop.**
> 1. **`TRUNCATE TABLE`** — MySQL does not fire `DELETE` triggers on truncate. SQLite's equivalent optimisation is disabled while a trigger exists, so only MySQL is exposed. Grant no `DROP` privilege on this schema to the application user.
> 2. **Foreign-key cascade deletes** — MySQL does not fire triggers on rows removed by `ON DELETE CASCADE`. ✅ **Verified safe here:** both `audit_logs` FKs (`agent_id`, `user_id`) are plain `RESTRICT`. **If either is ever changed to `CASCADE`, this protection is silently voided.**
> 3. **`migrate:fresh` / `DROP TABLE`** — intended; local dev must stay resettable.
>
> ⚠️ **`audit_logs.updated_at` is dead weight.** It carries `ON UPDATE CURRENT_TIMESTAMP`, which can never fire on a table where `UPDATE` aborts. Harmless, but it advertises a capability the table does not have — consider dropping the column.

### B. `jobs` — designation enforcement on assignment

**MySQL** — one trigger per operation, both columns checked inside. The `UPDATE` form fires only when the column actually changes, so a pre-existing bad row cannot block unrelated edits.

```sql
CREATE TRIGGER trg_jobs_designation_bi
BEFORE INSERT ON jobs
FOR EACH ROW
BEGIN
    DECLARE v_desig VARCHAR(20);

    IF NEW.ops_id IS NOT NULL THEN
        SELECT designation INTO v_desig FROM users WHERE id = NEW.ops_id;
        IF v_desig IS NULL OR v_desig <> 'operations' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'jobs.ops_id must reference a user with designation = operations';
        END IF;
    END IF;

    IF NEW.pricing_id IS NOT NULL THEN
        SELECT designation INTO v_desig FROM users WHERE id = NEW.pricing_id;
        IF v_desig IS NULL OR v_desig <> 'pricing' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'jobs.pricing_id must reference a user with designation = pricing';
        END IF;
    END IF;

    -- pending_ops_id is promoted straight into ops_id on approval (PRD §5.5), so it carries the
    -- same rule. Guarding it here surfaces a bad choice to the OPERATOR who made it, rather than
    -- to the pricing owner at the accept step.
    IF NEW.pending_ops_id IS NOT NULL THEN
        SELECT designation INTO v_desig FROM users WHERE id = NEW.pending_ops_id;
        IF v_desig IS NULL OR v_desig <> 'operations' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'jobs.pending_ops_id must reference a user with designation = operations';
        END IF;
    END IF;
END;

CREATE TRIGGER trg_jobs_designation_bu
BEFORE UPDATE ON jobs
FOR EACH ROW
BEGIN
    DECLARE v_desig VARCHAR(20);

    IF NEW.ops_id IS NOT NULL
       AND (OLD.ops_id IS NULL OR NEW.ops_id <> OLD.ops_id) THEN
        SELECT designation INTO v_desig FROM users WHERE id = NEW.ops_id;
        IF v_desig IS NULL OR v_desig <> 'operations' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'jobs.ops_id must reference a user with designation = operations';
        END IF;
    END IF;

    IF NEW.pricing_id IS NOT NULL
       AND (OLD.pricing_id IS NULL OR NEW.pricing_id <> OLD.pricing_id) THEN
        SELECT designation INTO v_desig FROM users WHERE id = NEW.pricing_id;
        IF v_desig IS NULL OR v_desig <> 'pricing' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'jobs.pricing_id must reference a user with designation = pricing';
        END IF;
    END IF;

    IF NEW.pending_ops_id IS NOT NULL
       AND (OLD.pending_ops_id IS NULL OR NEW.pending_ops_id <> OLD.pending_ops_id) THEN
        SELECT designation INTO v_desig FROM users WHERE id = NEW.pending_ops_id;
        IF v_desig IS NULL OR v_desig <> 'operations' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'jobs.pending_ops_id must reference a user with designation = operations';
        END IF;
    END IF;
END;
```

> **`v_desig IS NULL OR` is not redundant.** In MySQL, `NULL <> 'operations'` evaluates to `NULL`, which is falsy — so a missing user would **pass** the check. The FK makes that unreachable today, but the guard costs nothing and survives a future schema change.

**SQLite** — four triggers; `IS NOT` handles NULL correctly, so no extra guard is needed.

```sql
CREATE TRIGGER trg_jobs_ops_designation_bi
BEFORE INSERT ON jobs
FOR EACH ROW
WHEN NEW.ops_id IS NOT NULL
BEGIN
    SELECT RAISE(ABORT, 'jobs.ops_id must reference a user with designation = operations')
    WHERE (SELECT designation FROM users WHERE id = NEW.ops_id) IS NOT 'operations';
END;

CREATE TRIGGER trg_jobs_ops_designation_bu
BEFORE UPDATE OF ops_id ON jobs
FOR EACH ROW
WHEN NEW.ops_id IS NOT NULL
     AND (OLD.ops_id IS NULL OR NEW.ops_id <> OLD.ops_id)
BEGIN
    SELECT RAISE(ABORT, 'jobs.ops_id must reference a user with designation = operations')
    WHERE (SELECT designation FROM users WHERE id = NEW.ops_id) IS NOT 'operations';
END;

CREATE TRIGGER trg_jobs_pricing_designation_bi
BEFORE INSERT ON jobs
FOR EACH ROW
WHEN NEW.pricing_id IS NOT NULL
BEGIN
    SELECT RAISE(ABORT, 'jobs.pricing_id must reference a user with designation = pricing')
    WHERE (SELECT designation FROM users WHERE id = NEW.pricing_id) IS NOT 'pricing';
END;

CREATE TRIGGER trg_jobs_pricing_designation_bu
BEFORE UPDATE OF pricing_id ON jobs
FOR EACH ROW
WHEN NEW.pricing_id IS NOT NULL
     AND (OLD.pricing_id IS NULL OR NEW.pricing_id <> OLD.pricing_id)
BEGIN
    SELECT RAISE(ABORT, 'jobs.pricing_id must reference a user with designation = pricing')
    WHERE (SELECT designation FROM users WHERE id = NEW.pricing_id) IS NOT 'pricing';
END;

CREATE TRIGGER trg_jobs_pending_ops_designation_bi
BEFORE INSERT ON jobs
FOR EACH ROW
WHEN NEW.pending_ops_id IS NOT NULL
BEGIN
    SELECT RAISE(ABORT, 'jobs.pending_ops_id must reference a user with designation = operations')
    WHERE (SELECT designation FROM users WHERE id = NEW.pending_ops_id) IS NOT 'operations';
END;

CREATE TRIGGER trg_jobs_pending_ops_designation_bu
BEFORE UPDATE OF pending_ops_id ON jobs
FOR EACH ROW
WHEN NEW.pending_ops_id IS NOT NULL
     AND (OLD.pending_ops_id IS NULL OR NEW.pending_ops_id <> OLD.pending_ops_id)
BEGIN
    SELECT RAISE(ABORT, 'jobs.pending_ops_id must reference a user with designation = operations')
    WHERE (SELECT designation FROM users WHERE id = NEW.pending_ops_id) IS NOT 'operations';
END;
```

> ✅ **`jobs.pending_ops_id` IS covered — decided 2026-08-26.** §3.4 names only `ops_id` and `pricing_id`, but `pending_ops_id` is promoted straight into `ops_id` on approval (`PRD.md` §5.5), so it carries the same rule. Guarding the staging column means a bad choice fails for the **operator who made it**, at the moment they make it — rather than passing validation, sitting in the pricing owner's bell, and then erroring for *them* at the accept step. Trigger counts are now **3 MySQL / 6 SQLite** for this rule.

> ⚠️ **These triggers will break naive factories and seeders.** Any test that attaches a random user to `ops_id` now fails at the database. Test factories must mint users with explicit designations. Budget for this in Step 8 — alongside the three `ON DELETE RESTRICT` foreign keys, it is the other thing that will surprise you in tests.

### C. `accounts_invoices` / `accounts_purchase_vouchers` — `created_by` is an accounts user

Backs the segregation-of-duties rule (`PRD.md` §2.3.4): pricing edits the cost sheet, **accounts** finalizes and posts it.

**MySQL**

```sql
CREATE TRIGGER trg_invoices_created_by_bi
BEFORE INSERT ON accounts_invoices
FOR EACH ROW
BEGIN
    DECLARE v_desig VARCHAR(20);
    IF NEW.created_by IS NOT NULL THEN
        SELECT designation INTO v_desig FROM users WHERE id = NEW.created_by;
        IF v_desig IS NULL OR v_desig <> 'accounts' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'accounts_invoices.created_by must be a user with designation = accounts';
        END IF;
    END IF;
END;

CREATE TRIGGER trg_invoices_created_by_bu
BEFORE UPDATE ON accounts_invoices
FOR EACH ROW
BEGIN
    DECLARE v_desig VARCHAR(20);
    IF NEW.created_by IS NOT NULL
       AND (OLD.created_by IS NULL OR NEW.created_by <> OLD.created_by) THEN
        SELECT designation INTO v_desig FROM users WHERE id = NEW.created_by;
        IF v_desig IS NULL OR v_desig <> 'accounts' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'accounts_invoices.created_by must be a user with designation = accounts';
        END IF;
    END IF;
END;
```

Repeat both verbatim for `accounts_purchase_vouchers`, renaming to `trg_vouchers_created_by_bi` / `_bu` and adjusting the message.

**SQLite**

```sql
CREATE TRIGGER trg_invoices_created_by_bi
BEFORE INSERT ON accounts_invoices
FOR EACH ROW
WHEN NEW.created_by IS NOT NULL
BEGIN
    SELECT RAISE(ABORT, 'accounts_invoices.created_by must be a user with designation = accounts')
    WHERE (SELECT designation FROM users WHERE id = NEW.created_by) IS NOT 'accounts';
END;

CREATE TRIGGER trg_invoices_created_by_bu
BEFORE UPDATE OF created_by ON accounts_invoices
FOR EACH ROW
WHEN NEW.created_by IS NOT NULL
     AND (OLD.created_by IS NULL OR NEW.created_by <> OLD.created_by)
BEGIN
    SELECT RAISE(ABORT, 'accounts_invoices.created_by must be a user with designation = accounts')
    WHERE (SELECT designation FROM users WHERE id = NEW.created_by) IS NOT 'accounts';
END;
```

Repeat for `accounts_purchase_vouchers`.

> **`created_by` is nullable on both tables**, so a draft may exist without an author. The trigger only fires when a value is present — it enforces *who*, never *whether*. If an author must always be recorded on a **posted** document, that is an application-layer check on the posting transition, not a column constraint.

---

### D. Funnel views — `dsr` / `msr` / `ysr`

One shape, three grains. Every view is keyed by `(agent_id, transport_mode, period_start)` so air and sea never blend (`PRD.md` §7.3.2), and counts the enquiry in **the period it was raised**, never the period it converted in (`PRD.md` §7.1).

> #### 🔴 A quiet day produces no row at all — this is the design, not a bug
> `COUNT(*)` inside a `GROUP BY` can never be zero: a group exists only if it has rows. So a day with no enquiries is **absent** from the view rather than present with `0 %`.
>
> **The consumer must render a missing period as "—", not as zero.** That satisfies §7.1's rule ("a quiet day is not a bad day") without a calendar spine. If you later want empty periods to appear explicitly, `LEFT JOIN` a date-spine table onto these views — the `CASE WHEN … = 0 THEN NULL` guard below is already written to hold in that case, which is why it is kept despite being unreachable today.

> ✅ **`deleted_at` now exists and the views filter on it.** `PRD.md` §9.3 mandates `SoftDeletes` on seven operational tables; the column was missing from this schema entirely (zero occurrences) until 2026-08-26. It has been added to **six** tables — `jobs`, `enquiries`, `sea_shipment_details`, `job_entities`, `sea_containers` and `companies` — and to **no financial table**, per §9.3's split. `mailbox_connections` was in §9.3's original list but is **deliberately excluded**: it uses `is_active` instead (see the collision table below). Every view below carries `WHERE e.deleted_at IS NULL`; without it a soft-deleted enquiry still counts in the conversion denominator.

> #### ⚠️ Soft deletes collide with UNIQUE constraints — three cases, three different answers
> A tombstone row still occupies a unique key. Each of these needed a decision, not a blanket rule:
>
> | Constraint | Effect of a tombstone | Resolution |
> |---|---|---|
> | `jobs (agent_id, execution_job_no)` · `enquiries (agent_id, enquiry_no)` | The number stays consumed | ✅ **Correct as-is — leave it.** "A consumed number is never recycled" is an explicit product rule (`PRD.md` §11) |
> | `job_entities (job_id, unique_role_gate)` | **Breaks a normal operation** — soft-delete a shipper and you can never assign a new one | ✅ **Fixed in the DDL:** `deleted_at IS NULL` is folded into the generated gate, so a deleted row's gate goes NULL and leaves the index |
> | `mailbox_connections.email_address` (globally UNIQUE) | Would **break reconnection** — a tombstone permanently blocks that mailbox, for every tenant | ✅ **Avoided — this table does NOT soft-delete.** It carries **two independent deactivation axes** instead; see below. **Do not add `SoftDeletes` to this model** |

#### 🔀 `mailbox_connections` has two deactivation axes — never collapse them

A mailbox stops syncing for two entirely different reasons, driven by **two different actors**. An earlier draft put both on `is_active`; that is a consent bug, not a tidiness issue.

| | **Tier downgrade** | **User removes their mailbox** |
|---|---|---|
| Who does it | **Platform superadmin**, on `admin.f16sefreight.com` — sets `companies.tier` (`PRD.md` §2.3.7) | **The owning staff member**, in `/settings/mailboxes` (`PRD.md` §2.3.7) |
| Scope | Every mailbox in the tenant | One mailbox |
| Column | `is_active = false` | `disconnected_at` / `disconnected_by` stamped, `auth_state = 'not_connected'` |
| Tokens | **Kept, encrypted** — §3.3 requires upgrade to restore service without re-auth | **Cleared** — the user withdrew consent; hanging on to a live refresh token afterwards is indefensible |
| Undo | Automatic on upgrade | **Only the user, by re-running OAuth** |

> 🔴 **The bug this prevents.** `PRD.md` §3.3 says an upgrade reactivates downgraded mailboxes. If a user's own removal were also stored as `is_active = false`, a later upgrade would **silently reconnect a mailbox that person deliberately removed and resume syncing their mail** — an action nobody performed, triggered by a superadmin changing a billing tier. The restore query must therefore be narrow:
>
> ```sql
> -- On tier upgrade: reactivate ONLY downgrade-paused mailboxes.
> UPDATE mailbox_connections SET is_active = 1
> WHERE agent_id IN (…) AND is_active = 0 AND disconnected_at IS NULL;
> ```
>
> **Sync runs only when `is_active = 1 AND disconnected_at IS NULL AND auth_state = 'connected'`.** All three, every time.

> **Reconnection does not violate the unique index.** The row is never deleted, so reconnecting is an `UPDATE` of the existing row — fresh tokens, `auth_state = 'connected'`, `disconnected_at` cleared — not a second `INSERT` of the same address.

> ⚠️ **Unrelated, but visible from here: `status` and `auth_state` are duplicates.** Both exist on this table and carry nearly the same value set (`connected`, `awaiting_admin_consent`, `reauth_required`). Two columns that can disagree about the same fact will eventually disagree. `auth_state` is the one referenced by `PRD.md` §5.2.1's four connection states — **drop `status`**, or state plainly what it means that `auth_state` does not.
>
> `sea_shipment_details.job_id UNIQUE` is 1-to-1 with its job and dies with it, so a tombstone is harmless in practice — but re-creating details for a job whose row was soft-deleted would fail. Worth knowing before you write that observer.

**MySQL**

```sql
CREATE VIEW dsr_funnel_view AS
SELECT
    e.agent_id,
    e.transport_mode,
    DATE(e.created_at)                                              AS period_start,
    'day'                                                           AS period_grain,
    COUNT(*)                                                        AS enquiries_raised,
    -- EXISTS, never a LEFT JOIN: an enquiry may carry SEVERAL threads, and joining
    -- them would fan out the rows and inflate COUNT(*) — silently corrupting the
    -- conversion denominator. Confirmed in test: 3 enquiries across 4 threads still
    -- counted 3 raised / 2 replied, where a LEFT JOIN would have reported 4 raised.
    SUM(CASE WHEN EXISTS (SELECT 1 FROM email_threads t
                          WHERE t.enquiry_id = e.id
                            AND t.first_response_at IS NOT NULL)
             THEN 1 ELSE 0 END)                                     AS enquiries_replied,
    SUM(CASE WHEN e.status IN ('new','quoted','awaiting_client')
             THEN 1 ELSE 0 END)                                     AS enquiries_pending,
    SUM(CASE WHEN e.status = 'converted' THEN 1 ELSE 0 END)         AS enquiries_converted,
    SUM(CASE WHEN e.status = 'lost'      THEN 1 ELSE 0 END)         AS enquiries_lost,
    -- NULL, never 0%, when the denominator is empty (PRD §7.1)
    CASE WHEN COUNT(*) = 0 THEN NULL
         ELSE ROUND(SUM(CASE WHEN e.status = 'converted' THEN 1 ELSE 0 END) * 100.0
                    / COUNT(*), 2)
    END                                                             AS conversion_rate_pct
FROM enquiries e
WHERE e.deleted_at IS NULL          -- soft-deleted enquiries must not inflate the denominator
GROUP BY e.agent_id, e.transport_mode, DATE(e.created_at);
```

`msr_funnel_view` and `ysr_funnel_view` are identical except for the period expression, which appears in **both** the `SELECT` and the `GROUP BY`:

| View | `period_start` | `period_grain` |
|---|---|---|
| `dsr_funnel_view` | `DATE(e.created_at)` | `'day'` |
| `msr_funnel_view` | `DATE_FORMAT(e.created_at, '%Y-%m-01')` | `'month'` |
| `ysr_funnel_view` | *two bases — see below* | `'year'` |

#### `ysr_funnel_view` — the reader chooses the year basis

**Decided 2026-08-26: neither basis is hard-coded.** The view emits **both**, tagged by a `period_basis` column, so a UI toggle becomes a `WHERE` clause rather than a schema change:

```sql
SELECT * FROM ysr_funnel_view
WHERE agent_id = ? AND transport_mode = ? AND period_basis = ?;   -- 'fiscal' | 'calendar'
```

`ysr_funnel_view` therefore carries **one extra column** — `period_basis VARCHAR(8)` — ahead of the shared column list, and is a `UNION ALL` of the same query under two period expressions:

| `period_basis` | MySQL `period_start` | SQLite `period_start` |
|---|---|---|
| `'calendar'` | `DATE_FORMAT(e.created_at, '%Y-01-01')` | `strftime('%Y-01-01', e.created_at)` |
| `'fiscal'` | `DATE_FORMAT(DATE_SUB(e.created_at, INTERVAL 3 MONTH), '%Y-04-01')` | `strftime('%Y-04-01', date(e.created_at, '-3 months'))` |

**The fiscal expression returns the April 1st that opens the fiscal year**, which lines up exactly with `EnquirySequenceService::fiscalYear()` (`PRD.md` §6.3): a March-2026 enquiry yields `2025-04-01` and numbers as `-25-`; an April-2026 enquiry yields `2026-04-01` and numbers as `-26-`. A yearly report and a document number therefore agree, which is the whole point — for Jan–Mar the two bases differ, and that is precisely where reconciliation arguments start.

> **`period_basis` must be in the `WHERE` clause, always.** Query the view without it and every row is returned twice under two different year labels — silently doubling every count. Make it a required parameter in the repository method, not an optional filter.

> The other two grains need no such choice: a day is a day, and fiscal months are ordinary calendar months — only their *grouping into a year* differs.

**SQLite** — same statements, same column list, only the period expression differs:

| View | `period_start` |
|---|---|
| `dsr_funnel_view` | `date(e.created_at)` |
| `msr_funnel_view` | `strftime('%Y-%m-01', e.created_at)` |
| `ysr_funnel_view` | `strftime('%Y-01-01', e.created_at)` |

Both engines therefore return `period_start` as a real `YYYY-MM-DD` date, so one client formatter serves all three grains.

> 🔴 **`ysr_funnel_view` uses the CALENDAR year — confirm this is intended.** `EnquirySequenceService` numbers documents by **fiscal** year (April–March, `PRD.md` §6.3), so `ENQA-…-26-0001` and a `ysr` row labelled `2026` describe **different twelve-month windows** for the first three months of every calendar year. `PRD.md` §7.1 says only "yearly", so the literal reading is implemented here. **If the Boss's yearly report should align with the fiscal year instead**, swap the period expression to:
> ```sql
> -- MySQL
> DATE_FORMAT(DATE_SUB(e.created_at, INTERVAL 3 MONTH), '%Y-04-01')
> -- SQLite
> strftime('%Y-04-01', date(e.created_at, '-3 months'))
> ```
> This is left undecided rather than guessed — the two produce different numbers for Jan–Mar, and reconciling a report against a document number is exactly where that bites.

> **Tenant scoping does not reach views.** Laravel global scopes apply to Eloquent models, not to raw view queries. Every read of these views **must** filter `agent_id` (and `transport_mode`) explicitly, or it crosses branches. Treat them like any other raw query.

---

## 🗺️ UI Route & Workflow Navigation Matrix

To support the pricing and operations workflows, the frontend routes and buttons are mapped to corresponding database statuses and models:

### 1. Pricing Staff Kanban Navigation
*   **Kanban Columns (4 Columns):** `Processing`, `Awaiting Customer`, `In Transit`, and `Completed`.
*   **Mail Navigation Icon:** Available on all cards across all 4 columns. Clicking this icon redirects the operator to the Mail Inbox page (`/inbox`), loading the specific thread (`email_threads.thread_key` / `email_threads.enquiry_id` or `job_id` depending on lifecycle stage).
*   **Message Log Navigation Icon (In Transit Only):** Rendered exclusively on cards in the `In Transit` column (associated with active/dispatched shipment details in `air_shipment_details` or `sea_shipment_details`). Clicking this icon redirects the operator to the Message Log page (`/message-log`) to inspect SITA/IATA type B messages or tracking history.



