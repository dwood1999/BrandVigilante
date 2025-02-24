<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { fade } from 'svelte/transition';
    import SearchInput from '$lib/components/SearchInput.svelte';

    export let data: PageData;

    let searchQuery = '';
    let filteredMarketplaces = data.marketplaces;

    $: {
        filteredMarketplaces = data.marketplaces.filter(marketplace => 
            marketplace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            marketplace.url.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
</script>

<svelte:head>
    <title>Manage Marketplaces - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Marketplaces
                </h2>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <a
                    href="/admin/marketplaces/new"
                    class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Add Marketplace
                </a>
            </div>
        </div>
    </div>

    <div class="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Search -->
        <div class="w-full max-w-lg">
            <SearchInput
                bind:value={searchQuery}
                placeholder="Search marketplaces..."
            />
        </div>

        <!-- Marketplace List -->
        <div class="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
                {#each filteredMarketplaces as marketplace (marketplace.marketplace_id)}
                    <li>
                        <div class="px-4 py-4 sm:px-6">
                            <div class="flex items-center justify-between">
                                <div class="truncate">
                                    <div class="flex text-sm">
                                        <p class="font-medium text-blue-600 truncate">
                                            {marketplace.name}
                                        </p>
                                    </div>
                                    <div class="mt-2 flex">
                                        <div class="flex items-center text-sm text-gray-500">
                                            <a 
                                                href={marketplace.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                class="hover:text-blue-600"
                                            >
                                                {marketplace.url}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="ml-2 flex flex-shrink-0">
                                    <a
                                        href="/admin/marketplaces/{marketplace.marketplace_id}/edit"
                                        class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                                    >
                                        Edit
                                    </a>
                                    <form
                                        action="?/deleteMarketplace"
                                        method="POST"
                                        use:enhance={() => {
                                            return async () => {
                                                const confirmed = confirm('Are you sure you want to delete this marketplace?');
                                                return confirmed;
                                            };
                                        }}
                                    >
                                        <input type="hidden" name="marketplaceId" value={marketplace.marketplace_id}>
                                        <button
                                            type="submit"
                                            class="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-600/10 hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                            {#if marketplace.brands && marketplace.brands.length > 0}
                                <div class="mt-2">
                                    <div class="text-sm text-gray-500">
                                        Associated Brands:
                                        <div class="mt-1 flex flex-wrap gap-2">
                                            {#each marketplace.brands as brand}
                                                <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                    {brand.name}
                                                </span>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div> 