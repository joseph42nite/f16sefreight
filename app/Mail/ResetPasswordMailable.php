<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMailable extends Mailable
{

    use Queueable, SerializesModels;
    public $token;   // this token that Controller make it to send Email
    public $email;
    public $userType;
    
    public function __construct($token, $email, $userType)
    {
        $this->token = $token;
        $this->email = $email;
        $this->userType = $userType;
    }
   
    
    public function build()
    {
        return $this->markdown('Email.passwordRest')->with([ 
            'token' => $this->token,
            'email' => $this->email,
            'userType' => $this->userType
        ]);
    }
}
