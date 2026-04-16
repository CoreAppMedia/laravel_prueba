/**
 * Tailwind CSS Theme Extension for Heritage Pitch
 * Copy this into your tailwind.config.js theme.extend section
 */
module.exports = {
    theme: {
        extend: {
            colors: {
                'zapo-black': '#000000',
                'zapo-gray': '#f5f5f7',
                'zapo-red': '#C0442A',
                'zapo-near-black': '#1d1d1f',
                'zapo-green': '#3A6B52', /* Stadium Premium Green */
                'zapo-link': '#008f45',
                'zapo-link-dark': '#28cd41',
                'zapo-gold': '#d4af37',  /* Victory Gold */
                primary: '#3A6B52',
                secondary: '#1d1d1f',
                'border-gray': 'rgba(0, 0, 0, 0.12)',
            },
            fontFamily: {
                headline: ['Inter', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'micro': '5px',
                'zapo': '8px',
                'comfortable': '11px',
                'large': '12px',
                'pill': '980px',
            },
            boxShadow: {
                'zapo': '0 10px 30px rgba(0, 0, 0, 0.12)',
                'zapo-hover': '0 20px 40px rgba(0, 0, 0, 0.22)',
            },
            animation: {
                'zapo-fade': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
};
