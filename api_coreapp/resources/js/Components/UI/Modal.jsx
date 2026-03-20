import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="animate-fade-in"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(17, 16, 16, 0.45)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                }}
            />

            {/* Panel */}
            <div
                className={`relative w-full ${maxWidth} animate-fade-in-up`}
                style={{
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-premium)',
                    overflow: 'hidden',
                    maxHeight: 'calc(100vh - 40px)',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '800px'
                }}
            >
                {/* Banda tricolor */}
                <div className="brand-bar" />

                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px 24px',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        background: 'var(--color-bg-surface-alt)',
                    }}
                >
                    <h3
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 18,
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            letterSpacing: '-0.2px',
                        }}
                    >
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: 'var(--radius-sm)',
                            background: 'transparent',
                            border: '1px solid transparent',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--color-border-subtle)';
                            e.currentTarget.style.color = 'var(--color-text-primary)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                        }}
                        aria-label="Cerrar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Contenido */}
                <div style={{ padding: 24, overflowY: 'auto', minWidth: '800px' }}>
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.getElementById('modal-root'));
}