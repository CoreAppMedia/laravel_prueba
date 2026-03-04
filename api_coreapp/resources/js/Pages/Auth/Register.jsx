import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../lib/auth';

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        registrationKey: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear specific validation error when user types
        if (validationErrors[e.target.name]) {
            setValidationErrors({
                ...validationErrors,
                [e.target.name]: null
            });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setValidationErrors({});
        setIsSubmitting(true);

        try {
            await register(formData);
            // On successful registration, redirect to login or dashboard
            // Based on our implementation, user gets logged in automatically via setToken
            navigate('/', { replace: true });
        } catch (err) {
            if (err?.response?.status === 422) {
                setValidationErrors(err.response.data.errors || {});
                setError('Por favor, corrige los errores en el formulario.');
            } else if (err?.response?.status === 403 || err?.response?.status === 500) {
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

    return (
        <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl card-theme p-8 shadow-2xl">
                <div className="bg-theme-gradient h-2 rounded-full mb-6"></div>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-500 text-2xl">⚽</div>
                    <div>
                        <h1 className="text-xl font-black text-[--color-mx-white] uppercase tracking-tighter leading-none">Clubes Unidos</h1>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Crear Nueva Cuenta</div>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-6">Completa tus datos para unirte a la plataforma.</p>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-700/50 bg-red-900/20 p-4 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Sección de Datos de Cuenta */}
                    <div className="space-y-4">
                        <h2 className="text-sm border-b border-gray-700 pb-2 font-bold text-gray-300 uppercase tracking-widest">Datos de Cuenta</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Usuario (Nickname) *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-2.5 text-[--color-mx-white] outline-none focus:border-[--color-mx-green] transition-colors"
                                    placeholder="ej. carlos123"
                                />
                                {validationErrors.name && (
                                    <p className="mt-1 text-xs text-red-400">{validationErrors.name[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Correo Electrónico *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-2.5 text-[--color-mx-white] outline-none focus:border-[--color-mx-green] transition-colors"
                                    placeholder="tu-correo@ejemplo.com"
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-xs text-red-400">{validationErrors.email[0]}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Contraseña *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-2.5 text-[--color-mx-white] outline-none focus:border-[--color-mx-red] transition-colors"
                                    placeholder="Mínimo 8 caracteres"
                                />
                                {validationErrors.password && (
                                    <p className="mt-1 text-xs text-red-400">{validationErrors.password[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Confirmar Contraseña *</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-2.5 text-[--color-mx-white] outline-none focus:border-[--color-mx-red] transition-colors"
                                    placeholder="Repite la contraseña"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección de Datos Personales */}
                    <div className="space-y-4">
                        <h2 className="text-sm border-b border-gray-700 pb-2 font-bold text-gray-300 uppercase tracking-widest mt-6">Datos Personales</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nombre(s) *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-2.5 text-[--color-mx-white] outline-none focus:border-[--color-mx-green] transition-colors"
                                    placeholder="Juan"
                                />
                                {validationErrors.nombre && (
                                    <p className="mt-1 text-xs text-red-400">{validationErrors.nombre[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Apellido Paterno *</label>
                                <input
                                    type="text"
                                    name="apellido_paterno"
                                    value={formData.apellido_paterno}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-2.5 text-[--color-mx-white] outline-none focus:border-[--color-mx-green] transition-colors"
                                    placeholder="Pérez"
                                />
                                {validationErrors.apellido_paterno && (
                                    <p className="mt-1 text-xs text-red-400">{validationErrors.apellido_paterno[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Apellido Materno *</label>
                                <input
                                    type="text"
                                    name="apellido_materno"
                                    value={formData.apellido_materno}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg bg-gray-900/40 border border-gray-700 px-4 py-2.5 text-[--color-mx-white] outline-none focus:border-[--color-mx-green] transition-colors"
                                    placeholder="García"
                                />
                                {validationErrors.apellido_materno && (
                                    <p className="mt-1 text-xs text-red-400">{validationErrors.apellido_materno[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección de Seguridad */}
                    <div className="space-y-4">
                        <h2 className="text-sm border-b border-gray-700 pb-2 font-bold text-gray-300 uppercase tracking-widest mt-6">Seguridad</h2>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">Clave de Registro *</label>
                            <input
                                type="text"
                                name="registrationKey"
                                value={formData.registrationKey}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg bg-gray-900/40 border border-orange-700/50 px-4 py-2.5 text-[--color-mx-white] outline-none focus:border-orange-500 transition-colors"
                                placeholder="Clave proporcionada por el administrador"
                            />
                            <p className="mt-1 text-xs text-gray-500">Necesaria para validar que estás autorizado a crear una cuenta.</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-[--color-mx-green] mt-8 hover:bg-green-700 transition-colors px-4 py-3.5 font-black uppercase tracking-wider text-white disabled:opacity-60 shadow-lg shadow-green-900/20"
                    >
                        {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm border-t border-gray-800 pt-6">
                    <span className="text-gray-400">¿Ya tienes cuenta? </span>
                    <Link to="/login" className="text-white hover:text-[--color-mx-green] font-bold underline underline-offset-4 transition-colors">
                        Inicia Sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}
