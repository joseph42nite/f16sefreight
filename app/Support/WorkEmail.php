<?php

namespace App\Support;

/**
 * Work emails only, for the landing page's "Talk to us" form (owner, 2026-11-16: "only allow if they have a real
 * domain name, not gmail or outlook.in, so we can filter").
 *
 * An address passes when its domain is not a free mailbox provider and the domain can actually receive mail (it has an
 * MX record, or at least an A record). The same list lives in resources/js/src/view/pages/public/components/workEmail.js
 * so the form can say so before it is sent; this class is the one that decides.
 */
final class WorkEmail
{
    /** Free mailbox providers, exact domains. */
    private const FREE = [
        'gmail.com', 'googlemail.com',
        'outlook.com', 'outlook.in', 'hotmail.com', 'hotmail.co.in', 'hotmail.co.uk', 'live.com', 'live.in', 'msn.com',
        'yahoo.com', 'yahoo.co.in', 'yahoo.in', 'yahoo.co.uk', 'ymail.com', 'rocketmail.com',
        'icloud.com', 'me.com', 'mac.com', 'aol.com',
        'proton.me', 'protonmail.com', 'pm.me', 'tutanota.com', 'tuta.io', 'hey.com', 'fastmail.com',
        'zoho.com', 'zohomail.com', 'zohomail.in', 'gmx.com', 'gmx.net', 'mail.com', 'email.com', 'inbox.com',
        'yandex.com', 'yandex.ru', 'mail.ru', 'rediffmail.com', 'rediff.com', 'qq.com', '163.com', '126.com', 'sina.com',
    ];

    /** Providers that run many country domains: gmail.*, outlook.*, hotmail.*, live.*, yahoo.*. */
    private const FREE_FAMILY = '/^(gmail|googlemail|outlook|hotmail|live|yahoo|ymail|icloud|aol|proton(mail)?|yandex|gmx|rediff(mail)?)\./i';

    public const MESSAGE = 'Please use your work email (name@yourcompany.com). Personal addresses like Gmail or Outlook aren\'t accepted.';

    public const NOT_REAL = 'We couldn\'t find that email\'s domain. Please check the spelling of your work email.';

    public static function domain(string $email): string
    {
        $at = strrpos($email, '@');

        return $at === false ? '' : strtolower(trim(substr($email, $at + 1)));
    }

    public static function isFreeProvider(string $email): bool
    {
        $domain = self::domain($email);

        return $domain === '' || in_array($domain, self::FREE, true) || preg_match(self::FREE_FAMILY, $domain) === 1;
    }

    /** The domain can receive mail. A lookup that can't run (no DNS) is not held against the sender. */
    public static function domainIsReal(string $email): bool
    {
        $domain = self::domain($email);
        if ($domain === '' || strpos($domain, '.') === false) {
            return false;
        }
        if (!function_exists('checkdnsrr')) {
            return true;
        }

        return checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A');
    }

    public static function passes(string $email): bool
    {
        return !self::isFreeProvider($email) && self::domainIsReal($email);
    }
}
