@component('mail::message')
# Reset your password

Someone asked to reset the password for this address. The link works once, for 30 minutes. If it was not you, ignore
this message and nothing changes.

{{-- The address is this app's own (APP_URL), never taken from the request: a forged Host header must not be able to
     point the link, and the token in it, at another site. It used to go to another product's domain. --}}
@component('mail::button', ['url' => rtrim(config('app.url'), '/').'/PasswordForgotForm/'.rawurlencode($token).'/'.rawurlencode($email).'/'.rawurlencode($userType)])
Choose a new password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
