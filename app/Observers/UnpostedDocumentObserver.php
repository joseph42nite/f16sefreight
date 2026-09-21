<?php

namespace App\Observers;

use App\Services\UnpostedQueue;
use Illuminate\Database\Eloquent\Model;

/**
 * Keeps `unposted_transactions_queue` true for sales documents and purchase vouchers.
 *
 * 🔴 An OBSERVER rather than a call at each creation site: invoices are raised from the cost sheet, from the
 * billing desk and from seeders, and a queue that depends on every one of those remembering to write a row is a
 * queue that is wrong the first time somebody adds a fourth path. The close-of-period guard reads this table.
 */
class UnpostedDocumentObserver
{
    public function __construct(private readonly UnpostedQueue $queue) {}

    public function created(Model $document): void
    {
        $this->queue->track($document);
    }

    public function updated(Model $document): void
    {
        $this->queue->refresh($document);
    }
}
