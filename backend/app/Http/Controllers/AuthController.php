<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('taskly-token')->plainTextToken;
        
        return response()->json([
            'message' => 'Register Berhasil',
            'user' => $user,
            'token' => $token
        ],201);
    }

    public function login(Request $request) {
        $request->validate([
            'akun' => 'required|string',
            'password' => 'required|string',
        ]);
        
        $user = User::where('email', $request->akun)->orWhere('name', $request->akun)->first();

        if(!$user) {
            return response()->json([
                'message' => 'Nama atau Email Salah!',
            ],401);
        }
        
        if(!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Password Salah!',
            ],401);
        }

        $token = $user->createToken('taskly-token')->plainTextToken;

        return response()->json([
            'message' => 'Login Berhasil',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function user(Request $request) {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout Berhasil',
        ]);
    }
}
