<?php

namespace App\Http\Controllers;

use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * POST - /register
     * Register new user
     * 
     * Body:
     * 1. email - string
     * 2. password - string
     */
    public function register(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|unique:user2|email',
            'password' => 'required|min:6'
        ]);

        $email = $request->input('email');
        $password = Hash::make($request->input('password'));

        User::create([
            'email' => $email,
            'password' => $password
        ]);

        return response()->json([
            'message' => 'Pendaftaran berhasil'
        ], 201);
    }

    /**
     * POST - /login
     * Login into the app
     * 
     * Body:
     * 1. email - string
     * 2. password - string
     */
    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Periksa kembali informasi Anda'], 401);
        }

        $isValidPassword = Hash::check($password, $user->password);
        if (!$isValidPassword) {
            return response()->json(['message' => 'Periksa kembali informasi Anda'], 401);
        }

        $generateToken = bin2hex(random_bytes(40));
        $dateNow = new DateTime();
        $expDate = $user->token_exp;

        $dateNowTime = $dateNow->getTimestamp();
        $expDateTime = strtotime($expDate);
        $interval = ($expDateTime - $dateNowTime) / 86400;

        if ($interval < 10) {
            $user->update([
                'token' => $generateToken,
                'token_exp' => $dateNow->modify("+60 day")->format("Y-m-d H:i:s")
            ]);
        }

        return response()->json($user);
    }

    /**
     * POST - /session
     * Checking the token session
     * 
     * Header:
     * 1. X-Auth-Landslide
     */
    public function session(Request $request)
    {
        $token = $request->header('X-Auth-Landslide');

        $user = User::where('token', $token)->first();
        if (!$user) {
            return response()->json(['message' => 'Periksa kembali informasi Anda'], 401);
        }

        $generateToken = bin2hex(random_bytes(40));
        $dateNow = new DateTime();
        $expDate = $user->token_exp;

        $dateNowTime = $dateNow->getTimestamp();
        $expDateTime = strtotime($expDate);
        $interval = ($expDateTime - $dateNowTime) / 86400;

        if ($interval < 10) {
            $user->update([
                'token' => $generateToken,
                'token_exp' => $dateNow->modify("+60 day")->format("Y-m-d H:i:s")
            ]);
        }

        return response()->json($user);
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    //
}
