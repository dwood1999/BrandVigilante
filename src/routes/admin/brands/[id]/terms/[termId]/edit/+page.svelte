<script lang="ts">
    import { fade } from 'svelte/transition';
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    let loading = false;
    let showDeleteConfirm = false;

    const handleSubmit = () => {
        loading = true;
        return async ({ result, update }) => {
            loading = false;
            await update();
            
            if (result.type === 'success') {
                window.location.href = `/admin/brands/${data.brand.id}/manage?tab=terms`;
            }
        };
    };
</script>

<svelte:head>
    <title>Edit Term - {data.brand.name} - Admin Dashboard</title>
</svelte:head>

<div class="min-h-full bg-gray-50" in:fade>
    <div class="py-6">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="md:flex md:items-center md:justify-between">
                <div class="min-w-0 flex-1">
                    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Edit Trademark Term
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

            <div class="mt-8 space-y-6">
                <!-- Update Form -->
                <form
                    method="POST"
                    action="?/update"
                    class="bg-gray-100 shadow-sm ring-1 ring-gray-900/5 rounded-xl"
                    use:enhance={handleSubmit}
                >
                    <div class="px-4 py-6 sm:p-8">
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

                        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
                            <div class="col-span-full">
                                <label for="term" class="block text-sm font-medium leading-6 text-gray-900">
                                    Trademark Term
                                </label>
                                <div class="mt-2">
                                    <input
                                        type="text"
                                        name="term"
                                        id="term"
                                        required
                                        value={data.term.term}
                                        class="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <p class="mt-3 text-sm leading-6 text-gray-600">
                                    Enter the exact term you want to monitor.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-x-6 border-t border-gray-300 bg-gray-50 px-4 py-4 sm:px-8 rounded-b-xl">
                        <button
                            type="button"
                            class="text-sm font-semibold leading-6 text-red-600 hover:text-red-500"
                            on:click={() => showDeleteConfirm = true}
                        >
                            Delete Term
                        </button>
                        <button
                            type="submit"
                            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                <!-- Delete Confirmation Modal -->
                {#if showDeleteConfirm}
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div class="fixed inset-0 z-10 overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div class="sm:flex sm:items-start">
                                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                        </svg>
                                    </div>
                                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3 class="text-base font-semibold leading-6 text-gray-900">
                                            Delete Trademark Term
                                        </h3>
                                        <div class="mt-2">
                                            <p class="text-sm text-gray-500">
                                                Are you sure you want to delete this trademark term? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <form
                                        method="POST"
                                        action="?/delete"
                                        use:enhance={handleSubmit}
                                    >
                                        <button
                                            type="submit"
                                            class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            disabled={loading}
                                        >
                                            {loading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </form>
                                    <button
                                        type="button"
                                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        on:click={() => showDeleteConfirm = false}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div> 