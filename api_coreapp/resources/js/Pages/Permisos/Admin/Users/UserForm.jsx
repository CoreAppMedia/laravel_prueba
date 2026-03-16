import React, { useEffect, useMemo, useState } from 'react';
import http from '../../../../lib/http';
import toast from 'react-hot-toast';

export default function UserForm({ user, onSuccess, onCancel }) {
    const [saving, setSaving] = useState(false);

    const initial = useMemo(() => {
        return {
            name: user?.name || '',
            email: user?.email || '',
            nombre: user?.nombre || '',
            apellido_paterno: user?.apellido_paterno || '',
            apellido_materno: user?.apellido_materno || '',
            permiso_id: user?.permiso_id ?? '',
            rol_id: user?.rol_id ?? '',
            active: user?.active ?? true,
        };
    }, [user]);

    const [form, setForm] = useState(initial);

    useEffect(() => {
        setForm(initial);
    }, [initial]);

    const onChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error('Selecciona un usuario para editar');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
                nombre: form.nombre,
                apellido_paterno: form.apellido_paterno,
                apellido_materno: form.apellido_materno,
                permiso_id: form.permiso_id === '' ? null : Number(form.permiso_id),
                rol_id: form.rol_id === '' ? null : Number(form.rol_id),
                active: Boolean(form.active),
            };

            await http.put(`/api/users/${user.id}`, payload);
            toast.success('Usuario actualizado con éxito');
            onSuccess?.();
        } catch (err) {
            const msg = err?.response?.data?.message;
            toast.error(msg || 'Error al actualizar usuario');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Usuario (name)">
                    <input
                        value={form.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="input"
                        style={inputStyle}
                        placeholder="admin"
                    />
                </Field>
                <Field label="Email">
                    <input
                        value={form.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        className="input"
                        style={inputStyle}
                        placeholder="admin@dominio.com"
                    />
                </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="Nombre">
                    <input
                        value={form.nombre}
                        onChange={(e) => onChange('nombre', e.target.value)}
                        style={inputStyle}
                    />
                </Field>
                <Field label="Apellido Paterno">
                    <input
                        value={form.apellido_paterno}
                        onChange={(e) => onChange('apellido_paterno', e.target.value)}
                        style={inputStyle}
                    />
                </Field>
                <Field label="Apellido Materno">
                    <input
                        value={form.apellido_materno}
                        onChange={(e) => onChange('apellido_materno', e.target.value)}
                        style={inputStyle}
                    />
                </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="permiso_id">
                    <input
                        value={form.permiso_id}
                        onChange={(e) => onChange('permiso_id', e.target.value)}
                        style={inputStyle}
                        inputMode="numeric"
                        placeholder="2"
                    />
                </Field>
                <Field label="rol_id">
                    <input
                        value={form.rol_id}
                        onChange={(e) => onChange('rol_id', e.target.value)}
                        style={inputStyle}
                        inputMode="numeric"
                        placeholder="1"
                    />
                </Field>
                <Field label="Activo">
                    <select
                        value={form.active ? '1' : '0'}
                        onChange={(e) => onChange('active', e.target.value === '1')}
                        style={inputStyle}
                    >
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </Field>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={onCancel} className="btn-ghost" style={btnGhostStyle}>
                    Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary" style={btnPrimaryStyle}>
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
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
