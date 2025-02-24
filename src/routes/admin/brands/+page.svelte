<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import SearchInput from '$lib/components/SearchInput.svelte';
    import BrandCard from './BrandCard.svelte';

    export let data: PageData;

    let searchQuery = '';
    let filteredBrands = data.brands;

    $: {
        filteredBrands = data.brands.filter(brand => 
            brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brand.url.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
</script>

<svelte:head>
    <title>Manage Brands - Admin Dashboard</title>
</svelte:head>

<div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
        <!-- Header -->
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">Brands</h1>
                <p class="mt-2 text-sm text-gray-700">
                    A list of all brands including their name, URL, and associated terms.
                </p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <a
                    href="/admin/brands/new"
                    class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                >
                    Add brand
                </a>
            </div>
        </div>

        <!-- Search -->
        <div class="mt-6">
            <SearchInput
                bind:value={searchQuery}
                placeholder="Search brands..."
                class="max-w-md"
            />
        </div>

        <!-- Brand List -->
        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each filteredBrands as brand (brand.id)}
                <BrandCard {brand} />
            {/each}
        </div>

        {#if filteredBrands.length === 0}
            <div class="text-center py-12">
                <p class="text-sm text-gray-500">No brands found</p>
            </div>
        {/if}
    </div>
</div> 