<script lang="ts">
    import { fade } from 'svelte/transition';
    import type { PageData } from './$types';
    import SearchInput from '$lib/components/SearchInput.svelte';
    import { page } from '$app/stores';

    export let data: PageData;

    let searchQuery = '';
    let selectedUsers: number[] = [];
    let selectedTerms: number[] = [];
    let loading = false;
    let activeTab: 'users' | 'terms' | 'marketplaces' = $page.url.searchParams.get('tab') as 'users' | 'terms' | 'marketplaces' || 'users';
    let sortOrder: 'newest' | 'alphabetical' = 'newest';

    $: availableUsers = data.availableUsers.filter(user => 
        !data.users.some(u => u.id === user.id)
    );
    $: console.log('Available Users after initial filter:', availableUsers);

    $: filteredAvailableUsers = availableUsers.filter(user => 
        searchQuery === '' || [
            user.email,
            user.first_name,
            user.last_name,
            `${user.first_name} ${user.last_name}`
        ].some(field => 
            field.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    $: console.log('Available Users after search filter:', filteredAvailableUsers);

    $: sortedAvailableUsers = [...filteredAvailableUsers].sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    });
    $: console.log('Available Users after sorting:', sortedAvailableUsers);

    $: console.log('Raw data from server:', {
        availableUsers: data.availableUsers,
        users: data.users,
        sampleUser: data.availableUsers[0]
    });

    $: filteredAssociatedUsers = data.users.filter(user => 
        searchQuery === '' || [
            user.email,
            user.first_name,
            user.last_name,
            `${user.first_name} ${user.last_name}`
        ].some(field => 
            field.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    $: filteredTerms = data.terms.filter(term => 
        term.term.toLowerCase().includes(searchQuery.toLowerCase())
    );

    $: availableMarketplaces = data.allMarketplaces.filter(marketplace => 
        !data.brandMarketplaces.some(bm => bm.id === marketplace.id)
    );

    $: filteredMarketplaces = availableMarketplaces.filter(marketplace => 
        searchQuery === '' || marketplace.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            loading = false;
        }
    };

    const handleMarketplaceAssociation = async (marketplaceId: number) => {
        loading = true;
        try {
            const response = await fetch(`/api/brands/${data.brand.id}/marketplaces`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ marketplaceIds: [marketplaceId] })
            });
            
            if (!response.ok) throw new Error('Failed to associate marketplace');
            
            window.location.href = `/admin/brands/${data.brand.id}/manage?tab=marketplaces`;
        } catch (error) {
            console.error('Error:', error);
        } finally {
            loading = false;
        }
    };

    const handleMarketplaceRemoval = async (marketplaceId: number) => {
        loading = true;
        try {
            const response = await fetch(`/api/brands/${data.brand.id}/marketplaces`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ marketplaceIds: [marketplaceId] })
            });
            
            if (!response.ok) throw new Error('Failed to remove marketplace');
            
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            loading = false;
        }
    };

    const toggleMarketplaceStatus = async (marketplaceId: number, currentStatus: 'active' | 'inactive') => {
        loading = true;
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            const response = await fetch(
                `/api/brands/${data.brand.id}/marketplaces/${marketplaceId}/status`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                }
            );
            
            if (!response.ok) throw new Error('Failed to update status');
            
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>Manage {data.brand.name} - Admin Dashboard</title>
</svelte:head>

