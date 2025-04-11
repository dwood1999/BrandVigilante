import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
    const { subscribe, set, update } = writable<Theme>('light');

    if (browser) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') as Theme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        set(initialTheme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                set(e.matches ? 'dark' : 'light');
            }
        });
    }

    return {
        subscribe,
        toggle: () => {
            update(theme => {
                const newTheme = theme === 'light' ? 'dark' : 'light';
                if (browser) {
                    localStorage.setItem('theme', newTheme);
                }
                return newTheme;
            });
        },
        set: (theme: Theme) => {
            if (browser) {
                localStorage.setItem('theme', theme);
            }
            set(theme);
        }
    };
}

export const theme = createThemeStore(); 