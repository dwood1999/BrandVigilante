<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';

    const navigation = [
        { 
            name: 'Dashboard', 
            href: '/admin', 
            icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>`
        },
        { 
            name: 'Users', 
            href: '/admin/users',
            icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>`
        },
        { 
            name: 'Brands', 
            href: '/admin/brands',
            icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
            </svg>`
        },
        { 
            name: 'Terms', 
            href: '/admin/terms',
            icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>`
        },
        { 
            name: 'Marketplaces', 
            href: '/admin/marketplaces',
            icon: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>`
        }
    ];

    $: currentPath = $page.url.pathname;
</script>

<div class="min-h-[calc(100vh-4rem)] bg-gray-100 pt-16">
    <div class="hidden md:fixed md:top-16 md:bottom-0 md:flex md:w-64 md:flex-col">
        <div class="flex min-h-0 flex-1 flex-col bg-gray-800">
            <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div class="flex flex-shrink-0 items-center px-4">
                    <span class="text-xl font-bold text-white">Admin Panel</span>
                </div>
                <nav class="mt-5 flex-1 space-y-1 px-2">
                    {#each navigation as item}
                        <a
                            href={item.href}
                            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md {currentPath === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
                            aria-current={currentPath === item.href ? 'page' : undefined}
                        >
                            {@html item.icon}
                            <span class="ml-3">{item.name}</span>
                        </a>
                    {/each}
                </nav>
            </div>
            <div class="flex flex-shrink-0 bg-gray-700 p-4">
                <div class="group block w-full flex-shrink-0">
                    <div class="flex items-center">
                        <div>
                            <img
                                class="inline-block h-9 w-9 rounded-full"
                                src="https://ui-avatars.com/api/?name={encodeURIComponent(`${$page.data.user?.first_name} ${$page.data.user?.last_name}`)}&background=6366f1&color=fff"
                                alt="Profile"
                            />
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-white">
                                {$page.data.user?.first_name} {$page.data.user?.last_name}
                            </p>
                            <p class="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                                {$page.data.user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-1 flex-col md:pl-64">
        <div class="sticky top-16 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
                type="button"
                class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
                <span class="sr-only">Open sidebar</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
        <main class="flex-1" in:fade>
            <slot />
        </main>
    </div>
</div> 