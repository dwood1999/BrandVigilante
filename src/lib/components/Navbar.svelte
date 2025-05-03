<script lang="ts">
    import { page } from '$app/stores';
    import { fade, slide } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    // Props & Stores
    export let user: {
        id: number;
        email: string;
        role: string;
        first_name: string;
        last_name: string;
    } | null = null;

    // State
    let isOpen = false;
    let isScrolled = false;
    let userMenuOpen = false;
    let initials = '';

    // Compute initials when user changes
    $: if (user) {
        initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }

    // Handle scroll effect
    onMount(() => {
        const handleScroll = () => {
            isScrolled = window.scrollY > 10;
        };
        if (browser) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    });

    // Close menus when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu')) {
            userMenuOpen = false;
        }
        if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
            isOpen = false;
        }
    }

    // Handle keyboard navigation
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            isOpen = false;
            userMenuOpen = false;
        }
    }

    // Function to clear cookie client-side (best effort)
    function clearSessionCookieClientSide() {
        if (!browser) return;
        const cookieName = 'session'; // Assuming 'session' is the name
        const domain = window.location.hostname;
        document.cookie = `${cookieName}=;path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax${window.location.protocol === 'https:' ? ';Secure' : ''}`;
        console.log('[Navbar] Attempted client-side cookie clear');
    }

    async function handleLogout() {
        try {
            const response = await fetch('/logout', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                window.location.href = '/sign-in';
            } else {
                console.error('Logout failed:', await response.text());
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    function closeMenus() {
        isOpen = false;
        userMenuOpen = false;
    }

    // Navigation items
    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        ...(user ? [
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/listings', label: 'Listings' },
            ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : [])
        ] : [])
    ];
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<nav
    class="fixed w-full z-50 transition-all duration-200 {isScrolled ? 'bg-white shadow-lg dark:bg-gray-800' : 'bg-transparent'}"
    aria-label="Main navigation"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <!-- Logo and primary navigation -->
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a 
                        href="/" 
                        class="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        aria-label="JanusIPM Home"
                    >
                        JanusIPM
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {#each navItems as item}
                        <a
                            href={item.href}
                            class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {$page.url.pathname === item.href || ($page.url.pathname.startsWith(item.href) && item.href !== '/') ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
                            aria-current={$page.url.pathname === item.href ? 'page' : undefined}
                        >
                            {item.label}
                        </a>
                    {/each}
                </div>
            </div>

            <!-- Right side navigation -->
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
                {#if user}
                    <div class="flex items-center space-x-4">
                        <!-- User Dropdown -->
                        <div class="ml-3 relative user-menu">
                            <button
                                type="button"
                                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                id="user-menu"
                                aria-expanded={userMenuOpen}
                                aria-haspopup="true"
                                on:click={() => userMenuOpen = !userMenuOpen}
                            >
                                <span class="sr-only">Open user menu</span>
                                <div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                    {initials}
                                </div>
                            </button>

                            {#if userMenuOpen}
                                <div
                                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu"
                                    transition:fade={{ duration: 200 }}
                                >
                                    <a
                                        href="/profile"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        role="menuitem"
                                    >
                                        Your Profile
                                    </a>
                                    <a
                                        href="/settings"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        role="menuitem"
                                    >
                                        Settings
                                    </a>
                                </div>
                            {/if}
                        </div>
                        <form 
                            action="/sign-out" 
                            method="POST" 
                            use:enhance={() => {
                                return async ({ result }) => {
                                    if (result.type === 'success') {
                                        clearSessionCookieClientSide();
                                        await goto('/', { invalidateAll: true }); // Redirect to home, invalidate data
                                    }
                                };
                            }}
                        >
                            <button
                                type="submit"
                                class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                {:else}
                    <div class="flex items-center space-x-4">
                        <a
                            href="/sign-in"
                            class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Sign in
                        </a>
                        <a
                            href="/sign-up"
                            class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Sign up
                        </a>
                    </div>
                {/if}
            </div>

            <!-- Mobile menu button -->
            <div class="flex items-center sm:hidden">
                <button
                    type="button"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    aria-controls="mobile-menu"
                    aria-expanded={isOpen}
                    on:click={() => isOpen = !isOpen}
                >
                    <span class="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
                    <!-- Icon when menu is closed -->
                    <svg
                        class="h-6 w-6 {isOpen ? 'hidden' : 'block'}"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                    <!-- Icon when menu is open -->
                    <svg
                        class="h-6 w-6 {isOpen ? 'block' : 'hidden'}"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    {#if isOpen}
        <div
            class="sm:hidden"
            id="mobile-menu"
            transition:slide={{ duration: 200 }}
        >
            <div class="pt-2 pb-3 space-y-1">
                {#each navItems as item}
                    <a
                        href={item.href}
                        class="block pl-3 pr-4 py-2 text-base font-medium {$page.url.pathname === item.href ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-400' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}"
                        aria-current={$page.url.pathname === item.href ? 'page' : undefined}
                        on:click={closeMenus}
                    >
                        {item.label}
                    </a>
                {/each}
            </div>
            {#if user}
                <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    <div class="space-y-1">
                        <form 
                            action="/sign-out" 
                            method="POST"
                            use:enhance={() => {
                                return async ({ result }) => {
                                    if (result.type === 'success') {
                                        closeMenus(); // Close menu first
                                        clearSessionCookieClientSide();
                                        await goto('/', { invalidateAll: true }); // Redirect to home, invalidate data
                                    }
                                };
                            }}
                        >
                            <button
                                type="submit"
                                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            {:else}
                <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    <div class="space-y-1">
                        <a
                            href="/sign-in"
                            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                            on:click={closeMenus}
                        >
                            Sign in
                        </a>
                        <a
                            href="/sign-up"
                            class="block px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-gray-700"
                            on:click={closeMenus}
                        >
                            Sign up
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</nav> 