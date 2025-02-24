<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import { fade } from 'svelte/transition';

    export let data: PageData;
    export let form: ActionData;
    
    let loading = false;
    let name = data.marketplace.name;
    let url = data.marketplace.url;

    $: isValid = name.trim().length > 0 && url.trim().length > 0;
</script>

<svelte:head>
    <title>Edit Marketplace: {data.marketplace.name} - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Edit Marketplace: {data.marketplace.name}
                </h2>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <a
                    href="/admin/marketplaces"
                    class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Back to Marketplaces
                </a>
            </div>
        </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mt-8 bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <form
                    method="POST"
                    use:enhance={() => {
                        loading = true;
                        return async ({ result }) => {
                            loading = false;
                            if (result.type === 'success') {
                                window.location.href = '/admin/marketplaces';
                            }
                        };
                    }}
                >
                    <div class="space-y-6">
                        <div>
                            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">
                                Marketplace Name *
                            </label>
                            <div class="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    bind:value={name}
                                    required
                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter marketplace name"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="url" class="block text-sm font-medium leading-6 text-gray-900">
                                Website URL *
                            </label>
                            <div class="mt-2">
                                <input
                                    type="url"
                                    name="url"
                                    id="url"
                                    bind:value={url}
                                    required
                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        {#if data.marketplace.brands && data.marketplace.brands.length > 0}
                            <div>
                                <label class="block text-sm font-medium leading-6 text-gray-900">
                                    Associated Brands
                                </label>
                                <div class="mt-2">
                                    <div class="flex flex-wrap gap-2">
                                        {#each data.marketplace.brands as brand}
                                            <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {brand.name}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        {/if}

                        {#if form?.error}
                            <div class="rounded-md bg-red-50 p-4">
                                <div class="flex">
                                    <div class="ml-3">
                                        <h3 class="text-sm font-medium text-red-800">
                                            {form.error}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        {/if}

                        <div class="flex justify-end gap-x-3">
                            <a
                                href="/admin/marketplaces"
                                class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                disabled={!isValid || loading}
                                class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> 