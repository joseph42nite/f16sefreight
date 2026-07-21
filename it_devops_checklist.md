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

-- Check columns on companies
SHOW COLUMNS FROM companies LIKE 'in_testing_mode';
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

### Table: `companies`
`ConversionController::sendXmlToDescartes()` queries `companies.in_testing_mode` to decide which Descartes upload URL to use, but no migration in this repo ever created it either — same drift pattern as above.
```sql
ALTER TABLE companies ADD COLUMN in_testing_mode TINYINT(1) NULL DEFAULT 0;
```
A migration (`2026_07_20_000001_add_in_testing_mode_to_companies_table.php`) now exists in this repo for fresh/local environments; the live server still needs the manual step above if the column isn't already present.

### Table: `house_way_bills` (HAWB PDF columns)
`GenerateHawbPdfController` selects `house_way_bills.ho_name / ho_address / ho_city / ho_pincode / ho_state / ho_country` and `as_agreed`, but no migration ever created them — they exist on live (added by hand) so the HAWB PDF routes work there, but were missing locally, which made those routes fail in dev/test. **Run the check query first**; only run the ALTER for columns that are actually missing:
```sql
SHOW COLUMNS FROM house_way_bills WHERE Field IN ('ho_name','ho_address','ho_city','ho_pincode','ho_state','ho_country','as_agreed');

ALTER TABLE house_way_bills
  ADD COLUMN IF NOT EXISTS ho_name VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS ho_address VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS ho_city VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS ho_pincode VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS ho_state VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS ho_country VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS as_agreed TINYINT(1) NULL;
```
A migration (`2026_07_21_000000_add_ho_and_as_agreed_columns_to_house_way_bills_table.php`) now exists for fresh/local environments; the live server still needs the manual step above if the columns aren't already present.

---

## 3. Post-Upgrade Verification
Verify the columns were successfully created:
```sql
DESCRIBE way_bill_addresses;
DESCRIBE air_way_bills;
DESCRIBE house_way_bills;
DESCRIBE airlines;
DESCRIBE companies;
```
