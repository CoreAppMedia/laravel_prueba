import React from 'react';
import { ArrowRight, Trophy, Clock } from 'lucide-react';

export default function ConvocatoriaWidget() {
    return (
        <div
            className="card"
            style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-medium)',
            }}
        >
            {/* Banda decorativa superior */}
            <div className="brand-bar-thick" />

            {/* Contenido principal */}
            <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'var(--color-terra-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-terra)',
                        }}
                    >
                        <Trophy size={24} />
                    </div>
                    
                    {/* Badge de estado */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            background: 'var(--color-sage-light)',
                            border: '1px solid rgba(58,107,82,0.2)',
                            borderRadius: 20,
                            fontFamily: 'var(--font-body)',
                            fontSize: 10,
                            fontWeight: 700,
                            color: 'var(--color-sage)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}
                    >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-sage)' }} className="animate-pulse" />
                        Inscripciones Abiertas
                    </div>
                </div>

                <h3
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22,
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.2,
                        marginBottom: 10,
                    }}
                >
                    Torneo Clausura Cup 2026
                </h3>

                <p
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6,
                        marginBottom: 24,
                        flex: 1,
                    }}
                >
                    Asegura el lugar de tu equipo en la próxima temporada. Compite contra los mejores clubes de la región.
                </p>

                {/* Deadline info */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 0',
                        borderTop: '1px solid var(--color-border-subtle)',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        marginBottom: 24,
                    }}
                >
                    <Clock size={16} style={{ color: 'var(--color-gold)' }} />
                    <span
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Cierre de registros en: <span style={{ color: 'var(--color-terra)' }}>14 días</span>
                    </span>
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    Registrar Equipo Ahora <ArrowRight size={16} />
                </button>
            </div>
            
            {/* Elemento de diseño de fondo (marca de agua) */}
            <div
                style={{
                    position: 'absolute',
                    bottom: -30,
                    right: -30,
                    opacity: 0.03,
                    pointerEvents: 'none',
                    transform: 'rotate(-15deg)',
                }}
            >
                <Trophy size={140} />
            </div>
        </div>
    );
}
