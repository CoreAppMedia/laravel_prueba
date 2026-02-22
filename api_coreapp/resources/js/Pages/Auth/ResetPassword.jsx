import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../lib/auth';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);

        try {
            const data = await resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });

            setMessage(data?.message || 'Contraseña restablecida con éxito. Ya puedes iniciar sesión.');
        } catch (err) {
            const errors = err?.response?.data?.errors;
            const msg = err?.response?.data?.message || (errors ? Object.values(errors).flat().join(' ') : null) || 'No se pudo restablecer. Revisa tu código y contraseña.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center px-4">
            <div className="w-full max-w-md card-theme p-8 shadow-2xl">
                <div className="bg-theme-gradient h-2 rounded-full mb-6"></div>
                <h1 className="text-xl font-black uppercase tracking-wider">Restablecer contraseña</h1>
                <p className="text-gray-400 text-sm mt-2 mb-6">Ingresa tu código de 8 dígitos y tu nueva contraseña.</p>

                {message && (
                    <div className="mb-4 rounded-lg border border-green-700/40 bg-green-900/20 p-3 text-sm text-green-200">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-lg border border-red-700/50 bg-red-900/20 p-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Correo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-3 text-[--color-mx-white] outline-none focus:border-[--color-mx-green]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Código (8 dígitos)</label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            maxLength={8}
                            className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-3 text-[--color-mx-white] outline-none focus:border-[--color-mx-red] tracking-widest"
                            placeholder="00000000"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Nueva contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-3 text-[--color-mx-white] outline-none focus:border-[--color-mx-green]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Confirmar contraseña</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-3 text-[--color-mx-white] outline-none focus:border-[--color-mx-green]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-[--color-mx-green] hover:bg-green-700 transition-colors px-4 py-3 font-black uppercase tracking-wider text-white disabled:opacity-60"
                    >
                        {isSubmitting ? 'Guardando...' : 'Restablecer'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between text-sm">
                    <Link to="/login" className="text-gray-300 hover:text-white underline underline-offset-4">
                        Ir a login
                    </Link>
                    <Link to="/recuperar" className="text-gray-400 hover:text-gray-200">
                        Reenviar código
                    </Link>
                </div>
            </div>
        </div>
    );
}
