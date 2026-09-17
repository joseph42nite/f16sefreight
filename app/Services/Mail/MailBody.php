<?php

namespace App\Services\Mail;

use HTMLPurifier;
use HTMLPurifier_Config;

/**
 * A composed body, made safe to store and to send (PRD §5.2.4).
 *
 * 🔴 HTMLPURIFIER IS THE BOUNDARY, not the editor. TipTap keeps the composer to eight
 * formatting primitives, but a request can be sent without it; anything else is removed here.
 *
 * ⚠️ EMAIL HTML IS NOT WEB HTML. Outlook renders with Word's engine, so the body is wrapped in
 * a single 600px table with inline styles only — no `<style>` block, no flexbox, no web fonts.
 */
class MailBody
{
    /** The eight primitives, as markup: bold, italic, underline, two lists, link, quote — and paragraphs. */
    private const ALLOWED = 'p,br,strong,b,em,i,u,ul,ol,li,a[href],blockquote';

    private const FONT = 'font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1f2933;';

    /** Only the allowed markup survives. Plain text (no tags) keeps its line breaks. */
    public function clean(?string $html): string
    {
        $html = (string) $html;

        if ($html === strip_tags($html)) {
            $html = nl2br(e($html), false);
        }

        // 🔴 A blank line typed in the editor is an EMPTY paragraph, which has no height in any mail client — the gap
        // the sender left vanished (user, 2026-09-17: "the spacing is to be maintained"). A line break keeps it.
        $html = preg_replace('#<p>\s*</p>#i', '<p><br></p>', $html);

        return trim($this->purifier()->purify($html));
    }

    /**
     * A received or sent mail as it was written, safe to show (user, 2026-09-17: "respect the spacing, bold and
     * colours the way the mail is sent"). Much wider than the composer's eight primitives — tables, colours, sizes,
     * alignment, spacing and images stay — and still no scripts, forms, frames or event handlers.
     */
    public function forDisplay(?string $html): string
    {
        $config = HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', 'div[style|align],span[style],p[style|align],br,hr[style],b[style],strong[style],i[style],em[style],u[style],s[style],strike,sub,sup,'
            . 'font[color|size|face|style],h1[style],h2[style],h3[style],h4[style],h5[style],h6[style],pre[style],code,'
            . 'blockquote[style],ul[style],ol[style],li[style],a[href|style|title],center[style],small[style],big[style],'
            . 'table[style|width|border|cellpadding|cellspacing|align|bgcolor],thead,tbody,tfoot,tr[style|bgcolor],'
            . 'td[style|width|colspan|rowspan|align|valign|bgcolor],th[style|width|colspan|rowspan|align|valign|bgcolor],'
            . 'img[src|alt|width|height|style]');
        $config->set('CSS.AllowedProperties', ['color', 'background-color', 'background', 'font-weight', 'font-style',
            'font-size', 'font-family', 'text-decoration', 'text-align', 'line-height', 'margin', 'margin-top',
            'margin-bottom', 'margin-left', 'margin-right', 'padding', 'padding-top', 'padding-bottom', 'padding-left',
            'padding-right', 'border', 'border-top', 'border-bottom', 'border-left', 'border-right', 'border-collapse',
            'width', 'height', 'vertical-align', 'white-space', 'list-style-type']);
        $config->set('CSS.MaxImgLength', null);
        $config->set('HTML.MaxImgLength', null);
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true, 'data' => true]);
        $config->set('Cache.DefinitionImpl', null);

        return trim((new HTMLPurifier($config))->purify((string) $html));
    }

    /**
     * The body as it goes out: cleaned, styled inline, with the signature below it.
     *
     * @param  ?string  $signatureHtml  already cleaned, or null for none
     */
    public function forEmail(string $html, ?string $signatureHtml = null): string
    {
        $body = $this->inlineStyles($this->clean($html));

        if ($signatureHtml !== null && trim(strip_tags($signatureHtml)) !== '') {
            $body .= '<div style="margin-top:16px;color:#52606d;">'
                . $this->inlineStyles($this->clean($signatureHtml)) . '</div>';
        }

        return '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" '
            . 'style="max-width:600px;"><tr><td style="' . self::FONT . '">' . $body . '</td></tr></table>';
    }

    /** A plain-text signature (users.signature_text) as the same safe markup. */
    public function fromText(?string $text): ?string
    {
        return blank($text) ? null : nl2br(e($text), false);
    }

    private function inlineStyles(string $html): string
    {
        return strtr($html, [
            '<p>'          => '<p style="margin:0 0 10px;">',
            '<blockquote>' => '<blockquote style="margin:0 0 10px 8px;padding-left:10px;border-left:3px solid #d0d5dd;color:#52606d;">',
            '<ul>'         => '<ul style="margin:0 0 10px;padding-left:24px;">',
            '<ol>'         => '<ol style="margin:0 0 10px;padding-left:24px;">',
        ]);
    }

    private function purifier(): HTMLPurifier
    {
        $config = HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', self::ALLOWED);
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true]);
        // No definition cache on disk: the allow-list is tiny and a cache directory is one more
        // thing to make writable on every deploy.
        $config->set('Cache.DefinitionImpl', null);

        return new HTMLPurifier($config);
    }
}
