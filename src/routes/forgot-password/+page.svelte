<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import type { ActionData } from './$types';
    import { fade } from 'svelte/transition';
    import FormField from '$lib/components/ui/FormField.svelte';
    import FormContainer from '$lib/components/ui/FormContainer.svelte';
    import FormGroup from '$lib/components/ui/FormGroup.svelte';

    let formData: ActionData | null = null;
    let formError: string | null = null;
    let formSuccess: string | null = null;
    let fieldErrors: Record<string, string[]> = {};
    let isLoading = false;

    $: if ($page.form) {
        console.log('Page form updated:', $page.form);
        formData = $page.form;
        formError = $page.form.message;
        formSuccess = $page.form.success;
        fieldErrors = $page.form.fieldErrors || {};
    }

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input) {
            const fieldName = input.name;
            if (fieldErrors[fieldName]) {
                delete fieldErrors[fieldName];
            }
            if (formError) {
                formError = null;
            }
            if (formSuccess) {
                formSuccess = null;
            }
        }
    }

    function handleSubmit(event: SubmitEvent) {
        console.log('Form submission started');
        isLoading = true;
        formError = null;
        formSuccess = null;
        fieldErrors = {};
        return async ({ result }) => {
            console.log('Form submission result:', result);
            isLoading = false;
            
            if (result.type === 'failure') {
                console.log('Form submission failed:', result.data);
                try {
                    if (typeof result.data === 'string') {
                        formData = JSON.parse(result.data);
                    } else {
                        formData = result.data;
                    }
                    formError = formData?.message || 'An error occurred. Please try again.';
                    if (formData?.fieldErrors) {
                        fieldErrors = formData.fieldErrors;
                    }
                } catch (error) {
                    console.error('Error parsing form response:', error);
                    formError = 'An unexpected error occurred. Please try again.';
                }
            } else if (result.type === 'success') {
                formSuccess = 'If an account exists with that email, you will receive password reset instructions.';
            }
        };
    }

    let email = formData?.data?.email ?? '';
</script>

<svelte:head>
    <title>Forgot Password - JanusIPM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md" in:fade>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md" in:fade={{ delay: 150 }}>
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form 
                method="POST"
                use:enhance={handleSubmit}
                class="space-y-6"
            >
                <h1 class="sr-only">Reset your password</h1>

                <!-- Add CSRF token -->
                <input type="hidden" name="csrf" value={$page.data.csrf} />

                {#if formError}
                    <div 
                        class="rounded-md bg-red-50 p-4" 
                        role="alert"
                        aria-live="polite"
                    >
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">
                                    {formError}
                                </h3>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if formSuccess}
                    <div 
                        class="rounded-md bg-green-50 p-4" 
                        role="alert"
                        aria-live="polite"
                    >
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-green-800">
                                    {formSuccess}
                                </h3>
                            </div>
                        </div>
                    </div>
                {/if}

                <FormGroup legend="Account Information">
                    <FormField
                        label="Email address"
                        name="email"
                        type="email"
                        bind:value={email}
                        required
                        error={fieldErrors.email?.length ? fieldErrors.email[0] : formData?.fieldErrors?.email}
                        autocomplete="email"
                        on:input={handleInput}
                    />
                </FormGroup>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {#if isLoading}
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <circle class="opacity-75" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending instructions...
                        {:else}
                            Send reset instructions
                        {/if}
                    </button>
                </div>

                <div class="text-sm text-center">
                    <a href="/sign-in" class="font-medium text-blue-600 hover:text-blue-500">
                        Back to sign in
                    </a>
                </div>
            </form>
        </div>
    </div>
</div> 