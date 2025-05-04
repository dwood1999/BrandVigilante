<script lang="ts">
    import Logo from "$lib/components/Logo.svelte"
    import { Sun, Moon } from 'lucide-svelte'
    import { page } from '$app/stores';
    import { theme } from '$lib/stores/theme';

    const navItems = [
        { href: '/platform', label: 'Platform' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/enforcement', label: 'Enforcement' },
        { href: '/technology', label: 'Technology' }
    ] as const;

    const { 
        showMenu = true,
        className = ''
    } = $props<{
        showMenu?: boolean;
        className?: string;
    }>();

    let isMenuOpen = $state(false);
    let header: HTMLElement;

    function toggleMenu(event: Event) {
        event.stopPropagation();
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    function toggleTheme() {
        $theme = $theme === 'light' ? 'dark' : 'light';
    }

    // Handle clicks outside the menu to close it
    $effect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen && header && !header.contains(event.target as Node)) {
                closeMenu();
            }
        };
        
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    });
</script>

<header 
    class="w-full px-4 py-2 {className} relative z-50"
    aria-label="Main navigation"
    bind:this={header}
>
    <div class="max-w-screen-2xl mx-auto flex items-center justify-between">
        <Logo />

        <!-- Mobile menu button -->
        <button
            type="button"
            class="md:hidden p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onclick={toggleMenu}
        >
            <svg 
                class="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
            </svg>
        </button>

        <!-- Desktop Navigation -->
        <nav 
            class="hidden md:flex items-center gap-8 pr-4"
            aria-label="Main navigation"
        >
            {#each navItems as { href, label }}
                <a 
                    class="text-lg text-zinc-800 hover:text-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 rounded-md px-2 py-1" 
                    {href}
                    aria-current={href === $page.url.pathname ? 'page' : undefined}
                >
                    {label}
                </a>
            {/each}
            <div class="flex items-center gap-2">
            {#if showMenu}
                <button
                    type="button"
                    class="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    aria-label="Toggle theme"
                    onclick={toggleTheme}
                >
                    {#if $theme === 'light'}
                        <Moon class="w-5 h-5 text-zinc-600 hover:text-zinc-800" />
                    {:else}
                        <Sun class="w-5 h-5 text-zinc-400 hover:text-zinc-200" />
                    {/if}
                </button>
            {/if}
        </nav>
    </div>

    <!-- Mobile Navigation -->
    <div 
        id="mobile-menu"
        class="absolute top-full left-0 right-0 w-full bg-white shadow-lg md:hidden transition-all duration-200 ease-in-out {isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}"
        aria-hidden={!isMenuOpen}
    >
        <div class="px-4 py-2 space-y-2">
            {#each navItems as { href, label }}
                <a 
                    class="block text-lg text-zinc-800 hover:text-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 rounded-md px-2 py-1" 
                    {href}
                    onclick={closeMenu}
                    aria-current={href === $page.url.pathname ? 'page' : undefined}
                >
                    {label}
                </a>
            {/each}
            
            {#if showMenu}
                <div class="pt-2">
                    <button
                        type="button"
                        class="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                        aria-label="Toggle theme"
                        onclick={toggleTheme}
                    >
                        {#if $theme === 'light'}
                            <Moon class="w-5 h-5 text-zinc-600 hover:text-zinc-800" />
                        {:else}
                            <Sun class="w-5 h-5 text-zinc-400 hover:text-zinc-200" />
                        {/if}
                    </button>
                </div>
            {/if}
        </div>
    </div>
</header>