# Paying suppliers from your bank

*For the Money out page. Upload this in superadmin → Help documents, against Money out.*

F16s never sends money. You build the payment run here, and your own bank pays it. Your authorised signatories
approve it in your bank with its usual OTP and approval rules.

## 1. Build the run

1. Open **Money out → Pay suppliers** and tick the vouchers to pay. Change **Pay now** if you are paying part of a voucher.
2. Press **Build the run**. There is one payment for each supplier, because each one is a separate bank transfer.
3. If the supplier's bill takes something off, enter it for that supplier:
   - **Commission:** for example, an airline's commission on the AWB.
   - **Discount:** for example, a tonnage incentive.
   Leave both empty when there is none.
4. Press **Raise the payments**. The screen shows the total you are settling and the amount to **transfer**. The transfer is less any TDS, commission and discount. Transfer that amount, not the total.

## 2. Download the bank file

Press **Bank file**. It downloads a CSV with one row per supplier:

| Column | What it is |
|---|---|
| Beneficiary name | The supplier |
| Account number, IFSC | The supplier's bank details from Clients & Partners |
| Amount | What to transfer, already less TDS, commission and discount |
| Mode | RTGS for ₹2,00,000 and above, NEFT below |
| Payment reference | Our payment number, so the statement can be matched later |
| Check | Filled in when a supplier has no bank details. Add them in Clients & Partners first |

The file holds account numbers, so only accounts can download it, and every download is logged.

## 3. Upload it in your bank

1. Log in to your bank's **corporate net banking**.
2. Open the bulk payment upload. Banks call it *Bulk Upload*, *Bulk Payments* or *File Upload*.
3. The first time, download your bank's own template from that page. Copy the columns from our file into it. The headings differ slightly from bank to bank, but the information is the same.
4. Upload the file. Your authorised signatories approve it, and the bank sends each payment.

Paying just one supplier? Type that row into your bank's single transfer screen instead.

## 4. Close it off here

1. When the bank confirms, press **Post** on each payment in Money out. This records it in the ledger.
2. When the statement arrives, each debit is matched to its payment on the reconciliation screen. The statement comes from:
   - **Setu**, if the account is connected (Settings → Finance), or
   - a CSV import from your bank, if not.

Everything works without a bank connection. Setu only reads your statement automatically. It can never move money.
