<?php

namespace App\Services\Blog;

use HTMLPurifier;
use HTMLPurifier_Config;

/**
 * A blog article's body, safe to print into the public site (2026-11-15 frontend audit, FS6).
 *
 * The public page prints the body as HTML. It was stored exactly as the editor sent it, so a script in it ran for
 * every visitor — and for any signed-in person reading the blog, whose sign-in token is in the browser's storage.
 * Only what the editor's own toolbar can make survives: text styles, headings, lists, links, quotes, code, colours.
 */
class BlogBody
{
    private const ALLOWED = 'p[class|style],br,hr,strong,b,em,i,u,s,strike,sub,sup,h2[class|style],h3[class|style],'
        . 'h4[class|style],ul,ol,li[class|style],blockquote[class|style],pre[class],code,span[class|style],'
        . 'a[href|title|target|rel],img[src|alt|width|height]';

    public function clean(?string $html): string
    {
        $config = HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', self::ALLOWED);
        $config->set('CSS.AllowedProperties', ['color', 'background-color', 'text-align']);
        $config->set('Attr.AllowedFrameTargets', ['_blank']);
        // `data` is images only (the purifier checks the type): the editor embeds a pasted picture that way.
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true, 'data' => true]);
        // No definition cache on disk, as `MailBody`: one less directory to make writable on a deploy.
        $config->set('Cache.DefinitionImpl', null);

        return trim((new HTMLPurifier($config))->purify((string) $html));
    }
}
