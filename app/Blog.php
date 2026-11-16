<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'read_time',
        'image_path',
        'excerpt',
        'meta_title',
        'meta_description',
        'content',
        'takeaways',
        'published_at',
        'views_count'
    ];

    protected $casts = [
        'takeaways' => 'array',
        'published_at' => 'date'
    ];

    /**
     * Cleaned on the way IN, whoever saves it (2026-11-15 frontend audit, FS6): the public page prints the body as
     * HTML, so nothing that can run may be stored.
     */
    public function setContentAttribute($value): void
    {
        $this->attributes['content'] = $value === null ? null : (new \App\Services\Blog\BlogBody())->clean($value);
    }
}
