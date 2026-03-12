import React from 'react';
import Title from '../../Components/Title';
import AppLayout from '../../Layouts/AppLayout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BasePanel({ titulo, children, backUrl }) {
    return (
        <AppLayout>
            {/* Simple Page Title */}
            <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center gap-4">
                {backUrl && (
                    <Link
                        to={backUrl}
                        className="text-slate-600 hover:text-mx-green p-2 rounded-lg hover:bg-mx-green/5 transition-all"
                        title="Regresar"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                )}
                
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-slate-900">{titulo}</h1>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-fade-in">
                {children}
            </div>
        </AppLayout>
    );
}
