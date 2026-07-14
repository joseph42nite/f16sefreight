# 🛠️ IT DevOps Checklist: Database Schema & Indexing Guide

This checklist provides step-by-step instructions for manually setting up the required database tables and performance indexes on environments where Laravel migrations cannot be run directly.

All indexes listed below have been cross-referenced with the codebase. Indexes not used by the current application query patterns have been excluded.

---

## 📋 Step 1: Create Database Tables

Execute these SQL statements in your database manager (e.g. phpMyAdmin, MySQL Workbench, DBeaver) to create the three required tables.

### 1. Create `openclaw_nonces` Table
Used to store nonces and protect OpenClaw API webhooks from replay attacks.

```sql
CREATE TABLE openclaw_nonces (
  nonce VARCHAR(255) NOT NULL,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (nonce)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Create `openclaw_pending_actions` Table
Stores incoming OpenClaw webhook payloads awaiting manual moderator/admin review.

```sql
CREATE TABLE openclaw_pending_actions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  action_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(255) NOT NULL,
  payload LONGTEXT NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  telegram_message_id TEXT DEFAULT NULL,
  telegram_chat_id VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Create `status_response` Table
Used to log status updates, callbacks, and rejection messages (FNA) from Descartes.

```sql
CREATE TABLE status_response (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id VARCHAR(255) DEFAULT NULL,
  type_code VARCHAR(255) DEFAULT NULL,
  issue_date_time VARCHAR(255) DEFAULT NULL,
  conversation_id VARCHAR(255) DEFAULT NULL,
  primary_id VARCHAR(255) DEFAULT NULL,
  business_id VARCHAR(255) DEFAULT NULL,
  business_name VARCHAR(255) DEFAULT NULL,
  business_type_code VARCHAR(255) DEFAULT NULL,
  business_status_code VARCHAR(255) DEFAULT NULL,
  condition_code VARCHAR(255) DEFAULT NULL,
  reason TEXT DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## ⚡ Step 2: Add Database Indexes

Execute these SQL statements to optimize query speed and prevent full table scans under concurrent loads.

### 1. Rates Table (`rates`)
Speeds up rate list queries and distinct source/airline searches:
```sql
ALTER TABLE `rates` ADD INDEX `rates_origin_airport_idx` (`origin_airport_code`);
ALTER TABLE `rates` ADD INDEX `rates_carrier_idx` (`carrier_code`);
```
*(Removed `rates_dest_airport_idx` and composite because queries perform wildcard searches or check zone parameters instead).*

### 2. Descartes Carrier Charges (`ams`)
Speeds up custom charges lookup by origin airport:
```sql
ALTER TABLE `ams` ADD INDEX `ams_origin_idx` (`origin`);
```
*(Removed `ams_dest_airport_idx` and composite as there are no database queries filtering carrier charges by destination).*

### 3. Airports Lookup (`locations`)
Speeds up airport detail lookups by IATA code during auto-completes:
```sql
ALTER TABLE `locations` ADD INDEX `locations_iata_code_idx` (`iata_code`);
```

### 4. Rejection & Status tracking (`status_response`)
Optimizes cargo status response matching and FNA listings in the admin shipments tracker:
```sql
CREATE INDEX status_resp_business_id_idx ON status_response(business_id);
CREATE INDEX status_resp_message_id_idx ON status_response(message_id);
CREATE INDEX status_resp_business_status_idx ON status_response(business_id, business_status_code);
```

### 5. Airway Bills (`air_way_bills`)
Optimizes branch filters, status dashboards, and airway bill searches:
```sql
ALTER TABLE `air_way_bills` ADD INDEX `awb_agent_id_idx` (`agent_id`);
ALTER TABLE `air_way_bills` ADD INDEX `awb_code_no_idx` (`awb_code`, `awb_no`);
ALTER TABLE `air_way_bills` ADD INDEX `awb_agent_status_idx` (`agent_id`, `status`);
```

### 6. House Waybills (`house_way_bills`)
Optimizes consolidation lists, search dashboards, and master AWB groupings:
```sql
ALTER TABLE `house_way_bills` ADD INDEX `hawb_agent_id_idx` (`agent_id`);
ALTER TABLE `house_way_bills` ADD INDEX `hawb_code_no_idx` (`awb_code`, `awb_no`);
ALTER TABLE `house_way_bills` ADD INDEX `hawb_agent_awb_idx` (`agent_id`, `awb_code`, `awb_no`);
ALTER TABLE `house_way_bills` ADD INDEX `hawb_status_agent_idx` (`status`, `agent_id`);
```

### 7. Consignments & Addresses (`way_bill_consignment_data` and `way_bill_addresses`)
Speeds up joins when retrieving weights, dimensions, and addresses for AWB/HAWB cards:
```sql
ALTER TABLE `way_bill_consignment_data` ADD INDEX `consignment_awb_id_idx` (`awb_id`);
ALTER TABLE `way_bill_addresses` ADD INDEX `wayaddr_awb_id_idx` (`awb_id`);
```

### 8. Saved Client Addresses (`saved_addresses`)
Speeds up shipper/consignee address autocompletes during draft creations:
```sql
ALTER TABLE `saved_addresses` ADD INDEX `savedaddr_agent_type_idx` (`agent_id`, `address_type`);
```

### 9. Companies & Branches (`agents_info`)
Speeds up company branch mappings and listings:
```sql
ALTER TABLE `agents_info` ADD INDEX `agents_info_company_id_idx` (`company_id`);
```
*(Removed `users_branch_name_idx` on `users` table as the logged-in user's branch ID is loaded from session state and not queried directly in SELECT where filters).*

### 10. Background OCR Jobs (`pdf_processing_jobs` and `openclaw_pending_actions`)
Optimizes queries checking progress statuses, queue states, and processing history:
```sql
ALTER TABLE `pdf_processing_jobs` ADD INDEX `pdf_jobs_status_idx` (`status`);
CREATE INDEX openclaw_pending_status_idx ON openclaw_pending_actions(status);
```
*(Removed separate `pdf_jobs_user_id_idx` since `user_id` is a foreign key, which automatically generates a index in InnoDB).*

---

## 🔍 Step 3: Verification

Verify that all tables and indexes exist by executing:

```sql
-- 1. Check Tables
SHOW TABLES LIKE 'openclaw%';
SHOW TABLES LIKE 'status_response';

-- 2. Check Applied Indexes
SHOW INDEX FROM rates;
SHOW INDEX FROM ams;
SHOW INDEX FROM locations;
SHOW INDEX FROM status_response;
SHOW INDEX FROM air_way_bills;
SHOW INDEX FROM house_way_bills;
SHOW INDEX FROM way_bill_consignment_data;
SHOW INDEX FROM way_bill_addresses;
SHOW INDEX FROM saved_addresses;
SHOW INDEX FROM agents_info;
SHOW INDEX FROM pdf_processing_jobs;
```
