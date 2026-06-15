<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InvoiceSequence extends Model
{
    protected $table = 'invoice_sequences';

    protected $fillable = [
        'agent_id',
        'type',
        'fiscal_year',
        'current_value',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public static function nextInvoiceNumber(int $agentId, string $type, string $documentDate): string
    {
        $year = date('Y', strtotime($documentDate));
        
        $prefixMap = [
            'invoice' => 'INV',
            'debit_note' => 'DN',
            'credit_note' => 'CN',
            'brokerage' => 'BRK',
            'consol_invoice' => 'CON',
        ];
        $prefix = $prefixMap[$type] ?? 'INV';

        return \Illuminate\Support\Facades\DB::transaction(function () use ($agentId, $type, $year, $prefix) {
            $sequence = self::where('agent_id', $agentId)
                ->where('type', $type)
                ->where('fiscal_year', $year)
                ->lockForUpdate()
                ->first();

            if (!$sequence) {
                $sequence = self::create([
                    'agent_id' => $agentId,
                    'type' => $type,
                    'fiscal_year' => $year,
                    'current_value' => 0,
                ]);
            }

            $sequence->increment('current_value');
            $sequence->refresh();

            return sprintf('%s-%s-%04d', $prefix, $year, $sequence->current_value);
        });
    }
}
