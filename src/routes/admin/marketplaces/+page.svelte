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
            marketplace.platform_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            marketplace.base_url.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    function confirmDelete(event: MouseEvent) {
        return confirm('Are you sure you want to delete this marketplace?');
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
            <label for="searchQuery" class="block text-sm font-medium text-gray-900 mb-1">Search</label>
            <input
                id="searchQuery"
                type="text"
                bind:value={searchQuery}
                class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
        </div>

        <!-- Marketplace List -->
        <div class="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
                {#each filteredMarketplaces as marketplace (marketplace.id)}
                    <li>
                        <div class="px-4 py-4 sm:px-6">
                            <div class="flex items-center justify-between">
                                <div class="truncate">
                                    <div class="flex text-sm">
                                        <p class="font-medium text-blue-600 truncate">
                                            {marketplace.platform_name}
                                        </p>
                                    </div>
                                    <div class="mt-2 flex">
                                        <div class="flex items-center text-sm text-gray-500">
                                            <a 
                                                href={marketplace.base_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                class="hover:text-blue-600"
                                            >
                                                {marketplace.base_url}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="ml-2 flex flex-shrink-0">
                                    <a
                                        href="/admin/marketplaces/{marketplace.id}/edit"
                                        class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                                    >
                                        Edit
                                    </a>
                                    <form
                                        action="?/deleteMarketplace"
                                        method="POST"
                                        use:enhance
                                    >
                                        <input type="hidden" name="marketplaceId" value={marketplace.id}>
                                        <button
                                            type="submit"
                                            class="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-600/10 hover:bg-red-100"
                                            on:click={confirmDelete}
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div> 