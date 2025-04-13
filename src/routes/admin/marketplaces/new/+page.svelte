<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData, ActionResult } from './$types';
    import { fade } from 'svelte/transition';
    import FormField from '$lib/components/ui/FormField.svelte';
    import FormGroup from '$lib/components/ui/FormGroup.svelte';

    interface FormResult {
        type: 'success' | 'failure' | 'redirect';
        data?: any;
        location?: string;
    }

    interface FormErrors {
        error?: string;
        fieldErrors?: {
            name?: string;
            url?: string;
        };
    }

    export let form: FormErrors;
    
    let loading = false;
    let error: string | null = null;
    let name = '';
    let url = '';

    $: isValid = name.trim().length > 0 && url.trim().length > 0;

    function handleSubmit() {
        loading = true;
        error = null;
        
        return async ({ result, update }) => {
            loading = false;
            
            if (result.type === 'redirect') {
                // Handle redirect response
                window.location.href = result.location || '/admin/marketplaces';
            } else if (result.type === 'failure') {
                // Handle error
                error = result.data?.error || 'Failed to create marketplace';
                await update();
            }
        };
    }
</script>

<svelte:head>
    <title>Add New Marketplace - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Add New Marketplace
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
                    use:enhance={handleSubmit}
                    class="space-y-6"
                >
                    {#if error}
                        <div class="rounded-md bg-red-50 p-4 mb-4">
                            <div class="flex">
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-red-800">Error</h3>
                                    <div class="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    
                    <FormGroup legend="Marketplace Details">
                        <FormField
                            label="Marketplace Name"
                            name="name"
                            type="text"
                            bind:value={name}
                            required
                            error={form?.fieldErrors?.name}
                            placeholder="Enter marketplace name"
                        />

                        <FormField
                            label="Website URL"
                            name="url"
                            type="url"
                            bind:value={url}
                            required
                            error={form?.fieldErrors?.url}
                            placeholder="https://example.com"
                        />
                    </FormGroup>

                    <div class="flex justify-end space-x-3">
                        <a
                            href="/admin/marketplaces"
                            class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            disabled={!isValid || loading}
                        >
                            {loading ? 'Creating...' : 'Create Marketplace'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> 