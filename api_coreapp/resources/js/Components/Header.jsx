import React, { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-theme-gradient shadow-2xl relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-500">
                            {/* Placeholder Logo */}
                            ⚽
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                                Clubes Unidos
                            </h1>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest block">
                                Zapotitlán
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {['Inicio', 'Equipos', 'Calendario', 'Estadísticas', 'Noticias'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors duration-200 hover:bg-white/10"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white p-2 focus:outline-none"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[--color-bg-surface] border-t border-[--color-border-subtle] shadow-xl overflow-hidden mt-1 mx-2 rounded-2xl animate-fade-in">
                    <div className="px-4 py-3 space-y-1">
                        {['Inicio', 'Equipos', 'Calendario', 'Estadísticas', 'Noticias'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-[--color-text-primary] hover:text-white hover:bg-mx-green block px-4 py-3 rounded-xl text-base font-bold uppercase tracking-widest transition-all"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
