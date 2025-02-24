<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';

    const navItems = [
        { href: '/admin/brands', label: 'Brands', icon: 'tag' },
        { href: '/admin/users', label: 'Users', icon: 'users' },
        { href: '/admin/marketplaces', label: 'Marketplaces', icon: 'shopping-cart' }
    ];
</script>

<div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="/admin" class="text-xl font-bold text-gray-900">
                            Admin Dashboard
                        </a>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {#each navItems as item}
                            <a
                                href={item.href}
                                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                                    {$page.url.pathname.startsWith(item.href)
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                                aria-current={$page.url.pathname.startsWith(item.href) ? 'page' : undefined}
                            >
                                <span class="material-icons-outlined mr-2 text-lg">{item.icon}</span>
                                {item.label}
                            </a>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Page Content -->
    <main class="py-10" in:fade>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <slot />
        </div>
    </main>
</div> 