<?php

namespace App\Services\Help;

use DOMDocument;
use DOMXPath;
use RuntimeException;
use ZipArchive;

/**
 * An uploaded help document as Markdown-ish text with its headings kept.
 *
 * ⚠️ Headings MATTER: a section is what the copilot finds and cites, so a Word heading becomes
 * `#`, `##` or `###` exactly as a Markdown one would be. A .docx is read straight from its XML —
 * it is a zip — so no Word library is needed for paragraphs and headings.
 */
class HelpDocumentReader
{
    public const FORMATS = ['md', 'markdown', 'docx'];

    public function read(string $path, string $extension): string
    {
        $extension = strtolower($extension);

        if (in_array($extension, ['md', 'markdown'], true)) {
            return $this->clean((string) file_get_contents($path));
        }

        if ($extension === 'docx') {
            return $this->clean($this->docx($path));
        }

        throw new RuntimeException('Only .md and .docx files can be uploaded.');
    }

    private function docx(string $path): string
    {
        $zip = new ZipArchive();

        if ($zip->open($path) !== true || ($xml = $zip->getFromName('word/document.xml')) === false) {
            throw new RuntimeException('This .docx file could not be opened.');
        }

        $zip->close();

        $dom = new DOMDocument();
        // ⚠️ LIBXML_NONET: an uploaded file must not make the server fetch anything.
        $dom->loadXML($xml, LIBXML_NONET);
        $xpath = new DOMXPath($dom);
        $xpath->registerNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');

        $lines = [];

        foreach ($xpath->query('//w:body/w:p') as $paragraph) {
            $text = '';
            foreach ($xpath->query('.//w:t', $paragraph) as $run) {
                $text .= $run->textContent;
            }

            $style = (string) $xpath->evaluate('string(.//w:pStyle/@w:val)', $paragraph);

            // "Heading1", "Heading 2", "Title" → a Markdown heading of that level.
            if (preg_match('/^heading\s*([1-3])$/i', $style, $m)) {
                $text = str_repeat('#', (int) $m[1]) . ' ' . $text;
            } elseif (strcasecmp($style, 'Title') === 0) {
                $text = '# ' . $text;
            } elseif ($xpath->query('.//w:numPr', $paragraph)->length > 0) {
                $text = '- ' . $text;
            }

            $lines[] = $text;
        }

        return implode("\n", $lines);
    }

    private function clean(string $text): string
    {
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        return trim(preg_replace("/\n{3,}/", "\n\n", $text));
    }
}
