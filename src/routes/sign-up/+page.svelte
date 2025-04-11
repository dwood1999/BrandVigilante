<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    import type { ActionData } from './$types';
    import { page } from '$app/stores';
    import FormField from '$lib/components/ui/FormField.svelte';
    import FormContainer from '$lib/components/ui/FormContainer.svelte';
    import FormGroup from '$lib/components/ui/FormGroup.svelte';

    export let form: ActionData;

    let loading = false;
    let showPassword = false;
    let formData: ActionData | null = null;
    let firstName = form?.data?.first_name ?? '';
    let lastName = form?.data?.last_name ?? '';
    let email = form?.data?.email ?? '';
    let phone = form?.data?.phone ?? '';
    let password = '';

    interface SubmitResult {
        type: 'success' | 'failure';
        data?: {
            email: FormDataEntryValue;
            phone: FormDataEntryValue;
            first_name: FormDataEntryValue;
            last_name: FormDataEntryValue;
        };
    }

    function handleSubmit(event: SubmitEvent) {
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
            <FormContainer 
                onSubmit={handleSubmit}
                className="space-y-6"
                novalidate
            >
                <h1 class="sr-only">Create your account</h1>

                <!-- Add CSRF token -->
                <input type="hidden" name="csrf" value={$page.data.csrf} />

                <FormGroup legend="Personal Information">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="First Name"
                            name="first_name"
                            bind:value={firstName}
                            required
                            error={form?.fieldErrors?.first_name || formData?.fieldErrors?.first_name}
                            autocomplete="given-name"
                        />

                        <FormField
                            label="Last Name"
                            name="last_name"
                            bind:value={lastName}
                            required
                            error={form?.fieldErrors?.last_name || formData?.fieldErrors?.last_name}
                            autocomplete="family-name"
                        />
                    </div>
                </FormGroup>

                <FormGroup legend="Contact Information">
                    <FormField
                        label="Email address"
                        name="email"
                        type="email"
                        bind:value={email}
                        required
                        error={form?.fieldErrors?.email || formData?.fieldErrors?.email}
                        autocomplete="email"
                    />

                    <FormField
                        label="Phone number"
                        name="phone"
                        type="tel"
                        bind:value={phone}
                        required
                        error={form?.fieldErrors?.phone || formData?.fieldErrors?.phone}
                        autocomplete="tel"
                    />
                </FormGroup>

                <FormGroup legend="Security">
                    <div class="relative">
                        <FormField
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            bind:value={password}
                            required
                            error={form?.fieldErrors?.password || formData?.fieldErrors?.password}
                            autocomplete="new-password"
                        />
                        
                        <button
                            type="button"
                            class="absolute top-8 right-0 pr-3 flex items-center"
                            on:click={togglePassword}
                        >
                            <span class="text-sm text-gray-500">
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </button>
                    </div>
                    
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
                </FormGroup>

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
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {#if loading}
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                        {:else}
                            Create account
                        {/if}
                    </button>
                </div>
            </FormContainer>
        </div>
    </div>
</div> 