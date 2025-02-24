<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    import type { PageData, ActionData } from './$types';
    import type { SubmitFunction } from '@sveltejs/kit';

    export let data: PageData;
    export let form: ActionData;

    let loading = false;

    const handleSubmit: SubmitFunction = () => {
        loading = true;
        return async ({ result }) => {
            loading = false;
            if (result.type === 'success') {
                // Success is handled by the page reload
            }
        };
    }
</script>

<svelte:head>
    <title>Verify Email - JanusIPM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md" in:fade>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
        </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md" in:fade={{ delay: 150 }}>
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {#if data.error}
                <div class="rounded-md bg-red-50 p-4" role="alert">
                    <div class="flex">
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">
                                {data.error}
                            </h3>
                            {#if data.error === 'Verification token has expired'}
                                <div class="mt-4">
                                    <form
                                        method="POST"
                                        action="/verify-email/resend"
                                        use:enhance={handleSubmit}
                                    >
                                        <button
                                            type="submit"
                                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending...' : 'Resend verification email'}
                                        </button>
                                    </form>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else if data.success}
                <div class="rounded-md bg-green-50 p-4" role="alert">
                    <div class="flex">
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-green-800">
                                {data.success}
                            </h3>
                            <div class="mt-4">
                                <a
                                    href="/dashboard"
                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Go to Dashboard
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            {:else if data.isResend}
                <div class="text-center">
                    <h3 class="text-lg font-medium text-gray-900">Resend Verification Email</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Click the button below to receive a new verification email.
                    </p>
                    <form
                        method="POST"
                        action="/verify-email/resend"
                        class="mt-6"
                        use:enhance={handleSubmit}
                    >
                        <button
                            type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Verification Email'}
                        </button>
                    </form>
                </div>
            {/if}

            {#if form?.message}
                <div class="mt-4 rounded-md bg-red-50 p-4" role="alert">
                    <div class="flex">
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">
                                {form.message}
                            </h3>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div> 