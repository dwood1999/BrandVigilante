<script lang="ts">
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    
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
            const name = formatSegment(segment);
            return {
                name,
                path,
                isLast: index === array.length - 1
            };
        });

    // Define page titles for special cases
    const pageTitles: Record<string, string> = {
        'sign-in': 'Sign In',
        'sign-up': 'Sign Up',
        'admin': 'Admin Dashboard',
        'dashboard': 'Dashboard',
        'profile': 'Your Profile',
        'settings': 'Settings',
        'listings': 'Listings',
        'contact': 'Contact Us'
    };

    // Get the page title for a segment
    function getPageTitle(segment: string): string {
        return pageTitles[segment] || formatSegment(segment);
    }
</script>

<nav class="text-sm" aria-label="Breadcrumb">
    <ol 
        class="flex items-center flex-wrap gap-2"
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
    >
        <li 
            class="flex items-center"
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
        >
            <a 
                href="/" 
                class="inline-flex items-center py-2 min-h-[44px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                itemprop="item"
                aria-label="Home"
            >
                 <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                     <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                 </svg>
                <span class="sr-only">Home</span>
            </a>
            <meta itemprop="position" content="1" />
        </li>
        
        {#each pathSegments as segment, i}
            <li 
                class="flex items-center"
                itemprop="itemListElement"
                itemscope
                itemtype="https://schema.org/ListItem"
            >
                <svg 
                    class="h-4 w-4 text-gray-400 mx-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path 
                        fill-rule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clip-rule="evenodd" 
                    />
                </svg>
                {#if segment.isLast}
                    <span 
                        class="inline-flex items-center py-2 min-h-[44px] text-gray-900 dark:text-gray-100 font-medium px-1 rounded-md"
                        aria-current="page"
                        itemprop="name"
                    >
                        {getPageTitle(segment.path.split('/').pop() || '')}
                    </span>
                {:else}
                    <a 
                        href={segment.path} 
                        class="inline-flex items-center py-2 min-h-[44px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        itemprop="item"
                    >
                        <span itemprop="name">
                            {getPageTitle(segment.path.split('/').pop() || '')}
                        </span>
                    </a>
                {/if}
                <meta itemprop="position" content={String(i + 2)} />
            </li>
        {/each}
    </ol>
</nav> 