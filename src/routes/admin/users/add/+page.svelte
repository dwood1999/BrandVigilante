<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    import type { ActionData } from './$types';

    export let form: ActionData;
    let loading = false;

    function handleSubmit() {
        loading = true;
        return async ({ result }) => {
            loading = false;
            if (result.type === 'success') {
                window.location.href = '/admin/users';
            }
        };
    }
</script>

<svelte:head>
    <title>Add User - Admin Panel</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8" in:fade>
    <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Add New User
            </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
            <a
                href="/admin/users"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Back to Users
            </a>
        </div>
    </div>

    <form
        method="POST"
        class="mt-8 space-y-6"
        use:enhance={handleSubmit}
    >
        {#if form?.message}
            <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">
                            {form.message}
                        </h3>
                    </div>
                </div>
            </div>
        {/if}

        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
                <label for="first_name" class="block text-sm font-medium text-gray-700">
                    First name
                </label>
                <div class="mt-1">
                    <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={form?.data?.first_name ?? ''}
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                {#if form?.fieldErrors?.first_name}
                    <p class="mt-2 text-sm text-red-600">
                        {form.fieldErrors.first_name}
                    </p>
                {/if}
            </div>

            <div>
                <label for="last_name" class="block text-sm font-medium text-gray-700">
                    Last name
                </label>
                <div class="mt-1">
                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={form?.data?.last_name ?? ''}
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                {#if form?.fieldErrors?.last_name}
                    <p class="mt-2 text-sm text-red-600">
                        {form.fieldErrors.last_name}
                    </p>
                {/if}
            </div>

            <div class="sm:col-span-2">
                <label for="email" class="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div class="mt-1">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={form?.data?.email ?? ''}
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                {#if form?.fieldErrors?.email}
                    <p class="mt-2 text-sm text-red-600">
                        {form.fieldErrors.email}
                    </p>
                {/if}
            </div>

            <div class="sm:col-span-2">
                <label for="password" class="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div class="mt-1">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                {#if form?.fieldErrors?.password}
                    <p class="mt-2 text-sm text-red-600">
                        {form.fieldErrors.password}
                    </p>
                {/if}
            </div>

            <div class="sm:col-span-2">
                <label for="phone" class="block text-sm font-medium text-gray-700">
                    Phone number
                </label>
                <div class="mt-1">
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={form?.data?.phone ?? ''}
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                {#if form?.fieldErrors?.phone}
                    <p class="mt-2 text-sm text-red-600">
                        {form.fieldErrors.phone}
                    </p>
                {/if}
            </div>

            <div class="sm:col-span-2">
                <label for="role" class="block text-sm font-medium text-gray-700">
                    Role
                </label>
                <div class="mt-1">
                    <select
                        id="role"
                        name="role"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                        <option value="user" selected={form?.data?.role === 'user'}>User</option>
                        <option value="admin" selected={form?.data?.role === 'admin'}>Admin</option>
                    </select>
                </div>
                {#if form?.fieldErrors?.role}
                    <p class="mt-2 text-sm text-red-600">
                        {form.fieldErrors.role}
                    </p>
                {/if}
            </div>
        </div>

        <div class="pt-5">
            <div class="flex justify-end">
                <a
                    href="/admin/users"
                    class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </a>
                <button
                    type="submit"
                    disabled={loading}
                    class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {loading ? 'Creating...' : 'Create User'}
                </button>
            </div>
        </div>
    </form>
</div> 