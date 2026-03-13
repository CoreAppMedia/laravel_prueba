import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import { getHomePathForUser } from '../../lib/permissions';
import AuthCard from './AuthCard';
import AuthInput from './AuthInput';
import { authstyles } from './AuthStyles';

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
            navigate(getHomePathForUser(data?.user), { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || 'No se pudo iniciar sesión. Verifica tus datos.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthCard>
            {/* Identidad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div className="brand-logo">
                    <img src="/images/logo.png" alt="Logo" />
                </div>
                <div>
                    <div className="brand-name">Clubes Unidos Zapotitlán</div>
                    <div className="brand-season">Acceso al sistema</div>
                </div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.3px',
                    marginBottom: 6,
                }}>
                    Iniciar Sesión
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Ingresa tus credenciales para administrar tu liga.
                </p>
            </div>

            {error && <div style={authstyles.alertError}>{error}</div>}

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <AuthInput
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu-correo@ejemplo.com"
                    required
                />
                <AuthInput
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 4, justifyContent: 'center', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                    {isSubmitting ? 'Entrando…' : 'Entrar'}
                </button>
            </form>

            {/* Pie de navegación */}
            <div style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Link
                    to="/recuperar"
                    style={authstyles.link}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    ¿Olvidaste tu contraseña?
                </Link>
                <Link
                    to="/"
                    style={authstyles.linkMuted}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                    Volver
                </Link>
            </div>
        </AuthCard>
    );
}