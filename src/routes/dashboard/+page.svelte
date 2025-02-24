<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    let loading = true;

    onMount(() => {
        loading = false;
    });

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatDateTime(dateString: string): string {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }

    function formatPhoneNumber(phone: string): string {
        // Implement your formatting logic here
        return phone;
    }
</script>

<svelte:head>
    <title>Dashboard - JanusIPM</title>
</svelte:head>

{#if loading}
    <div class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
{:else}
    <div class="min-h-screen bg-gray-100">
        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" in:fade>
            <!-- Welcome Section -->
            <div class="px-4 py-6 sm:px-0">
                <h1 class="text-2xl font-semibold text-gray-900">
                    Welcome back, {data.user.first_name}!
                </h1>
                <p class="mt-1 text-sm text-gray-600">
                    Here's your account overview
                </p>
            </div>

            <!-- Quick Actions -->
            {#if data.user.role === 'admin'}
                <div class="mt-6 px-4 sm:px-0">
                    <div class="bg-white shadow rounded-lg p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">Admin Actions</h2>
                        <div class="flex flex-wrap gap-4">
                            <a
                                href="/admin/users"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                data-sveltekit-preload
                            >
                                User Management
                            </a>
                            <a
                                href="/admin/brands"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                data-sveltekit-preload
                            >
                                Brand Management
                            </a>
                            <a
                                href="/admin/terms"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                data-sveltekit-preload
                            >
                                Trademark Terms
                            </a>
                            <a
                                href="/admin/marketplaces"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                data-sveltekit-preload
                            >
                                Marketplace Management
                            </a>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- User Information -->
            <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Account Information
                    </h3>
                </div>
                <div class="border-t border-gray-200">
                    <dl>
                        <!-- Email field with verification status -->
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Email address
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                                {data.user.email}
                                {#if data.user.email_verified}
                                    <svg 
                                        class="h-5 w-5 text-green-500" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                        aria-label="Email verified"
                                    >
                                        <path 
                                            fill-rule="evenodd" 
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                            clip-rule="evenodd" 
                                        />
                                    </svg>
                                {:else}
                                    <span class="inline-flex items-center">
                                        <svg 
                                            class="h-5 w-5 text-yellow-500" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 20 20" 
                                            fill="currentColor"
                                            aria-label="Email not verified"
                                        >
                                            <path 
                                                fill-rule="evenodd" 
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                                                clip-rule="evenodd" 
                                            />
                                        </svg>
                                        <form 
                                            method="POST" 
                                            action="/verify-email/resend"
                                            class="ml-2"
                                        >
                                            <button
                                                type="submit"
                                                class="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                            >
                                                Verify now
                                            </button>
                                        </form>
                                    </span>
                                {/if}
                            </dd>
                        </div>

                        <!-- Rest of the user information -->
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                                Full name
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {data.user.first_name} {data.user.last_name}
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Phone number</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {data.user.phone ? formatPhoneNumber(data.user.phone) : 'Not provided'}
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Account type</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {data.user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}">
                                    {data.user.role}
                                </span>
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Member since</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formatDate(data.user.created_at)}
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Last login</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formatDateTime(data.user.lastLogin)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </main>
    </div>
{/if} 