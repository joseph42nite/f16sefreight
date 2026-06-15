<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InboundAttachment extends Model
{
    protected $table = 'inbound_attachments';

    protected $fillable = [
        'inbound_email_id',
        'filename',
        'file_path',
        'mime_type',
    ];

    public function inboundEmail()
    {
        return $this->belongsTo(InboundEmail::class, 'inbound_email_id');
    }
}
