<script lang="ts">
    import { page } from '$app/stores';
    import { fade, slide } from 'svelte/transition';
    import { onMount } from 'svelte';

    // Props & Stores
    export let user: {
        id: number;
        email: string;
        role: string;
        initials: string;
    } | null = null;

    // State
    let isOpen = false;
    let isScrolled = false;
    let userMenuOpen = false;

    // Handle scroll effect
    onMount(() => {
        const handleScroll = () => {
            isScrolled = window.scrollY > 10;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

    async function handleLogout() {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            window.location.href = '/sign-in';
        }
    }

    function closeMenus() {
        isOpen = false;
        userMenuOpen = false;
    }
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<nav
    class="fixed w-full z-50 transition-all duration-200"
    class:bg-white={isScrolled}
    class:shadow-lg={isScrolled}
    aria-label="Main navigation"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <!-- Logo and primary navigation -->
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a 
                        href="/" 
                        class="text-xl font-bold text-blue-600"
                        aria-label="Home"
                    >
                        JanusIPM
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a
                        href="/"
                        class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {$page.url.pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}"
                        aria-current={$page.url.pathname === '/' ? 'page' : undefined}
                    >
                        Home
                    </a>
                    <a
                        href="/about"
                        class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {$page.url.pathname === '/about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}"
                        aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
                    >
                        About
                    </a>
                    {#if user}
                        <a
                            href="/dashboard"
                            class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {$page.url.pathname === '/dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}"
                            aria-current={$page.url.pathname === '/dashboard' ? 'page' : undefined}
                        >
                            Dashboard
                        </a>
                    {/if}
                </div>
            </div>

            <!-- Right side navigation -->
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
                {#if user}
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
                                {user.initials}
                            </div>
                        </button>

                        {#if userMenuOpen}
                            <div
                                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu"
                                transition:fade={{ duration: 200 }}
                            >
                                <a
                                    href="/profile"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    Your Profile
                                </a>
                                <div role="menuitem">
                                    <form action="/logout" method="POST">
                                        <button
                                            type="submit"
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </form>
                                </div>
                            </div>
                        {/if}
                    </div>
                {:else}
                    <div class="flex items-center space-x-4">
                        <a
                            href="/sign-in"
                            class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    aria-controls="mobile-menu"
                    aria-expanded={isOpen}
                    on:click={() => isOpen = !isOpen}
                >
                    <span class="sr-only">Open main menu</span>
                    <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        {#if isOpen}
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        {:else}
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        {/if}
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
                <a
                    href="/"
                    class="block pl-3 pr-4 py-2 text-base font-medium {$page.url.pathname === '/' ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}"
                    aria-current={$page.url.pathname === '/' ? 'page' : undefined}
                >
                    Home
                </a>
                <a
                    href="/about"
                    class="block pl-3 pr-4 py-2 text-base font-medium {$page.url.pathname === '/about' ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}"
                    aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
                >
                    About
                </a>
                {#if user}
                    <a
                        href="/dashboard"
                        class="block pl-3 pr-4 py-2 text-base font-medium {$page.url.pathname === '/dashboard' ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}"
                        aria-current={$page.url.pathname === '/dashboard' ? 'page' : undefined}
                    >
                        Dashboard
                    </a>
                    <form action="/logout" method="POST">
                        <button
                            type="submit"
                            class="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Sign out
                        </button>
                    </form>
                {:else}
                    <a
                        href="/sign-in"
                        class="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    >
                        Sign in
                    </a>
                    <a
                        href="/sign-up"
                        class="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    >
                        Sign up
                    </a>
                {/if}
            </div>
        </div>
    {/if}
</nav> 