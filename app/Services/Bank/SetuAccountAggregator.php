<?php

namespace App\Services\Bank;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Setu's Account Aggregator (FIU) API — the only file that knows its shape (PRD §6.4, GAPS #442).
 *
 * ⚠️ **WRITTEN FROM MEMORY OF SETU'S PUBLISHED API, NOT FROM THEIR DOCUMENTATION** — setu.co was not reachable from
 * the machine this was built on. The flow is the Account Aggregator framework's own and is not in doubt:
 *   1. create a CONSENT for the account holder's mobile → Setu returns a page where they approve it
 *   2. the consent turns ACTIVE (a webhook, or asking again)
 *   3. create a data SESSION for a date range → Setu fetches the statement from the bank
 *   4. collect the session when it is ready → the transactions
 * The paths, headers and field names below are what must be confirmed against the sandbox before production. They
 * are all here, so that is a change to this file only.
 *
 * 🔴 READ-ONLY. There is no call here that moves money, and there must never be one: an AA consent does not permit it.
 */
class SetuAccountAggregator
{
    public function configured(): bool
    {
        return collect(config('setu.required'))->every(fn (string $key) => filled(config($this->configKey($key))));
    }

    /** @return string[] the env keys still empty — names only */
    public function missing(): array
    {
        return collect(config('setu.required'))->reject(fn (string $key) => filled(config($this->configKey($key))))->values()->all();
    }

    /**
     * Ask the account holder to share this account's statement.
     *
     * @return array{id: string, url: ?string, status: string}
     */
    public function createConsent(string $mobile, string $from, string $to): array
    {
        $body = $this->send('post', '/consents', [
            'consentDuration' => ['unit' => 'MONTH', 'value' => (string) config('setu.consent_months')],
            'vua' => $mobile,
            'dataRange' => ['from' => $from, 'to' => $to],
        ]);

        if (blank($body['id'] ?? null)) {
            throw new RuntimeException('Setu did not return a consent.');
        }

        return ['id' => (string) $body['id'], 'url' => $body['url'] ?? null, 'status' => strtolower((string) ($body['status'] ?? 'pending'))];
    }

    /** @return array{status: string, expires_at: ?string} */
    public function consent(string $consentId): array
    {
        $body = $this->send('get', '/consents/' . rawurlencode($consentId));

        return [
            'status' => strtolower((string) ($body['status'] ?? 'pending')),
            'expires_at' => $body['detail']['consentExpiry'] ?? $body['consentExpiry'] ?? null,
        ];
    }

    /** Ask for the statement between two dates. @return string the session id */
    public function createSession(string $consentId, string $from, string $to): string
    {
        $body = $this->send('post', '/sessions', [
            'consentId' => $consentId,
            'dataRange' => ['from' => $from, 'to' => $to],
            'format' => 'json',
        ]);

        if (blank($body['id'] ?? null)) {
            throw new RuntimeException('Setu did not start a data session.');
        }

        return (string) $body['id'];
    }

    /**
     * Collect a session.
     *
     * @return array{status: string, accounts: array<int, array{masked: ?string, transactions: array}>}
     *         status: pending · completed · partial · failed · expired
     */
    public function session(string $sessionId): array
    {
        $body = $this->send('get', '/sessions/' . rawurlencode($sessionId));

        $accounts = [];
        foreach ((array) ($body['fips'] ?? []) as $fip) {
            foreach ((array) ($fip['accounts'] ?? []) as $account) {
                $accounts[] = [
                    'masked' => $account['maskedAccNumber'] ?? null,
                    'transactions' => (array) ($account['data']['account']['transactions']['transaction'] ?? []),
                ];
            }
        }

        return ['status' => strtolower((string) ($body['status'] ?? 'pending')), 'accounts' => $accounts];
    }

    /**
     * One transaction in the Account Aggregator's FI schema → one statement line for StatementImporter.
     *
     * 🔴 The reference is Setu's `txnId`, prefixed, so it can never collide with a CSV's UTR for a different line.
     */
    public static function line(array $txn): array
    {
        return [
            'reference' => 'setu:' . ($txn['txnId'] ?? ''),
            'amount' => $txn['amount'] ?? 0,
            'value_date' => $txn['valueDate'] ?? $txn['transactionTimestamp'] ?? null,
            'direction' => strtoupper((string) ($txn['type'] ?? '')) === 'DEBIT' ? 'debit' : 'credit',
            'narration' => $txn['narration'] ?? null,
            // The bank's own reference (UTR, cheque no) is the most useful thing to match on; the AA has no payer field.
            'counterparty' => $txn['reference'] ?? null,
            'currency' => 'INR',
        ];
    }

    private function send(string $method, string $path, array $body = []): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('Setu is not connected yet — ' . implode(', ', $this->missing()) . ' not set.');
        }

        try {
            $response = $this->client()->{$method}(rtrim((string) config('setu.base_url'), '/') . $path, $method === 'get' ? [] : $body);
        } catch (ConnectionException) {
            throw new RuntimeException('Setu is not reachable.');
        }

        if ($response->failed()) {
            throw new RuntimeException('Setu refused the request (HTTP ' . $response->status() . ')'
                . (filled($response->json('errorMsg')) ? ': ' . mb_substr((string) $response->json('errorMsg'), 0, 120) : '.'));
        }

        return (array) $response->json();
    }

    private function client(): PendingRequest
    {
        return Http::acceptJson()->timeout((int) config('setu.timeout'))->withHeaders([
            'x-client-id' => (string) config('setu.client_id'),
            'x-client-secret' => (string) config('setu.client_secret'),
            'x-product-instance-id' => (string) config('setu.product_instance_id'),
        ]);
    }

    /** SETU_AA_CLIENT_ID → setu.client_id */
    private function configKey(string $env): string
    {
        return 'setu.' . strtolower(preg_replace('/^SETU_AA_/', '', $env));
    }
}
