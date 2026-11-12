<?php

namespace App\Support;

use DOMDocument;

/**
 * A DOM document whose `createElement(name, value)` takes the value as TEXT (2026-11-10 audit, L4).
 *
 * 🔴 The built-in one reads the value as XML source, so an address with "&" in it — "M/S RAM & SONS" — is an
 * unterminated entity: PHP warns, Laravel turns the warning into an exception, and the waybill cannot be sent to the
 * airline at all. Here the value is appended as a text node, which escapes it.
 */
class XmlDocument extends DOMDocument
{
    #[\ReturnTypeWillChange]
    public function createElement($localName, $value = '')
    {
        $element = parent::createElement($localName);

        if ($value !== null && $value !== '') {
            $element->appendChild($this->createTextNode((string) $value));
        }

        return $element;
    }
}
