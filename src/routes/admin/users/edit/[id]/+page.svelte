<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import { fade } from 'svelte/transition';
    import FormField from '$lib/components/ui/FormField.svelte';
    import FormContainer from '$lib/components/ui/FormContainer.svelte';
    import FormGroup from '$lib/components/ui/FormGroup.svelte';
    import { page } from '$app/stores'; // Import page store

    interface FormResult {
        type: 'success' | 'failure';
        data?: any;
    }

    interface FormErrors {
        error?: string;
        fieldErrors?: {
            first_name?: string;
            last_name?: string;
            email?: string;
            password?: string;
            phone?: string;
            role?: string;
        };
    }

    export let data: PageData;
    export let form: ActionData | null = null; 
    
    let loading = false;
    let success = false;
    let first_name = data.user.first_name;
    let last_name = data.user.last_name;
    let email = data.user.email;
    let phone = data.user.phone || '';
    let password = '';
    let role = data.user.role;

    // Function to update form values from data
    function updateFormValues(userData: any) {
        first_name = userData.first_name;
        last_name = userData.last_name;
        email = userData.email;
        phone = userData.phone || '';
        role = userData.role;
        password = ''; // Always clear password after update
        console.log('[updateFormValues] Form values updated');
    }

    // Initialize form values
    updateFormValues(data.user);

    const handleSubmit = () => {
        loading = true;
        success = false;
        // No need to manually update form values here, 
        // we'll rely on the reactive $page.form update below
        return async ({ result }: { result: FormResult }) => {
            loading = false;
            // Set success flag based on result, but don't update values here
            success = result.type === 'success' && result.data?.success === true;
        };
    };

    // Reactively update form values when $page.form indicates success
    $: if ($page.form?.success && $page.form?.user) {
        console.log('[Reactive Update] Form prop indicates success, updating values:', $page.form.user);
        updateFormValues($page.form.user);
        // Reset success flag from form prop if needed, or rely on local success flag
        // Optionally clear $page.form after processing?
    }

    // Also update local success flag based on form prop
    $: success = $page.form?.success === true;

</script>

<svelte:head>
    <title>Edit User: {data.user.first_name} {data.user.last_name} - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Edit User: {data.user.first_name} {data.user.last_name}
                </h2>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <a
                    href="/admin/users"
                    class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Back to Users
                </a>
            </div>
        </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mt-8 bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                {#if success}
                    <div class="rounded-md bg-green-50 p-4 mb-6">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-green-800">
                                    User updated successfully!
                                </p>
                            </div>
                        </div>
                    </div>
                {/if}

                <FormContainer 
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <FormGroup legend="User Information">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <FormField
                                label="First Name"
                                name="first_name"
                                type="text"
                                bind:value={first_name}
                                required
                                error={form?.fieldErrors?.first_name}
                            />

                            <FormField
                                label="Last Name"
                                name="last_name"
                                type="text"
                                bind:value={last_name}
                                required
                                error={form?.fieldErrors?.last_name}
                            />
                        </div>

                        <FormField
                            label="Email"
                            name="email"
                            type="email"
                            bind:value={email}
                            required
                            error={form?.fieldErrors?.email}
                        />

                        <FormField
                            label="Phone"
                            name="phone"
                            type="tel"
                            bind:value={phone}
                            error={form?.fieldErrors?.phone}
                        />

                        <FormField
                            label="Password"
                            name="password"
                            type="password"
                            bind:value={password}
                            error={form?.fieldErrors?.password}
                            helperText="Leave blank to keep current password"
                        />

                        <div>
                            <label for="role" class="block text-sm font-medium leading-6 text-gray-900">
                                Role *
                            </label>
                            <div class="mt-2">
                                <select
                                    id="role"
                                    name="role"
                                    bind:value={role}
                                    required
                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            {#if form?.fieldErrors?.role}
                                <p class="mt-2 text-sm text-red-600">{form.fieldErrors.role}</p>
                            {/if}
                        </div>
                    </FormGroup>

                    {#if form?.error}
                        <div class="rounded-md bg-red-50 p-4">
                            <div class="flex">
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-red-800">
                                        {form.error}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    {/if}

                    <div class="flex justify-end gap-x-3">
                        <a
                            href="/admin/users"
                            class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={loading}
                            class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </FormContainer>
            </div>
        </div>
    </div>
</div> 