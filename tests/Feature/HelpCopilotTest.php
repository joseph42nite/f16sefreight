<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Services\Help\HelpDocumentReader;
use App\Services\Help\HelpIndexer;
use App\SuperAdmin;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use ZipArchive;

/**
 * The help copilot (PRD §5.10, user decisions 2026-09-14): F16s staff upload a document per page,
 * the copilot answers a portal user from those documents only, and can hand over to a ticket.
 */
class HelpCopilotTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;

    private const ARRIVAL_DOC = "# Arrival notice\n\nWhen an arrival notice comes in, open the job and click [[job-documents]]. Then press [[upload-document]] and choose the file.\n\n## Checking it\n\nThe notice appears under Documents.";

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.openrouter.key' => 'test-key', 'services.openrouter.base' => 'https://openrouter.test/api/v1']);
        Cache::forget(\App\Services\Help\HelpSearch::CACHE_KEY);
        DB::table('help_questions')->delete();
        DB::table('help_documents')->delete();
        DB::table('llm_usage_logs')->delete();
        DB::table('ai_budget_settings')->delete();

        $company = Company::create(['name' => 'Help Co', 'code' => 'HLP', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->user = User::create([
            'name' => 'Ops', 'email' => 'ops-help@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'operations', 'is_active' => 1,
        ]);
    }

    /** What the faked chat model answers next. */
    private array $chatAnswer = [];

    private ?\ArrayObject $seen = null;

    /**
     * OpenRouter, faked: a text about arrival notices embeds near [1,0,0], anything else near [0,1,0];
     * the chat model answers `$answer`. Returns the requests, in order.
     *
     * ⚠️ ONE `Http::fake()` per test, reading mutable state: a second call is silently ignored
     * because the first matching stub wins (see MailboxSyncTest).
     */
    private function fakeOpenRouter(array $answer = []): \ArrayObject
    {
        $this->chatAnswer = $answer;

        if ($this->seen !== null) {
            $this->seen->exchangeArray([]);

            return $this->seen;
        }

        $this->seen = $seen = new \ArrayObject();

        Http::fake(function ($request) use ($seen) {
            $seen[] = $request;

            if (str_ends_with($request->url(), '/embeddings')) {
                $vectors = array_map(fn ($text) => ['embedding' => stripos($text, 'arrival') !== false ? [1, 0, 0] : [0, 1, 0]], $request['input']);

                return Http::response(['data' => $vectors, 'model' => 'baai/bge-m3', 'usage' => ['prompt_tokens' => 40, 'cost' => 0.0000004]], 200);
            }

            return Http::response([
                'model' => 'google/gemma-4-31b-it', 'provider' => 'DeepInfra',
                'choices' => [['message' => ['content' => json_encode($this->chatAnswer)]]],
                'usage' => ['prompt_tokens' => 900, 'completion_tokens' => 120, 'cost' => 0.00012],
            ], 200);
        });

        return $seen;
    }

    private function asStaff(): self
    {
        $staff = SuperAdmin::create(['name' => 'Staff', 'email' => 'staff-help-' . uniqid() . '@f16s.test', 'password' => Hash::make('x')]);

        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($staff), 'Accept' => 'application/json']);
    }

    private function asUser(): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->user), 'Accept' => 'application/json']);
    }

    private function upload(string $content = self::ARRIVAL_DOC, string $name = 'jobs.md', string $route = '/jobs')
    {
        return $this->asStaff()->post('http://superadmin.f16sefreight.com/api/superadmin/help-documents', [
            'file' => UploadedFile::fake()->createWithContent($name, $content), 'title' => 'Jobs page', 'route' => $route,
        ], ['Accept' => 'application/json']);
    }

    private function ask(string $question, string $route = '/jobs')
    {
        return $this->asUser()->postJson('http://focusair.localhost/api/help/ask', ['question' => $question, 'route' => $route]);
    }

    // ─── The library ─────────────────────────────────────────────────────────

    public function test_a_markdown_document_is_split_by_heading_and_indexed(): void
    {
        $this->fakeOpenRouter();

        $this->upload()->assertCreated()->assertJsonPath('status', 'indexed')->assertJsonPath('chunk_count', 2);

        $chunks = DB::table('help_chunks')->orderBy('position')->get();
        $this->assertSame('Arrival notice', $chunks[0]->heading);
        $this->assertSame('Arrival notice › Checking it', $chunks[1]->heading);
        $this->assertSame('help_index', DB::table('llm_usage_logs')->value('purpose'));
    }

    /** Re-uploading replaces the document's sections, so the copilot answers from the new version. */
    public function test_reuploading_replaces_the_sections(): void
    {
        $this->fakeOpenRouter();
        $id = $this->upload()->json('id');

        $this->asStaff()->post("http://superadmin.f16sefreight.com/api/superadmin/help-documents/{$id}", [
            'file' => UploadedFile::fake()->createWithContent('jobs.md', "# Only one section\n\nNew text."), 'title' => 'Jobs page', 'route' => '/jobs',
        ], ['Accept' => 'application/json'])->assertOk()->assertJsonPath('chunk_count', 1);

        $this->assertSame(['New text.'], DB::table('help_chunks')->where('help_document_id', $id)->pluck('text')->all());
    }

    public function test_a_word_document_keeps_its_headings(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'docx');
        $zip = new ZipArchive();
        $zip->open($path, ZipArchive::OVERWRITE);
        $zip->addFromString('word/document.xml', '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
            . '<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Arrival notice</w:t></w:r></w:p>'
            . '<w:p><w:r><w:t>Open the job.</w:t></w:r></w:p></w:body></w:document>');
        $zip->close();

        $this->assertSame("# Arrival notice\nOpen the job.", app(HelpDocumentReader::class)->read($path, 'docx'));
    }

    public function test_only_md_and_docx_are_accepted(): void
    {
        $this->upload('text', 'jobs.pdf')->assertStatus(422);
    }

    /** Without a key the document is kept, marked not indexed, with the reason. */
    public function test_without_a_key_the_document_is_kept_but_not_indexed(): void
    {
        config(['services.openrouter.key' => null]);

        $this->upload()->assertCreated()->assertJsonPath('status', 'not_indexed')
            ->assertJsonPath('error', 'the model is not configured (no OPENROUTER_API_KEY)');
    }

    public function test_a_long_section_is_cut_into_overlapping_pieces(): void
    {
        $long = "# Long\n\n" . str_repeat("This is one sentence about the page. ", 200);
        $pieces = app(HelpIndexer::class)->pieces('Page', '/x', $long);

        $this->assertGreaterThan(1, count($pieces));
        $this->assertStringStartsWith('Page › Long (page /x)', $pieces[0]['embed']);
    }

    // ─── Asking ──────────────────────────────────────────────────────────────

    /**
     * 🔴 Answers only from the documents, and a step can only name a button the documents name: an
     * invented target and a page the sections are not about are both dropped.
     */
    public function test_an_answer_keeps_only_buttons_and_pages_the_documents_name(): void
    {
        $this->fakeOpenRouter();
        $this->upload();

        $seen = $this->fakeOpenRouter([
            'found' => true,
            'answer' => 'Open the job, click [[job-documents]], then [[upload-document]].',
            'page' => '/settings',
            'steps' => [
                ['target' => 'job-documents', 'instruction' => 'Open Documents'],
                ['target' => 'magic-button', 'instruction' => 'Invented'],
                ['target' => 'upload-document', 'instruction' => 'Upload the notice'],
            ],
        ]);

        $this->ask('An arrival notice came in, where do I put it?')
            ->assertOk()
            ->assertJsonPath('found', true)
            ->assertJsonPath('answer', 'Open the job, click [[job-documents]], then [[upload-document]].')
            ->assertJsonPath('page', null)
            ->assertJsonPath('steps', [
                ['target' => 'job-documents', 'instruction' => 'Open Documents'],
                ['target' => 'upload-document', 'instruction' => 'Upload the notice'],
            ]);

        $chat = collect($seen)->first(fn ($r) => str_ends_with($r->url(), '/chat/completions'));
        $this->assertSame('deny', $chat['provider']['data_collection']);
        $this->assertStringContainsString('[[job-documents]]', $chat['messages'][1]['content']);

        $this->assertSame(1, DB::table('help_questions')->where('found', true)->count());
        $this->assertSame(['help', 'help'], DB::table('llm_usage_logs')->where('purpose', 'help')->pluck('purpose')->all());
    }

    /** Measured: Gemma marked the controls in its answer and returned no steps — they come from the answer. */
    public function test_steps_come_from_the_answer_when_the_model_lists_none(): void
    {
        $this->fakeOpenRouter();
        $this->upload();
        $this->fakeOpenRouter([
            'found' => true, 'page' => '/jobs', 'steps' => [],
            'answer' => 'Open the job and click [[job-documents]]. Then press [[upload-document]]. Do not press [[made-up]].',
        ]);

        $this->ask('An arrival notice came in, where do I put it?')
            ->assertOk()
            ->assertJsonPath('steps', [
                ['target' => 'job-documents', 'instruction' => 'Open the job and click [[job-documents]].'],
                ['target' => 'upload-document', 'instruction' => 'Then press [[upload-document]].'],
            ])
            ->assertJsonPath('answer', 'Open the job and click [[job-documents]]. Then press [[upload-document]]. Do not press made-up.');
    }

    /**
     * 🔴 Cheap first, fast fallback always (user, 2026-09-14): the answer is asked of economy providers
     * under the price ceiling first; when that fails, the fallback has no ceiling, and the tier is logged.
     */
    public function test_help_asks_economy_first_and_falls_back(): void
    {
        $this->fakeOpenRouter();
        $this->upload();

        $chats = [];
        Http::swap(new \Illuminate\Http\Client\Factory());
        Http::fake(function ($request) use (&$chats) {
            if (str_ends_with($request->url(), '/embeddings')) {
                return Http::response(['data' => [['embedding' => [1, 0, 0]]], 'usage' => ['prompt_tokens' => 10, 'cost' => 0]], 200);
            }

            $chats[] = $request['provider'];

            return count($chats) === 1
                ? Http::response(['error' => ['message' => 'No endpoints found']], 503)
                : Http::response(['model' => 'google/gemma-4-31b-it', 'provider' => 'ModelRun',
                    'choices' => [['message' => ['content' => json_encode(['found' => true, 'answer' => 'Use [[job-documents]].', 'page' => '/jobs', 'steps' => []])]]],
                    'usage' => ['prompt_tokens' => 900, 'completion_tokens' => 50, 'cost' => 0.0012]], 200);
        });

        $this->ask('An arrival notice came in, where do I put it?')->assertOk()->assertJsonPath('found', true);

        $this->assertSame(['prompt' => 0.2, 'completion' => 0.5], $chats[0]['max_price']);
        $this->assertSame(['CoreWeave', 'Chutes', 'DeepInfra', 'Venice'], $chats[0]['order']);
        $this->assertFalse($chats[0]['allow_fallbacks']);
        $this->assertArrayNotHasKey('max_price', $chats[1]);
        $this->assertSame(['ModelRun'], $chats[1]['order']);
        $this->assertSame('fast', DB::table('llm_usage_logs')->where('purpose', 'help')->orderByDesc('id')->value('tier'));
    }

    /** 🔴 Nothing close enough: the model is not called, and the reply offers a ticket. */
    public function test_a_question_the_documents_do_not_cover_is_not_sent_to_the_model(): void
    {
        $this->fakeOpenRouter();
        $this->upload();
        $seen = $this->fakeOpenRouter(['found' => true, 'answer' => 'should not be asked', 'page' => null, 'steps' => []]);

        $this->ask('How do I change my password?')->assertOk()->assertJsonPath('found', false);

        $this->assertFalse(collect($seen)->contains(fn ($r) => str_ends_with($r->url(), '/chat/completions')));
        $this->assertSame(1, DB::table('help_questions')->where('found', false)->count());
    }

    public function test_questions_have_their_own_daily_limit(): void
    {
        DB::table('ai_budget_settings')->insert(['per_user_daily_questions' => 1, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('help_questions')->insert(['user_id' => $this->user->id, 'question' => 'q', 'created_at' => now(), 'updated_at' => now()]);

        $this->ask('anything')->assertStatus(429)->assertJsonPath('reason', 'daily_limit');
    }

    public function test_without_a_key_help_says_so(): void
    {
        config(['services.openrouter.key' => null]);

        $this->ask('anything')->assertStatus(503)->assertJsonPath('reason', 'not_configured');
    }

    /** The ticket carries the conversation the portal recorded. */
    public function test_a_ticket_carries_the_help_conversation(): void
    {
        $this->asUser()->postJson('http://focusair.localhost/api/tickets', [
            'route' => '/jobs', 'description' => 'The bot could not help',
            'help_transcript' => [['question' => 'Where do I put an arrival notice?', 'answer' => "I couldn't find this."]],
        ])->assertCreated()->assertJsonPath('help_transcript.0.question', 'Where do I put an arrival notice?');
    }

    /** 🔒 The library is F16s's: a tenant login cannot change it. */
    public function test_a_tenant_user_cannot_upload_help_documents(): void
    {
        $this->asUser()->post('http://superadmin.f16sefreight.com/api/superadmin/help-documents', [
            'file' => UploadedFile::fake()->createWithContent('x.md', '# x'), 'title' => 'x',
        ], ['Accept' => 'application/json'])->assertStatus(401);
    }
}
