import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Buscar...', width = '300px', className = '' }) {
    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width: width,
            }}
        >
            <Search
                size={18}
                style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                }}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-terra)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-terra-light)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            />
        </div>
    );
}
