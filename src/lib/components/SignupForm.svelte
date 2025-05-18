<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { z } from "zod";
    import { formStore } from "$lib/stores/formStore";

    // Define the form schema using Zod
    const schema = z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        company: z.string().min(2, "Company name must be at least 2 characters"),
        phone: z.string().optional(),
    });

    let firstName = $state("");
    let lastName = $state("");
    let email = $state("");
    let company = $state("");
    let phone = $state("");
    let errors = $state<{ [key: string]: string }>({});
    let message = $state("");
    let messageType = $state<'success' | 'error' | null>(null);

    function openForm() {
        formStore.update(state => ({ ...state, isOpen: true }));
    }

    function closeForm() {
        formStore.update(state => ({ ...state, isOpen: false }));
    }

    async function handleSubmit(event: any) {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        errors = {};
        message = "";
        messageType = null;
        // Client-side validation
        const result = schema.safeParse({ firstName, lastName, email, company, phone });
        if (!result.success) {
            for (const issue of result.error.issues) {
                errors[issue.path[0]] = issue.message;
            }
            message = "Please fix the errors below.";
            messageType = 'error';
            return;
        }
        formStore.update(state => ({ ...state, isSubmitting: true }));
        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, company, phone })
            });
            const result = await response.json();
            if (result.success) {
                message = result.message || "Thank you for your inquiry! We will be in touch soon.";
                messageType = 'success';
                firstName = lastName = email = company = phone = "";
                setTimeout(() => {
                    closeForm();
                }, 2000);
            } else {
                message = result.message || "There was an error submitting your inquiry. Please try again later.";
                messageType = 'error';
            }
        } catch (err) {
            message = "There was an error submitting your inquiry. Please try again later.";
            messageType = 'error';
        } finally {
            formStore.update(state => ({ ...state, isSubmitting: false }));
        }
    }

    let { children } = $props();
</script>

<div class="relative">
    <div
        role="button"
        tabindex="0"
        class="w-full cursor-pointer"
        onclick={openForm}
        onkeydown={e => { if (e.key === 'Enter' || e.key === ' ') { openForm(); } }}
        aria-label="Open signup form"
    >
        {@render children?.()}
    </div>

    {#if $formStore.isOpen}
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
            <div class="bg-white border border-gray-200 rounded-2xl shadow-lg max-w-md w-full p-6 space-y-6" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <div class="flex justify-between items-center mb-2">
                    <h2 class="text-2xl font-bold text-foreground">Get More Information</h2>
                    <button
                        type="button"
                        onclick={closeForm}
                        class="text-gray-500 hover:text-gray-700"
                        aria-label="Close signup form"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="text-muted-foreground mb-2">
                    A representative will contact you to show you how we can protect your valuable brand.
                </p>
                {#if message}
                    <div class="rounded-md p-4 text-sm mb-2 {messageType === 'success' ? 'bg-lime-50 border border-lime-200 text-lime-800' : 'bg-red-50 border border-red-200 text-red-700'}">
                        {message}
                    </div>
                {/if}
                <form class="space-y-4" onsubmit={handleSubmit} autocomplete="off">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="firstName" class="block text-sm font-medium text-gray-900">First name</label>
                            <input id="firstName" name="firstName" type="text" bind:value={firstName} required class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                            {#if errors.firstName}
                                <div class="text-xs text-red-600 mt-1">{errors.firstName}</div>
                            {/if}
                        </div>
                        <div class="space-y-1">
                            <label for="lastName" class="block text-sm font-medium text-gray-900">Last name</label>
                            <input id="lastName" name="lastName" type="text" bind:value={lastName} required class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                            {#if errors.lastName}
                                <div class="text-xs text-red-600 mt-1">{errors.lastName}</div>
                            {/if}
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
                        <input id="email" name="email" type="email" bind:value={email} required class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                        {#if errors.email}
                            <div class="text-xs text-red-600 mt-1">{errors.email}</div>
                        {/if}
                    </div>
                    <div class="space-y-1">
                        <label for="company" class="block text-sm font-medium text-gray-900">Company</label>
                        <input id="company" name="company" type="text" bind:value={company} required class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                        {#if errors.company}
                            <div class="text-xs text-red-600 mt-1">{errors.company}</div>
                        {/if}
                    </div>
                    <div class="space-y-1">
                        <label for="phone" class="block text-sm font-medium text-gray-900">Phone (optional)</label>
                        <input id="phone" name="phone" type="tel" bind:value={phone} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                        {#if errors.phone}
                            <div class="text-xs text-red-600 mt-1">{errors.phone}</div>
                        {/if}
                    </div>
                    <button type="submit" class="mt-4 w-full h-12 bg-blue-600 text-white rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={$formStore.isSubmitting}>
                        {#if $formStore.isSubmitting}
                            Submitting...
                        {:else}
                            Get Started
                        {/if}
                    </button>
                </form>
            </div>
        </div>
    {/if}
</div> 