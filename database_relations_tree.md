# F16s Freight OS — Complete Table Schema & Relational Tree

This document provides a comprehensive column-level schema reference for all 44 database tables (current and future), tracing foreign key connection links directly.

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
  Column            | Type           | Key | Connection Links
  ------------------|----------------|-----|----------------------------------------------------
  id                | BIGINT         | PK  | ──► agents_info.company_id (Tenant office branches)
                    |                |     | ──► accounts_purchase_vouchers.vendor_id
                    |                |     | ──► gst_ledger_entries.company_id
                    |                |     | ──► unposted_transactions_queue.company_id
                    |                |     | ──► accounts_cass_statements.airline_id
                    |                |     | ──► accounts_invoice_brokerage_details.partner_agent_id
                    |                |     | ──► accounts_invoice_consol_details.partner_agent_id
                    |                |     | ──► customers.company_id (Onboarded client customers)
  name              | VARCHAR(100)   |     |
  tier              | VARCHAR(30)    |     | (core, tactical, command)
  email_domain      | VARCHAR(100)   |     | (Verification suffix)
  ocr_credits_balance | INT          |     | (Remaining vision OCR balance)
  ocr_credits_monthly_allowance | INT|     | (Monthly credit quota)
  ocr_credits_limit | INT            |     | (Overdraft limit threshold, default: 0)
  created_at        | TIMESTAMP      |     |
  updated_at        | TIMESTAMP      |     |
```

### 1a. `customers` (PK: `id`)
*Note: This table stores the shippers, consignees, notify parties, and debtors onboarded by the platform tenants.*

```text
  Column            | Type           | Key | Connection Links
  ------------------|----------------|-----|----------------------------------------------------
  id                | BIGINT         | PK  | ──► jobs.client_id
                    |                |     | ──► accounts_invoices.client_id
                    |                |     | ──► job_entities.customer_id
                    |                |     | ──► operational_cover_letters.recipient_customer_id
  company_id        | BIGINT         | FK  | ◄── companies.id (Tenant company owning this client)
  name              | VARCHAR(100)   |     |
  email_domain      | VARCHAR(100)   |     | (For domain lookup/matching)
  email             | VARCHAR(100)   |     | (Operations/billing email)
  phone             | VARCHAR(30)    |     | (Contact phone number)
  address           | TEXT           |     | (Registered physical office address)
  gst_no            | VARCHAR(30)    |     | (GSTIN Tax Identification number)
  pan_no            | VARCHAR(20)    |     | (Permanent Account Number)
  duns_no           | VARCHAR(20)    |     | (Dun & Bradstreet Number for credit checks)
  bank_name         | VARCHAR(100)   |     | (Bank name for invoice settlements)
  bank_account_no   | VARCHAR(50)    |     | (Bank account routing number)
  bank_ifsc_code    | VARCHAR(20)    |     | (IFSC / SWIFT code for transfers)
  payment_terms_days | INT           |     | (Default credit invoice payment terms e.g., 30)
  credit_limit      | DECIMAL(15,2)  |     | (Maximum allowed accounts receivable outstanding balance)
  default_port_id   | BIGINT         | FK  | ◄── ports.id (Preferred destination port)
  branch_id         | BIGINT         | FK  | ◄── agents_info.id (Auto-resolved proximity branch)
  sales_rep_id      | BIGINT         | FK  | ◄── users.id (Command tier assigned sales rep)
  created_at        | TIMESTAMP      |     |
  updated_at        | TIMESTAMP      |     |
```

### 2. `agents_info` (PK: `id`)
```text
  Column            | Type           | Key | Connection Links
  ------------------|----------------|-----|----------------------------------------------------
  id                | BIGINT         | PK  | ──► users.branch_name
                    |                |     | ──► jobs.agent_id
                    |                |     | ──► mailbox_connections.agent_id
                    |                |     | ──► email_threads.agent_id
                    |                |     | ──► chart_of_accounts.agent_id
                    |                |     | ──► accounting_periods.agent_id
                    |                |     | ──► accounts_invoices.agent_id
                    |                |     | ──► accounts_purchase_vouchers.agent_id
                    |                |     | ──► accounts_ledger_entries.agent_id
                    |                |     | ──► gst_ledger_entries.agent_id
                    |                |     | ──► sequence_counters.agent_id
                    |                |     | ──► unposted_transactions_queue.agent_id
                    |                |     | ──► approved_drafts_queue.agent_id
                    |                |     | ──► operational_cover_letters.agent_id
                    |                |     | ──► bank_transactions.agent_id
                    |                |     | ──► financial_snapshots.agent_id
                    |                |     | ──► accounts_cass_statements.agent_id
                    |                |     | ──► milestone_performance_logs.agent_id
                    |                |     | ──► audit_logs.agent_id
                    |                |     | ──► sea_containers.agent_id
                    |                |     | ──► sea_container_items.agent_id
  company_id        | BIGINT         | FK  | ◄── companies.id
  agent_name        | VARCHAR(100)   |     |
  agent_address     | TEXT           |     |
  created_at        | TIMESTAMP      |     |
  updated_at        | TIMESTAMP      |     |
