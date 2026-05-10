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
        'published_at'
    ];

    protected $casts = [
        'takeaways' => 'array',
        'published_at' => 'date'
    ];
}
