import React from 'react';

export default function Title({ title }) {
    return (
        <div className="py-6 border-b border-[--color-border-subtle] mb-6">
            <h1 className="text-4xl font-black text-[--color-text-primary] uppercase tracking-tighter italic">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">
                    {title || 'Dashboard'}
                </span>
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-mx-green via-mx-red to-transparent mt-2 rounded-full"></div>
        </div>
    );
}
