import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-[--color-bg-surface] border-t border-[--color-border-subtle] text-[--color-text-primary] py-8 mt-12 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-wider mb-4 text-[--color-mx-green]">Clubes Unidos Zapotitlán</h4>
                        <p className="text-[--color-text-secondary] text-sm font-medium">
                            La liga profesional de fútbol que une pasión, talento y tecnología.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-wider mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm text-[--color-text-secondary] font-semibold">
                            <li><a href="#" className="hover:text-[--color-mx-green] transition-colors">Reglamento</a></li>
                            <li><a href="#" className="hover:text-[--color-mx-green] transition-colors">Equipos</a></li>
                            <li><a href="#" className="hover:text-[--color-mx-green] transition-colors">Resultados</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-wider mb-4 text-[--color-mx-red]">Contacto</h4>
                        <p className="text-[--color-text-secondary] text-sm font-bold">info@clubesunidos.com</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-[--color-border-subtle] text-center text-[--color-text-muted] text-xs font-bold uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} Clubes Unidos Zapotitlán | Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
