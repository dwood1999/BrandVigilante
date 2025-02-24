<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './types';
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';

    export let form: ActionData;

    let loading = false;
    let showPassword = false;
    let formData: ActionData | null = null;

    function handleSubmit() {
        loading = true;
        return async ({ result }) => {
            loading = false;
            
            if (result.type === 'failure') {
                try {
                    if (typeof result.data === 'string') {
                        formData = JSON.parse(result.data);
                    } else {
                        formData = result.data;
                    }
                } catch (error) {
                    console.error('Error parsing form response:', error);
                }
            }
        };
    }

    function togglePassword() {
        showPassword = !showPassword;
    }
</script>

<svelte:head>
    <title>Sign In - JanusIPM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md" in:fade>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a href="/sign-up" class="font-medium text-blue-600 hover:text-blue-500">
                create a new account
            </a>
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md" in:fade={{ delay: 150 }}>
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form 
                method="POST" 
                class="space-y-6" 
                use:enhance={handleSubmit}
                aria-labelledby="signin-heading"
            >
                <h1 id="signin-heading" class="sr-only">Sign in to your account</h1>

                <!-- Add CSRF token -->
                <input type="hidden" name="csrf" value={$page.data.csrf} />

                <!-- Email Field -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div class="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            aria-required="true"
                            aria-invalid={form?.fieldErrors?.email ? 'true' : 'false'}
                            aria-describedby={form?.fieldErrors?.email ? 'email-error' : undefined}
                            value={form?.data?.email ?? formData?.data?.email ?? ''}
                        />
                    </div>
                    {#if form?.fieldErrors?.email}
                        <p 
                            id="email-error" 
                            class="mt-2 text-sm text-red-600"
                            role="alert"
                        >
                            {form.fieldErrors.email}
                        </p>
                    {/if}
                </div>

                <!-- Password Field -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div class="mt-1 relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autocomplete="current-password"
                            required
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm {form?.fieldErrors?.password ? 'border-red-500' : ''}"
                        />
                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center"
                            on:click={togglePassword}
                        >
                            <span class="text-sm text-gray-500">
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </button>
                    </div>
                    {#if form?.fieldErrors?.password}
                        <p class="mt-2 text-sm text-red-600" role="alert">
                            {form.fieldErrors.password}
                        </p>
                    {/if}
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-sm">
                        <a href="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                {#if form?.message || formData?.message}
                    <div 
                        class="rounded-md bg-red-50 p-4" 
                        role="alert"
                        aria-live="polite"
                    >
                        <div class="flex">
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">
                                    {formData?.message || form?.message}
                                </h3>
                            </div>
                        </div>
                    </div>
                {/if}

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>

            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300" />
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <span class="sr-only">Sign in with Google</span>
                        Google
                    </button>
                    <button
                        type="button"
                        class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <span class="sr-only">Sign in with GitHub</span>
                        GitHub
                    </button>
                </div>
            </div>
        </div>
    </div>
</div> 