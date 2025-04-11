<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { navigation } from '$lib/stores/navigation';
    import { browser } from '$app/environment';
    
    export let duration = 300;
    export let y = 20;
    
    // Determine which transition to use based on navigation direction
    // Only use transitions in browser environment
    $: transition = browser && $navigation.isNavigating 
        ? fly 
        : fade;
    
    // Determine transition parameters
    $: params = browser && $navigation.isNavigating 
        ? { y, duration } 
        : { duration };
</script>

<div in:transition={params} out:fade={{ duration: duration / 2 }}>
    <slot />
</div> 