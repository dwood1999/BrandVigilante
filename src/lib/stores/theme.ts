import { readable } from 'svelte/store';

export const theme = readable<'light'>('light', () => {
    // Always light mode, do nothing on subscribe
    return () => {};
}); 