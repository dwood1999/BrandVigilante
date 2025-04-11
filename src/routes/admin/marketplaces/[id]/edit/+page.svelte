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
    
    console.log('Page data:', data);
    console.log('Marketplace data:', data.marketplace);
    
    let loading = false;
    
    // Initialize form fields with marketplace data
    let platform_name = data.marketplace?.platform_name || '';
    let base_url = data.marketplace?.base_url || '';
    let currency_code = data.marketplace?.currency_code || '';
    let country_code = data.marketplace?.country_code || '';
    let external_id = data.marketplace?.external_id || '';

    console.log('Form values:', {
        platform_name,
        base_url,
        currency_code,
        country_code,
        external_id
    });

    $: isValid = platform_name.trim().length > 0 && 
                 base_url.trim().length > 0 && 
                 currency_code.trim().length > 0 && 
                 country_code.trim().length > 0;
</script>

<svelte:head>
    <title>Edit Marketplace: {data.marketplace?.platform_name || 'Loading...'} - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Edit Marketplace: {data.marketplace?.platform_name || 'Loading...'}
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
                <FormContainer 
                    onSubmit={() => {
                        loading = true;
                        return async ({ result }: { result: FormResult }) => {
                            loading = false;
                            if (result.type === 'success') {
                                window.location.href = '/admin/marketplaces';
                            }
                        };
                    }}
                    className="space-y-6"
                >
                    <FormGroup legend="Marketplace Details">
                        <FormField
                            label="Platform Name"
                            name="platform_name"
                            type="text"
                            bind:value={platform_name}
                            required
                            error={form?.fieldErrors?.platform_name}
                            placeholder="Enter platform name"
                        />

                        <FormField
                            label="Base URL"
                            name="base_url"
                            type="url"
                            bind:value={base_url}
                            required
                            error={form?.fieldErrors?.base_url}
                            placeholder="https://example.com"
                        />

                        <FormField
                            label="Currency Code"
                            name="currency_code"
                            type="text"
                            bind:value={currency_code}
                            required
                            error={form?.fieldErrors?.currency_code}
                            placeholder="USD"
                            maxlength="3"
                        />

                        <FormField
                            label="Country Code"
                            name="country_code"
                            type="text"
                            bind:value={country_code}
                            required
                            error={form?.fieldErrors?.country_code}
                            placeholder="US"
                            maxlength="2"
                        />

                        <FormField
                            label="External ID"
                            name="external_id"
                            type="text"
                            bind:value={external_id}
                            error={form?.fieldErrors?.external_id}
                            placeholder="Optional external identifier"
                        />
                    </FormGroup>

                    <div class="flex justify-end">
                        <button
                            type="submit"
                            class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            disabled={!isValid || loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </FormContainer>
            </div>
        </div>
    </div>
</div> 