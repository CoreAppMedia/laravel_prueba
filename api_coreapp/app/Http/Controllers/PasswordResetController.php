<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetCode;
use Illuminate\Validation\Rules\Password as PasswordRules;


/**
 * Este controlador maneja el proceso de restablecimiento de contraseña, incluyendo el envío de enlaces de restablecimiento y el restablecimiento de contraseñas.
 * 
 * This controller handles the password reset process, including sending reset links and resetting passwords.
 */

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Si su correo electrónico está registrado, recibirá un código de restablecimiento.'], 200);
        }

        // Generate 8-digit code
        $code = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);

        \Illuminate\Support\Facades\Log::info('Generando código de restablecimiento para el usuario: ' . $user->id);

        // Store code in DB (update existing or insert new)
        DB::table('password_reset_codes')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($code),
                'created_at' => now()
            ]
        );

        \Illuminate\Support\Facades\Log::info('Código de restablecimiento guardado. Enviando correo electrónico...');

        // Send email
        try {
            Mail::to($user)->send(new PasswordResetCode($code));
            \Illuminate\Support\Facades\Log::info('Correo electrónico enviado con éxito.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error sending email: ' . $e->getMessage());
            throw $e;
        }

        return response()->json(['message' => 'Código de restablecimiento enviado a su correo electrónico.'], 200);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string|size:8',
            'password' => [
                'required',
                'confirmed',
                PasswordRules::min(8)->mixedCase()->numbers()->symbols()
            ],
        ]);

        // Verify code
        $record = DB::table('password_reset_codes')->where('email', $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            throw ValidationException::withMessages(['token' => 'Código de restablecimiento inválido o expirado.']);
        }

        // Check expiration (e.g., 15 minutes)
        if (now()->diffInMinutes($record->created_at) > 15) {
            throw ValidationException::withMessages(['token' => 'Código de restablecimiento expirado.']);
        }

        // Update password
        $user = User::where('email', $request->email)->first();
        $user->forceFill([
            'password' => Hash::make($request->password)
        ])->save();

        // Delete code
        DB::table('password_reset_codes')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña restablecida con éxito.']);
    }
}
