<script lang="ts">
    import { onMount } from 'svelte';
    
    let skipLink: HTMLAnchorElement;
    let isVisible = false;
    
    onMount(() => {
        // Show skip link when tabbing
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                isVisible = true;
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });
    
    function handleFocus() {
        // Focus the main content when skip link is clicked
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            mainContent.removeAttribute('tabindex');
        }
    }
</script>

<a
    bind:this={skipLink}
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    on:click={handleFocus}
>
    Skip to main content
</a>

<div id="main-content" tabindex="-1">
    <slot />
</div> 