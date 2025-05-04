<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import FormContainer from "$lib/components/ui/FormContainer.svelte";
    import FormField from "$lib/components/ui/FormField.svelte";
    import FormGroup from "$lib/components/ui/FormGroup.svelte";
    import { z } from "zod";

    // Define the form schema using Zod
    const schema = z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        company: z.string().min(2, "Company name must be at least 2 characters"),
        phone: z.string().optional(),
    });

    let isOpen = $state(false);
    let firstName = $state("");
    let lastName = $state("");
    let email = $state("");
    let company = $state("");
    let phone = $state("");
    
    let firstNameError = $state("");
    let lastNameError = $state("");
    let emailError = $state("");
    let companyError = $state("");

    // Handle form submission
    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        // Here you would typically send the data to your server
        console.log("Form submitted:", { firstName, lastName, email, company, phone });
        // Close the dialog after successful submission
        isOpen = false;
    }

    let { children } = $props();
</script>

<div class="relative">
    <div
        role="button"
        tabindex="0"
        class="w-full cursor-pointer"
        onclick={() => isOpen = true}
        onkeydown={e => { if (e.key === 'Enter' || e.key === ' ') { isOpen = true; } }}
        aria-label="Open signup form"
    >
        {@render children?.()}
    </div>

    {#if isOpen}
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-foreground">Start Your Free Trial</h2>
                    <button
                        type="button"
                        onclick={() => isOpen = false}
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close signup form"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="text-muted-foreground mb-6">
                    Fill out the form below to get started with our brand protection platform.
                </p>
                <FormContainer onSubmit={handleSubmit}>
                    <FormGroup>
                        <div class="grid grid-cols-2 gap-4">
                            <FormField
                                label="First name"
                                name="firstName"
                                bind:value={firstName}
                                error={firstNameError}
                                placeholder="John"
                            />
                            <FormField
                                label="Last name"
                                name="lastName"
                                bind:value={lastName}
                                error={lastNameError}
                                placeholder="Doe"
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <FormField
                            label="Email"
                            name="email"
                            type="email"
                            bind:value={email}
                            error={emailError}
                            placeholder="john@example.com"
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormField
                            label="Company"
                            name="company"
                            bind:value={company}
                            error={companyError}
                            placeholder="Acme Inc."
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormField
                            label="Phone (optional)"
                            name="phone"
                            type="tel"
                            bind:value={phone}
                            placeholder="+1 (555) 000-0000"
                        />
                    </FormGroup>
                    <Button type="submit" class="w-full">Start Free Trial</Button>
                </FormContainer>
            </div>
        </div>
    {/if}
</div> 