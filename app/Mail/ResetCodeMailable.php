<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/** The six-digit code a person types on a portal's sign-in page to choose a new password. */
class ResetCodeMailable extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $code, public int $minutes)
    {
    }

    public function build()
    {
        return $this->subject('Your password reset code')->markdown('emails.password-reset-code');
    }
}
