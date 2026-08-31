<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\BellNotificationService;
use Illuminate\Http\JsonResponse;

/**
 * The bell — ui_ux_guide §5.6.
 *
 * 🔒 No gate beyond authentication, deliberately: a notification is addressed to ONE
 * user by `notifiable_id`, and the query is scoped to the caller. There is no role for
 * which "may not read their own bell" is a sensible rule.
 */
class NotificationController extends Controller
{
    public function __construct(private readonly BellNotificationService $bell) {}

    public function index(): JsonResponse
    {
        $userId = (int) auth()->id();

        return response()->json([
            'unread'        => $this->bell->unreadCount($userId),
            'notifications' => $this->bell->forUser($userId),
        ]);
    }

    /**
     * ⚠️ Idempotent by design. A double-click, or two tabs open on the same bell, must
     * not be an error — the second call simply finds nothing unread to update.
     */
    public function markRead(string $id): JsonResponse
    {
        $this->bell->markRead((int) auth()->id(), $id);

        return response()->json(['unread' => $this->bell->unreadCount((int) auth()->id())]);
    }
}
