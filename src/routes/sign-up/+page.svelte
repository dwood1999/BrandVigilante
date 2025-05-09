<script lang="ts">
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { SignUpSchema } from '$lib/auth';
    import { z } from 'zod';

    let firstName = $page.form?.data?.first_name?.toString() ?? '';
    let lastName = $page.form?.data?.last_name?.toString() ?? '';
    let email = $page.form?.data?.email?.toString() ?? '';
    let phone = $page.form?.data?.phone?.toString() ?? '';
    let password = '';
    let showPassword = false;
    let passwordStrength = 0;
    let validationErrors: Record<string, string> = {};
    let isLoading = false;
    let formError: string | null = $page.form?.message || null;

    function calculatePasswordStrength(pwd: string): number {
        let strength = 0;
        if (pwd.length >= 8) strength += 1;
        if (/[A-Z]/.test(pwd)) strength += 1;
        if (/[a-z]/.test(pwd)) strength += 1;
        if (/[0-9]/.test(pwd)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
        return strength;
    }

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input) {
            if (input.name === 'password') {
                passwordStrength = calculatePasswordStrength(input.value);
            }
            validationErrors[input.name] = '';
            formError = null;
        }
    }

    async function handleSubmit(event: Event) {
        isLoading = true;
        // Let the form submit normally (SvelteKit will handle the POST)
    }
</script>

<svelte:head>
    <title>Sign Up - JanusIPM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md" in:fade>
        <h2 class="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">Create your account</h2>
        <p class="mt-2 text-center text-base text-gray-600 dark:text-gray-400">Introduce yourself to get started.</p>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or
            <a href="/sign-in" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline">sign in to your existing account</a>
        </p>

        <div class="mt-4">
            <a href="/login/google" class="w-full h-12 flex items-center justify-center gap-2 bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-base shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                Sign up with Google
            </a>
        </div>

        <div class="mt-4 relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Or continue with email
                </span>
            </div>
        </div>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md" in:fade={{ delay: 150 }}>
        <form method="POST" class="bg-white dark:bg-gray-800 border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6" on:submit={handleSubmit} on:input={handleInput} autocomplete="off">
            <input type="hidden" name="csrf" value={$page.data.csrf} />
            {#if formError}
                <div class="rounded-md bg-red-50 p-4 text-red-700 text-sm">{formError}</div>
            {/if}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label for="first_name" class="block text-sm font-medium text-gray-900">First Name</label>
                    <input id="first_name" name="first_name" type="text" required bind:value={firstName} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div class="space-y-1">
                    <label for="last_name" class="block text-sm font-medium text-gray-900">Last Name</label>
                    <input id="last_name" name="last_name" type="text" required bind:value={lastName} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
            </div>
            <div class="space-y-1">
                <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
                <input id="email" name="email" type="email" required bind:value={email} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="phone" class="block text-sm font-medium text-gray-900">Phone number</label>
                <input id="phone" name="phone" type="tel" required bind:value={phone} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
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
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Password must:</span>
                <ul class="list-disc list-inside mt-1">
                    <li class={password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>Be at least 8 characters long</li>
                    <li class={/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}>Contain at least one uppercase letter</li>
                    <li class={/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}>Contain at least one lowercase letter</li>
                    <li class={/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}>Contain at least one number</li>
                    <li class={/[^A-Za-z0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}>Contain at least one special character</li>
                </ul>
            </div>
            <button type="submit" class="mt-4 w-full h-12 bg-blue-600 text-white rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                {#if isLoading}
                    Signing up...
                {:else}
                    Sign up
                {/if}
            </button>
        </form>
    </div>
</div>

<style>
    @media (prefers-reduced-motion: reduce) {
        /* No transitions needed */
    }
</style> 