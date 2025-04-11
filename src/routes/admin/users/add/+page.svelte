<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    import FormField from '$lib/components/ui/FormField.svelte';
    import FormContainer from '$lib/components/ui/FormContainer.svelte';
    import FormGroup from '$lib/components/ui/FormGroup.svelte';

    interface FormResult {
        type: 'success' | 'failure';
        data?: any;
    }

    interface FormErrors {
        error?: string;
        fieldErrors?: {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            phone?: string;
            role?: string;
        };
    }

    export let form: FormErrors | null = null;
    let loading = false;
    let firstName = '';
    let lastName = '';
    let email = '';
    let phone = '';
    let password = '';
    let role = 'user';

    function handleSubmit() {
        loading = true;
        return async ({ result }: { result: FormResult }) => {
            loading = false;
            if (result.type === 'success') {
                window.location.href = '/admin/users';
            }
        };
    }
</script>

<svelte:head>
    <title>Add New User - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Add New User
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
                <FormContainer 
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <FormGroup legend="User Information">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <FormField
                                label="First Name"
                                name="firstName"
                                type="text"
                                bind:value={firstName}
                                required
                                error={form?.fieldErrors?.firstName}
                                autocomplete="name"
                            />

                            <FormField
                                label="Last Name"
                                name="lastName"
                                type="text"
                                bind:value={lastName}
                                required
                                error={form?.fieldErrors?.lastName}
                                autocomplete="name"
                            />
                        </div>

                        <FormField
                            label="Email"
                            name="email"
                            type="email"
                            bind:value={email}
                            required
                            error={form?.fieldErrors?.email}
                            autocomplete="email"
                        />

                        <FormField
                            label="Phone"
                            name="phone"
                            type="tel"
                            bind:value={phone}
                            error={form?.fieldErrors?.phone}
                            autocomplete="tel"
                        />

                        <FormField
                            label="Password"
                            name="password"
                            type="password"
                            bind:value={password}
                            required
                            error={form?.fieldErrors?.password}
                            autocomplete="new-password"
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
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </FormContainer>
            </div>
        </div>
    </div>
</div> 