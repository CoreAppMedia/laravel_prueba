import React, { useRef } from 'react';
import { authstyles, inputFocusOn, inputFocusOff } from './AuthStyles';


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
                <label htmlFor={name} style={authstyles.label}>
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
                    ...authstyles.input,
                    borderColor: error ? 'var(--color-terra)' : 'var(--color-border-strong)',
                }}
                onFocus={() => inputFocusOn(ref.current)}
                onBlur={() => {
                    if (!error) inputFocusOff(ref.current);
                }}
            />
            {error && <p style={authstyles.fieldError}>{error}</p>}
            {hint && !error && <p style={authstyles.hint}>{hint}</p>}
        </div>
    );
}