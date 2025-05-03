<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { browser } from '$app/environment';
    import { writable } from 'svelte/store';

    // Create a store to track dismissed state
    const isDismissed = writable(false);

    // Check if user is verified
    $: isVerified = $page.data.user?.email_verified ?? true;
    $: showBanner = !isVerified && !$isDismissed;

    // Handle dismissal
    function dismissBanner() {
        isDismissed.set(true);
    }

    // Reset dismissal on page load
    if (browser) {
        isDismissed.set(false);
    }
</script>

{#if showBanner}
    <div 
        class="bg-yellow-50 border-l-4 border-yellow-400 p-4" 
        role="alert"
        aria-live="polite"
        in:fade
    >
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
                <p class="text-sm text-yellow-700">
                    Please verify your email address. Check your inbox for the verification link we sent to {$page.data.user?.email}.
                    <a href="/resend-verification" class="font-medium underline text-yellow-700 hover:text-yellow-600">
                        Resend verification email
                    </a>
                </p>
            </div>
            <div class="ml-auto pl-3">
                <div class="-mx-1.5 -my-1.5">
                    <button
                        type="button"
                        class="inline-flex rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
                        on:click={dismissBanner}
                    >
                        <span class="sr-only">Dismiss</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if} 