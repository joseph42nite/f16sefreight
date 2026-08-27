<?php

namespace App\Providers;

use App\Company;
use App\EmailThread;
use App\Enquiry;
use App\Job;
use App\Observers\EmailThreadObserver;
use App\Observers\EnquiryObserver;
use App\Observers\JobObserver;
use App\Observers\SeaShipmentDetailObserver;
use App\SeaShipmentDetail;
use App\Support\UserContext;
use App\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        $this->registerMorphMap();
        $this->registerObservers();
        $this->bustContextCacheOnSave();
    }

    /**
     * Guide §2.4.
     *
     * 🔴 **The morph map is not cosmetic — it is the stored value.** Without it Eloquent
     * writes the fully-qualified class name into party_type / billed_party_type /
     * source_type, so renaming or moving a class silently orphans every historical row.
     * These short keys are what the migrations and the DDL already document.
     */
    private function registerMorphMap(): void
    {
        Relation::morphMap([
            'invoice'          => \App\AccountsInvoice::class,
            'purchase_voucher' => \App\AccountsPurchaseVoucher::class,
            'awb'              => \App\AirwayBills::class,
            'hawb'             => \App\HousewayBills::class,
            // Party morph — resolves job_entities.party_type, rate_cards.party_type
            // and accounts_invoices.billed_party_type.
            'customer'         => \App\Customer::class,
            'partner'          => \App\Partner::class,
        ]);
    }

    private function registerObservers(): void
    {
        Job::observe(JobObserver::class);
        Enquiry::observe(EnquiryObserver::class);
        EmailThread::observe(EmailThreadObserver::class);
        SeaShipmentDetail::observe(SeaShipmentDetailObserver::class);
    }

    /**
     * Entitlement is re-read per request and memoized (App\Support\UserContext). The TTL
     * is a backstop, not the mechanism — busting on save is what makes a demotion or a
     * tier downgrade take effect on the NEXT request rather than up to five minutes
     * later (guide §3.6).
     */
    private function bustContextCacheOnSave(): void
    {
        User::saved(fn (User $user) => UserContext::forget($user->id));

        Company::saved(function (Company $company) {
            User::whereIn('branch_name', $company->branches()->select('id'))
                ->pluck('id')
                ->each(fn ($id) => UserContext::forget((int) $id));
        });
    }
}
