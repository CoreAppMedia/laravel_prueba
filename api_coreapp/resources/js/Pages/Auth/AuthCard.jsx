import React from 'react';
import { authstyles } from './AuthStyles';

export default function AuthCard({ children, maxWidth = '448px' }) {
    return (
        <div style={{ ...authstyles.page }}>
            <div style={{ ...authstyles.card, maxWidth }}>
                <div className="brand-bar-thick" />
                {/* Cuerpo */}
                <div style={authstyles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
}