import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../lib/auth';
import AuthCard from './authcard';
import AuthInput from './authinput';
import { authstyles } from './authstyles';

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
            const data = await resetPassword({ email, token, password, password_confirmation: passwordConfirmation });
            setMessage(data?.message || 'Contraseña restablecida con éxito. Ya puedes iniciar sesión.');
        } catch (err) {
            const errors = err?.response?.data?.errors;
            const msg = err?.response?.data?.message
                || (errors ? Object.values(errors).flat().join(' ') : null)
                || 'No se pudo restablecer. Revisa tu código y contraseña.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthCard>
            {/* Identidad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div className="brand-logo">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.5" />
                        <path d="M10 2 L12 7.5 H18 L13.5 11 L15.5 17 L10 13.5 L4.5 17 L6.5 11 L2 7.5 H8 Z" fill="#fff" opacity=".85" />
                    </svg>
                </div>
                <div>
                    <div className="brand-name">Liga Santiago Zapotitlán</div>
                    <div className="brand-season">Restablecer contraseña</div>
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
                    Nueva Contraseña
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Ingresa tu código de 8 dígitos y define tu nueva contraseña.
                </p>
            </div>

            {message && <div style={authstyles.alertSuccess}>{message}</div>}
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
                    label="Código de verificación (8 dígitos)"
                    name="token"
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="00000000"
                    required
                    maxLength={8}
                />

                {/* Separador de sección */}
                <div style={{ ...authstyles.sectionTitle, marginTop: 4 }}>
                    Nueva contraseña
                </div>

                <AuthInput
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                />
                <AuthInput
                    label="Confirmar contraseña"
                    name="password_confirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={e => setPasswordConfirmation(e.target.value)}
                    placeholder="Repite la contraseña"
                    required
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 4, justifyContent: 'center', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                    {isSubmitting ? 'Guardando…' : 'Restablecer contraseña'}
                </button>
            </form>

            <div style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Link
                    to="/login"
                    style={authstyles.link}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    Ir a login
                </Link>
                <Link
                    to="/recuperar"
                    style={authstyles.linkMuted}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                    Reenviar código
                </Link>
            </div>
        </AuthCard>
    );
}