```

### 3. `ports` (PK: `id`)
```text
  Column            | Type           | Key | Connection Links
  ------------------|----------------|-----|----------------------------------------------------
  id                | BIGINT         | PK  | ──► users.default_port_id
  locode            | CHAR(5)        | UK  | (UN/LOCODE, unique index)
  port_name         | VARCHAR(100)   |     |
  country_code      | CHAR(2)        |     |
  port_type         | VARCHAR(20)    |     | (air, sea, land)
  is_active         | BOOLEAN        |     |
  created_at        | TIMESTAMP      |     |
  updated_at        | TIMESTAMP      |     |
```

### 4. `users` (PK: `id`)
```text
  Column            | Type           | Key | Connection Links
  ------------------|----------------|-----|----------------------------------------------------
  id                | BIGINT         | PK  | ──► email_threads.assigned_operator_id
                    |                |     | ──► jobs.operator_id
                    |                |     | ──► jobs.job_owner_id
                    |                |     | ──► jobs.doc_user_id
                    |                |     | ──► accounts_invoices.created_by
                    |                |     | ──► accounts_purchase_vouchers.created_by
                    |                |     | ──► unposted_transactions_queue.created_by
                    |                |     | ──► approved_drafts_queue.approved_by
                    |                |     | ──► operational_cover_letters.prepared_by
                    |                |     | ──► audit_logs.user_id
  name              | VARCHAR(100)   |     |
  email             | VARCHAR(100)   | UK  |
  password          | VARCHAR(255)   |     |
  designation       | VARCHAR(20)    |     | (pricing, operations, sales, admin, documentation)
  company_name      | VARCHAR(100)   |     |
  branch_name       | BIGINT         | FK  | ◄── agents_info.id
  default_port_id   | BIGINT         | FK  | ◄── ports.id
  pima_address      | VARCHAR(50)    |     | (For IATA Type B message routing)
  signature_text    | TEXT           |     | (Custom email signature configured via User Profile Settings page)
  created_at        | TIMESTAMP      |     |
  updated_at        | TIMESTAMP      |     |
