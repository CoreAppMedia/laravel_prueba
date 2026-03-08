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
            {/* Header Section with Glassmorphism */}
            <div className="relative mb-10 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-mx-green via-slate-500 to-mx-red rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mx-green to-mx-red p-[2px]">
                                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center">
                                    <UserIcon size={32} className="text-white" />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                                <CheckCircle size={12} className="text-white" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                {user?.nombre} {user?.apellido_paterno}
                                <span className="bg-mx-green/10 text-mx-green text-[10px] uppercase px-2 py-0.5 rounded-full border border-mx-green/20">Online</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-1">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <Shield size={14} className="text-blue-400" />
                                    {user?.rol?.nombre || 'Administrador'}
                                </span>
                                <span className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span className="text-sm text-slate-500 font-medium lowercase italic">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={signOut}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
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
                        className="bg-slate-800/50 hover:bg-mx-green/20 hover:text-mx-green border border-slate-700 p-2.5 rounded-xl transition-all group"
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
