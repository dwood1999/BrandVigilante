import { writable } from 'svelte/store';

export const formStore = writable({
    isOpen: false,
    isSubmitting: false
}); 