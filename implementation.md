# Code Quality Audit & Refactoring Implementation Plan

Analyzed through the lens of the [Karpathy Coding Principles](https://github.com/multica-ai/andrej-karpathy-skills):
**Simplicity First** · **Surgical Changes** · **No bloated constructions when simpler code would do**

---

## Executive Summary

The codebase has **severe duplication** between `AirwayBillController` (1197 lines) and `HousewayBillController` (1202 lines). These two controllers are ~85% identical. The same pattern extends to `ConversionController` (1823 lines) and `IMPConversionController` (332 lines), and `GenerateAwbPdfController` vs `GenerateHawbPdfController`. Additionally, there is intra-file duplication (copy-paste within the same file), dead/commented-out code, and unnecessary complexity.

---

## Issue 1: AirwayBillController ↔ HousewayBillController (Critical)

These two controllers are **near-identical copies** of each other. Every private method is duplicated with only the difference of `$awb_code.$awb_no` vs `$hawb_no` as the ID.

> **Total duplicated code: ~1,700 lines across both files that could be ~500 lines in a shared trait.**

### Recommended Fix

Create a `WaybillTrait` to share common methods:

```php
// app/Http/Traits/WaybillTrait.php
trait WaybillTrait
{
    private function getAuthAgent() { ... }
    private function validateAndFormatRouteDates(array &$routing_information) { ... }
    private function getAddressByType(Request $request, string $addressType, string $prefix) { ... }
    // ...etc
}
```

---

## Issue 2: Intra-File Duplication Within Each Controller

### 2a. Auth + Agent lookup repeated in every method

This 4-line block appeared **12+ times** in each controller:

```php
$user = auth()->guard('user-api')->user();
$company_id = $user->company_id;  // never used!
$branch_name = $user->branch_name;
$agent = Agent::where('id', $branch_name)->first();
```

_Resolved in Phase 2: Extracted into local `getAuthAgent()` helper._

### 2b. Date validation/formatting in `routingInformation()`

The same date validation and formatting block was **copy-pasted 3 times** (for `date`, `date_2`, `date_3`) in `routingInformation()`.
_Resolved in Phase 2: Extracted into local `validateAndFormatRouteDates()` helper._

### 2c. `getShipperAddress`, `getConsigneeAddress`, `getAlsoNotifyAddress`

These three methods were **structurally identical** — only the field prefix changed (`ship_`, `cons_`, `also_`).
_Resolved in Phase 2: Extracted into local `getAddressByType()` helper._

---

## Issue 3: ConversionController — Route Info Copy-Pasted 3×

In [ConversionController.php L299-400](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/app/Http/Controllers/Logistics/ConversionController.php#L299-L400), the XML generation for transport route 1, 2, and 3 is copy-pasted 3 times with only the suffix (`_2`, `_3`) and sequence number changing.
Same pattern in `HouseWayBillConversion()` starting at L598.

---

## Issue 4: IMPConversionController — WayBillConversion ↔ HouseWayBillConversion

[IMPConversionController.php](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/app/Http/Controllers/Logistics/IMPConversionController.php) has the same pattern: `WayBillConversion()` (L23-166) and `HouseWayBillConversion()` (L167-311) are **~90% identical IMP format generation** with the same shipper/consignee/agent/charges formatting logic duplicated.

---

## Issue 5: GenerateAwbPdfController — 3 Methods Are Copy-Paste

[GenerateAwbPdfController.php](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/app/Http/Controllers/Generators/GenerateAwbPdfController.php) has 3 methods:

-   `downloadPdf()` (L21-48)
-   `downloadMultipleAwbPdf()` (L50-93)
-   `downloadMultipleWithBackAwbPdf()` (L96-142)

All three repeat the same data fetching, special handling info parsing, and HS code parsing. These should be **one method** with parameters.

---

## Refactoring Plan & Progress

### Phase 1: Quick Wins — ✅ COMPLETED

1. **Remove all commented-out code** (L86, L95, L112, L170 in AWB; L471, L504, L548 in HAWB)
2. **Remove unused `$company_id`** variables (~25 occurrences across controllers)
3. **Remove `dd()` and `die()` debug calls**
4. **Fix always-true `if (1)`** in HousewayBillController L900
5. **Fix route conflicts** in `api.php` (remove duplicate address routes)

### Phase 2: Extract Local Helpers — ✅ COMPLETED

6. **Created `getAuthAgent()` helper** — replaced 24 copies of repeated auth blocks.
7. **Created `validateAndFormatRouteDates()` helper** — replaced ~120 lines of copy-pasted date blocks.
8. **Merged `getShipperAddress`/`getConsigneeAddress`/`getAlsoNotifyAddress`** into single parameterized `getAddressByType()` helper.
9. **Merged `getOriginCode`/`getDestinationCode`** in frontend `airWayBillMixin.js`.
10. **Database & Schema Fixes**: Resolved missing `agent_id` column on `way_bill_addresses` and tracking columns (`status`, `awb_email`, etc.) on `air_way_bills`/`house_way_bills`.
11. **Integration Tests**: Added [WaybillRefactoringTest.php](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/tests/Feature/WaybillRefactoringTest.php) to thoroughly verify routing date conversions, prefix isolation, and create flows.

### Phase 3: Major Cross-File Deduplication — ⏳ UP NEXT

12. **Create `WaybillTrait`**: Extract shared helper logic from `AirwayBillController` and `HousewayBillController` into a single reusable Trait.
13. **Extract shared XML generation** in `ConversionController` into shared XML building helper methods.
14. **Merge PDF download methods** in `GenerateAwbPdfController`.
15. **Extract shared IMP conversion** logic in `IMPConversionController`.

### Phase 4: Frontend Refactoring — ⏳ UP NEXT

16. **Extract shared form sections** from `FocusAir.vue` / `HouseWayBill.vue` into components.
17. **Share address form components** between AWB and HAWB pages.

---

## Verification Plan

### Automated Tests

-   Run full PHPUnit test suite: `/usr/local/bin/php vendor/bin/phpunit`
-   Verify all routes: `php artisan route:list`

### Manual Verification

-   Execute manual SQL queries on live MySQL database using [it_devops_checklist.md](file:///Users/jomygeorge/.gemini/antigravity/scratch/f16s_main_ssh/it_devops_checklist.md).
