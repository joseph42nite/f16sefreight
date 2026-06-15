<?php

namespace App\Providers;

use App\Job;
use App\AccountsInvoice;
use App\Observers\JobObserver;
use App\Observers\InvoiceObserver;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Bind EnquirySequenceService as a singleton so sequence state
        // is consistent within a single request lifecycle.
        $this->app->singleton(\App\Services\EnquirySequenceService::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Register Eloquent observers
        Job::observe(JobObserver::class);
        AccountsInvoice::observe(InvoiceObserver::class);

        // Polymorphic morph maps — resolves source_type strings in audit_logs
        // and ledger_entries to concrete model classes. Prevents class name
        // leakage and ensures consistent aliases across environments.
        Relation::morphMap([
            'AWB'             => \App\AirwayBills::class,
            'HAWB'            => \App\HousewayBills::class,
            'Invoice'         => \App\AccountsInvoice::class,
            'DebitNote'       => \App\AccountsInvoice::class,
            'CreditNote'      => \App\AccountsInvoice::class,
            'PurchaseVoucher' => \App\AccountsPurchaseVoucher::class,
        ]);
    }
}

