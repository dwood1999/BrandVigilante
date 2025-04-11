<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { fade } from 'svelte/transition';
    import SearchInput from '$lib/components/SearchInput.svelte';
    import { page } from '$app/stores';

    export let data: PageData;

    let searchQuery = '';
    let selectedUsers: number[] = [];
    let selectedTerms: number[] = [];
    let loading = false;

    // Filter out already associated users from available users
    $: availableUsers = data.availableUsers.filter(user => 
        !data.users.some(u => u.id === user.id)
    );

    $: filteredUsers = data.availableUsers.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    $: filteredTerms = data.terms.filter(term => 
        term.term.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBulkUserAssociation = async () => {
        if (selectedUsers.length === 0) return;
        
        loading = true;
        try {
            const response = await fetch(`/api/brands/${data.brand.id}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds: selectedUsers })
            });
            
            if (!response.ok) throw new Error('Failed to associate users');
            
            // Refresh the page to show updated associations
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            loading = false;
        }
    };

    const handleUserRemoval = async (userId: number) => {
        loading = true;
        try {
            const response = await fetch(`/api/brands/${data.brand.id}/users`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds: [userId] })
            });
            
            if (!response.ok) throw new Error('Failed to remove user');
            
            // Refresh the page to show updated associations
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>{data.brand.name} Management - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {data.brand.name} Management
                </h2>
            </div>
        </div>

        <!-- Search -->
        <div class="mt-4 w-full max-w-lg">
            <SearchInput
                bind:value={searchQuery}
                placeholder="Search users or terms..."
            />
        </div>

        <!-- Users Section -->
        <div class="mt-8">
            <h3 class="text-lg font-medium text-gray-900">Associated Users</h3>
            
            <!-- Current Users -->
            {#if data.users.length > 0}
                <div class="mt-4 bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h4 class="text-sm font-medium text-gray-500 mb-4">Currently Associated Users</h4>
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" class="relative px-6 py-3">
                                        <span class="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                {#each data.users as user (user.id)}
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                type="button"
                                                class="text-red-600 hover:text-red-900"
                                                disabled={loading}
                                                on:click={() => handleUserRemoval(user.id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}

            <!-- Add Users Section -->
            {#if availableUsers.length > 0}
                <div class="mt-4 bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="flex justify-between mb-4">
                            <h4 class="text-sm font-medium text-gray-500">Select users to associate with this brand</h4>
                            <button
                                type="button"
                                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                disabled={selectedUsers.length === 0 || loading}
                                on:click={handleBulkUserAssociation}
                            >
                                {loading ? 'Processing...' : 'Associate Selected Users'}
                            </button>
                        </div>

                        <div class="mt-4 border rounded-md">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                on:change={(e) => {
                                                    if (e.currentTarget.checked) {
                                                        selectedUsers = filteredUsers.map(u => u.id);
                                                    } else {
                                                        selectedUsers = [];
                                                    }
                                                }}
                                            >
                                        </th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    {#each filteredUsers as user (user.id)}
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    bind:group={selectedUsers}
                                                    value={user.id}
                                                >
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                {user.first_name} {user.last_name}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                {user.email}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {user.email_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                                    {user.email_verified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Terms Section -->
        <div class="mt-8">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Trademark Terms</h3>
                <a
                    href="/admin/terms/new?brand={data.brand.id}"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    Add New Term
                </a>
            </div>
            <div class="mt-4 bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Term
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#each data.terms as term (term.id)}
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {term.term}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(term.created_at).toLocaleDateString()}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="/admin/terms/{term.id}/edit" class="text-blue-600 hover:text-blue-900">
                                            Edit
                                        </a>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div> 