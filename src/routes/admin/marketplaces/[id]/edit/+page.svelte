<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    export let data: any;
    export let form: any;
    let loading = false;
    let error: string | null = form?.error || null;
    let success: string | null = form?.success ? 'Marketplace updated successfully!' : null;
    let platform_name = data.marketplace?.platform_name || '';
    let base_url = data.marketplace?.base_url || '';
    let currency_code = data.marketplace?.currency_code || '';
    let country_code = data.marketplace?.country_code || '';
    let external_id = data.marketplace?.external_id || '';

    function handleInput(event: Event) {
        error = null;
        success = null;
    }

    async function handleSubmit(event: Event) {
        loading = true;
        // Let the form submit normally (SvelteKit will handle the POST)
    }
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
        <form method="POST" class="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6" on:submit={handleSubmit} on:input={handleInput} autocomplete="off">
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
                <input id="currency_code" name="currency_code" type="text" required maxlength="3" bind:value={currency_code} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="country_code" class="block text-sm font-medium text-gray-900">Country Code</label>
                <input id="country_code" name="country_code" type="text" required maxlength="2" bind:value={country_code} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="external_id" class="block text-sm font-medium text-gray-900">External ID</label>
                <input id="external_id" name="external_id" type="text" bind:value={external_id} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <button type="submit" class="mt-4 w-full h-12 bg-blue-600 text-white rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                {#if loading}
                    Saving...
                {:else}
                    Save Changes
                {/if}
            </button>
        </form>
    </div>
</div> 