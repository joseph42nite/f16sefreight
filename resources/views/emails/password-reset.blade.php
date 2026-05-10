@component('mail::message')
# FAcheck

Forgot password link


@component('mail::button', ['url' => 'https://facheck.com/PasswordForgotForm/'.$token.'/'.$email.'/'.$userType])
Click here
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent