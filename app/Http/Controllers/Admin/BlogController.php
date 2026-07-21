<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource for public view.
     */
    public function index(Request $request)
    {
        if (!$request->is('api/superadmin/*') && !$request->is('superadmin/*')) {
            $blogs = Blog::whereNotNull('published_at')
                ->orderBy('published_at', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $blogs = Blog::orderBy('created_at', 'desc')->get();
        }
        
        return response()->json([
            'success' => true,
            'data' => $blogs
        ]);
    }

    /**
     * Display the specified blog by slug for public details page.
     */
    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)->whereNotNull('published_at')->first();

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found.'
            ], 404);
        }

        // Increment view count
        $blog->increment('views_count');

        return response()->json([
            'success' => true,
            'data' => $blog
        ]);
    }

    /**
     * Store a newly created blog post (SuperAdmin Only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'read_time' => 'required|string',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'takeaways' => 'nullable|array',
            'image' => 'required|file|mimes:webp,png,jpeg,jpg|max:2048'
        ]);

        $slug = Str::slug($request->title);
        
        // Ensure unique slug
        $count = Blog::where('slug', 'LIKE', $slug . '%')->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Generate standard semantic name
            $filename = $slug . '-' . time() . '.' . $file->getClientOriginalExtension();
            
            // Direct drop into target public directory requested by user
            $destinationPath = public_path('media/assets/blog');
            
            if (!File::isDirectory($destinationPath)) {
                File::makeDirectory($destinationPath, 0775, true, true);
            }

            $file->move($destinationPath, $filename);
            $imagePath = '/media/assets/blog/' . $filename;
        }

        $publishedAt = filter_var($request->input('is_draft'), FILTER_VALIDATE_BOOLEAN) ? null : now();

        $blog = Blog::create([
            'title' => $request->title,
            'slug' => $slug,
            'category' => $request->category,
            'read_time' => $request->read_time,
            'excerpt' => $request->excerpt,
            'content' => $request->content,
            'meta_title' => $request->meta_title ?: $request->title,
            'meta_description' => $request->meta_description ?: $request->excerpt,
            'takeaways' => $request->takeaways,
            'image_path' => $imagePath,
            'published_at' => $publishedAt
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully!',
            'data' => $blog
        ]);
    }

    /**
     * Update existing entry.
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'read_time' => 'required|string',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|file|mimes:webp,png,jpeg,jpg|max:2048'
        ]);

        $data = $request->only([
            'title', 'category', 'read_time', 'excerpt', 'content', 
            'meta_title', 'meta_description', 'takeaways'
        ]);

        if ($request->has('is_draft')) {
            $isDraft = filter_var($request->input('is_draft'), FILTER_VALIDATE_BOOLEAN);
            $data['published_at'] = $isDraft ? null : ($blog->published_at ?: now());
        }

        // Re-slug if title changed
        if ($request->title !== $blog->title) {
            $slug = Str::slug($request->title);
            $count = Blog::where('slug', 'LIKE', $slug . '%')->where('id', '!=', $id)->count();
            $data['slug'] = ($count > 0) ? $slug . '-' . ($count + 1) : $slug;
        }

        if ($request->hasFile('image')) {
            // Delete old file optionally, keeping existing ones for safety standard here unless requested to purge
            $file = $request->file('image');
            $filename = ($data['slug'] ?? $blog->slug) . '-' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('media/assets/blog'), $filename);
            $data['image_path'] = '/media/assets/blog/' . $filename;
        }

        $blog->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Blog updated successfully!',
            'data' => $blog
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        // Soft or hard delete? Standard is hard for basic CMS unless asked.
        $blog->delete();
        return response()->json([
            'success' => true,
            'message' => 'Blog deleted successfully.'
        ]);
    }
}
