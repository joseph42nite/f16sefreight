<?php

namespace Tests\Feature;

use App\Company;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/** Monthly credits (2026-09-17: a company created on the 10th showed 0 until the 1st). Tactical is 500, Command 2,000. */
class CreditGrantTest extends TestCase
{
    use DatabaseTransactions;

    public function test_a_new_company_gets_its_allowance_once_and_an_upgrade_gets_the_difference(): void
    {
        $company = Company::create(['name' => 'Grant Co', 'code' => 'GRT', 'tier' => 'tactical']);

        $this->artisan('credits:grant-monthly')->assertSuccessful();
        $this->assertSame(500.0, (float) $company->fresh()->ocr_credits_balance);

        // Some used, then a second run the same month changes nothing.
        $company->forceFill(['ocr_credits_balance' => 480])->save();
        $this->artisan('credits:grant-monthly')->assertSuccessful();
        $this->assertSame(480.0, (float) $company->fresh()->ocr_credits_balance);

        // Moved up to Command mid-month: 2,000 − 500 already granted = 1,500 added.
        $company->forceFill(['tier' => 'command'])->save();
        $this->artisan('credits:grant-monthly')->assertSuccessful();
        $this->assertSame(1980.0, (float) $company->fresh()->ocr_credits_balance);
        $this->assertSame(2000, (int) DB::table('ocr_credit_transactions')->where('company_id', $company->id)->where('transaction_type', 'monthly_grant')->sum('amount'));
    }
}
