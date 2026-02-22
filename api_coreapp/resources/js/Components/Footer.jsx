import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-[--color-bg-dark] border-t border-gray-800 text-[--color-mx-white] py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-lg font-bold uppercase tracking-wider mb-4 text-[--color-mx-green]">Clubes Unidos Zapotitlán</h4>
                        <p className="text-gray-400 text-sm">
                            La liga profesional de fútbol que une pasión, talento y tecnología.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold uppercase tracking-wider mb-4 text-[--color-mx-white]">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-[--color-mx-green] transition-colors">Reglamento</a></li>
                            <li><a href="#" className="hover:text-[--color-mx-green] transition-colors">Equipos</a></li>
                            <li><a href="#" className="hover:text-[--color-mx-green] transition-colors">Resultados</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold uppercase tracking-wider mb-4 text-[--color-mx-red]">Contacto</h4>
                        <p className="text-gray-400 text-sm">info@clubesunidos.com</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Clubes Unidos Zapotitlán | Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
