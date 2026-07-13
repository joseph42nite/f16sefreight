<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    /**
     * Send a markdown message to a Telegram chat.
     *
     * @param  string|int  $chatId
     * @param  string  $text
     * @param  array|null  $replyMarkup
     * @return array|null
     */
    public static function sendMessage($chatId, $text, $replyMarkup = null)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');
        if (!$botToken) {
            Log::warning('[TELEGRAM] Bot token not configured.');
            return null;
        }

        try {
            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'Markdown',
                'reply_markup' => $replyMarkup
            ]);

            if ($response->successful()) {
                return $response->json('result');
            }

            Log::error('[TELEGRAM] Send message failed: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('[TELEGRAM] Send message exception: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Edit the text of a previously sent message.
     *
     * @param  string|int  $chatId
     * @param  int  $messageId
     * @param  string  $text
     * @return bool
     */
    public static function editMessageText($chatId, $messageId, $text)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');
        if (!$botToken) return false;

        try {
            $response = Http::post("https://api.telegram.org/bot{$botToken}/editMessageText", [
                'chat_id' => $chatId,
                'message_id' => $messageId,
                'text' => $text,
                'parse_mode' => 'Markdown'
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('[TELEGRAM] Edit message exception: ' . $e->getMessage());
        }

        return false;
    }

    /**
     * Answer a callback query from an inline button interaction.
     *
     * @param  string  $callbackQueryId
     * @param  string  $text
     * @return bool
     */
    public static function answerCallbackQuery($callbackQueryId, $text)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');
        if (!$botToken) return false;

        try {
            $response = Http::post("https://api.telegram.org/bot{$botToken}/answerCallbackQuery", [
                'callback_query_id' => $callbackQueryId,
                'text' => $text
            ]);
            return $response->successful();
        } catch (\Exception $e) {
            Log::error('[TELEGRAM] Answer callback exception: ' . $e->getMessage());
        }

        return false;
    }
}
