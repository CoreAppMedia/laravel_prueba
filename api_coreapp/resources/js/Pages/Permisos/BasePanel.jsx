import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BasePanel({ children, backUrl }) {
    return (
        <AppLayout>
            {/* Simple Page Title */}
            <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center gap-4">
                {backUrl && (
                    <Link
                        to={backUrl}
                        style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'var(--color-bg-surface-alt)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        cursor: 'pointer',
                    }}
                        title="Regresar"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                )}
            </div>

            {/* Content Area */}
            <div className="animate-fade-in">
                {children}
            </div>
        </AppLayout>
    );
}


