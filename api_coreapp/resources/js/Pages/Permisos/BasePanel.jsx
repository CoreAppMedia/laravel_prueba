import React from 'react';
import Title from '../../Components/Title';
import AppLayout from '../../Layouts/AppLayout';
import { useAuth } from '../../Auth/AuthContext';

export default function BasePanel({ titulo }) {
    const { user, signOut } = useAuth();

    return (
        <AppLayout>
            <div className="flex items-start justify-between gap-4">
                <Title title={titulo} />

                <button
                    onClick={signOut}
                    className="bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 text-gray-200 font-bold uppercase tracking-wider text-xs rounded-lg px-4 py-3"
                >
                    Cerrar sesión
                </button>
            </div>

            <div className="mt-8 card-theme p-6">
                <div className="text-sm text-gray-400 uppercase tracking-wider font-bold">Usuario</div>
                <div className="mt-2 text-lg font-black">{user?.nombre} {user?.apellido_paterno} {user?.apellido_materno}</div>
                <div className="text-gray-400 text-sm mt-1">{user?.email}</div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/40 border border-gray-700 rounded-xl p-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Permiso</div>
                        <div className="mt-1 text-white font-black">{user?.permiso?.nombre || 'Sin permiso'}</div>
                    </div>
                    <div className="bg-gray-900/40 border border-gray-700 rounded-xl p-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Rol</div>
                        <div className="mt-1 text-white font-black">{user?.rol?.nombre || 'Sin rol'}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