```

### 5. `jobs` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► sea_shipment_details.job_id (1-to-1)
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
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  transport_mode         | VARCHAR(10)  |     | (air, sea)
  direction              | VARCHAR(10)  |     | (export, import)
  enquiry_no             | VARCHAR(30)  | UK  | (Central Counter sequential ENQ-YY-NNNN)
  execution_job_no       | VARCHAR(30)  | UK  | (Central Counter sequential JOB-YY-NNNN)
  client_id              | BIGINT       | FK  | ◄── customers.id
  operator_id            | BIGINT       | FK  | ◄── users.id (Auto-assigned to first email responder; reassignable)
  job_owner_id           | BIGINT       | FK  | ◄── users.id
  doc_user_id            | BIGINT       | FK  | ◄── users.id
  status                 | VARCHAR(30)  |     | (Intake, AI Extraction, Verification, Generation, PDF Generated, Sent to Airline, Airline Confirmed, Completed, Lost)
  lost_reason            | VARCHAR(30)  |     | (rates_high, delay_in_response, client_cancelled, capacity_issue, other)
  lost_reason_custom     | VARCHAR(255) |     |
  lost_at                | TIMESTAMP    |     |
  parent_job_id          | BIGINT       | FK  | ◄── jobs.id (Self-referencing Consol validation)
  is_sub_shipment        | BOOLEAN      |     | (Child House record under consolidation)
  is_consolidation       | BOOLEAN      |     | (Parent Master record accepting child Houses)
  cargo_type             | VARCHAR(20)  |     | (Authoritative: General, Hazmat, Perishable, ULD, FCL, LCL)
  consol_type            | VARCHAR(20)  |     | (Authoritative: agent_consol, buyers_consol, direct, none)
  delivery_mode          | VARCHAR(20)  |     | (Authoritative: door-to-door, port-to-port, etc.)
  planned_clearance_date | DATE         |     | (Clearance schedule tracker)
  awb_number             | VARCHAR(20)  |     |
  pickup_address         | VARCHAR(500) |     | (Authoritative source address)
  delivery_address       | VARCHAR(500) |     | (Authoritative target address)
  extracted_pieces       | INT          |     | (Regex-extracted pieces)
  extracted_weight       | DECIMAL(10,3)|     | (Regex-extracted weight)
  extracted_volume       | DECIMAL(8,3) |     | (Regex-extracted volume)
  cargo_description      | TEXT         |     | (Regex-extracted description)
  completed_at           | TIMESTAMP    |     | (Timestamp when status reached Completed)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 6. `sea_shipment_details` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  job_id                 | BIGINT       | FK  | ◄── jobs.id (Unique index)
  carrier_id             | BIGINT       | FK  | ◄── companies.id
  vessel_name            | VARCHAR(100) |     |
  voyage_no              | VARCHAR(30)  |     |
  por_code               | CHAR(5)      |     | (LOCODE)
  pol_code               | CHAR(5)      |     | (LOCODE)
  pod_code               | CHAR(5)      |     | (LOCODE)
  del_code               | CHAR(5)      |     | (LOCODE)
  transshipment_required | BOOLEAN      |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 7. `air_shipment_details` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  job_id                 | BIGINT       | FK  | ◄── jobs.id (Unique index)
  flight_number          | VARCHAR(20)  |     |
  flight_date            | TIMESTAMP    |     |
  carrier_name           | VARCHAR(100) |     |
  pol_code               | CHAR(5)      |     | (LOCODE)
  pod_code               | CHAR(5)      |     | (LOCODE)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 8. `air_way_bills` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | VARCHAR(20)  | PK  | (awb_code + awb_no)
  uuid                   | UUID         | UK  | (Secure tracker reference)
  job_id                 | BIGINT       | FK  | ◄── jobs.id
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  awb_code               | CHAR(3)      |     |
  awb_no                 | CHAR(8)      |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 9. `house_way_bills` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | VARCHAR(30)  | PK  |
  uuid                   | UUID         | UK  | (Secure tracker reference)
  job_id                 | BIGINT       | FK  | ◄── jobs.id
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  reference_id           | VARCHAR(50)  |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 10. `mailbox_connections` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id (Branch-level tenant isolation)
  user_id                | BIGINT       | FK  | ◄── users.id (Operator who owns this mailbox)
  email_address          | VARCHAR(100) | UK  |
  provider               | VARCHAR(20)  |     | (google, microsoft)
  access_token           | TEXT         |     | (Encrypted at rest)
  refresh_token          | TEXT         |     | (Encrypted at rest)
  expires_at             | TIMESTAMP    |     |
  is_active              | BOOLEAN      |     | (false = tier downgrade paused)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 11. `email_threads` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  assigned_operator_id   | BIGINT       | FK  | ◄── users.id (Auto-assigned to first email responder; reassignable)
  job_id                 | BIGINT       | FK  | ◄── jobs.id
  thread_key             | VARCHAR(255) | UK  | ──► inbound_emails.thread_key
  status                 | VARCHAR(20)  |     | (unread, read, replied, archived, updates)
  classification         | VARCHAR(20)  |     | (customer_enquiry, airline, clearance, trucking_road)
  latest_message_rcvd_at | TIMESTAMP    |     |
  first_triage_at        | TIMESTAMP    |     | (Immutable audit timestamp)
  pending_client_notification | JSON    |     | (Staged draft email body, attachment list, and type awaiting user consent)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 12. `inbound_emails` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► inbound_attachments.inbound_email_id
  agent_id               | BIGINT       | FK  | ◄── agents_info.id (Branch-level tenant isolation)
  mailbox_connection_id  | BIGINT       | FK  | ◄── mailbox_connections.id (Cascade delete)
  thread_key             | VARCHAR(255) | IDX | ──► email_threads.thread_key (Composite index)
  message_id             | VARCHAR(255) | UK  |
  from                   | VARCHAR(255) |     |
  to                     | VARCHAR(255) |     |
  subject                | VARCHAR(255) |     |
  body_text              | LONGTEXT     |     |
  body_html              | LONGTEXT     |     | (HTMLPurifier sanitized)
  received_at            | TIMESTAMP    |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 13. `inbound_attachments` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  inbound_email_id       | BIGINT       | FK  | ◄── inbound_emails.id (Cascade delete)
  filename               | VARCHAR(255) |     |
  file_path              | VARCHAR(255) |     | (Contains UUID generated string name)
  mime_type              | VARCHAR(50)  |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 14. `job_documents` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  job_id                 | BIGINT       | FK  | ◄── jobs.id (Cascade delete)
  document_type          | VARCHAR(50)  |     |
  file_path              | VARCHAR(255) |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 15. `milestone_performance_logs` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id
  milestone_name         | VARCHAR(50)  |     | (Intake, AI Extraction, Verification, etc.)
  entered_at             | TIMESTAMP    |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 16. `audit_logs` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  user_id                | BIGINT       | FK  | ◄── users.id
  action                 | VARCHAR(255) |     |
  model_type             | VARCHAR(100) |     |
  model_id               | BIGINT       |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 17. `chart_of_accounts` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► accounts_ledger_entries.chart_of_account_id
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  account_code           | VARCHAR(30)  |     | (Unique per agent)
  account_name           | VARCHAR(100) |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 18. `accounting_periods` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► accounts_ledger_entries.accounting_period_id
                         |              |     | ──► financial_snapshots.accounting_period_id
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  period_name            | VARCHAR(50)  |     |
  start_date             | DATE         |     |
  end_date               | DATE         |     |
  status                 | VARCHAR(20)  |     | (open, closed)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 19. `sea_containers` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► sea_container_items.container_id
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id
  container_number       | VARCHAR(20)  |     |
  seal_number            | VARCHAR(30)  |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 20. `sea_container_items` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  container_id           | BIGINT       | FK  | ◄── sea_containers.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id (House child card)
  piece_count            | INT          |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 21. `cargo_arrival_notices` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id
  notice_number          | VARCHAR(30)  | UK  | (Central Counter sequential CAN-YY-NNNN)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 22. `job_entities` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id
  customer_id            | BIGINT       | FK  | ◄── customers.id
  role                   | VARCHAR(20)  |     | (shipper, consignee, notify_party)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 23. `accounts_invoices` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► accounts_invoice_items.invoice_id (Cascade)
                         |              |     | ──► accounts_invoice_brokerage_details.invoice_id
                         |              |     | ──► accounts_invoice_consol_details.invoice_id
                         |              |     | ──► bank_transactions.matched_invoice_id
                         |              |     | ──► accounts_invoices.parent_invoice_id (Self-relation)
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id (On Delete Restrict)
  client_id              | BIGINT       | FK  | ◄── customers.id (Debtor)
  parent_invoice_id      | BIGINT       | FK  | ◄── accounts_invoices.id (Self-referencing credit notes)
  created_by             | BIGINT       | FK  | ◄── users.id
  invoice_no             | VARCHAR(30)  | UK  | (Central Counter sequential prefix-YY-NNNN)
  type                   | VARCHAR(20)  |     | (invoice, debit_note, credit_note, brokerage, consol_invoice)
  document_date          | DATE         |     |
  status                 | VARCHAR(20)  |     | (draft, finalized, sent, paid, void)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     | (Soft deletes forbidden)
```

