<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    import type { ActionData } from './$types';
    import { page } from '$app/stores';

    export let form: ActionData;

    let loading = false;
    let showPassword = false;
    let formData: ActionData | null = null;

    interface SubmitResult {
        type: 'success' | 'failure';
        data?: {
            email: FormDataEntryValue;
            phone: FormDataEntryValue;
            first_name: FormDataEntryValue;
            last_name: FormDataEntryValue;
        };
    }

    function handleSubmit() {
        loading = true;
        return async ({ result }: { result: SubmitResult }) => {
            loading = false;
            if (result.type === 'failure') {
                try {
                    formData = result;
                } catch (error) {
                    console.error('Error parsing form response:', error);
                    formData = {
                        message: 'An unexpected error occurred. Please try again.',
                        data: result.data || {
                            email: '',
                            phone: '',
                            first_name: '',
                            last_name: ''
                        }
                    };
                }
            } else if (result.type === 'success') {
                // Redirect to dashboard on success
                window.location.href = '/dashboard';
            }
        };
    }

    function togglePassword() {
        showPassword = !showPassword;
    }
</script>

<svelte:head>
    <title>Sign Up - JanusIPM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md" in:fade>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a href="/sign-in" class="font-medium text-blue-600 hover:text-blue-500">
                sign in to your existing account
            </a>
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md" in:fade={{ delay: 150 }}>
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form 
                method="POST" 
                class="space-y-6" 
                use:enhance={handleSubmit}
                aria-labelledby="signup-heading"
            >
                <h1 id="signup-heading" class="sr-only">Create your account</h1>

                <!-- Add CSRF token -->
                <input type="hidden" name="csrf" value={$page.data.csrf} />

                <!-- First Name Field -->
                <div>
                    <label for="first_name" class="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <div class="mt-1">
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            required
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            aria-required="true"
                            aria-invalid={form?.fieldErrors?.first_name ? 'true' : 'false'}
                            aria-describedby={form?.fieldErrors?.first_name ? 'first_name-error' : undefined}
                            value={form?.data?.first_name ?? formData?.data?.first_name ?? ''}
                        />
                    </div>
                    {#if form?.fieldErrors?.first_name}
                        <p 
                            id="first_name-error" 
                            class="mt-2 text-sm text-red-600"
                            role="alert"
                        >
                            {form.fieldErrors.first_name}
                        </p>
                    {/if}
                </div>

                <!-- Last Name Field -->
                <div>
                    <label for="last_name" class="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <div class="mt-1">
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            required
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            aria-required="true"
                            aria-invalid={form?.fieldErrors?.last_name ? 'true' : 'false'}
                            aria-describedby={form?.fieldErrors?.last_name ? 'last_name-error' : undefined}
                            value={form?.data?.last_name ?? formData?.data?.last_name ?? ''}
                        />
                    </div>
                    {#if form?.fieldErrors?.last_name}
                        <p 
                            id="last_name-error" 
                            class="mt-2 text-sm text-red-600"
                            role="alert"
                        >
                            {form.fieldErrors.last_name}
                        </p>
                    {/if}
                </div>

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

                <!-- Phone Field -->
                <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700">
                        Phone number
                    </label>
                    <div class="mt-1">
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autocomplete="tel"
                            required
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            aria-required="true"
                            aria-invalid={form?.fieldErrors?.phone ? 'true' : 'false'}
                            aria-describedby={form?.fieldErrors?.phone ? 'phone-error' : undefined}
                            value={form?.data?.phone ?? formData?.data?.phone ?? ''}
                        />
                    </div>
                    {#if form?.fieldErrors?.phone}
                        <p 
                            id="phone-error" 
                            class="mt-2 text-sm text-red-600"
                            role="alert"
                        >
                            {form.fieldErrors.phone}
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
                            required
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            aria-required="true"
                            aria-invalid={form?.fieldErrors?.password || formData?.fieldErrors?.password ? 'true' : 'false'}
                            aria-describedby={form?.fieldErrors?.password || formData?.fieldErrors?.password ? 'password-error' : undefined}
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
                    {#if form?.fieldErrors?.password || formData?.fieldErrors?.password}
                        <p 
                            id="password-error" 
                            class="mt-2 text-sm text-red-600"
                            role="alert"
                        >
                            {formData?.fieldErrors?.password || form?.fieldErrors?.password}
                        </p>
                    {/if}
                    <div class="mt-2 text-sm text-gray-500">
                        <span>Password must:</span>
                        <ul class="list-disc list-inside mt-1">
                            <li>Be at least 8 characters long</li>
                            <li>Contain at least one uppercase letter</li>
                            <li>Contain at least one lowercase letter</li>
                            <li>Contain at least one number</li>
                            <li>Contain at least one special character</li>
                        </ul>
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
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div> 