import React, { useState } from 'react';
import http from '../../../../lib/http';
import toast from 'react-hot-toast';

export default function UserPasswordForm({ user, onSuccess, onCancel }) {
    const [saving, setSaving] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error('Usuario no seleccionado');
            return;
        }

        if (!password || password.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (password !== passwordConfirmation) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        setSaving(true);
        try {
            await http.put(`/api/users/${user.id}/password`, {
                password,
                password_confirmation: passwordConfirmation,
            });
            toast.success('Contraseña actualizada con éxito');
            onSuccess?.();
        } catch (err) {
            const msg = err?.response?.data?.message;
            toast.error(msg || 'Error al actualizar contraseña');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
                background: 'var(--color-bg-muted)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
            }}>
                {user?.email || '-'}
            </div>

            <Field label="Nueva contraseña">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    placeholder="********"
                    autoComplete="new-password"
                />
            </Field>

            <Field label="Confirmar contraseña">
                <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    style={inputStyle}
                    placeholder="********"
                    autoComplete="new-password"
                />
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={onCancel} className="btn-ghost" style={btnGhostStyle}>
                    Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary" style={btnPrimaryStyle}>
                    {saving ? 'Guardando...' : 'Actualizar'}
                </button>
            </div>
        </form>
    );
}

function Field({ label, children }) {
    return (
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--color-text-muted)',
            }}>
                {label}
            </span>
            {children}
        </label>
    );
}

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-subtle)',
    backgroundColor: 'var(--color-bg-surface)',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    outline: 'none',
};

const btnGhostStyle = {
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-subtle)',
    background: 'var(--color-bg-surface)',
    fontFamily: 'var(--font-body)',
    fontWeight: 800,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '1px',
};

const btnPrimaryStyle = {
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-subtle)',
    background: 'var(--gradient-brand)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: 900,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '1px',
};