### 24. `accounts_invoice_items` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  invoice_id             | BIGINT       | FK  | ◄── accounts_invoices.id (Cascade delete)
  description            | VARCHAR(255) |     |
  amount                 | DECIMAL(15,2)|     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 25. `accounts_invoice_brokerage_details` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  invoice_id             | BIGINT       | FK  | ◄── accounts_invoices.id (Unique index)
  partner_agent_id       | BIGINT       | FK  | ◄── companies.id
  brokerage_basis        | VARCHAR(30)  |     | (flat_rate, per_container)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 26. `accounts_invoice_consol_details` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  invoice_id             | BIGINT       | FK  | ◄── accounts_invoices.id (Unique index)
  partner_agent_id       | BIGINT       | FK  | ◄── companies.id
  consol_basis           | VARCHAR(30)  |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 27. `accounts_purchase_vouchers` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► accounts_purchase_items.purchase_voucher_id
                         |              |     | ──► accounts_cass_statements.matched_voucher_id
                         |              |     | ──► bank_transactions.matched_voucher_id
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id (On Delete Restrict)
  vendor_id              | BIGINT       | FK  | ◄── companies.id (Carrier/Vendor Creditor)
  created_by             | BIGINT       | FK  | ◄── users.id
  voucher_no             | VARCHAR(30)  | UK  | (Central Counter sequential PV-YY-NNNN)
  document_date          | DATE         |     |
  status                 | VARCHAR(20)  |     | (unpaid, paid, void)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     | (Soft deletes forbidden)
