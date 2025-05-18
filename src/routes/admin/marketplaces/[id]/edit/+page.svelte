<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import { fade } from 'svelte/transition';

    interface FormResult {
        type: 'success' | 'failure';
        data?: any;
    }

    interface FormErrors {
        error?: string;
        success?: boolean;
        message?: string;
        fieldErrors?: {
            platform_name?: string;
            base_url?: string;
            currency_code?: string;
            country_code?: string;
            external_id?: string;
        };
    }

    export let data: PageData;
    export let form: FormErrors;
    
    let loading = false;
    let platform_name = data.marketplace?.platform_name || '';
    let base_url = data.marketplace?.base_url || '';
    let currency_code = data.marketplace?.currency_code || '';
    let country_code = data.marketplace?.country_code || '';
    let external_id = data.marketplace?.external_id || '';
    let formError: string | null = form?.error || null;
    let formSuccess: string | null = form?.success ? form.message || 'Marketplace updated successfully!' : null;

    function handleInput(event: Event) {
        formError = null;
        formSuccess = null;
    }

    $: isValid = platform_name.trim().length > 0 && base_url.trim().length > 0;
</script>

<svelte:head>
    <title>Edit Marketplace: {data.marketplace?.platform_name || 'Loading...'} - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col items-center sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-xl" in:fade>
        <h2 class="mt-2 text-center text-2xl font-bold text-gray-900">Edit Marketplace: {data.marketplace?.platform_name || 'Loading...'}</h2>
        <p class="mt-2 text-center text-base text-gray-600">Update marketplace details below.</p>
        <div class="mt-4 text-center">
            <a href="/admin/marketplaces" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Back to Marketplaces</a>
        </div>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-xl" in:fade={{ delay: 150 }}>
        <form 
            method="POST" 
            action="?/update"
            class="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6" 
            on:input={handleInput}
            use:enhance={() => {
                loading = true;
                return async ({ result }) => {
                    loading = false;
                    if (result.type === 'success') {
                        formSuccess = result.data?.message || 'Marketplace updated successfully!';
                        formError = null;
                    }
                };
            }}
            autocomplete="off"
        >
            {#if formError}
                <div class="rounded-md bg-red-50 p-4 text-red-700 text-sm">{formError}</div>
            {/if}
            {#if formSuccess}
                <div class="rounded-md bg-green-50 p-4 text-green-700 text-sm">{formSuccess}</div>
            {/if}
            <div class="space-y-1">
                <label for="platform_name" class="block text-sm font-medium text-gray-900">Platform Name</label>
                <input 
                    id="platform_name" 
                    name="platform_name" 
                    type="text" 
                    required 
                    bind:value={platform_name} 
                    class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                />
                {#if form?.fieldErrors?.platform_name}
                    <p class="mt-2 text-sm text-red-600">{form.fieldErrors.platform_name}</p>
                {/if}
            </div>
            <div class="space-y-1">
                <label for="base_url" class="block text-sm font-medium text-gray-900">Base URL</label>
                <input 
                    id="base_url" 
                    name="base_url" 
                    type="url" 
                    required 
                    bind:value={base_url} 
                    class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                />
                {#if form?.fieldErrors?.base_url}
                    <p class="mt-2 text-sm text-red-600">{form.fieldErrors.base_url}</p>
                {/if}
            </div>
            <div class="space-y-1">
                <label for="currency_code" class="block text-sm font-medium text-gray-900">Currency Code</label>
                <input 
                    id="currency_code" 
                    name="currency_code" 
                    type="text" 
                    required 
                    maxlength="3" 
                    bind:value={currency_code} 
                    class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                />
                {#if form?.fieldErrors?.currency_code}
                    <p class="mt-2 text-sm text-red-600">{form.fieldErrors.currency_code}</p>
                {/if}
            </div>
            <div class="space-y-1">
                <label for="country_code" class="block text-sm font-medium text-gray-900">Country Code</label>
                <input 
                    id="country_code" 
                    name="country_code" 
                    type="text" 
                    required 
                    maxlength="2" 
                    bind:value={country_code} 
                    class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                />
                {#if form?.fieldErrors?.country_code}
                    <p class="mt-2 text-sm text-red-600">{form.fieldErrors.country_code}</p>
                {/if}
            </div>
            <div class="space-y-1">
                <label for="external_id" class="block text-sm font-medium text-gray-900">External ID</label>
                <input 
                    id="external_id" 
                    name="external_id" 
                    type="text" 
                    bind:value={external_id} 
                    class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                />
                {#if form?.fieldErrors?.external_id}
                    <p class="mt-2 text-sm text-red-600">{form.fieldErrors.external_id}</p>
                {/if}
            </div>
            <button 
                type="submit" 
                class="mt-4 w-full h-12 bg-blue-600 text-white rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={!isValid || loading}
            >
                {#if loading}
                    Saving...
                {:else}
                    Save Changes
                {/if}
            </button>
        </form>
    </div>
</div> 