/**
 * Estilos compartidos para todas las pantallas de autenticación.
 * Importar desde cada componente de auth.
 */

export const authStyles = {
    // Página contenedor
    page: {
        minHeight: '100vh',
        background: 'var(--color-bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
    },

    // Card principal
    card: {
        width: '100%',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-premium)',
    },

    // Cuerpo del card
    body: {
        padding: '32px',
    },

    // Label de campo
    label: {
        display: 'block',
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: 'var(--color-text-muted)',
        marginBottom: 7,
    },

    // Input base
    input: {
        width: '100%',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--color-text-primary)',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxSizing: 'border-box',
    },

    // Separador de sección
    sectionTitle: {
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: 'var(--color-text-muted)',
        paddingBottom: 10,
        borderBottom: '1px solid var(--color-border-subtle)',
        marginBottom: 16,
    },

    // Alerta error
    alertError: {
        marginBottom: 16,
        padding: '12px 14px',
        background: 'var(--color-terra-light)',
        border: '1px solid rgba(192,68,42,0.25)',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--color-terra)',
        lineHeight: 1.5,
    },

    // Alerta éxito
    alertSuccess: {
        marginBottom: 16,
        padding: '12px 14px',
        background: 'var(--color-sage-light)',
        border: '1px solid rgba(58,107,82,0.25)',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--color-sage)',
        lineHeight: 1.5,
    },

    // Error de validación inline
    fieldError: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        color: 'var(--color-terra)',
        marginTop: 5,
    },

    // Texto de ayuda
    hint: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        color: 'var(--color-text-ghost)',
        marginTop: 5,
        lineHeight: 1.4,
    },

    // Link de navegación
    link: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--color-terra)',
        textDecoration: 'none',
        transition: 'opacity 0.15s',
    },

    // Link secundario (volver)
    linkMuted: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--color-text-muted)',
        textDecoration: 'none',
        transition: 'color 0.15s',
    },
};

/** Aplica focus-style a un input ref inline */
export function inputFocusOn(el) {
    if (!el) return;
    el.style.borderColor = 'var(--color-terra)';
    el.style.boxShadow = '0 0 0 3px rgba(192,68,42,0.10)';
}
export function inputFocusOff(el) {
    if (!el) return;
    el.style.borderColor = 'var(--color-border-strong)';
    el.style.boxShadow = 'none';
}