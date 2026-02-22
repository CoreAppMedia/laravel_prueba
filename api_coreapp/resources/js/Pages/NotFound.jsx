import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center px-4">
            <div className="w-full max-w-md card-theme p-8">
                <div className="bg-theme-gradient h-2 rounded-full mb-6"></div>
                <h1 className="text-2xl font-black uppercase tracking-wider">Página no encontrada</h1>
                <p className="text-gray-400 text-sm mt-2">La ruta que buscaste no existe.</p>
                <div className="mt-6">
                    <Link to="/" className="inline-flex items-center justify-center w-full bg-[--color-mx-green] hover:bg-green-700 transition-colors text-white font-bold uppercase tracking-wider rounded-lg px-4 py-3">
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
