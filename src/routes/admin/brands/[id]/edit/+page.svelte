<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { fade } from 'svelte/transition';
    import FormField from '$lib/components/ui/FormField.svelte';
    import FormContainer from '$lib/components/ui/FormContainer.svelte';
    import FormGroup from '$lib/components/ui/FormGroup.svelte';

    interface FormResult {
        type: 'success' | 'failure';
        data?: any;
    }

    interface FormErrors {
        error?: string;
        success?: boolean;
        message?: string;
        fieldErrors?: {
            name?: string;
            display_name?: string;
            url?: string;
            description?: string;
            status?: string;
        };
    }

    export let data: PageData;
    export let form: FormErrors;
    
    let loading = false;
    let name = data.brand.name || '';
    let display_name = data.brand.display_name || '';
    let url = data.brand.url || '';
    let description = data.brand.description || '';
    let status = data.brand.status || 'active';
    let formError: string | null = form?.error || null;
    let formSuccess: string | null = form?.success ? form.message || 'Brand updated successfully!' : null;

    function handleInput(event: Event) {
        formError = null;
        formSuccess = null;
    }

    // Only validate if the fields have been modified
    $: isValid = true;
</script>

<svelte:head>
    <title>Edit Brand: {data.brand.name} - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Edit Brand: {data.brand.name}
                </h2>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <a
                    href="/admin/brands"
                    class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Back to Brands
                </a>
            </div>
        </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mt-8 bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <form
                    method="POST"
                    action="?/update"
                    class="space-y-6"
                    on:input={handleInput}
                    use:enhance={() => {
                        loading = true;
                        return async ({ result }) => {
                            loading = false;
                            if (result.type === 'success') {
                                formSuccess = result.data?.message || 'Brand updated successfully!';
                                formError = null;
                            }
                        };
                    }}
                >
                    {#if formError}
                        <div class="rounded-md bg-red-50 p-4">
                            <div class="flex">
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-red-800">
                                        {formError}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    {/if}

                    {#if formSuccess}
                        <div class="rounded-md bg-green-50 p-4">
                            <div class="flex">
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-green-800">
                                        {formSuccess}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    {/if}

                    <div class="space-y-6">
                        <div>
                            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">
                                Brand Name
                            </label>
                            <div class="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    bind:value={name}
                                    required
                                    class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            {#if form?.fieldErrors?.name}
                                <p class="mt-2 text-sm text-red-600">{form.fieldErrors.name}</p>
                            {/if}
                        </div>

                        <div>
                            <label for="display_name" class="block text-sm font-medium leading-6 text-gray-900">
                                Display Name
                            </label>
                            <div class="mt-2">
                                <input
                                    type="text"
                                    name="display_name"
                                    id="display_name"
                                    bind:value={display_name}
                                    required
                                    class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            {#if form?.fieldErrors?.display_name}
                                <p class="mt-2 text-sm text-red-600">{form.fieldErrors.display_name}</p>
                            {/if}
                        </div>

                        <div>
                            <label for="url" class="block text-sm font-medium leading-6 text-gray-900">
                                Website URL
                            </label>
                            <div class="mt-2">
                                <input
                                    type="url"
                                    name="url"
                                    id="url"
                                    bind:value={url}
                                    class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            {#if form?.fieldErrors?.url}
                                <p class="mt-2 text-sm text-red-600">{form.fieldErrors.url}</p>
                            {/if}
                        </div>

                        <div>
                            <label for="description" class="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div class="mt-2">
                                <textarea
                                    name="description"
                                    id="description"
                                    bind:value={description}
                                    rows="3"
                                    class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                ></textarea>
                            </div>
                            {#if form?.fieldErrors?.description}
                                <p class="mt-2 text-sm text-red-600">{form.fieldErrors.description}</p>
                            {/if}
                        </div>

                        <div>
                            <label for="status" class="block text-sm font-medium leading-6 text-gray-900">
                                Status
                            </label>
                            <div class="mt-2">
                                <select
                                    name="status"
                                    id="status"
                                    bind:value={status}
                                    class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            {#if form?.fieldErrors?.status}
                                <p class="mt-2 text-sm text-red-600">{form.fieldErrors.status}</p>
                            {/if}
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {#if loading}
                                Saving...
                            {:else}
                                Save Changes
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> 