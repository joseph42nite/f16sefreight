<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\SupportTicket;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * "Talk to a support agent" from the help assistant (PRD §5.10, user 2026-09-14).
 *
 * 🔴 IT IS A TICKET. Connecting raises a `chat` ticket in the support desk queue and the conversation
 * runs on it, so a chat nobody answered is still a ticket somebody will — never a message lost because
 * no agent was online. One open chat per user: asking again returns the same one.
 *
 * 🔒 A user sees and writes to their OWN chats only; anyone else's id is not found.
 */
class SupportChatController extends Controller
{
    /** Open a chat, or return the one already open. The help conversation so far comes with it. */
    public function start(Request $request): JsonResponse
    {
        $data = $request->validate([
            'route' => ['nullable', 'string', 'max:255'],
            'help_transcript' => ['nullable', 'array', 'max:20'],
            'help_transcript.*.question' => ['required_with:help_transcript', 'string', 'max:1000'],
            'help_transcript.*.answer' => ['required_with:help_transcript', 'string', 'max:4000'],
        ]);

        if ($open = $this->openChat()) {
            return response()->json($this->shape($open));
        }

        $context = UserContext::for(auth()->user());

        $ticket = SupportTicket::create([
            'channel' => 'chat',
            'agent_id' => $context->agentId,
            'user_id' => $context->userId,
            'route' => $data['route'] ?? '/',
            'description' => 'Live chat from the help assistant',
            'help_transcript' => $data['help_transcript'] ?? null,
            'status' => 'open',
        ]);

        $ticket->post('system', 'Chat started. An F16s support agent will reply here — you can close Help and come back.');

        return response()->json($this->shape($ticket->fresh()), 201);
    }

    /** The user's open chat, if any — restores the chat and the Help button's badge. */
    public function current(): JsonResponse
    {
        $chat = $this->openChat() ?? SupportTicket::where('user_id', auth()->id())->where('channel', 'chat')
            ->where('status', 'resolved')->where('updated_at', '>=', now()->subDay())
            ->latest('id')->first();

        if ($chat && $chat->status === 'resolved' && $this->unread($chat) === 0) {
            $chat = null;
        }

        return response()->json(['chat' => $chat ? $this->shape($chat, false) : null]);
    }

    /** Messages after `after_id`; reading them marks them read. */
    public function messages(Request $request, int $ticket): JsonResponse
    {
        $chat = $this->mine($ticket);
        $messages = $chat->messages()->where('id', '>', (int) $request->query('after_id', 0))
            ->get(['id', 'sender', 'body', 'created_at']);

        if ($last = $chat->messages()->max('id')) {
            $chat->forceFill(['user_read_message_id' => $last])->save();
        }

        return response()->json(['status' => $chat->status, 'messages' => $messages]);
    }

    public function send(Request $request, int $ticket): JsonResponse
    {
        $data = $request->validate(['body' => ['required', 'string', 'max:4000']]);
        $chat = $this->mine($ticket);

        if ($chat->status === 'resolved') {
            return response()->json(['error' => 'This chat was closed. Start a new one from Help.', 'reason' => 'closed'], 422);
        }

        $message = $chat->post('user', trim($data['body']), auth()->id());

        return response()->json($message->only(['id', 'sender', 'body', 'created_at']), 201);
    }

    /** Agent and system messages after the last one this user read. */
    private function unread(SupportTicket $chat): int
    {
        return $chat->messages()->where('sender', '!=', 'user')->where('id', '>', (int) $chat->user_read_message_id)->count();
    }

    private function openChat(): ?SupportTicket
    {
        return SupportTicket::where('user_id', auth()->id())->where('channel', 'chat')
            ->where('status', '!=', 'resolved')->latest('id')->first();
    }

    private function mine(int $id): SupportTicket
    {
        return SupportTicket::where('id', $id)->where('user_id', auth()->id())->where('channel', 'chat')->firstOrFail();
    }

    private function shape(SupportTicket $chat, bool $withMessages = true): array
    {
        $unread = $this->unread($chat);

        return [
            'id' => $chat->id,
            'status' => $chat->status,
            'unread' => $unread,
            'messages' => $withMessages ? $chat->messages()->get(['id', 'sender', 'body', 'created_at']) : [],
        ];
    }
}
