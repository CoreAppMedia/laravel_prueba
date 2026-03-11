import React, { useRef } from 'react';
import { authstyles, inputFocusOn, inputFocusOff } from './authstyles';

/**
 * Campo de formulario reutilizable para pantallas de autenticación.
 * Props:
 *  - label, name, type, value, onChange, placeholder, required
 *  - error   : string — mensaje de validación inline
 *  - hint    : string — texto de ayuda debajo del campo
 *  - accent  : 'terra' (default) | 'gold' | 'sage'
 */
export default function AuthInput({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required,
    error,
    hint,
    maxLength,
}) {
    const ref = useRef(null);

    return (
        <div>
            {label && (
                <label htmlFor={name} style={authStyles.label}>
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                style={{
                    ...authStyles.input,
                    borderColor: error ? 'var(--color-terra)' : 'var(--color-border-strong)',
                }}
                onFocus={() => inputFocusOn(ref.current)}
                onBlur={() => {
                    if (!error) inputFocusOff(ref.current);
                }}
            />
            {error && <p style={authStyles.fieldError}>{error}</p>}
            {hint && !error && <p style={authStyles.hint}>{hint}</p>}
        </div>
    );
}