```

### 28. `accounts_purchase_items` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  purchase_voucher_id    | BIGINT       | FK  | ◄── accounts_purchase_vouchers.id (Cascade delete)
  description            | VARCHAR(255) |     |
  amount                 | DECIMAL(15,2)|     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 29. `accounts_ledger_entries` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  chart_of_account_id    | BIGINT       | FK  | ◄── chart_of_accounts.id
  accounting_period_id   | BIGINT       | FK  | ◄── accounting_periods.id
  posting_date           | DATE         |     |
  debit_amount           | DECIMAL(15,2)|     |
  credit_amount          | DECIMAL(15,2)|     |
  source_id              | BIGINT       |     | (Polymorphic morphTo matching invoices/vouchers)
  source_type            | VARCHAR(50)  |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 30. `gst_ledger_entries` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  company_id             | BIGINT       | FK  | ◄── companies.id
  voucher_id             | BIGINT       |     | (Polymorphic morphTo matching invoices/vouchers)
  voucher_type           | VARCHAR(50)  |     |
  cgst_amount            | DECIMAL(15,2)|     | (Accrued local CGST)
  sgst_amount            | DECIMAL(15,2)|     | (Accrued local SGST)
  igst_amount            | DECIMAL(15,2)|     | (Accrued interstate IGST)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 31. `sequence_counters` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  prefix                 | VARCHAR(10)  |     | (INV, PV, ENQ, JOB, CAN, CL, MF)
  fiscal_year            | VARCHAR(6)   |     | (Calculated via fiscalYear() GST helper)
  current_value          | INT          |     | (Increment counter value)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 32. `unposted_transactions_queue` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  company_id             | BIGINT       | FK  | ◄── companies.id
  created_by             | BIGINT       | FK  | ◄── users.id
  source_id              | BIGINT       |     | (Polymorphic morphTo matching invoices/vouchers)
  source_type            | VARCHAR(50)  |     |
  net_amount             | DECIMAL(15,2)|     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 33. `approved_drafts_queue` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id (Cascade delete)
  approved_by            | BIGINT       | FK  | ◄── users.id
  source_id              | BIGINT       |     | (Polymorphic: air_way_bills, house_way_bills, etc.)
  source_type            | VARCHAR(50)  |     |
  operational_ref        | VARCHAR(50)  |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 34. `operational_cover_letters` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  recipient_customer_id  | BIGINT       | FK  | ◄── customers.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id (Cascade delete)
  prepared_by            | BIGINT       | FK  | ◄── users.id
  cover_letter_no        | VARCHAR(30)  | UK  | (Central Counter sequential CL-YY-NNNN)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 35. `bank_transactions` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  matched_invoice_id     | BIGINT       | FK  | ◄── accounts_invoices.id (On Delete Set Null)
  matched_voucher_id     | BIGINT       | FK  | ◄── accounts_purchase_vouchers.id (On Delete Set Null)
  plaid_transaction_id   | VARCHAR(255) | UK  |
  amount                 | DECIMAL(15,2)|     |
  reconciliation_status  | VARCHAR(20)  |     | (unreconciled, matched, disputed, ignored)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 36. `financial_snapshots` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  accounting_period_id   | BIGINT       | FK  | ◄── accounting_periods.id
  snapshot_date          | DATE         |     |
  total_receivables      | DECIMAL(15,2)|     |
  total_payables         | DECIMAL(15,2)|     |
  last_computed_at       | TIMESTAMP    |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 37. `accounts_cass_statements` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  airline_id             | BIGINT       | FK  | ◄── companies.id
  matched_voucher_id     | BIGINT       | FK  | ◄── accounts_purchase_vouchers.id
  awb_number             | VARCHAR(20)  |     |
  reconciliation_status  | VARCHAR(20)  |     | (unmatched, matched, rate_mismatch, weight_mismatch)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 38. `pdf_processing_jobs` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► pdf_extraction_corrections.job_id
  user_id                | BIGINT       | FK  | ◄── users.id
  document_type          | VARCHAR(50)  |     | (MAWB, HAWB, Invoice, Packing List)
  extracted_data         | JSON         |     | (JSON payload mapped by Gemma 4 / Gemini)
  status                 | VARCHAR(20)  |     | (pending, processing, completed, failed)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 39. `manifest_filings` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id
  icegate_id             | VARCHAR(50)  |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 40. `email_classification_rules` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  | ──► email_classification_overrides.matched_rule_id
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  rule_name              | VARCHAR(100) |     |
  rule_type              | VARCHAR(30)  |     | (domain_blocklist, subject_keyword, body_keyword, sender_pattern)
  pattern                | VARCHAR(500) |     |
  target_classification  | VARCHAR(30)  |     |
  priority               | INT          |     |
  is_active              | BOOLEAN      |     |
  hit_count              | INT          |     |
  override_count         | INT          |     |
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
```

### 41. `email_classification_overrides` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id
  email_thread_id        | BIGINT       | FK  | ◄── email_threads.id
  matched_rule_id        | BIGINT       | FK  | ◄── email_classification_rules.id
  original_classification| VARCHAR(30)  |     |
  corrected_classification| VARCHAR(30) |     |
  email_subject          | VARCHAR(255) |     |
  sender_domain          | VARCHAR(100) |     |
  sender_email           | VARCHAR(255) |     |
  corrected_by           | BIGINT       | FK  | ◄── users.id
  created_at             | TIMESTAMP    |     |
```

### 42. `ocr_credit_transactions` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  company_id             | BIGINT       | FK  | ◄── companies.id
  job_id                 | BIGINT       | FK  | ◄── jobs.id (On Delete Set Null)
  amount                 | INT          |     | (Negative for usage, positive for recharge)
  transaction_type       | VARCHAR(30)  |     | (monthly_grant, purchase, consumption, refund)
  notes                  | VARCHAR(255) |     |
  created_at             | TIMESTAMP    |     |
```

