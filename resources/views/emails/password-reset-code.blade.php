@component('mail::message')
# Your password reset code

Someone asked to reset the password for this address. Type this code on the sign-in page:

@component('mail::panel')
**{{ $code }}**
@endcomponent

The code works once, for {{ $minutes }} minutes. If it was not you, ignore this message and nothing changes.
Nobody from F16s will ever ask you for this code.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
