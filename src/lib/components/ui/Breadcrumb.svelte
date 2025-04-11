<script lang="ts">
    import { page } from '$app/stores';
    
    // Format the path segments for display
    function formatSegment(segment: string): string {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    // Get the current path segments
    $: pathSegments = $page.url.pathname
        .split('/')
        .filter(Boolean)
        .map((segment, index, array) => {
            const path = '/' + array.slice(0, index + 1).join('/');
            return {
                name: formatSegment(segment),
                path
            };
        });
</script>

<nav class="text-xs" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-1">
        <li>
            <a href="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Home
            </a>
        </li>
        
        {#each pathSegments as segment, i}
            <li class="flex items-center">
                <svg class="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                {#if i === pathSegments.length - 1}
                    <span class="ml-1 text-gray-700 dark:text-gray-300 font-medium" aria-current="page">
                        {segment.name}
                    </span>
                {:else}
                    <a href={segment.path} class="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        {segment.name}
                    </a>
                {/if}
            </li>
        {/each}
    </ol>
</nav> 