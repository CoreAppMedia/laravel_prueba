import React from 'react';
import { authStyles } from './Authstyles';

/**
 * Contenedor visual compartido para todas las páginas de autenticación.
 * Props:
 *  - maxWidth : string CSS (default '448px')
 *  - children
 */
export default function AuthCard({ children, maxWidth = '448px' }) {
    return (
        <div style={{ ...authStyles.page }}>
            <div style={{ ...authStyles.card, maxWidth }}>
                {/* Banda tricolor de marca */}
                <div className="brand-bar-thick" />
                {/* Cuerpo */}
                <div style={authStyles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
}