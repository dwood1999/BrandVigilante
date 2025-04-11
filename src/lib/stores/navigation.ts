import { writable, derived } from 'svelte/store';
import { page } from '$app/stores';
import { browser } from '$app/environment';

export interface NavigationState {
    activeRoute: string;
    previousRoute: string | null;
    isNavigating: boolean;
    navigationHistory: string[];
}

function createNavigationStore() {
    const { subscribe, set, update } = writable<NavigationState>({
        activeRoute: '',
        previousRoute: null,
        isNavigating: false,
        navigationHistory: []
    });

    // Only subscribe to page store in browser environment
    if (browser) {
        try {
            // Subscribe to page store to track navigation
            page.subscribe(({ url }) => {
                update(state => {
                    const currentPath = url.pathname;
                    
                    // Don't update if it's the same route
                    if (state.activeRoute === currentPath) return state;
                    
                    return {
                        activeRoute: currentPath,
                        previousRoute: state.activeRoute,
                        isNavigating: false,
                        navigationHistory: [...state.navigationHistory, state.activeRoute].filter(Boolean)
                    };
                });
            });
        } catch (error) {
            console.error('Error subscribing to page store:', error);
        }
    }

    return {
        subscribe,
        setNavigating: (isNavigating: boolean) => {
            update(state => ({ ...state, isNavigating }));
        },
        goBack: () => {
            update(state => {
                if (state.navigationHistory.length > 0) {
                    const previousRoute = state.navigationHistory[state.navigationHistory.length - 1];
                    return {
                        ...state,
                        navigationHistory: state.navigationHistory.slice(0, -1),
                        previousRoute: state.activeRoute,
                        activeRoute: previousRoute
                    };
                }
                return state;
            });
        }
    };
}

export const navigation = createNavigationStore();

// Derived store for active route segments
export const activeRouteSegments = derived(navigation, $navigation => {
    return $navigation.activeRoute.split('/').filter(Boolean);
}); 