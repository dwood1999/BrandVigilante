<script lang="ts">
    import { performance, performanceScore } from '$lib/stores/performance';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    
    // Only show in development mode
    $: showMonitor = browser && import.meta.env.DEV;
    
    let isExpanded = false;
    let isVisible = true;
    
    // Auto-collapse after 5 seconds
    onMount(() => {
        setTimeout(() => {
            isExpanded = false;
        }, 5000);
    });
    
    // Format time in milliseconds
    function formatTime(ms: number | null): string {
        if (ms === null) return 'N/A';
        return `${ms.toFixed(2)}ms`;
    }
    
    // Get color based on score
    function getScoreColor(score: number | null): string {
        if (score === null) return 'text-gray-500';
        if (score >= 90) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    }
    
    // Toggle visibility
    function toggleVisibility() {
        isVisible = !isVisible;
    }
</script>

{#if showMonitor}
    <div class="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out {isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-sm font-semibold">Performance Metrics</h3>
                <div class="flex gap-2">
                    <button 
                        class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        on:click={() => isExpanded = !isExpanded}
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                    <button 
                        class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        on:click={toggleVisibility}
                    >
                        {isVisible ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
            
            {#if isExpanded}
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span class="font-medium">FCP:</span> {formatTime($performance.fcp)}
                    </div>
                    <div>
                        <span class="font-medium">LCP:</span> {formatTime($performance.lcp)}
                    </div>
                    <div>
                        <span class="font-medium">FID:</span> {formatTime($performance.fid)}
                    </div>
                    <div>
                        <span class="font-medium">CLS:</span> {$performance.cls?.toFixed(4) || 'N/A'}
                    </div>
                    <div>
                        <span class="font-medium">TTFB:</span> {formatTime($performance.ttfb)}
                    </div>
                    <div>
                        <span class="font-medium">Score:</span> 
                        <span class={getScoreColor($performanceScore)}>
                            {$performanceScore || 'N/A'}
                        </span>
                    </div>
                </div>
                
                <div class="mt-2 text-xs">
                    <details>
                        <summary class="cursor-pointer">Navigation Timing</summary>
                        <div class="grid grid-cols-2 gap-1 mt-1 pl-2">
                            <div>DNS: {formatTime($performance.navigationTiming.dnsLookup)}</div>
                            <div>TCP: {formatTime($performance.navigationTiming.tcpConnection)}</div>
                            <div>Server: {formatTime($performance.navigationTiming.serverResponse)}</div>
                            <div>DOM: {formatTime($performance.navigationTiming.domLoad)}</div>
                            <div>Window: {formatTime($performance.navigationTiming.windowLoad)}</div>
                        </div>
                    </details>
                </div>
            {:else}
                <div class="text-xs text-center text-gray-500">
                    Performance metrics available
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* Smooth transitions */
    .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }
</style> 