### 43. `pdf_extraction_corrections` (PK: `id`)
```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  job_id                 | BIGINT       | FK  | ◄── pdf_processing_jobs.id (Cascade delete)
  field_name             | VARCHAR(50)  |     | (e.g. shipper_name, weight, volume, pieces, awb_no)
  original_value         | TEXT         |     | (Value extracted by the LLM)
  corrected_value        | TEXT         |     | (Value corrected and approved by operator)
  confidence_level       | VARCHAR(10)  |     | (high, medium, low)
  corrected_by           | BIGINT       | FK  | ◄── users.id
  created_at             | TIMESTAMP    |     |
```

### 44. `support_tickets` (PK: `id`)
*Note: This table stores customer/operator bug reports and complaints captured via the in-app chatbot and DOM selector.*

```text
  Column                 | Type         | Key | Connection Links
  -----------------------|--------------|-----|----------------------------------------------------
  id                     | BIGINT       | PK  |
  agent_id               | BIGINT       | FK  | ◄── agents_info.id (Tenant branch)
  user_id                | BIGINT       | FK  | ◄── users.id (Reporter user)
  route                  | VARCHAR(255) |     | (Active page URL/route)
  element_selector       | VARCHAR(255) |     | (CSS selector path of clicked element)
  screenshot_path        | VARCHAR(500) |     | (S3 or local screenshot path)
  console_logs           | JSON         |     | (Array of captured console error logs)
  description            | TEXT         |     | (Reporter's problem statement)
  status                 | VARCHAR(20)  |     | (open, investigating, resolved)
  created_at             | TIMESTAMP    |     |
  updated_at             | TIMESTAMP    |     |
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

---

## 💾 Raw SQL DDL Script (CREATE TABLE statements & Indexes)

You can run the following SQL script directly in your database to initialize all tables, primary keys, foreign keys, unique keys, and speed indexes in the correct execution priority order:

```sql
-- 1. companies
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tier VARCHAR(30) DEFAULT 'core', -- Platform subscription tier for tenants (core, tactical, command); ignored for client customers
    email_domain VARCHAR(100) NULL, -- Suffix domain for verification
    ocr_credits_balance INT DEFAULT 0, -- OCR credits balance for platform tenants
    ocr_credits_monthly_allowance INT DEFAULT 0, -- Monthly quota replenishment for platform tenants
    ocr_credits_limit INT DEFAULT 0, -- Overdraft credit limit threshold for platform tenants (negative values allowed)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1a. customers
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL, -- The platform tenant owning this customer account
    name VARCHAR(100) NOT NULL,
    email_domain VARCHAR(100) NULL, -- Suffix domain for searching/linking
    email VARCHAR(100) NULL, -- Operations/billing email
    phone VARCHAR(30) NULL, -- Contact phone number
    address TEXT NULL, -- Registered physical office address
    gst_no VARCHAR(30) NULL, -- GSTIN Tax Identification number
    pan_no VARCHAR(20) NULL, -- Permanent Account Number
    duns_no VARCHAR(20) NULL, -- Dun & Bradstreet Number for credit checks
    bank_name VARCHAR(100) NULL, -- Bank name for invoice settlements
    bank_account_no VARCHAR(50) NULL, -- Bank account routing number
    bank_ifsc_code VARCHAR(20) NULL, -- IFSC / SWIFT code for transfers
    payment_terms_days INT DEFAULT 30, -- Default credit invoice payment terms e.g., 30
    credit_limit DECIMAL(15,2) DEFAULT 0.00, -- Maximum allowed accounts receivable outstanding balance
    default_port_id BIGINT NULL, -- Preferred airport/seaport location
    branch_id BIGINT NULL, -- Proximity agent branch managing this customer
    sales_rep_id BIGINT NULL, -- Assigned sales rep for outstanding collection balance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 2. agents_info
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

-- 4. users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    default_port_id BIGINT NULL,          -- Nullable: set during onboarding, references ports.id
    branch_name BIGINT NOT NULL, -- references agents_info.id
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    designation VARCHAR(20) NOT NULL DEFAULT 'operations', -- pricing, operations, sales, admin, documentation
    company_name VARCHAR(100) NOT NULL,
    pima_address VARCHAR(50) NULL,
    signature_text TEXT NULL, -- configured via User Profile Settings page
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (default_port_id) REFERENCES ports(id),
    FOREIGN KEY (branch_name) REFERENCES agents_info(id)
);

