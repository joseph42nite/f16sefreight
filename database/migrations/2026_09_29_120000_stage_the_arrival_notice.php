<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The arrival notice to the consignee is STAGED for a person's approval, never sent by itself (owner, 2026-09-29; GAPS
 * #436). It waits on the notice itself, not on a conversation: every house of a consol shares the consol's enquiry,
 * and so its conversation — one waiting draft per conversation would let one house's notice replace another's.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cargo_arrival_notices', function (Blueprint $table) {
            $table->json('staged_mail')->nullable()->after('notice_number');     // {to, cc, subject, body}
            $table->timestamp('staged_at')->nullable()->after('staged_mail');
            $table->string('decision', 10)->nullable()->after('staged_at');      // sent · skipped
            $table->unsignedBigInteger('decided_by')->nullable()->after('decision');
            $table->timestamp('decided_at')->nullable()->after('decided_by');
        });
    }

    public function down(): void
    {
        Schema::table('cargo_arrival_notices', function (Blueprint $table) {
            $table->dropColumn(['staged_mail', 'staged_at', 'decision', 'decided_by', 'decided_at']);
        });
    }
};
