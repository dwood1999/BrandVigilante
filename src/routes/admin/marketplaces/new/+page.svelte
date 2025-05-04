<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    export let form: any;
    let loading = false;
    let error: string | null = form?.error || null;
    let success: string | null = form?.success ? 'Marketplace created successfully!' : null;
    let platform_name = '';
    let base_url = '';
    let currency_code = '';
    let country_code = '';
    let external_id = '';

    $: isValid = platform_name.trim().length > 0 && base_url.trim().length > 0;

    function handleInput(event: Event) {
        error = null;
        success = null;
    }

    function handleSubmit() {
        loading = true;
        error = null;
        return async ({ result, update }) => {
            loading = false;
            if (result.type === 'redirect') {
                window.location.href = result.location || '/admin/marketplaces';
            } else if (result.type === 'failure') {
                error = result.data?.error || 'Failed to create marketplace';
                await update();
            }
        };
    }
</script>

<svelte:head>
    <title>Add New Marketplace - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col items-center sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-xl" in:fade>
        <h2 class="mt-2 text-center text-2xl font-bold text-gray-900">Add New Marketplace</h2>
        <p class="mt-2 text-center text-base text-gray-600">Enter details for the new marketplace below.</p>
        <div class="mt-4 text-center">
            <a href="/admin/marketplaces" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Back to Marketplaces</a>
        </div>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-xl" in:fade={{ delay: 150 }}>
        <form method="POST" class="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6" use:enhance={handleSubmit} on:input={handleInput} autocomplete="off">
            {#if error}
                <div class="rounded-md bg-red-50 p-4 text-red-700 text-sm">{error}</div>
            {/if}
            {#if success}
                <div class="rounded-md bg-green-50 p-4 text-green-700 text-sm">{success}</div>
            {/if}
            <div class="space-y-1">
                <label for="platform_name" class="block text-sm font-medium text-gray-900">Platform Name</label>
                <input id="platform_name" name="platform_name" type="text" required bind:value={platform_name} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="base_url" class="block text-sm font-medium text-gray-900">Base URL</label>
                <input id="base_url" name="base_url" type="url" required bind:value={base_url} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="currency_code" class="block text-sm font-medium text-gray-900">Currency Code</label>
                <input id="currency_code" name="currency_code" type="text" maxlength="3" bind:value={currency_code} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="country_code" class="block text-sm font-medium text-gray-900">Country Code</label>
                <input id="country_code" name="country_code" type="text" maxlength="2" bind:value={country_code} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="external_id" class="block text-sm font-medium text-gray-900">External ID</label>
                <input id="external_id" name="external_id" type="text" bind:value={external_id} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <button type="submit" class="mt-4 w-full h-12 bg-blue-600 text-white rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isValid || loading}>
                {#if loading}
                    Creating...
                {:else}
                    Create Marketplace
                {/if}
            </button>
        </form>
    </div>
</div> 