-- 5. jobs
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    transport_mode VARCHAR(10) NOT NULL, -- 'air', 'sea'
    direction VARCHAR(10) DEFAULT 'export', -- 'export', 'import'
    enquiry_no VARCHAR(30) NOT NULL UNIQUE,
    execution_job_no VARCHAR(30) NULL UNIQUE,
    client_id BIGINT NULL,
    operator_id BIGINT NULL, -- Auto-assigned to first email responder; reassignable
    job_owner_id BIGINT NULL,
    doc_user_id BIGINT NULL,
    parent_job_id BIGINT NULL,
    status VARCHAR(30) DEFAULT 'Intake', -- Intake, AI Extraction, Verification, Generation, PDF Generated, Sent to Airline, Airline Confirmed, Completed, Lost
    lost_reason VARCHAR(30) NULL,
    lost_reason_custom VARCHAR(255) NULL,
    lost_at TIMESTAMP NULL,
    cargo_type VARCHAR(20) NULL,
    consol_type VARCHAR(20) NULL,
    delivery_mode VARCHAR(20) NULL,
    planned_clearance_date DATE NULL,
    awb_number VARCHAR(20) NULL,
    pickup_address VARCHAR(500) NULL,
    delivery_address VARCHAR(500) NULL,
    is_sub_shipment BOOLEAN DEFAULT FALSE,
    is_consolidation BOOLEAN DEFAULT FALSE,
    extracted_pieces INT NULL,
    extracted_weight DECIMAL(10,3) NULL,
    extracted_volume DECIMAL(8,3) NULL,
    cargo_description TEXT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (client_id) REFERENCES customers(id),
    FOREIGN KEY (operator_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (job_owner_id) REFERENCES users(id),
    FOREIGN KEY (doc_user_id) REFERENCES users(id),
    FOREIGN KEY (parent_job_id) REFERENCES jobs(id)
);

-- 6. sea_shipment_details
CREATE TABLE sea_shipment_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL UNIQUE,
    carrier_id BIGINT NULL,
    vessel_name VARCHAR(100) NULL,
    voyage_no VARCHAR(30) NULL,
    por_code CHAR(5) NULL,
    pol_code CHAR(5) NULL,
    pod_code CHAR(5) NULL,
    del_code CHAR(5) NULL,
    transshipment_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (carrier_id) REFERENCES companies(id)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 8. air_way_bills
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
CREATE TABLE house_way_bills (
    id VARCHAR(30) PRIMARY KEY,
    uuid CHAR(36) NULL UNIQUE, -- UUID unique index
    job_id BIGINT NOT NULL,
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
    agent_id BIGINT NOT NULL,
    email_address VARCHAR(100) NOT NULL,
    provider VARCHAR(20) NOT NULL, -- 'google', 'microsoft'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id)
);

-- 11. email_threads
CREATE TABLE email_threads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    assigned_operator_id BIGINT NULL, -- Auto-assigned to first email responder; reassignable
    job_id BIGINT NULL,
    thread_key VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'unread', -- 'unread', 'read', 'replied', 'archived', 'updates'
    classification VARCHAR(20) DEFAULT 'customer_enquiry', -- 'customer_enquiry', 'airline', etc.
    latest_message_received_at TIMESTAMP NOT NULL,
    first_triage_at TIMESTAMP NULL,
    pending_client_notification JSON NULL, -- JSON object storing staged draft body, attachments, & type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (assigned_operator_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

-- 12. inbound_emails
CREATE TABLE inbound_emails (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    thread_key VARCHAR(255) NOT NULL,
    message_id VARCHAR(255) NOT NULL UNIQUE,
    `from` VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NULL,
    body_html TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_key) REFERENCES email_threads(thread_key)
);

-- 13. inbound_attachments
CREATE TABLE inbound_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inbound_email_id BIGINT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL, -- contains UUID filename
    mime_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inbound_email_id) REFERENCES inbound_emails(id) ON DELETE CASCADE
);

-- 14. job_documents
CREATE TABLE job_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
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
    notice_number VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- 22. job_entities
CREATE TABLE job_entities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'shipper', 'consignee', 'notify_party'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 23. accounts_invoices
CREATE TABLE accounts_invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    parent_invoice_id BIGINT NULL,
    created_by BIGINT NULL,
    invoice_no VARCHAR(30) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'invoice', 'debit_note', 'credit_note', 'brokerage', 'consol_invoice'
    document_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id) REFERENCES customers(id),
    FOREIGN KEY (parent_invoice_id) REFERENCES accounts_invoices(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY uq_invoice_agent_no (agent_id, invoice_no)
);

-- 24. accounts_invoice_items
CREATE TABLE accounts_invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES accounts_invoices(id) ON DELETE CASCADE
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
    FOREIGN KEY (partner_agent_id) REFERENCES companies(id)
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
    FOREIGN KEY (partner_agent_id) REFERENCES companies(id)
);

