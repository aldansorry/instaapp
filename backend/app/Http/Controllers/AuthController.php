<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    private function tokenCookie(string $token)
    {
        $minutes = 60 * 24 * 7;
        return cookie(
            'jwt_token',
            $token,
            $minutes,
            null,
            null,
            false,
            true,
            false,
            'Lax'
        );
    }

    private function clearTokenCookie()
    {
        return cookie('jwt_token', '', -1, null, null, false, true, false, 'Lax');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201)->cookie($this->tokenCookie($token));
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!$token = JWTAuth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        return response()->json([
            'token' => $token,
            'user' => auth()->user(),
        ])->cookie($this->tokenCookie($token));
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Logged out'])->cookie($this->clearTokenCookie());
    }
}