<div class="py-6" in:fade>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Manage {data.brand.name}
                </h2>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <a
                    href="/admin/brands"
                    class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Back to Brands
                </a>
            </div>
        </div>

        <!-- Tabs -->
        <div class="mt-4 border-b border-gray-200">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                    on:click={() => activeTab = 'users'}
                >
                    Users
                </button>
                <button
                    class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'terms' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                    on:click={() => activeTab = 'terms'}
                >
                    Trademark Terms
                </button>
                <button
                    class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'marketplaces' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                    on:click={() => activeTab = 'marketplaces'}
                >
                    Marketplaces
                </button>
            </nav>
        </div>

        {#if activeTab === 'users'}
            <!-- Associated Users -->
            {#if filteredAssociatedUsers.length > 0}
                <div class="mt-8">
                    <h3 class="text-lg font-medium text-gray-900">Associated Users</h3>
                    <div class="mt-4 bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
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
                                    {#each filteredAssociatedUsers as user (user.id)}
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
                </div>
            {/if}

            <!-- Available Users -->
            {#if filteredAvailableUsers.length > 0}
                <div class="mt-8">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-medium text-gray-900">Available Users</h3>
                        <div class="flex items-center gap-4">
                            <SearchInput
                                bind:value={searchQuery}
                                placeholder="Search available users..."
                                class="w-64"
                            />
                            <select
                                bind:value={sortOrder}
                                class="rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="alphabetical">Alphabetical</option>
                            </select>
                            <button
                                type="button"
                                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                disabled={selectedUsers.length === 0 || loading}
                                on:click={handleBulkUserAssociation}
                            >
                                {loading ? 'Processing...' : 'Add Selected Users'}
                            </button>
                        </div>
                    </div>
                    <div class="mt-4 bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                on:change={(e) => {
                                                    if (e.currentTarget.checked) {
                                                        selectedUsers = filteredAvailableUsers.map(u => u.id);
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
                                            Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    {#each sortedAvailableUsers as user (user.id)}
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
                                                <div class="text-sm font-medium text-gray-900">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            {/if}
        {:else if activeTab === 'terms'}
            <!-- Terms Section -->
            <div class="mt-8">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-medium text-gray-900">Trademark Terms</h3>
                    <div class="flex items-center gap-4">
                        <SearchInput
                            bind:value={searchQuery}
                            placeholder="Search terms..."
                            class="w-64"
                        />
                        <a
                            href="/admin/brands/{data.brand.id}/terms/new"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Add New Term
                        </a>
                    </div>
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
                                {#each filteredTerms as term (term.id)}
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {term.term}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(term.created_at).toLocaleDateString()}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a 
                                                href="/admin/brands/{data.brand.id}/terms/{term.id}/edit"
                                                class="text-blue-600 hover:text-blue-900"
                                            >
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
        {:else if activeTab === 'marketplaces'}
            <!-- Marketplaces Section -->
            <div class="mt-8">
                <!-- Associated Marketplaces -->
                {#if data.brandMarketplaces.length > 0}
                    <div class="mb-8">
                        <h3 class="text-lg font-medium text-gray-900">Associated Marketplaces</h3>
                        <div class="mt-4 bg-white shadow sm:rounded-lg">
                            <div class="px-4 py-5 sm:p-6">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Added
                                            </th>
                                            <th scope="col" class="relative px-6 py-3">
                                                <span class="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        {#each data.brandMarketplaces as marketplace (marketplace.id)}
                                            <tr>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="text-sm font-medium text-gray-900">
                                                        {marketplace.name}
                                                    </div>
                                                    <div class="text-sm text-gray-500">
                                                        {marketplace.url}
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {marketplace.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                        <button
                                                            type="button"
                                                            class="focus:outline-none"
                                                            disabled={loading}
                                                            on:click={() => toggleMarketplaceStatus(marketplace.id, marketplace.status)}
                                                        >
                                                            {marketplace.status}
                                                        </button>
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(marketplace.created_at).toLocaleDateString()}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        type="button"
                                                        class="text-red-600 hover:text-red-900"
                                                        disabled={loading}
                                                        on:click={() => handleMarketplaceRemoval(marketplace.id)}
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
                    </div>
                {/if}

                <!-- Available Marketplaces -->
                {#if filteredMarketplaces.length > 0}
                    <div class="mt-8">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-medium text-gray-900">Available Marketplaces</h3>
                            <div class="flex items-center gap-4">
                                <SearchInput
                                    bind:value={searchQuery}
                                    placeholder="Search marketplaces..."
                                    class="w-64"
                                />
                            </div>
                        </div>
                        <div class="mt-4 bg-white shadow sm:rounded-lg">
                            <div class="px-4 py-5 sm:p-6">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th scope="col" class="relative px-6 py-3">
                                                <span class="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        {#each filteredMarketplaces as marketplace (marketplace.id)}
                                            <tr>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="text-sm font-medium text-gray-900">
                                                        {marketplace.name}
                                                    </div>
                                                    <div class="text-sm text-gray-500">
                                                        {marketplace.url}
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        type="button"
                                                        class="text-blue-600 hover:text-blue-900"
                                                        disabled={loading}
                                                        on:click={() => handleMarketplaceAssociation(marketplace.id)}
                                                    >
                                                        Add
                                                    </button>
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
        {/if}
    </div>
</div> 