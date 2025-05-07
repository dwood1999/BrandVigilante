<script lang="ts">
    import { page } from '$app/stores';
    import type { LayoutData } from './$types';
    import { fade } from 'svelte/transition';

    export const data: LayoutData = { user: null };
</script>

<div class="min-h-screen bg-gray-50" in:fade>
    <slot />
</div> 