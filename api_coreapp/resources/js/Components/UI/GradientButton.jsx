import React from 'react';

export default function GradientButton({ children, className = '', type = 'button', onClick, disabled = false, icon: Icon }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                bg-theme-gradient text-white font-medium py-2 px-4 rounded-lg
                hover:opacity-90 transition-opacity flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg
                ${className}
            `}
        >
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
}
