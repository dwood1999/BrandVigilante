{#if $page.data.userMessage}
    <div class="alert alert-info mb-4">
        {$page.data.userMessage}
    </div>
{/if}

<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';

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
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Product Listings</h1>
        <div class="flex items-center space-x-4">
            <div class="relative">
                <input
                    type="text"
                    placeholder="Search listings..."
                    bind:value={searchInput}
                    on:input={handleSearch}
                    class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <select
                bind:value={selectedPerPage}
                on:change={handlePerPageChange}
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
            </select>
        </div>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
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
                    {#each listings as listing}
                        <tr>
                            <td class="px-6 py-4 w-[30%]">
                                <div class="text-sm font-medium text-gray-900 break-words">{listing.product_title}</div>
                                <div class="text-sm text-gray-500">
                                    UPC: {listing.product_upc} | EAN: {listing.product_ean}
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

    <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{startRecord}</span> to{' '}
            <span class="font-medium">{endRecord}</span> of{' '}
            <span class="font-medium">{pagination.total}</span> results
        </div>
        <div class="flex items-center space-x-2">
            <button
                class="px-3 py-1 rounded-md bg-white border text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                on:click={() => goToPage(1)}
            >
                First
            </button>
            <button
                class="px-3 py-1 rounded-md bg-white border text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                on:click={() => goToPage(currentPage - 1)}
            >
                Previous
            </button>
            <span class="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <button
                class="px-3 py-1 rounded-md bg-white border text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === totalPages}
                on:click={() => goToPage(currentPage + 1)}
            >
                Next
            </button>
            <button
                class="px-3 py-1 rounded-md bg-white border text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === totalPages}
                on:click={() => goToPage(totalPages)}
            >
                Last
            </button>
        </div>
    </div>
</div> 