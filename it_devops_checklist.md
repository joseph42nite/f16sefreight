# Live Server — Database Changes

## The rule

Every schema change ships as a **Laravel migration** in `database/migrations/`. On the live server:

```bash
php artisan migrate --force
```

No SQL is run by hand except the one-off catch-up below.

---

## One-off catch-up — before the first `migrate` on live

The live server has never run `php artisan migrate`; its older columns were added by hand. Do this once, before the
first run.

### 1. Back up the live database

### 2. Record what live already has in the `migrations` table

Laravel runs every migration that is not listed in the `migrations` table. On live that table is empty (or missing),
so the first run would try to create tables that already exist — `users` first — and stop. Each migration whose
table or column live already has must be listed there before the first run. ❓ Which ones those are has to be read
from the live schema (GAPS #460).

### 3. Check the hand-added columns

These columns were added on live by hand, and each now also has a migration. Each of those migrations **skips a
column that is already there** (`Schema::hasColumn`), so no `ALTER` is needed by hand — the checks below only show
what live has.

```sql
-- way_bill_addresses — 2026_07_15_000000_add_agent_id_to_way_bill_addresses_table
SHOW COLUMNS FROM way_bill_addresses LIKE 'agent_id';

-- air_way_bills — 2026_07_15_010000_add_tracking_columns_to_waybill_tables, 2026_07_27_000000_add_as_agreed_to_air_way_bills_table
SHOW COLUMNS FROM air_way_bills WHERE Field IN ('status', 'awb_email', 't_id', 'send_created', 'send_status', 'as_agreed');

-- house_way_bills — 2026_07_15_010000_add_tracking_columns_to_waybill_tables, 2026_07_21_000000_add_ho_and_as_agreed_columns_to_house_way_bills_table
SHOW COLUMNS FROM house_way_bills WHERE Field IN ('status', 't_id', 'send_created', 'send_status',
    'ho_name', 'ho_address', 'ho_city', 'ho_pincode', 'ho_state', 'ho_country', 'as_agreed');

-- airlines — 2026_07_20_000000_add_airline_address_to_airlines_table (read by the AWB and HAWB PDFs)
SHOW COLUMNS FROM airlines LIKE 'airline_address';

-- companies — 2026_07_20_000001_add_in_testing_mode_to_companies_table (picks the Descartes upload URL)
SHOW COLUMNS FROM companies LIKE 'in_testing_mode';
```

### 4. Run the migrations, then verify

```bash
php artisan migrate --force
```

```sql
DESCRIBE way_bill_addresses;
DESCRIBE air_way_bills;
DESCRIBE house_way_bills;
DESCRIBE airlines;
DESCRIBE companies;
```
