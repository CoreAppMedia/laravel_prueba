import React from 'react';

export default function Card({ children, className = '', title }) {
    return (
        <div className={`card-theme shadow-xl overflow-hidden ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
                    <h3 className="text-lg font-semibold text-mx-white">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
