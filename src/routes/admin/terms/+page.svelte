<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { fade } from 'svelte/transition';
    import SearchInput from '$lib/components/SearchInput.svelte';

    export let data: PageData;

    let searchQuery = '';
    let filteredTerms = data.terms;

    $: {
        filteredTerms = data.terms.filter(term => 
            term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            term.brand_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    function confirmDelete(event: MouseEvent) {
        return confirm('Are you sure you want to delete this term?');
    }
</script>

<svelte:head>
    <title>Trademark Terms - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Trademark Terms
                </h2>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <a
                    href="/admin/terms/new"
                    class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Add New Term
                </a>
            </div>
        </div>
    </div>

    <div class="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Search -->
        <div class="w-full max-w-lg">
            <SearchInput
                bind:value={searchQuery}
                placeholder="Search terms or brands..."
            />
        </div>

        <!-- Terms List -->
        <div class="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
            {#if filteredTerms.length === 0}
                <div class="p-4 text-center text-gray-500">
                    {searchQuery ? 'No terms found matching your search.' : 'No trademark terms have been added yet.'}
                </div>
            {:else}
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Term
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Brand
                            </th>
                            <th scope="col" class="relative px-6 py-3">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#each filteredTerms as term, index (term.id || index)}
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    {term.term}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {term.brand_name}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="ml-2 flex flex-shrink-0">
                                        <a
                                            href="/admin/terms/{term.id}/edit"
                                            class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                                        >
                                            Edit
                                        </a>
                                        <form
                                            action="?/deleteTerm"
                                            method="POST"
                                            use:enhance={() => {
                                                return async () => {
                                                    if (!confirm('Are you sure you want to delete this term?')) {
                                                        return false;
                                                    }
                                                };
                                            }}
                                        >
                                            <input type="hidden" name="termId" value={term.id}>
                                            <button
                                                type="submit"
                                                class="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-600/10 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>
</div> 