import React from 'react';

export default function LoadingScreen({ label }) {
    return (
        <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center px-4">
            <div className="w-full max-w-md card-theme p-8 text-center">
                <div className="bg-theme-gradient h-2 rounded-full mb-6"></div>
                <div className="text-2xl font-black uppercase tracking-wider">Cargando</div>
                <div className="text-gray-400 text-sm mt-2">{label || 'Preparando el panel...'}</div>
            </div>
        </div>
    );
}
