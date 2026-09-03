<?php

namespace App\Observers;

use App\Partner;
use App\Services\GlobalDomainDirectory;

/**
 * A partner's email domain is an industry fact, captured as a side effect of ordinary work.
 *
 * 🔴 **This is the cheapest signal the product has.** An operator adding "Lufthansa Cargo,
 * airline, ops@lhcargo.test" has just told the platform what that domain is, and it cost
 * them nothing extra. Every other tenant's inbox classifies that airline correctly from
 * then on, without anyone writing a rule.
 *
 * ⚠️ On the OBSERVER, not in the partner controller, so an import or a console command
 * teaches the directory too. Adding a column is only half the change — so is adding a
 * controller.
 */
class PartnerObserver
{
    public function created(Partner $partner): void
    {
        $this->teach($partner);
    }

    public function updated(Partner $partner): void
    {
        // Only when the fact itself changed. Renaming a partner says nothing new about
        // its domain.
        if ($partner->wasChanged('email') || $partner->wasChanged('partner_type')) {
            $this->teach($partner);
        }
    }

    /**
     * ⚠️ Failure is deliberately silent. The directory is an improvement, not a
     * precondition — a partner must save even if the platform learns nothing from it.
     */
    private function teach(Partner $partner): void
    {
        rescue(fn () => app(GlobalDomainDirectory::class)->observePartner($partner), report: false);
    }
}
