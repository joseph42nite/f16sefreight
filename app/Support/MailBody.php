<?php

namespace App\Support;

/**
 * The body of a drafted mail: plain paragraphs turned into the HTML the editor and the mail provider take.
 *
 * Every paragraph is escaped — the text is a model's, or facts read from the database, and neither may bring markup of
 * its own into a mail that goes out under a person's name. (2026-11-10 audit §6: three drafters each had this.)
 */
final class MailBody
{
    /** @param array<int, string> $paragraphs */
    public static function paragraphs(array $paragraphs): string
    {
        return implode('', array_map(fn ($p) => '<p>' . e($p) . '</p>', $paragraphs));
    }
}
