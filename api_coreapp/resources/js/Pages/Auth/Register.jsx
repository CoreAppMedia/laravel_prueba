import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../lib/auth';
import AuthCard from './authcard';
import AuthInput from './authinput';
import { authStyles } from './authstyles';

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password_confirmation: '',
        nombre: '', apellido_paterno: '', apellido_materno: '', registrationKey: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (validationErrors[e.target.name]) {
            setValidationErrors({ ...validationErrors, [e.target.name]: null });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setValidationErrors({});
        setIsSubmitting(true);
        try {
            await register(formData);
            navigate('/', { replace: true });
        } catch (err) {
            if (err?.response?.status === 422) {
                setValidationErrors(err.response.data.errors || {});
                setError('Por favor, corrige los errores en el formulario.');
            } else if ([403, 500].includes(err?.response?.status)) {
                setError(err?.response?.data?.message || 'Error con la Clave de Registro.');
            } else if (err?.response?.status === 409) {
                setError(err?.response?.data?.message || 'El usuario ya existe.');
            } else {
                setError('Ocurrió un error al intentar registrarte.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const ve = validationErrors;

    return (
        <AuthCard maxWidth="640px">
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
                    <div className="brand-season">Crear nueva cuenta</div>
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
                    Registro
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Completa tus datos para unirte a la plataforma.
                </p>
            </div>

            {error && <div style={authStyles.alertError}>{error}</div>}

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── Datos de cuenta ── */}
                <div>
                    <div style={authStyles.sectionTitle}>Datos de cuenta</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <AuthInput label="Usuario (nickname) *" name="name" value={formData.name} onChange={handleChange} placeholder="ej. carlos123" required error={ve.name?.[0]} />
                        <AuthInput label="Correo electrónico *" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="tu-correo@ejemplo.com" required error={ve.email?.[0]} />
                        <AuthInput label="Contraseña *" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" required error={ve.password?.[0]} />
                        <AuthInput label="Confirmar contraseña *" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} placeholder="Repite la contraseña" required />
                    </div>
                </div>

                {/* ── Datos personales ── */}
                <div>
                    <div style={authStyles.sectionTitle}>Datos personales</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                        <AuthInput label="Nombre(s) *" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Juan" required error={ve.nombre?.[0]} />
                        <AuthInput label="Apellido paterno *" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleChange} placeholder="Pérez" required error={ve.apellido_paterno?.[0]} />
                        <AuthInput label="Apellido materno *" name="apellido_materno" value={formData.apellido_materno} onChange={handleChange} placeholder="García" required error={ve.apellido_materno?.[0]} />
                    </div>
                </div>

                {/* ── Seguridad ── */}
                <div>
                    <div style={authStyles.sectionTitle}>Seguridad</div>
                    <AuthInput
                        label="Clave de registro *"
                        name="registrationKey"
                        value={formData.registrationKey}
                        onChange={handleChange}
                        placeholder="Clave proporcionada por el administrador"
                        required
                        hint="Necesaria para validar que estás autorizado a crear una cuenta."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                    {isSubmitting ? 'Registrando…' : 'Crear cuenta'}
                </button>
            </form>

            <div style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: '1px solid var(--color-border-subtle)',
                textAlign: 'center',
            }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
                    ¿Ya tienes cuenta?{' '}
                </span>
                <Link
                    to="/login"
                    style={authStyles.link}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    Inicia sesión aquí
                </Link>
            </div>
        </AuthCard>
    );
}