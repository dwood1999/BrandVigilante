<script lang="ts">
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    let formError: string | null = $page.form?.message || null;
    let formSuccess: string | null = $page.form?.success || null;
    let isLoading = false;
    let email = $page.form?.data?.email ?? '';

    function handleInput(event: Event) {
        formError = null;
        formSuccess = null;
    }

    async function handleSubmit(event: Event) {
        isLoading = true;
        // Let the form submit normally (SvelteKit will handle the POST)
    }
</script>

<svelte:head>
    <title>Forgot Password - JanusIPM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col items-center sm:px-6 lg:px-8">
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md" in:fade>
        <h2 class="mt-4 text-center text-2xl font-bold text-gray-900">Reset your password</h2>
        <p class="mt-2 text-center text-base text-gray-600">Enter your email address and we'll send you instructions to reset your password.</p>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md" in:fade={{ delay: 150 }}>
        <form method="POST" class="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6" on:submit={handleSubmit} on:input={handleInput} autocomplete="off">
            <input type="hidden" name="csrf" value={$page.data.csrf} />
            {#if formError}
                <div class="rounded-md bg-red-50 p-4 text-red-700 text-sm">{formError}</div>
            {/if}
            {#if formSuccess}
                <div class="rounded-md bg-green-50 p-4 text-green-700 text-sm">{formSuccess}</div>
            {/if}
            <div class="space-y-1">
                <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
                <input id="email" name="email" type="email" required bind:value={email} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <button type="submit" class="mt-4 w-full h-12 bg-blue-600 text-white rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                {#if isLoading}
                    Sending instructions...
                {:else}
                    Send reset instructions
                {/if}
            </button>
            <div class="text-sm text-center">
                <a href="/sign-in" class="font-medium text-blue-600 hover:text-blue-500 underline">Back to sign in</a>
            </div>
        </form>
    </div>
</div> 