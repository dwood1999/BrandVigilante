import { writable } from 'svelte/store';

// Initialize theme from localStorage or default to 'light'
const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : 'light';
export const theme = writable<'light' | 'dark'>(storedTheme as 'light' | 'dark' || 'light');

// Update localStorage and document class when theme changes
theme.subscribe((value) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', value);
    }
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', value === 'dark');
    }
});

// Initialize theme on mount
if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
} 