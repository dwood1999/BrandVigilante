import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Define interfaces for performance entries
interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
}

export interface PerformanceMetrics {
    fcp: number | null; // First Contentful Paint
    lcp: number | null; // Largest Contentful Paint
    fid: number | null; // First Input Delay
    cls: number | null; // Cumulative Layout Shift
    ttfb: number | null; // Time to First Byte
    navigationTiming: {
        dnsLookup: number;
        tcpConnection: number;
        serverResponse: number;
        domLoad: number;
        windowLoad: number;
    };
}

function createPerformanceStore() {
    const { subscribe, set, update } = writable<PerformanceMetrics>({
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
        navigationTiming: {
            dnsLookup: 0,
            tcpConnection: 0,
            serverResponse: 0,
            domLoad: 0,
            windowLoad: 0
        }
    });

    if (browser) {
        // Initialize performance observers
        const initPerformanceObservers = () => {
            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (entries.length > 0) {
                    update(state => ({
                        ...state,
                        fcp: entries[0].startTime
                    }));
                }
            });
            fcpObserver.observe({ entryTypes: ['paint'] });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (entries.length > 0) {
                    update(state => ({
                        ...state,
                        lcp: entries[entries.length - 1].startTime
                    }));
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (entries.length > 0) {
                    const entry = entries[0] as PerformanceEventTiming;
                    update(state => ({
                        ...state,
                        fid: entry.processingStart - entry.startTime
                    }));
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    const layoutShift = entry as LayoutShift;
                    if (!layoutShift.hadRecentInput) {
                        clsValue += layoutShift.value;
                    }
                }
                update(state => ({
                    ...state,
                    cls: clsValue
                }));
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            // Time to First Byte
            const navigationEntries = window.performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
                const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
                update(state => ({
                    ...state,
                    ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
                    navigationTiming: {
                        dnsLookup: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
                        tcpConnection: navigationEntry.connectEnd - navigationEntry.connectStart,
                        serverResponse: navigationEntry.responseEnd - navigationEntry.requestStart,
                        domLoad: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
                        windowLoad: navigationEntry.loadEventEnd - navigationEntry.loadEventStart
                    }
                }));
            }
        };

        // Initialize observers when the page loads
        if (document.readyState === 'complete') {
            initPerformanceObservers();
        } else {
            window.addEventListener('load', initPerformanceObservers);
        }
    }

    return {
        subscribe,
        reset: () => {
            set({
                fcp: null,
                lcp: null,
                fid: null,
                cls: null,
                ttfb: null,
                navigationTiming: {
                    dnsLookup: 0,
                    tcpConnection: 0,
                    serverResponse: 0,
                    domLoad: 0,
                    windowLoad: 0
                }
            });
        }
    };
}

export const performance = createPerformanceStore();

// Derived store for performance score
export const performanceScore = derived(performance, $performance => {
    if (!$performance.fcp || !$performance.lcp || !$performance.fid || !$performance.cls) {
        return null;
    }
    
    // Calculate a simple performance score (0-100)
    // This is a simplified version of the Core Web Vitals scoring
    const fcpScore = Math.max(0, 100 - ($performance.fcp / 20));
    const lcpScore = Math.max(0, 100 - ($performance.lcp / 25));
    const fidScore = Math.max(0, 100 - ($performance.fid / 10));
    const clsScore = Math.max(0, 100 - ($performance.cls * 100));
    
    return Math.round((fcpScore + lcpScore + fidScore + clsScore) / 4);
}); 