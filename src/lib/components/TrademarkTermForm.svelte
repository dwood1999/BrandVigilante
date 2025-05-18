<script lang="ts">
    import type { Brand } from '$lib/models/brand';
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
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
            term?: string;
            brandId?: string;
        };
    }

    export let brands: Brand[] = [];
    export let form: FormErrors | null = null;
    export let loading = false;
    export let initialData: { term?: string; brand_id?: number } = {};
    export let onSubmit: (result: FormResult) => void;
    export let onInput: () => void;

    let term = initialData.term || '';
    let brandId = '';

    onMount(() => {
        // Ensure brand_id is set as a string after the component mounts
        if (initialData.brand_id) {
            brandId = initialData.brand_id.toString();
        }
    });

    $: isValid = term.trim().length > 0 && brandId !== '';
</script>

<form
    method="POST"
    action="?/update"
    class="space-y-6"
    on:input={onInput}
    use:enhance={({ formData, cancel }) => {
        return async ({ result }) => {
            if (onSubmit) {
                onSubmit({ type: result.type, data: result.data } as FormResult);
            }
            // Only update the form if it was successful
            if (result.type === 'success') {
                // Reload the page to get fresh data
                window.location.reload();
            }
        };
    }}
>
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

    {#if form?.success}
        <div class="rounded-md bg-green-50 p-4">
            <div class="flex">
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">
                        {form.message || 'Term updated successfully!'}
                    </h3>
                </div>
            </div>
        </div>
    {/if}

    <div class="space-y-6">
        <div>
            <label for="brand" class="block text-sm font-medium leading-6 text-gray-900">
                Brand *
            </label>
            <div class="mt-2">
                <select
                    id="brand"
                    name="brandId"
                    bind:value={brandId}
                    required
                    class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                    <option value="">Select a brand</option>
                    {#each brands as brand}
                        <option value={brand.id.toString()}>{brand.name}</option>
                    {/each}
                </select>
            </div>
            {#if form?.fieldErrors?.brandId}
                <p class="mt-2 text-sm text-red-600">{form.fieldErrors.brandId}</p>
            {/if}
        </div>

        <div>
            <label for="term" class="block text-sm font-medium leading-6 text-gray-900">
                Trademark Term
            </label>
            <div class="mt-2">
                <input
                    type="text"
                    name="term"
                    id="term"
                    bind:value={term}
                    required
                    class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
            </div>
            {#if form?.fieldErrors?.term}
                <p class="mt-2 text-sm text-red-600">{form.fieldErrors.term}</p>
            {/if}
        </div>
    </div>

    <div class="flex justify-end gap-x-3">
        <a
            href="/admin/terms"
            class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
            Cancel
        </a>
        <button
            type="submit"
            disabled={!isValid || loading}
            class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Saving...' : 'Save Term'}
        </button>
    </div>
</form> 