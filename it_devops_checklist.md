# Live Server Database Update Instructions

Since migrations are not run via Artisan, these SQL statements must be executed manually. Below are the queries to **check** if a column exists and the corresponding **safe statements** to execute on the live MySQL server.

---

## 1. Check Existing Columns
Run these queries first to see which columns are already present on the live server:

```sql
-- Check columns on way_bill_addresses
SHOW COLUMNS FROM way_bill_addresses LIKE 'agent_id';

-- Check columns on air_way_bills
SHOW COLUMNS FROM air_way_bills WHERE Field IN ('status', 'awb_email', 't_id', 'send_created', 'send_status');

-- Check columns on house_way_bills
SHOW COLUMNS FROM house_way_bills WHERE Field IN ('status', 't_id', 'send_created', 'send_status');

-- Check columns on airlines
SHOW COLUMNS FROM airlines LIKE 'airline_address';
```

---

## 2. Alter Statements
Run the appropriate query for any columns that are **missing** from the check step.

### Table: `way_bill_addresses`
If `agent_id` is missing:
```sql
ALTER TABLE way_bill_addresses ADD COLUMN agent_id INT NULL AFTER awb_id;
```

### Table: `air_way_bills`
If any of these tracking columns are missing:
```sql
-- Run only for the specific columns that don't exist yet:
ALTER TABLE air_way_bills 
  ADD COLUMN IF NOT EXISTS status VARCHAR(255) NOT NULL DEFAULT 'generate_pdf',
  ADD COLUMN IF NOT EXISTS awb_email VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS t_id VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS send_created VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS send_status VARCHAR(255) NULL;
```
*(Note: `ADD COLUMN IF NOT EXISTS` is supported in MySQL 8.0.19+ and MariaDB. For older MySQL versions, run them one-by-one by omitting `IF NOT EXISTS` for the missing columns only)*

### Table: `house_way_bills`
If any of these tracking columns are missing:
```sql
ALTER TABLE house_way_bills 
  ADD COLUMN IF NOT EXISTS status VARCHAR(255) NOT NULL DEFAULT 'generate_pdf',
  ADD COLUMN IF NOT EXISTS t_id VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS send_created VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS send_status VARCHAR(255) NULL;
```

### Table: `airlines`
`GenerateAwbPdfController` and `GenerateHawbPdfController` query `airlines.airline_address`, but no migration in this repo ever created it — it was likely added by hand on the live server previously (same as the columns above) and just never documented here. **Run the check query first**; only run the ALTER if it's actually missing:
```sql
ALTER TABLE airlines ADD COLUMN airline_address TEXT NULL;
```
A migration (`2026_07_20_000000_add_airline_address_to_airlines_table.php`) now exists in this repo so fresh/local environments get this column automatically — it won't affect the live server, which still needs the manual step above if the column isn't already present.

---

## 3. Post-Upgrade Verification
Verify the columns were successfully created:
```sql
DESCRIBE way_bill_addresses;
DESCRIBE air_way_bills;
DESCRIBE house_way_bills;
DESCRIBE airlines;
```
