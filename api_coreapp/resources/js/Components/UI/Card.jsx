import React from 'react';

export default function Card({ children, className = '', title }) {
    return (
        <div className={`bg-[--color-bg-surface] border border-[--color-border-subtle] rounded-2xl shadow-soft overflow-hidden animate-fade-in ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-[--color-border-subtle] bg-[--color-bg-surface-alt]/50">
                    <h3 className="text-lg font-black text-[--color-text-primary] tracking-tight">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
