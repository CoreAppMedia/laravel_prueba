import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../css/dashboard.css';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-zapo-gray flex flex-col font-body text-secondary overflow-x-hidden w-full relative">
            <Header />

            <main className="flex-1 py-10 animate-zapo">
                <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6 tracking-tight">
                        Panel Principal
                    </h1>
                    <p className="text-secondary/60 text-lg max-w-2xl leading-relaxed">
                        Bienvenido al sistema de gestión de la liga. Aquí podrás administrar torneos, equipos y estadísticas con una experiencia premium.
                    </p>

                    <div className="mt-12 p-8 bg-white rounded-zapo shadow-zapo border border-border-gray/10">
                        <h2 className="text-xl font-bold mb-4">Estado del Sistema</h2>
                        <div className="flex gap-4">
                            <div className="flex-1 p-4 bg-zapo-green/10 rounded-micro border border-zapo-green/20">
                                <span className="block text-2xl font-bold text-zapo-green">ACTIVO</span>
                                <span className="text-xs uppercase tracking-widest opacity-60">Servidor Vite</span>
                            </div>
                            <div className="flex-1 p-4 bg-zapo-gold/10 rounded-micro border border-zapo-gold/20">
                                <span className="block text-2xl font-bold text-zapo-gold">OK</span>
                                <span className="text-xs uppercase tracking-widest opacity-60">Base de Datos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}