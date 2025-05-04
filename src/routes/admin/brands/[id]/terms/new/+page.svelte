<script lang="ts">
    import { fade } from 'svelte/transition';
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    let loading = false;
</script>

<svelte:head>
    <title>Add New Term - {data.brand.name} - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Add New Trademark Term
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                    for {data.brand.name}
                </p>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <a
                    href="/admin/brands/{data.brand.id}/manage?tab=terms"
                    class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Back to Terms
                </a>
            </div>
        </div>

        <form
            method="POST"
            class="mt-8 bg-white shadow sm:rounded-lg"
            use:enhance={() => {
                loading = true;
                return async ({ result, update }) => {
                    loading = false;
                    await update();
                    
                    if (result.type === 'success') {
                        window.location.href = `/admin/brands/${data.brand.id}/manage?tab=terms`;
                    }
                };
            }}
        >
            <div class="px-4 py-5 sm:p-6">
                {#if form?.error}
                    <div class="mb-6 rounded-md bg-red-50 p-4">
                        <div class="flex">
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">Error</h3>
                                <p class="text-sm text-red-700">{form.error}</p>
                            </div>
                        </div>
                    </div>
                {/if}

                <div class="space-y-6">
                    <div>
                        <label for="term" class="block text-sm font-medium leading-6 text-gray-900">
                            Trademark Term
                        </label>
                        <div class="mt-2">
                            <input
                                type="text"
                                name="term"
                                id="term"
                                required
                                class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <p class="mt-3 text-sm leading-6 text-gray-600">
                            Enter the exact term you want to monitor.
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-end gap-x-6 border-t border-gray-200 px-4 py-4 sm:px-6">
                <button
                    type="submit"
                    class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Term'}
                </button>
            </div>
        </form>
    </div>
</div> 