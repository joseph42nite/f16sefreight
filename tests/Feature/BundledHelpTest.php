<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/** The guides that ship with the product reach the in-app Help library without an upload (GAPS #445). */
class BundledHelpTest extends TestCase
{
    use DatabaseTransactions;

    public function test_the_payment_guide_is_loaded_for_money_out_once(): void
    {
        config(['services.openrouter.key' => null]);   // no embedding model here: kept, not indexed, with the reason

        $this->artisan('help:load-bundled')->assertSuccessful();
        $this->artisan('help:load-bundled')->assertSuccessful();

        $docs = DB::table('help_documents')->where('filename', 'paying-suppliers-from-your-bank.md')->get();
        $this->assertCount(1, $docs, 'loading twice keeps one document');
        $this->assertSame('/money-out', $docs[0]->route);
        $this->assertStringContainsString('corporate net banking', $docs[0]->content);
    }
}
