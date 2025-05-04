<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Form from "$lib/components/ui/form/index.js";
    import { superForm } from "sveltekit-superforms/client";
    import { z } from "zod";

    // Define the form schema using Zod
    const schema = z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        company: z.string().min(2, "Company name must be at least 2 characters"),
        phone: z.string().optional(),
    });

    // Create the form using superforms
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

    let isOpen = $state(false);
    let { children } = $props();
</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Trigger>
        {@render children?.()}
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Start Your Free Trial</Dialog.Title>
            <Dialog.Description>
                Fill out the form below to get started with our brand protection platform.
            </Dialog.Description>
        </Dialog.Header>
        <form onsubmit={handleSubmit} class="grid gap-4 py-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="firstName">First name</Label>
                    <Input
                        id="firstName"
                        bind:value={firstName}
                        placeholder="John"
                    />
                    {#if firstNameError}
                        <p class="text-sm text-destructive">{firstNameError}</p>
                    {/if}
                </div>
                <div class="grid gap-2">
                    <Label for="lastName">Last name</Label>
                    <Input
                        id="lastName"
                        bind:value={lastName}
                        placeholder="Doe"
                    />
                    {#if lastNameError}
                        <p class="text-sm text-destructive">{lastNameError}</p>
                    {/if}
                </div>
            </div>
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    bind:value={email}
                    placeholder="john@example.com"
                />
                {#if emailError}
                    <p class="text-sm text-destructive">{emailError}</p>
                {/if}
            </div>
            <div class="grid gap-2">
                <Label for="company">Company</Label>
                <Input
                    id="company"
                    bind:value={company}
                    placeholder="Acme Inc."
                />
                {#if companyError}
                    <p class="text-sm text-destructive">{companyError}</p>
                {/if}
            </div>
            <div class="grid gap-2">
                <Label for="phone">Phone (optional)</Label>
                <Input
                    id="phone"
                    type="tel"
                    bind:value={phone}
                    placeholder="+1 (555) 000-0000"
                />
            </div>
            <Dialog.Footer>
                <Button type="submit" class="w-full">Start Free Trial</Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root> 