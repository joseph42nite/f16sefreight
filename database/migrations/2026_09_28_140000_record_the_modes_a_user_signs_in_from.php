<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The transport modes a person signs in from — ["air"], ["sea"] or both (owner, 2026-09-28).
 *
 * Mail arriving in their mailbox is an enquiry for THAT desk: a mailbox whose owner works from FocusSea gets sea
 * enquiries. Mixed — both, or none recorded yet — files a would-be enquiry as Other for a person to file from
 * their portal, rather than guessing a desk (GAPS #427).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'signed_in_modes')) {
            Schema::table('users', fn (Blueprint $t) => $t->json('signed_in_modes')->nullable());
        }
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('signed_in_modes'));
    }
};