-- 27. accounts_purchase_vouchers
CREATE TABLE accounts_purchase_vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    created_by BIGINT NULL,
    voucher_no VARCHAR(30) NOT NULL,
    document_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT,
    FOREIGN KEY (vendor_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY uq_voucher_agent_no (agent_id, voucher_no)
);

-- 28. accounts_purchase_items
CREATE TABLE accounts_purchase_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_voucher_id BIGINT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_voucher_id) REFERENCES accounts_purchase_vouchers(id) ON DELETE CASCADE
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
    cover_letter_no VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (recipient_customer_id) REFERENCES customers(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (prepared_by) REFERENCES users(id)
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

-- 36. financial_snapshots
CREATE TABLE financial_snapshots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    accounting_period_id BIGINT NULL,
    snapshot_date DATE NOT NULL,
    total_receivables DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_payables DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    last_computed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (accounting_period_id) REFERENCES accounting_periods(id) ON DELETE SET NULL
);

-- 37. accounts_cass_statements
CREATE TABLE accounts_cass_statements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT NOT NULL,
    airline_id BIGINT NOT NULL,
    matched_voucher_id BIGINT NULL,
    awb_number VARCHAR(20) NOT NULL,
    reconciliation_status VARCHAR(20) DEFAULT 'unmatched',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents_info(id),
    FOREIGN KEY (airline_id) REFERENCES companies(id),
    FOREIGN KEY (matched_voucher_id) REFERENCES accounts_purchase_vouchers(id) ON DELETE SET NULL
);

-- 38. pdf_processing_jobs (Logs/Parser records)
-- Stores unstructured document category drafts parsed via PyMuPDF (text extraction) + Gemma 4 E4B (JSON mapping classification)
CREATE TABLE pdf_processing_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_type VARCHAR(50) NULL, -- MAWB, HAWB, Invoice, Packing List
    extracted_data JSON NULL, -- Structured JSON payload mapped by Gemma 4 / Gemini
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
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
    job_id BIGINT NULL,
    amount INT NOT NULL,
    transaction_type VARCHAR(30) NOT NULL, -- monthly_grant, purchase, consumption, refund
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
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


-- =====================================================================
-- PERFORMANCE & HIGH-SPEED OPTIMIZATION INDEXES
-- =====================================================================

-- Single-column indexes
CREATE INDEX idx_support_tickets_status ON support_tickets (status);
CREATE INDEX idx_inbound_emails_msg_id ON inbound_emails (message_id);
CREATE INDEX idx_email_threads_thread_key ON email_threads (thread_key);
CREATE INDEX idx_manifest_filings_icegate_id ON manifest_filings (icegate_id);
CREATE INDEX idx_jobs_transport_mode ON jobs (transport_mode);
CREATE INDEX idx_pdf_processing_jobs_status ON pdf_processing_jobs (status);

-- Composite Indexes
-- 1. Inbox Folders View index (Saves operator folder queues loading latency)
CREATE INDEX idx_threads_agent_status_received ON email_threads (agent_id, status, latest_message_received_at);

-- 2. Kanban Board View index (Eases Ops workload query scans)
CREATE INDEX idx_jobs_agent_mode_status ON jobs (agent_id, transport_mode, status);

-- 3. General Ledger Scanning composite index
CREATE INDEX idx_ledger_agent_date_account ON accounts_ledger_entries (agent_id, posting_date, chart_of_account_id);

-- Foreign Key Constraints for customers (to resolve cyclic dependency)
ALTER TABLE customers ADD CONSTRAINT fk_customers_default_port FOREIGN KEY (default_port_id) REFERENCES ports(id);
ALTER TABLE customers ADD CONSTRAINT fk_customers_branch FOREIGN KEY (branch_id) REFERENCES agents_info(id);
ALTER TABLE customers ADD CONSTRAINT fk_customers_sales_rep FOREIGN KEY (sales_rep_id) REFERENCES users(id);

---

## 🗺️ UI Route & Workflow Navigation Matrix

To support the pricing and operations workflows, the frontend routes and buttons are mapped to corresponding database statuses and models:

### 1. Pricing Staff Kanban Navigation
*   **Kanban Columns (4 Columns):** `Processing`, `Awaiting Customer`, `In Transit`, and `Completed`.
*   **Mail Navigation Icon:** Available on all cards across all 4 columns. Clicking this icon redirects the operator to the Mail Inbox page (`/inbox`), loading the specific thread (`email_threads.thread_key` / `email_threads.job_id`).
*   **Message Log Navigation Icon (In Transit Only):** Rendered exclusively on cards in the `In Transit` column (associated with active/dispatched shipment details in `air_shipment_details` or `sea_shipment_details`). Clicking this icon redirects the operator to the Message Log page (`/message-log`) to inspect SITA/IATA type B messages or tracking history.



