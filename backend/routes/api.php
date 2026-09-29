<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

//Route Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function(){
//Route Logout
Route::post('/logout', [AuthController::class, 'logout']);

//Route User
Route::get('/user', [AuthController::class, 'user']);
});
