<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A message keeps its full recipient list.
 *
 * 🔴 `to` was `varchar(255)` holding a comma-joined list. A freight thread routinely
 * carries the client, two of their staff, the airline and two internal addresses — six
 * addresses at ~30 characters each is already at the ceiling, and past it MySQL either
 * truncates silently or errors, depending on the connection's strict mode. Either way the
 * recipient list is the wrong thing to lose: it is who was on the conversation.
 *
 * 🔴 `cc` did not exist at any layer — not in the Graph `$select`, not on
 * `NormalisedMessage`, not here. Reply-all is impossible without it, and so is
 * "start a new mail with the same people in CC" (GAPS #47).
 *
 * ⚠️ `bcc` is stored but will almost always be empty on INBOUND mail, and that is correct
 * rather than broken: a blind copy is not disclosed to recipients, so Graph only returns
 * it on the sender's own copy of a message. It is here for the outbound half.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_messages', function (Blueprint $table) {
            // TEXT, not a longer varchar: a distribution list has no useful upper bound,
            // and guessing one is what produced the 255 in the first place.
            $table->text('cc')->nullable()->after('to');
            $table->text('bcc')->nullable()->after('cc');
        });

        // Widened separately — changing a column's type needs doctrine/dbal on Laravel 9,
        // so this is raw DDL by necessity rather than by preference.
        Schema::getConnection()->statement('ALTER TABLE email_messages MODIFY `to` TEXT NULL');
    }

    public function down(): void
    {
        Schema::table('email_messages', function (Blueprint $table) {
            $table->dropColumn(['cc', 'bcc']);
        });

        // ⚠️ Narrowing back TRUNCATES any row already over 255 characters. Accepted only
        // because this is a development rollback path; the up() direction is the one that
        // runs anywhere real.
        Schema::getConnection()->statement('ALTER TABLE email_messages MODIFY `to` VARCHAR(255) NULL');
    }
};
