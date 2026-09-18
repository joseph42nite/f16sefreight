<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Services\SellFromWaybill;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** The cost sheet's sell side follows the draft waybill (user, 2026-09-18). Buy comes later. */
class SellFromWaybillTest extends TestCase
{
    use DatabaseTransactions;

    private Job $job;
    private string $awbId = '17655443322';

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Sell Co', 'code' => 'SEL', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'Priya', 'email' => 'priya-sel@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        auth()->guard('user-api')->login($user);
        $enquiry = Enquiry::create(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'converted', 'enquiry_no' => 'ENQA-SELBOM-26-0001']);
        $this->job = Job::create(['agent_id' => $branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-SELBOM-26-0001', 'awb_number' => '176-55443322', 'status' => 'Intake']);

        DB::table('air_way_bills')->insert(['id' => $this->awbId, 'awb_code' => '176', 'awb_no' => '55443322',
            'agent_id' => $branch->id, 'job_id' => $this->job->id, 'status' => 'draft', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('way_bill_consignment_data')->insert(['awb_id' => $this->awbId, 'agent_id' => $branch->id,
            'pieces' => 10, 'gross_weight' => 102, 'chargable_weight' => 120, 'rate' => 85, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('payment_info')->insert(['awb_id' => $this->awbId, 'currency' => 'INR', 'weight_charge' => 10200,
            'other_charges_due_agent_prepaid' => 1500, 'other_charges_due_agent_collect' => 0,
            'other_charges_due_carrier_prepaid' => 0, 'other_charges_due_carrier_collect' => 750, 'created_at' => now(), 'updated_at' => now()]);
    }

    private function lines()
    {
        return AccountsInvoiceItem::whereIn('invoice_id', AccountsInvoice::withoutTenantScope()->where('job_id', $this->job->id)->select('id'))
            ->orderBy('id')->get();
    }

    public function test_the_freight_and_other_charges_become_sell_lines_and_follow_every_save(): void
    {
        app(SellFromWaybill::class)->refresh($this->awbId);

        $lines = $this->lines();
        $this->assertSame(['air_freight', 'miscellaneous', 'miscellaneous'], $lines->pluck('charge_type')->all());
        // 120 kg × 85
        $this->assertSame('10200.00', $lines[0]->amount);
        $this->assertStringContainsString('AWB 176-55443322, 120 kg', $lines[0]->description);
        $this->assertSame(['1500.00', '750.00'], [$lines[1]->amount, $lines[2]->amount]);

        // The rate changes on the draft: the same lines are rewritten, not doubled.
        DB::table('way_bill_consignment_data')->where('awb_id', $this->awbId)->update(['rate' => 90]);
        app(SellFromWaybill::class)->refresh($this->awbId);

        $this->assertCount(3, $this->lines());
        $this->assertSame('10800.00', $this->lines()[0]->amount);
    }

    /** A line somebody typed is never touched, and a posted invoice is never rewritten. */
    public function test_typed_lines_stay_and_a_posted_invoice_is_left_alone(): void
    {
        app(SellFromWaybill::class)->refresh($this->awbId);
        $invoice = AccountsInvoice::withoutTenantScope()->where('job_id', $this->job->id)->first();

        AccountsInvoiceItem::create(['invoice_id' => $invoice->id, 'charge_type' => 'cartage', 'description' => 'Cartage, typed in',
            'quantity' => 1, 'rate' => 2000, 'amount' => 2000, 'tax_status' => 'taxable', 'tax_percentage' => 0, 'tax_amount' => 0, 'net_amount' => 2000]);

        app(SellFromWaybill::class)->refresh($this->awbId);
        $this->assertCount(4, $this->lines(), 'the three from the waybill, and the one typed in');
        $this->assertTrue($this->lines()->contains('description', 'Cartage, typed in'));

        $invoice->forceFill(['status' => 'posted'])->save();
        DB::table('way_bill_consignment_data')->where('awb_id', $this->awbId)->update(['rate' => 999]);

        $this->assertSame(0, app(SellFromWaybill::class)->refresh($this->awbId));
        $this->assertSame('10200.00', $this->lines()->firstWhere('charge_type', 'air_freight')->amount);
    }

    /** A waybill that belongs to no shipment has no cost sheet to write to. */
    public function test_an_unlinked_waybill_writes_nothing(): void
    {
        DB::table('air_way_bills')->where('id', $this->awbId)->update(['job_id' => null]);

        $this->assertSame(0, app(SellFromWaybill::class)->refresh($this->awbId));
        $this->assertCount(0, $this->lines());
    }
}
