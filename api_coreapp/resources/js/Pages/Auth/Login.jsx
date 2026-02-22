import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import { getHomePathForUser } from '../../lib/permissions';

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const data = await signIn({ email, password });
            const user = data?.user;

            navigate(getHomePathForUser(user), { replace: true });
        } catch (err) {
            const message = err?.response?.data?.message || 'No se pudo iniciar sesión. Verifica tus datos.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center px-4">
            <div className="w-full max-w-md card-theme p-8 shadow-2xl">
                <div className="bg-theme-gradient h-2 rounded-full mb-6"></div>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-500">⚽</div>
                    <div>
                        <h1 className="text-xl font-black text-[--color-mx-white] uppercase tracking-tighter leading-none">Clubes Unidos</h1>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Acceso al sistema</div>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-6">Inicia sesión para administrar tu liga.</p>

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

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-3 text-[--color-mx-white] outline-none focus:border-[--color-mx-red]"
                            placeholder="********"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-[--color-mx-green] hover:bg-green-700 transition-colors px-4 py-3 font-black uppercase tracking-wider text-white disabled:opacity-60"
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between text-sm">
                    <Link to="/recuperar" className="text-gray-300 hover:text-white underline underline-offset-4">
                        ¿Olvidaste tu contraseña?
                    </Link>
                    <Link to="/" className="text-gray-400 hover:text-gray-200">
                        Volver
                    </Link>
                </div>
            </div>
        </div>
    );
}
