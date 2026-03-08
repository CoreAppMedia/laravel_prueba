import React from 'react';

export default function GradientButton({ children, className = '', type = 'button', onClick, disabled = false, icon: Icon }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                bg-theme-gradient text-white font-black py-3 px-6 rounded-xl
                hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-3
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-premium uppercase text-xs tracking-widest
                ${className}
            `}
        >
            {Icon && <Icon size={18} className="text-white/80" />}
            {children}
        </button>
    );
}
