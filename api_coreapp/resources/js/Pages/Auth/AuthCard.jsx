import React from 'react';
import { authstyles } from './authstyles';

/**
 * Contenedor visual compartido para todas las páginas de autenticación.
 * Props:
 *  - maxWidth : string CSS (default '448px')
 *  - children
 */
export default function AuthCard({ children, maxWidth = '448px' }) {
    return (
        <div style={{ ...authstyles.page }}>
            <div style={{ ...authstyles.card, maxWidth }}>
                {/* Banda tricolor de marca */}
                <div className="brand-bar-thick" />
                {/* Cuerpo */}
                <div style={authstyles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
}