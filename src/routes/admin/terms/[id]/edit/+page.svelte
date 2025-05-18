<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import { fade } from 'svelte/transition';
    import TrademarkTermForm from '$lib/components/TrademarkTermForm.svelte';

    export let data: PageData;
    export let form: ActionData;
    
    let loading = false;
    let formError: string | null = form?.error || null;
    let formSuccess: string | null = form?.success ? form.message || 'Term updated successfully!' : null;

    function handleInput(event: Event) {
        formError = null;
        formSuccess = null;
    }

    const handleSubmit = () => {
        loading = true;
        return async ({ result }) => {
            loading = false;
            if (result.type === 'success') {
                formSuccess = result.data?.message || 'Term updated successfully!';
                formError = null;
            }
        };
    };
</script>

<svelte:head>
    <title>Edit Trademark Term: {data.term.term} - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Edit Trademark Term: {data.term.term}
                </h2>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <a
                    href="/admin/terms"
                    class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Back to Terms
                </a>
            </div>
        </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mt-8 bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <TrademarkTermForm
                    {form}
                    {loading}
                    brands={data.brands}
                    initialData={{
                        term: data.term.term,
                        brand_id: data.term.brand_id
                    }}
                    onSubmit={handleSubmit}
                    onInput={handleInput}
                />
            </div>
        </div>
    </div>
</div> 