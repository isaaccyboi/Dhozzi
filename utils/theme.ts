import { Plan } from '../types';

export const THEME_COLORS = {
    blue: {
        start: '#2563eb', // blue-600
        end: '#1d4ed8',   // blue-700
        accent: '#3b82f6', // blue-500 for highlights
        glow: 'rgba(37, 99, 235, 0.2)',
        glow2: 'rgba(99, 102, 241, 0.2)', // a related indigo for variety
    },
    purple: {
        start: '#7c3aed', // violet-600
        end: '#6d28d9',   // violet-700
        accent: '#8b5cf6', // violet-500 for highlights
        glow: 'rgba(124, 58, 237, 0.2)',
        glow2: 'rgba(139, 92, 246, 0.2)', // lighter violet
    },
    green: {
        start: '#059669', // emerald-600
        end: '#047857',   // emerald-700
        accent: '#10b981', // emerald-500 for highlights
        glow: 'rgba(5, 150, 105, 0.2)',
        glow2: 'rgba(16, 185, 129, 0.2)', // lighter emerald
    },
    orange: { // For Admin
        start: '#f97316', // orange-500
        end: '#ea580c',   // orange-600
        accent: '#fb923c', // orange-400
        glow: 'rgba(249, 115, 22, 0.2)',
        glow2: 'rgba(251, 146, 60, 0.2)', // lighter orange
    }
};

export const applyTheme = (plan: Plan | 'admin') => {
    let theme;
    switch (plan) {
        case 'premium':
            theme = THEME_COLORS.purple;
            break;
        case 'platinum':
            theme = THEME_COLORS.green;
            break;
        case 'admin':
            theme = THEME_COLORS.orange;
            break;
        case 'basic':
        default:
            theme = THEME_COLORS.blue;
            break;
    }

    const root = document.documentElement;
    root.style.setProperty('--color-primary-start', theme.start);
    root.style.setProperty('--color-primary-end', theme.end);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-user-message', theme.accent);
    root.style.setProperty('--glow-color-1', theme.glow);
    root.style.setProperty('--glow-color-2', theme.glow2);
};