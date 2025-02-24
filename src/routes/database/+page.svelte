<script lang="ts">
    import type { PageData } from './types';
    
    export let data: PageData;

    $: ({ users, userMessage, databaseStatus } = data);
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Database Information</h1>

    <!-- Database Status -->
    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Connection Status</h2>
        <div class="p-4 rounded-lg {databaseStatus === 'working' ? 'bg-green-100' : 'bg-red-100'}">
            <p class="font-medium">
                {#if databaseStatus === 'working'}
                    ✅ Database connection is working
                {:else}
                    ❌ Database connection failed
                {/if}
            </p>
        </div>
    </div>

    <!-- Users Table -->
    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Users</h2>
        <p class="text-gray-600 mb-4">{userMessage}</p>

        {#if users.length > 0}
            <div class="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#each users as user}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>

    <!-- Back to Home -->
    <div>
        <a href="/" class="text-blue-600 hover:text-blue-800 font-medium">← Back to Home</a>
    </div>
</div> 