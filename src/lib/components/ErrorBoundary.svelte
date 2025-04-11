<script lang="ts">
    import { onMount } from 'svelte';
    import type { ErrorBoundaryProps } from '$lib/types/components';
    
    export let fallback = 'Something went wrong. Please try again.';
    export let onError: ((error: Error) => void) | undefined = undefined;
    
    let error: Error | null = null;
    
    onMount(() => {
        const handleError = (event: ErrorEvent) => {
            error = event.error;
            if (onError) {
                onError(event.error);
            }
            event.preventDefault();
        };
        
        window.addEventListener('error', handleError);
        
        return () => {
            window.removeEventListener('error', handleError);
        };
    });
</script>

{#if error}
    <div class="error-boundary p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 class="text-red-800 font-semibold mb-2">Error</h2>
        <p class="text-red-600 mb-4">{fallback}</p>
        {#if import.meta.env.DEV}
            <pre class="text-sm text-red-500 bg-red-100 p-2 rounded overflow-auto">
                {error.message}
            </pre>
        {/if}
        <button
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            on:click={() => window.location.reload()}
        >
            Reload Page
        </button>
    </div>
{:else}
    <slot />
{/if} 