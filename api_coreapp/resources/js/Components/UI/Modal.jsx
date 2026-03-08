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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className={`relative w-full ${maxWidth} transform transition-all`}>
                <Card className="shadow-2xl ring-1 ring-slate-700/50">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50">
                        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-mx-white to-slate-400">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div>
                        {children}
                    </div>
                </Card>
            </div>
        </div>
    );
}
