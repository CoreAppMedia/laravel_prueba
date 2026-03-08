import React from 'react';
import Title from '../../Components/Title';
import AppLayout from '../../Layouts/AppLayout';
import { useAuth } from '../../Auth/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

export default function BasePanel({ titulo, children, backUrl }) {
    const { user, signOut } = useAuth();

    return (
        <AppLayout>
            {/* Header Section with Advanced Light Glassmorphism */}
            <div className="relative mb-10 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-mx-green via-slate-200 to-mx-red rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-white/70 backdrop-blur-2xl border border-white/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-premium">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mx-green to-mx-red p-[2px] shadow-lg">
                                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                                    <UserIcon size={32} className="text-slate-700" />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                                <CheckCircle size={12} className="text-white" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                                {user?.nombre} {user?.apellido_paterno}
                                <span className="bg-green-100 text-green-700 text-[10px] uppercase px-2 py-0.5 rounded-full border border-green-200 font-bold">Online</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-1">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <Shield size={14} className="text-blue-600" />
                                    {user?.rol?.nombre || 'Administrador'}
                                </span>
                                <span className="hidden md:block w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-sm text-slate-400 font-medium italic">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={signOut}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm"
                        >
                            <LogOut size={16} />
                            Desconectar
                        </button>
                    </div>
                </div>
            </div>

            {/* Page Title Section */}
            <div className="flex items-center gap-4 mb-8 px-2">
                {backUrl && (
                    <Link
                        to={backUrl}
                        className="bg-white hover:bg-mx-green/10 hover:text-mx-green border border-slate-200 text-slate-600 p-2.5 rounded-xl transition-all group shadow-sm"
                        title="Regresar"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                )}
                <Title title={titulo} />
            </div>

            {/* Content Area */}
            <div className="animate-fade-in">
                {children}
            </div>
        </AppLayout>
    );
}
