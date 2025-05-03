<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    import type { ActionData } from './$types';
    import { page } from '$app/stores';
    import FormField from '$lib/components/ui/FormField.svelte';
    import FormContainer from '$lib/components/ui/FormContainer.svelte';
    import FormGroup from '$lib/components/ui/FormGroup.svelte';
    import { SignUpSchema } from '$lib/auth';
    import { z } from 'zod';

    let formData: ActionData | null = null;
    let formError: string | null = null;
    let fieldErrors: Record<string, string[]> = {};
    let isLoading = false;

    $: if ($page.form) {
        formData = $page.form;
        formError = $page.form.message;
        fieldErrors = $page.form.fieldErrors || {};
    }

    let loading = false;
    let showPassword = false;
    let formErrorData: ActionData | null = null;
    let firstName = formData?.data?.first_name?.toString() ?? '';
    let lastName = formData?.data?.last_name?.toString() ?? '';
    let email = formData?.data?.email?.toString() ?? '';
    let phone = formData?.data?.phone?.toString() ?? '';
    let password = '';
    let passwordStrength = 0;
    let validationErrors: Record<string, string> = {};

    // Password strength calculation
    function calculatePasswordStrength(pwd: string): number {
        let strength = 0;
        if (pwd.length >= 8) strength += 1;
        if (/[A-Z]/.test(pwd)) strength += 1;
        if (/[a-z]/.test(pwd)) strength += 1;
        if (/[0-9]/.test(pwd)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
        return strength;
    }

    // Real-time validation
    function validateField(field: string, value: string) {
        try {
            if (field === 'password') {
                passwordStrength = calculatePasswordStrength(value);
            }
            SignUpSchema.shape[field as keyof typeof SignUpSchema.shape].parse(value);
            delete validationErrors[field];
        } catch (error) {
            if (error instanceof z.ZodError) {
                validationErrors[field] = error.errors[0].message;
            }
        }
    }

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input) {
            const fieldName = input.name;
            if (fieldErrors[fieldName]) {
                delete fieldErrors[fieldName];
            }
        }
    }

    function handleSubmit(event: SubmitEvent) {
        // Validate all fields before submission
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        
        for (const [key, value] of formData.entries()) {
            validateField(key, value.toString());
        }

        if (Object.keys(validationErrors).length > 0) {
            event.preventDefault();
            return;
        }

        loading = true;
    }

    function handleResult(result: ActionData | null) {
        loading = false;
        if (!result) return;
        
        if (!result.success) {
            try {
                formErrorData = result;
            } catch (error) {
                console.error('Error parsing form response:', error);
                formErrorData = {
                    message: 'An unexpected error occurred. Please try again.',
                    data: result.data || {
                        email: '',
                        phone: '',
                        first_name: '',
                        last_name: ''
                    },
                    fieldErrors: result.fieldErrors || {}
                };
            }
        } else if (result.success) {
            // Redirect to dashboard on success
            window.location.href = '/dashboard';
        }
    }

    function togglePassword() {
        showPassword = !showPassword;
    }

    // Password strength indicator color
    function getStrengthColor(strength: number): string {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 4) return 'bg-yellow-500';
        return 'bg-green-500';
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
                on:result={({ detail }) => handleResult(detail)}
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
                            on:input={handleInput}
                            required
                            error={fieldErrors.first_name?.length ? fieldErrors.first_name[0] : validationErrors.first_name || formData?.fieldErrors?.first_name || formErrorData?.fieldErrors?.first_name}
                            autocomplete="name"
                        />

                        <FormField
                            label="Last Name"
                            name="last_name"
                            bind:value={lastName}
                            on:input={handleInput}
                            required
                            error={fieldErrors.last_name?.length ? fieldErrors.last_name[0] : validationErrors.last_name || formData?.fieldErrors?.last_name || formErrorData?.fieldErrors?.last_name}
                            autocomplete="name"
                        />
                    </div>
                </FormGroup>

                <FormGroup legend="Contact Information">
                    <FormField
                        label="Email address"
                        name="email"
                        type="email"
                        bind:value={email}
                        on:input={handleInput}
                        required
                        error={fieldErrors.email?.length ? fieldErrors.email[0] : validationErrors.email || formData?.fieldErrors?.email || formErrorData?.fieldErrors?.email}
                        autocomplete="email"
                    />

                    <FormField
                        label="Phone number"
                        name="phone"
                        type="tel"
                        bind:value={phone}
                        on:input={handleInput}
                        required
                        error={fieldErrors.phone?.length ? fieldErrors.phone[0] : validationErrors.phone || formData?.fieldErrors?.phone || formErrorData?.fieldErrors?.phone}
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
                            on:input={handleInput}
                            required
                            error={fieldErrors.password?.length ? fieldErrors.password[0] : validationErrors.password || formData?.fieldErrors?.password || formErrorData?.fieldErrors?.password}
                            autocomplete="new-password"
                        />
                        
                        <button
                            type="button"
                            class="absolute top-8 right-0 pr-3 flex items-center"
                            on:click={togglePassword}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <span class="text-sm text-gray-500">
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </button>
                    </div>
                    
                    <!-- Password strength indicator -->
                    {#if password}
                        <div class="mt-2">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm text-gray-500">Password strength:</span>
                                <span class="text-sm font-medium {getStrengthColor(passwordStrength)} text-white px-2 py-0.5 rounded">
                                    {passwordStrength}/5
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    class="h-2.5 rounded-full {getStrengthColor(passwordStrength)} transition-all duration-300" 
                                    style="width: {passwordStrength * 20}%"
                                ></div>
                            </div>
                        </div>
                    {/if}

                    <div class="mt-2 text-sm text-gray-500">
                        <span>Password must:</span>
                        <ul class="list-disc list-inside mt-1">
                            <li class={password.length >= 8 ? 'text-green-600' : ''}>Be at least 8 characters long</li>
                            <li class={/[A-Z]/.test(password) ? 'text-green-600' : ''}>Contain at least one uppercase letter</li>
                            <li class={/[a-z]/.test(password) ? 'text-green-600' : ''}>Contain at least one lowercase letter</li>
                            <li class={/[0-9]/.test(password) ? 'text-green-600' : ''}>Contain at least one number</li>
                            <li class={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>Contain at least one special character (optional)</li>
                        </ul>
                        <p class="mt-1 text-xs text-gray-400">Note: Your password must meet at least 3 of the 4 character requirements above</p>
                    </div>
                </FormGroup>

                {#if formError || formErrorData?.message}
                    <div 
                        class="rounded-md bg-red-50 p-4" 
                        role="alert"
                        aria-live="polite"
                    >
                        <div class="flex">
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">
                                    {formError || formErrorData?.message}
                                </h3>
                            </div>
                        </div>
                    </div>
                {/if}

                <div>
                    <button
                        type="submit"
                        disabled={loading || Object.keys(validationErrors).length > 0}
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

<style>
    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
        .transition-all {
            transition: none;
        }
    }
</style> 