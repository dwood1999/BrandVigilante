<script lang="ts">
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    export let data: PageData;

    let search = $page.url.searchParams.get('search') || '';
    let selectedRole = $page.url.searchParams.get('role') || '';
    let perPage = Number($page.url.searchParams.get('perPage')) || 10;

    $: currentPage = Number($page.url.searchParams.get('page')) || 1;
    $: totalPages = data.pagination.totalPages;
    $: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function updateQueryParams() {
        const params = new URLSearchParams($page.url.searchParams);
        if (search) params.set('search', search);
        else params.delete('search');
        if (selectedRole) params.set('role', selectedRole);
        else params.delete('role');
        params.set('perPage', perPage.toString());
        params.set('page', '1');
        window.location.search = params.toString();
    }
</script>

<svelte:head>
    <title>{data.meta.title}</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" in:fade>
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-2xl font-semibold text-gray-900">Users</h1>
            <p class="mt-2 text-sm text-gray-700">
                A list of all users in your account including their name, email, role and status.
            </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <a
                href="/admin/users/add"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
                Add user
            </a>
        </div>
    </div>

    <!-- Filters -->
    <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-900 mb-1">Search</label>
            <input
                id="search"
                type="text"
                bind:value={search}
                on:input={() => updateQueryParams()}
                class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
        </div>
        <div class="sm:w-48">
            <label for="role" class="block text-sm font-medium text-gray-900 mb-1">Role</label>
            <select
                id="role"
                bind:value={selectedRole}
                on:change={() => updateQueryParams()}
                class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
                <option value="">All roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
        </div>
        <div class="sm:w-32">
            <label for="perPage" class="block text-sm font-medium text-gray-900 mb-1">Per Page</label>
            <select
                id="perPage"
                bind:value={perPage}
                on:change={() => updateQueryParams()}
                class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
            </select>
        </div>
    </div>

    <!-- Users Table -->
    <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span class="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            {#each data.users as user (user.id)}
                                <tr>
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div class="font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 {user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {formatDate(user.created_at)}
                                    </td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div class="ml-2 flex flex-shrink-0">
                                            <a
                                                href="/admin/users/edit/{user.id}"
                                                class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                                            >
                                                Edit
                                            </a>
                                            <form
                                                action="?/deleteUser"
                                                method="POST"
                                                use:enhance={({ formData }) => {
                                                    return async ({ result }) => {
                                                        if (!confirm('Are you sure you want to delete this user?')) {
                                                            return;
                                                        }
                                                    };
                                                }}
                                            >
                                                <input type="hidden" name="userId" value={user.id}>
                                                <button
                                                    type="submit"
                                                    class="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-600/10 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
        <div class="flex flex-1 justify-between sm:hidden">
            <a
                href="?page={currentPage - 1}"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                class:pointer-events-none={currentPage === 1}
                class:opacity-50={currentPage === 1}
            >
                Previous
            </a>
            <a
                href="?page={currentPage + 1}"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                class:pointer-events-none={currentPage === totalPages}
                class:opacity-50={currentPage === totalPages}
            >
                Next
            </a>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Showing <span class="font-medium">{(currentPage - 1) * perPage + 1}</span> to <span class="font-medium">{Math.min(currentPage * perPage, data.pagination.total)}</span> of{' '}
                    <span class="font-medium">{data.pagination.total}</span> results
                </p>
            </div>
            <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <a
                        href="?page={currentPage - 1}"
                        class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                        class:pointer-events-none={currentPage === 1}
                        class:opacity-50={currentPage === 1}
                    >
                        <span class="sr-only">Previous</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    {#each pageNumbers as pageNum}
                        <a
                            href="?page={pageNum}"
                            class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                            class:bg-blue-50={pageNum === currentPage}
                            class:text-blue-600={pageNum === currentPage}
                            class:border-blue-500={pageNum === currentPage}
                        >
                            {pageNum}
                        </a>
                    {/each}
                    <a
                        href="?page={currentPage + 1}"
                        class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                        class:pointer-events-none={currentPage === totalPages}
                        class:opacity-50={currentPage === totalPages}
                    >
                        <span class="sr-only">Next</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </nav>
            </div>
        </div>
    </div>
</div> 