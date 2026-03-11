import React from 'react';
import { Link } from 'react-router-dom';
import BasePanel from './Permisos/BasePanel';
import Card from '../Components/UI/Card';
import GradientButton from '../Components/UI/GradientButton';
import { Palette, Zap, Type, Layers, Box, ArrowRight, ShieldCheck, Skull } from 'lucide-react';

export default function GuiaEstilo() {
    return (
        <BasePanel titulo="Guía de Estilos: Mictlán Futuro">
            
            {/* Cabecera / Intro */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-10 mb-10 shadow-premium relative overflow-hidden border border-slate-700">
                {/* Decoración abstracta de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D946EF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-slow-zoom"></div>
                <div className="absolute bottom-0 right-32 w-64 h-64 bg-[#FF6B00] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-slow-zoom" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-0 left-32 w-64 h-64 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-slow-zoom" style={{animationDelay: '4s'}}></div>
                
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Skull className="text-[#FF6B00]" size={28} />
                            <span className="text-white/50 uppercase tracking-[0.3em] text-xs font-black">Sistema de Diseño 2026</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Mictlán <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#D946EF] to-[#8B5CF6]">Futuro</span>
                        </h1>
                        <p className="text-slate-300 max-w-2xl font-medium leading-relaxed">
                            Una estética responsiva diseñada para la liga de fútbol de Santiago Zapotitlán. 
                            Fusionando la limpieza del futurismo con colores vibrantes del Día de Muertos y la intensidad del deporte.
                        </p>
                    </div>
                </div>
            </div>

            {/* Colores */}
            <div className="mb-12">
                <h2 className="text-2xl font-black flex items-center gap-3 mb-6 text-slate-800">
                    <Palette className="text-[#D946EF]" />
                    Paleta de Colores
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Cempasúchil */}
                    <div className="bg-white p-3 border border-slate-200 rounded-2xl shadow-soft group hover:-translate-y-1 transition-all">
                        <div className="h-24 w-full rounded-xl mb-3 shadow-inner bg-[#FF6B00]"></div>
                        <h3 className="font-black text-sm text-slate-900">Cempasúchil</h3>
                        <p className="text-[10px] uppercase font-bold text-slate-400">#FF6B00</p>
                        <p className="text-xs text-slate-500 mt-1 leading-tight">Energía y vida</p>
                    </div>

                    {/* Rosa Mexicano */}
                    <div className="bg-white p-3 border border-slate-200 rounded-2xl shadow-soft group hover:-translate-y-1 transition-all">
                        <div className="h-24 w-full rounded-xl mb-3 shadow-inner bg-[#D946EF]"></div>
                        <h3 className="font-black text-sm text-slate-900">Rosa Mexicano</h3>
                        <p className="text-[10px] uppercase font-bold text-slate-400">#D946EF</p>
                        <p className="text-xs text-slate-500 mt-1 leading-tight">Misticismo</p>
                    </div>

                    {/* Morado Mictlán */}
                    <div className="bg-white p-3 border border-slate-200 rounded-2xl shadow-soft group hover:-translate-y-1 transition-all">
                        <div className="h-24 w-full rounded-xl mb-3 shadow-inner bg-[#8B5CF6]"></div>
                        <h3 className="font-black text-sm text-slate-900">Morado Neón</h3>
                        <p className="text-[10px] uppercase font-bold text-slate-400">#8B5CF6</p>
                        <p className="text-xs text-slate-500 mt-1 leading-tight">Elegancia profunda</p>
                    </div>

                    {/* Verde Agave */}
                    <div className="bg-white p-3 border border-slate-200 rounded-2xl shadow-soft group hover:-translate-y-1 transition-all">
                        <div className="h-24 w-full rounded-xl mb-3 shadow-inner bg-[#10B981]"></div>
                        <h3 className="font-black text-sm text-slate-900">Verde Agave</h3>
                        <p className="text-[10px] uppercase font-bold text-slate-400">#10B981</p>
                        <p className="text-xs text-slate-500 mt-1 leading-tight">La Cancha virtual</p>
                    </div>

                    {/* Blanco Papel Picado */}
                    <div className="bg-white p-3 border border-slate-200 rounded-2xl shadow-soft group hover:-translate-y-1 transition-all">
                        <div className="h-24 w-full rounded-xl mb-3 shadow-inner bg-[#f8fafc] border border-slate-200"></div>
                        <h3 className="font-black text-sm text-slate-900">Base / Lienzo</h3>
                        <p className="text-[10px] uppercase font-bold text-slate-400">#f8fafc</p>
                        <p className="text-xs text-slate-500 mt-1 leading-tight">Claridad suprema</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Tipografía */}
                <section>
                    <h2 className="text-2xl font-black flex items-center gap-3 mb-6 text-slate-800">
                        <Type className="text-[#FF6B00]" />
                        Tipografía
                    </h2>
                    
                    <Card title="Jerarquía (Instrument Sans)">
                        <div className="space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Encabezado Principal</div>
                                <h1 className="text-4xl font-black text-slate-900">Santiago Zapotitlán</h1>
                            </div>
                            <div className="border-b border-slate-100 pb-4">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Títulos de Sección</div>
                                <h2 className="text-2xl font-black text-slate-800">Liga Regional de Fútbol</h2>
                            </div>
                            <div className="border-b border-slate-100 pb-4">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Párrafo Regular</div>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                    Aquí mostramos la legibilidad perfecta para párrafos descriptivos y mensajes informativos largos pensados para usuarios de 20 a 50 años.
                                </p>
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Etiquetas y Status</div>
                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">Completado</span>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Botones y Componentes UI */}
                <section>
                    <h2 className="text-2xl font-black flex items-center gap-3 mb-6 text-slate-800">
                        <Zap className="text-[#10B981]" />
                        Botones y Botones Gradiente
                    </h2>

                    <Card title="Interacciones Principales">
                        <div className="space-y-8 p-4">
                            
                            {/* Gradient Buttons */}
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Estilos de Llamado a la Acción (CTA)</div>
                                <div className="flex flex-wrap gap-4">
                                    <GradientButton icon={Zap} className="from-[#FF6B00] to-[#D946EF]">
                                        Acción Neón
                                    </GradientButton>
                                    
                                    <button className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                        <ShieldCheck size={16} />
                                        Confirmar
                                    </button>
                                </div>
                            </div>

                            {/* Standard Buttons */}
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Botones Secundarios</div>
                                <div className="flex flex-wrap gap-4">
                                    <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                                        Botón Discreto
                                    </button>
                                    
                                    <button className="bg-red-50 border border-red-200 text-red-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">
                                        Peligro
                                    </button>
                                </div>
                            </div>
                            
                            {/* Micro-interactions */}
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Micro Interacciones</div>
                                <div className="flex items-center gap-4">
                                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#FF6B00] hover:text-white transition-all duration-300 shadow-inner">
                                        <ArrowRight size={18} />
                                    </button>
                                    <span className="text-sm font-medium text-slate-500 italic">Hover effect suave</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
            
            {/* Tarjetas y Contenedores */}
            <section className="mt-12">
                <h2 className="text-2xl font-black flex items-center gap-3 mb-6 text-slate-800">
                    <Layers className="text-blue-500" />
                    Tarjetas y Concepto Glassmorphism
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Standard Card */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 mb-4">
                            <Box size={24} />
                        </div>
                        <h3 className="font-black text-lg text-slate-900 mb-2">Tarjeta Estándar</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Bordes súper redondeados (3xl), borde sutil y sombras suaves que se intensifican al hacer hover.
                        </p>
                    </div>

                    {/* Gradient Border Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#D946EF] rounded-[2rem] blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative h-full bg-white border border-slate-100 rounded-3xl p-6 shadow-soft">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B00] mb-4">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-black text-lg text-slate-900 mb-2">Resalte Neón</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Para notificaciones importantes o paneles de control que requieren destacar sobre el resto del contenido.
                            </p>
                        </div>
                    </div>
                    
                    {/* Glassmorphism / Frosted Glass */}
                    <div className="bg-gradient-to-br from-[#10B981] to-[#047857] rounded-3xl p-6 shadow-premium text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-20"></div>
                        <div className="relative z-10">
                            <h3 className="font-black text-lg mb-2">Panel Sólido Activo</h3>
                            <p className="text-sm text-green-100 font-medium leading-relaxed mb-6">
                                Utilizado para indicar que una sección, torneo o partido está actualmente en vivo (En Curso).
                            </p>
                            <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-green-50">Transmisión</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </BasePanel>
    );
}
