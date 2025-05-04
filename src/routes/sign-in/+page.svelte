<script lang="ts">
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let email = $page.form?.email ?? '';
    let password = '';
    let showPassword = false;
    let isLoading = false;
    let formError: string | null = $page.form?.message || null;

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input) {
            formError = null;
        }
    }

    async function handleSubmit(event: Event) {
        isLoading = true;
        // Let the form submit normally (SvelteKit will handle the POST)
    }
</script>

<svelte:head>
    <title>Sign In - JanusIPM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center sm:px-6 lg:px-8">
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md" in:fade>
        <h2 class="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">Sign in to your account</h2>
        <p class="mt-2 text-center text-base text-gray-600 dark:text-gray-400">Welcome back! Please enter your credentials.</p>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or
            <a href="/sign-up" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline">create a new account</a>
        </p>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md" in:fade={{ delay: 150 }}>
        <form method="POST" class="bg-white dark:bg-gray-800 border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6" on:submit={handleSubmit} on:input={handleInput} autocomplete="off">
            <input type="hidden" name="csrf" value={$page.data.csrf} />
            {#if formError}
                <div class="rounded-md bg-red-50 p-4 text-red-700 text-sm">{formError}</div>
            {/if}
            <div class="space-y-1">
                <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
                <input id="email" name="email" type="email" required bind:value={email} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
                <div class="relative">
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} required bind:value={password} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary pr-10" />
                    <button type="button" tabindex="-1" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" on:click={() => showPassword = !showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {#if showPassword}
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675m2.122-2.122A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.233-.938 4.675m-2.122 2.122A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675" /></svg>
                        {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                        {/if}
                    </button>
                </div>
            </div>
            <div class="flex items-center justify-end">
                <a href="/forgot-password" class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline">Forgot password?</a>
            </div>
            <button type="submit" class="mt-4 w-full h-12 bg-blue-600 text-white rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                {#if isLoading}
                    Signing in...
                {:else}
                    Sign in
                {/if}
            </button>
        </form>
    </div>
</div> 