<?php

namespace Tests\Unit;

use App\Support\Inr;
use PHPUnit\Framework\TestCase;

/** Walk 4 #39: server-written sentences group rupees the Indian way, like the screens do. */
class InrTest extends TestCase
{
    /** @dataProvider amounts */
    public function test_rupees_are_grouped_the_indian_way(float $amount, string $expected): void
    {
        $this->assertSame($expected, Inr::format($amount));
    }

    public function amounts(): array
    {
        return [
            'lakhs'     => [785703.0, '7,85,703.00'],
            'limit'     => [514000.0, '5,14,000.00'],
            'thousands' => [5400.0, '5,400.00'],
            'crores'    => [12345678.9, '1,23,45,678.90'],
            'small'     => [0.5, '0.50'],
            'negative'  => [-98765.4, '-98,765.40'],
        ];
    }
}
