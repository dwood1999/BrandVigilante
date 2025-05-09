<script lang="ts">
    import { page } from '$app/stores';
    import { fade, slide } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import Logo from './Logo.svelte';

    // State
    let isOpen = false;
    let isScrolled = false;
    let userMenuOpen = false;
    let initials = '';

    // Compute initials when user changes
    $: if ($page.data.user) {
        initials = `${$page.data.user.first_name[0]}${$page.data.user.last_name[0]}`.toUpperCase();
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
        
        const cookieNameToClear = $page.data.cookieNameToClear;

        if (!cookieNameToClear) {
            console.warn('[Navbar] cookieNameToClear not found in $page.data. Cannot clear cookie client-side.');
            return; 
        }

        const domain = window.location.hostname;
        const secureFlag = window.location.protocol === 'https:' ? ';Secure' : '';
        
        document.cookie = `${cookieNameToClear}=;path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax${secureFlag}`;
        console.log(`[Navbar] Attempted client-side clear for cookie: ${cookieNameToClear}`);
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

    // Make navItems reactive to user changes
    $: navItems = [
        { href: '/', label: 'Home' },
        ...($page.data.user
            ? [
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/listings', label: 'Listings' },
                ...($page.data.user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : [])
            ]
            : [])
    ];

    // Make desktopNavItems reactive to user changes
    $: desktopNavItems = [
        ...(!$page.data.user ? [
            { href: '/', label: 'Home' },
            { href: '/platform', label: 'Platform' },
            { href: '/pricing', label: 'Pricing' },
            { href: '/enforcement', label: 'Enforcement' },
            { href: '/technology', label: 'Technology' },
            { href: '/contact', label: 'Contact' },
        ] : []),
        ...($page.data.user
            ? [
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/listings', label: 'Listings' },
                ...($page.data.user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : [])
            ]
            : [])
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
                    <Logo size="lg" showText={true} linkToHome={true} />
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden sm:ml-6 sm:flex sm:space-x-1">
                    {#each desktopNavItems as item}
                        <a
                            href={item.href}
                            class="inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md min-h-[44px] {$page.url.pathname === item.href ||
                            ($page.url.pathname.startsWith(item.href) && item.href !== '/')
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' // Subtle background for active link
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            aria-current={$page.url.pathname === item.href ? 'page' : undefined}
                        >
                            {item.label}
                        </a>
                    {/each}
                </div>
            </div>

            <!-- Right side navigation -->
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
                {#if $page.data.user}
                    <div class="flex items-center space-x-4">
                        <!-- User Dropdown -->
                        <div class="ml-3 relative user-menu">
                            <button
                                type="button"
                                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                id="user-menu-button"
                                aria-expanded={userMenuOpen}
                                aria-haspopup="true"
                                aria-controls="user-menu-content"
                                on:click={() => (userMenuOpen = !userMenuOpen)}
                            >
                                <span class="sr-only">Open user menu</span>
                                <!-- Increased size for touch target -->
                                <div
                                    class="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-medium"
                                >
                                    {initials}
                                </div>
                            </button>

                            {#if userMenuOpen}
                                <div
                                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700 focus:outline-none"
                                    role="menu"
                                    id="user-menu-content"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    tabindex="-1"
                                    transition:fade={{ duration: 150 }}
                                >
                                    <a
                                        href="/profile"
                                        class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        role="menuitem"
                                        tabindex="-1"
                                        on:click={closeMenus}
                                    >
                                        Your Profile
                                    </a>
                                    <form
                                        action="/sign-out"
                                        method="POST"
                                        use:enhance={() => {
                                            /* Client-side redirect handled in enhance */ return async ({
                                                result
                                            }) => {
                                                if (result.type === 'success') {
                                                    closeMenus();
                                                    clearSessionCookieClientSide();
                                                    await goto('/', { invalidateAll: true });
                                                }
                                            };
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            role="menuitem"
                                            tabindex="-1"
                                        >
                                            Sign out
                                        </button>
                                    </form>
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <!-- Sign in/Sign up buttons for non-logged in users -->
                    <div class="flex items-center space-x-2">
                        <a
                            href="/sign-in"
                            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md min-h-[44px] text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 {$page.url.pathname ===
                            '/sign-in'
                                ? 'bg-gray-100 dark:bg-gray-700'
                                : ''}"
                            aria-current={$page.url.pathname === '/sign-in' ? 'page' : undefined}
                        >
                            Sign in
                        </a>
                        <a
                            href="/sign-up"
                            class="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                    class="menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 min-w-[44px] min-h-[44px]"
                    aria-controls="mobile-menu"
                    aria-expanded={isOpen}
                    on:click={() => (isOpen = !isOpen)}
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
            class="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            id="mobile-menu"
            transition:slide={{ duration: 200 }}
        >
            <!-- Use simplified navItems for mobile -->
            <div class="px-2 pt-2 pb-3 space-y-1">
                {#each navItems as item}
                    <a
                        href={item.href}
                        class="block px-3 py-3 text-base font-medium rounded-md {$page.url.pathname === item.href
                            ? 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'}"
                        aria-current={$page.url.pathname === item.href ? 'page' : undefined}
                        on:click={closeMenus}
                    >
                        {item.label}
                    </a>
                {/each}
                <!-- Add About/Contact back for mobile if desired -->
                <a
                    href="/about"
                    class="block px-3 py-3 text-base font-medium rounded-md {$page.url.pathname === '/about'
                        ? 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'}"
                    aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
                    on:click={closeMenus}
                >
                    About
                </a>
                <a
                    href="/contact"
                    class="block px-3 py-3 text-base font-medium rounded-md {$page.url.pathname === '/contact'
                        ? 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'}"
                    aria-current={$page.url.pathname === '/contact' ? 'page' : undefined}
                    on:click={closeMenus}
                >
                    Contact
                </a>
            </div>
            {#if $page.data.user}
                <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center px-5">
                        <div class="flex-shrink-0">
                            <!-- Increased size for touch target -->
                            <div
                                class="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-medium"
                            >
                                {initials}
                            </div>
                        </div>
                        <div class="ml-3">
                            <div class="text-base font-medium text-gray-800 dark:text-white">
                                {$page.data.user.first_name} {$page.data.user.last_name}
                            </div>
                            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{$page.data.user.email}</div>
                        </div>
                    </div>
                    <div class="mt-3 px-2 space-y-1">
                        <a
                            href="/profile"
                            class="block px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 rounded-md"
                            on:click={closeMenus}
                        >
                            Your Profile
                        </a>
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
                                class="block w-full text-left px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            {:else}
                <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    <div class="px-2 space-y-1">
                        <a
                            href="/sign-in"
                            class="block px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 rounded-md"
                            on:click={closeMenus}
                        >
                            Sign in
                        </a>
                        <a
                            href="/sign-up"
                            class="block px-3 py-3 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-gray-700 rounded-md"
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