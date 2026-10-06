# Code Quality Audit & Refactoring Plan — Air Waybill Controllers

Analysed through the lens of the [Karpathy Coding Principles](https://github.com/multica-ai/andrej-karpathy-skills):
**Simplicity First** · **Surgical Changes** · **No bloated constructions when simpler code would do**

## Status

| Phase | What | Status |
|---|---|---|
| 1 | Quick wins | ✅ Done |
| 2 | Local helpers inside each controller | ✅ Done |
| 3 | Cross-file deduplication | ✅ Done |
| 4 | Frontend form sections | ⏳ Not started |

---

## What the audit found

Line counts are as found at the audit.

1. **`AirwayBillController` (1197 lines) ↔ `HousewayBillController` (1202 lines)** — ~85% identical; every private
   method duplicated, differing only in `$awb_code.$awb_no` vs `$hawb_no` as the ID.
2. **Duplication inside each controller:**
   - the auth + agent lookup block, 12+ times per controller;
   - the date validation block in `routingInformation()`, copied for `date`, `date_2`, `date_3`;
   - `getShipperAddress` / `getConsigneeAddress` / `getAlsoNotifyAddress`, identical but for the prefix
     (`ship_`, `cons_`, `also_`).
3. **`ConversionController` (1823 lines)** — the XML for transport routes 1, 2 and 3 copied three times, in both the
   master and house conversions.
4. **`IMPConversionController` (332 lines)** — `WayBillConversion()` and `HouseWayBillConversion()` ~90% identical.
5. **`GenerateAwbPdfController`** — `downloadPdf()`, `downloadMultipleAwbPdf()` and
   `downloadMultipleWithBackAwbPdf()` repeated the same data fetching and parsing.

---

## Phase 1 — Quick wins ✅

1. Removed commented-out code.
2. Removed unused `$company_id` variables (~25).
3. Removed `dd()` and `die()` debug calls.
4. Fixed the always-true `if (1)` in `HousewayBillController`.
5. Fixed duplicate address routes in `routes/api.php`.

## Phase 2 — Local helpers ✅

6. `getAuthAgent()` — replaced 24 copies of the auth block.
7. `validateAndFormatRouteDates()` — replaced the copied date blocks.
8. `getAddressByType()` — one parameterised address helper.
9. `getOriginCode` / `getDestinationCode` merged in `resources/js/src/core/mixins/airWayBillMixin.js`.
10. Schema: `way_bill_addresses.agent_id` and the tracking columns on `air_way_bills` / `house_way_bills`
    (`status`, `awb_email`, …) — now migrations (see `it_devops_checklist.md`).
11. `tests/Feature/WaybillRefactoringTest.php` — routing dates, prefix isolation, create flows.

## Phase 3 — Cross-file deduplication ✅

12. **`app/Http/Traits/WaybillTrait.php`** — the shared helpers, used by `AirwayBillController` and
    `HousewayBillController` (`39e6a693`).
13. **`ConversionController::buildRouteMovementElement()`** — one route-movement builder for routes 1–3 (`cd5b3adb`).
14. **`GenerateAwbPdfController`** — the three downloads share `loadAwbPdfData()` and `renderMultipleAwbPages()`
    (`2130bb2c`).
15. **`IMPConversionController`** — removed (`49ba655b`), so there is nothing left to share.

## Phase 4 — Frontend ⏳

16. Extract the shared form sections of `FocusAir.vue` / `HouseWayBill.vue` into components.
17. Share the address form components between the AWB and HAWB pages.

---

## Verification

```bash
php artisan test tests/Feature/WaybillRefactoringTest.php
php artisan route:list
```

Schema changes on the live server: `it_devops_checklist.md`.
