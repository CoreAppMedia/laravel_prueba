import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../lib/auth';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);

        try {
            const data = await forgotPassword({ email });
            setMessage(data?.message || 'Si tu correo está registrado, recibirás un código de restablecimiento.');
        } catch (err) {
            const msg = err?.response?.data?.message || 'No se pudo enviar el código. Intenta de nuevo.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center px-4">
            <div className="w-full max-w-md card-theme p-8 shadow-2xl">
                <div className="bg-theme-gradient h-2 rounded-full mb-6"></div>
                <h1 className="text-xl font-black uppercase tracking-wider">Recuperar contraseña</h1>
                <p className="text-gray-400 text-sm mt-2 mb-6">Te enviaremos un código de 8 dígitos a tu correo.</p>

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
                            placeholder="tu-correo@ejemplo.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-[--color-mx-red] hover:bg-red-700 transition-colors px-4 py-3 font-black uppercase tracking-wider text-white disabled:opacity-60"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar código'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between text-sm">
                    <Link to="/restablecer" className="text-gray-300 hover:text-white underline underline-offset-4">
                        Ya tengo mi código
                    </Link>
                    <Link to="/login" className="text-gray-400 hover:text-gray-200">
                        Volver a login
                    </Link>
                </div>
            </div>
        </div>
    );
}
