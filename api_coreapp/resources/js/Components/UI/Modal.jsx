import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Card from './Card';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className={`relative w-full ${maxWidth} transform transition-all`}>
                <Card className="shadow-2xl !p-0 border-none overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-[--color-border-subtle] bg-slate-50">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-200"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </Card>
            </div>
        </div>
    );
}
