{#if $page.data.userMessage}
    <div class="alert alert-info mb-4">
        {$page.data.userMessage}
    </div>
{/if}

<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    // import { enhance } from '$app/forms'; // enhance seems unused now
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { buttonVariants } from '$lib/components/ui/button/variants'; // Import variants
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card'; 
    import { Badge } from '$lib/components/ui/badge'; 
    import { cn } from "$lib/utils"; // Import cn utility

    export let data: PageData;

    let searchInput = $page.url.searchParams.get('search') || '';
    let selectedPerPage = $page.url.searchParams.get('perPage') || '10';
    let debounceTimer: NodeJS.Timeout;
    let currentUrl = $page.url;

    $: ({ listings, pagination, meta } = data);
    $: currentPage = pagination.page;
    $: totalPages = pagination.totalPages;
    $: startRecord = (pagination.page - 1) * pagination.perPage + 1;
    $: endRecord = Math.min(startRecord + pagination.perPage - 1, pagination.total);

    function updateUrl() {
        const url = new URL(currentUrl);
        if (searchInput) {
            url.searchParams.set('search', searchInput);
        } else {
            url.searchParams.delete('search');
        }
        url.searchParams.set('perPage', selectedPerPage);
        goto(url.toString());
    }

    function handleSearch() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const url = new URL(currentUrl);
            url.searchParams.set('page', '1'); // Reset to first page on search
            if (searchInput) {
                url.searchParams.set('search', searchInput);
            } else {
                url.searchParams.delete('search');
            }
            goto(url.toString());
        }, 300);
    }

    function handlePerPageChange() {
        const url = new URL(currentUrl);
        url.searchParams.set('page', '1'); // Reset to first page when changing items per page
        url.searchParams.set('perPage', selectedPerPage);
        goto(url.toString());
    }

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        const url = new URL(currentUrl);
        url.searchParams.set('page', page.toString());
        goto(url.toString());
    }
</script>

<svelte:head>
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Product Listings</h1>
        <div class="flex flex-wrap items-center gap-4">
            <div class="relative">
                <input
                    type="text"
                    placeholder="Search listings..."
                    bind:value={searchInput}
                    on:input={handleSearch}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>
            <select
                bind:value={selectedPerPage}
                on:change={handlePerPageChange}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
            </select>
        </div>
    </div>

    <div class="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                            Product
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marketplace
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seller
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each listings as listing (listing.id)}
                        <tr>
                            <td class="px-6 py-4 w-[30%]">
                                <div class="text-sm font-medium text-gray-900 break-words">{listing.product_title}</div>
                                <div class="text-sm text-gray-500">
                                    UPC: {listing.product_upc ?? 'N/A'} | EAN: {listing.product_ean ?? 'N/A'}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{listing.marketplace_name}</div>
                                <div class="text-sm text-gray-500">{listing.marketplace_country}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                {#if listing.seller_id}
                                    <div class="text-sm text-gray-900">
                                        <a href={listing.seller_url} target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                                            {listing.seller_name}
                                        </a>
                                    </div>
                                    {#if listing.is_buybox_winner}
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Buy Box Winner
                                        </span>
                                    {/if}
                                {:else}
                                    <div class="text-sm text-gray-500">No seller assigned</div>
                                {/if}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    {listing.price} {listing.currency}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(listing.created_at).toLocaleDateString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href={listing.url} target="_blank" rel="noopener noreferrer"
                                   class="text-blue-600 hover:text-blue-900">
                                    View Listing
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <div class="block md:hidden space-y-4">
        {#each listings as listing (listing.id)}
            <Card>
                <CardHeader class="pb-2">
                    <CardTitle class="text-base break-words">{listing.product_title}</CardTitle>
                    <CardDescription>
                        UPC: {listing.product_upc ?? 'N/A'} | EAN: {listing.product_ean ?? 'N/A'}
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-2 text-sm">
                    <div>
                        <span class="font-medium text-gray-700">Marketplace:</span> 
                        {listing.marketplace_name} ({listing.marketplace_country})
                    </div>
                    <div>
                        <span class="font-medium text-gray-700">Seller:</span> 
                        {#if listing.seller_id}
                            <a href={listing.seller_url} target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                                {listing.seller_name}
                            </a>
                            {#if listing.is_buybox_winner}
                                <Badge variant="success" class="ml-2">Buy Box</Badge>
                            {/if}
                        {:else}
                            <span class="text-gray-500">N/A</span>
                        {/if}
                    </div>
                    <div>
                        <span class="font-medium text-gray-700">Price:</span> 
                        {listing.price} {listing.currency}
                    </div>
                    <div>
                        <span class="font-medium text-gray-700">Created:</span> 
                        {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                    <div class="pt-2">
                         <a 
                            href={listing.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                         >
                            View Listing
                        </a>
                    </div>
                </CardContent>
            </Card>
        {/each}
    </div>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{startRecord}</span> to{' '}
            <span class="font-medium">{endRecord}</span> of{' '}
            <span class="font-medium">{pagination.total}</span> results
        </div>
        <div class="flex items-center space-x-1">
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                on:click={() => goToPage(1)}
            >
                First
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                on:click={() => goToPage(currentPage - 1)}
            >
                Previous
            </Button>
            <span class="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                on:click={() => goToPage(currentPage + 1)}
            >
                Next
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                on:click={() => goToPage(totalPages)}
            >
                Last
            </Button>
        </div>
    </div>
</div> 