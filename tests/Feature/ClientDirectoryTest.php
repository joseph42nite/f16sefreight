<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** The client page (user, 2026-09-16): accounts figures only on Command; the name and details editable. */
class ClientDirectoryTest extends TestCase
{
    use DatabaseTransactions;

    private function tenant(string $tier): array
    {
        $company = Company::create(['name' => "Dir {$tier}", 'code' => strtoupper(substr($tier, 0, 3)) . 'D', 'tier' => $tier]);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $customer = Customer::create(['company_id' => $company->id, 'name' => 'globex.test', 'email_domain' => 'globex.test',
            'gst_no' => '27AAACG1234F1Z5', 'credit_limit' => 500000, 'payment_terms_days' => 30]);

        return [$company, $branch, $customer];
    }

    private function as(Company $company, Agent $branch, string $designation): self
    {
        $user = User::create(['name' => $designation, 'email' => "{$designation}-{$company->code}-dir@test.local", 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => $designation, 'is_active' => 1]);
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);

        return $this;
    }

    public function test_tactical_shows_the_domain_and_name_but_no_accounts_figures(): void
    {
        [$company, $branch, $customer] = $this->tenant('tactical');

        $row = $this->as($company, $branch, 'pricing')->getJson('http://focusair.localhost/api/customers')
            ->assertOk()->assertJsonPath('with_accounts', false)->json('data.0');

        $this->assertSame('globex.test', $row['email_domain']);
        foreach (['gst_no', 'pan_no', 'credit_limit', 'payment_terms_days'] as $field) {
            $this->assertArrayNotHasKey($field, $row);
        }

        // The name is written in; an accounts figure sent anyway is not stored.
        $this->putJson("http://focusair.localhost/api/customers/{$customer->id}", ['name' => 'Globex Industries', 'email_domain' => 'globex.test', 'credit_limit' => 1])
            ->assertOk()->assertJsonPath('name', 'Globex Industries')->assertJsonMissingPath('credit_limit');
        $this->assertEquals(500000, $customer->fresh()->credit_limit);
    }

    public function test_command_shows_and_edits_the_accounts_figures(): void
    {
        [$company, $branch, $customer] = $this->tenant('command');

        $this->as($company, $branch, 'accounts')->getJson('http://accounts.localhost/api/customers')
            ->assertOk()->assertJsonPath('with_accounts', true)->assertJsonPath('data.0.gst_no', '27AAACG1234F1Z5');

        $this->putJson("http://accounts.localhost/api/customers/{$customer->id}", ['name' => 'Globex', 'credit_limit' => 750000])->assertOk();
        $this->assertEquals(750000, $customer->fresh()->credit_limit);
    }

    public function test_operations_cannot_add_or_edit_clients(): void
    {
        [$company, $branch, $customer] = $this->tenant('tactical');

        $this->as($company, $branch, 'operations')->putJson("http://focusair.localhost/api/customers/{$customer->id}", ['name' => 'x'])->assertForbidden();
    }

    private function mailbox(Agent $branch): \App\MailboxConnection
    {
        $owner = User::create(['name' => 'desk', 'email' => 'desk-' . $branch->id . '-dir@test.local', 'password' => 'x',
            'company_name' => $branch->company_id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);

        return \App\MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $branch->id, 'user_id' => $owner->id,
            'email_address' => 'desk-' . $branch->id . '@forwarder.test', 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected']);
    }

    private function receive(\App\MailboxConnection $mailbox, string $from, array $cc = []): void
    {
        app(\App\Services\Mail\MessageIngestor::class)->ingest($mailbox, [new \App\Services\Mail\NormalisedMessage(
            messageId: '<' . uniqid('', true) . '@dir.test>', threadId: null, from: $from, to: [$mailbox->email_address], cc: $cc, bcc: [],
            subject: 'Quote ' . uniqid(), snippet: 'Please quote.', receivedAt: now(), direction: 'inbound',
        )]);
    }

    /** 🔴 Every address on the client's domain — sender or copied — is saved to its contacts; others are not. */
    public function test_mail_addresses_from_a_clients_domain_are_saved(): void
    {
        [$company, $branch, $customer] = $this->tenant('tactical');
        $mailbox = $this->mailbox($branch);

        $this->receive($mailbox, 'shipping@globex.test', ['accounts@globex.test', 'broker@otherco.test']);
        $this->receive($mailbox, 'Shipping@Globex.test');

        $contacts = \App\CustomerContact::where('customer_id', $customer->id)->orderBy('email')->get();
        $this->assertSame(['accounts@globex.test', 'shipping@globex.test'], $contacts->pluck('email')->all());
        $this->assertSame([1, 2], $contacts->pluck('message_count')->all());
        $this->assertFalse($contacts->contains('include_in_cc', true), 'being copied is a person\'s decision');

        $this->as($company, $branch, 'sales')->getJson("http://focusair.localhost/api/customers/{$customer->id}/contacts")
            ->assertOk()->assertJsonPath('contacts.0.email', 'shipping@globex.test');
    }

    /** Writing in a client's domain gathers the mail already received from it. */
    public function test_adding_a_client_gathers_addresses_from_mail_already_received(): void
    {
        [$company, $branch] = $this->tenant('tactical');
        $this->receive($this->mailbox($branch), 'ops@initech.test', ['finance@initech.test']);

        $id = $this->as($company, $branch, 'pricing')->postJson('http://focusair.localhost/api/customers', ['name' => 'Initech', 'email_domain' => 'initech.test'])
            ->assertCreated()->json('id');

        $this->assertSame(['finance@initech.test', 'ops@initech.test'], \App\CustomerContact::where('customer_id', $id)->orderBy('email')->pluck('email')->all());
    }

    /** Enquiries, Tactical: the client is its domain for pricing and sales (the roles with this page), with no key to a client record. */
    public function test_tactical_enquiries_show_the_domain_as_the_client(): void
    {
        [$company, $branch, $customer] = $this->tenant('tactical');
        $customer->update(['name' => 'Globex Industries']);
        \App\Enquiry::create(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'new', 'customer_id' => $customer->id, 'enquiry_no' => 'ENQA-TACD-26-0001']);

        foreach (['pricing', 'sales'] as $role) {
            $row = $this->as($company, $branch, $role)->getJson('http://focusair.localhost/api/enquiries')->assertOk()->json('data.0');

            $this->assertSame(['globex.test', null], [$row['client_label'], $row['customer_id']], $role);
            $this->assertArrayNotHasKey('customer', $row, $role);
        }
    }

    /** Enquiries, Command: the client's name, with the client record it links to. */
    public function test_command_enquiries_show_the_client_name(): void
    {
        [$company, $branch, $customer] = $this->tenant('command');
        $customer->update(['name' => 'Globex Industries']);
        \App\Enquiry::create(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'new', 'customer_id' => $customer->id, 'enquiry_no' => 'ENQA-COMD-26-0001']);

        foreach (['pricing', 'sales'] as $role) {
            $row = $this->as($company, $branch, $role)->getJson('http://focusair.localhost/api/enquiries')->assertOk()->json('data.0');

            $this->assertSame(['Globex Industries', $customer->id, 'globex.test'], [$row['client_label'], $row['customer_id'], $row['client_domain']], $role);
        }
    }

    /** 🔴 Sales see who in pricing is on an enquiry; pricing's own board does not repeat their name. */
    public function test_sales_see_the_pricing_owner_on_the_enquiries_page(): void
    {
        [$company, $branch, $customer] = $this->tenant('tactical');
        $pricing = \App\User::create(['name' => 'Priya Nair', 'email' => 'owner-tac-dir@test.local', 'password' => 'x',
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        \App\Enquiry::create(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'new', 'customer_id' => $customer->id,
            'pricing_id' => $pricing->id, 'enquiry_no' => 'ENQA-TACD-26-0009']);

        $this->as($company, $branch, 'sales')->getJson('http://focusair.localhost/api/enquiries')
            ->assertOk()->assertJsonPath('data.0.pricing_owner', 'Priya Nair');

        $this->as($company, $branch, 'pricing')->getJson('http://focusair.localhost/api/enquiries')
            ->assertOk()->assertJsonPath('data.0.pricing_owner', null);
    }
}
