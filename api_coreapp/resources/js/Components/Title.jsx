import React from 'react';

export default function Title({ title }) {
    return (
        <div className="py-6 border-b border-gray-800 mb-6">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                <span className="text-gradient-metallic">
                    {title || 'Dashboard'}
                </span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-green-500 via-white to-red-500 mt-2 rounded-full"></div>
        </div>
    );
}
