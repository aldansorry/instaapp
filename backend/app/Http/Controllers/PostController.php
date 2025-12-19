<?php
namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\PostLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $eager = [
            'user:id,name',
            'comments.user:id,name',
        ];
        $posts = Post::with($eager)
            ->withExists('liked_by_user')
            ->withCount('likes')
            ->latest()
            ->get();

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string|max:2000',
            'image'   => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $imagePath = $request->file('image')->store('posts', 'public');

            $post = Post::create([
                'content'    => $data['content'],
                'user_id'    => auth()->id(),
                'image_path' => $imagePath,
            ]);

            # set relation and defaul value
            $post->load('user:id,name');
            $post->likes_count          = 0;
            $post->liked_by_user_exists = false;
            $post->image_url            = $post->image_url;
            $post->setRelation('comments', collect());

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();

            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $e;
        }
        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403, 'Permission Required.');
        }

        $data = $request->validate([
            'content' => 'required|string|max:2000',
            'image'   => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        DB::beginTransaction();

        try {
            if ($request->hasFile('image')) {
                if ($post->image_path) {
                    $old_image = $post->image_path;
                }
                $imagePath        = $request->file('image')->store('posts', 'public');
                $post->image_path = $imagePath;
            }

            $post->content = $data['content'];
            $post->save();

            $eager = [
                'user:id,name',
                'comments.user:id,name',
            ];
            $post->load($eager)->loadCount('likes')->loadExists('liked_by_user');

            if (isset($old_image)) {
                Storage::disk('public')->delete($old_image);
            }
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();

            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $e;
        }

        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403, 'Permission Required.');
        }

        DB::beginTransaction();

        try {
            if ($post->image_path) {
                $old_image = $post->image_path;
            }

            $post->delete();
            if (isset($old_image)) {
                Storage::disk('public')->delete($old_image);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();

            throw $e;
        }

        return response()->json(['message' => 'Post deleted']);
    }

    public function like(Post $post)
    {
        $userId   = auth()->id();
        $existing = PostLike::where('post_id', $post->id)->where('user_id', $userId)->first();

        $liked = true;
        if ($existing) {
            $existing->delete();
            $liked = false;
        } else {
            try {
                PostLike::create([
                    'post_id' => $post->id,
                    'user_id' => $userId,
                ]);
            } catch (\Throwable $e) {
                # catch unique do nothing
            }
        }

        $likesCount = PostLike::where('post_id', $post->id)->count();

        return response()->json([
            'liked'       => $liked,
            'likes_count' => $likesCount,
        ]);
    }

    public function comment(Post $post, Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'content' => $data['content'],
        ]);

        $comment->load('user:id,name');

        return response()->json($comment, 201);
    }

    public function deleteComment(Post $post, Comment $comment)
    {
        if ($comment->post_id !== $post->id) {
            abort(404);
        }

        if ($comment->user_id !== auth()->id()) {
            abort(403, 'Permission Required.');
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
