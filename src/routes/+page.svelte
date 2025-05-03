<script lang="ts">
    import { fade } from 'svelte/transition';
    import type { PageData } from '$lib/types';
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
    
    export let data: PageData;

    // Initialize with default values using reactive statements
    $: features = data?.features || [];
    $: meta = data?.meta || {
        title: 'JanusIPM',
        description: 'Advanced intellectual property management and protection services'
    };

    let isVisible = false;
    
    // Show elements when component mounts
    onMount(() => {
        isVisible = true;
    });

    // Debug logging
    $: {
        if (validatePageData(data)) {
            console.log('[UI DEBUG] Valid page data received');
        } else {
            console.error('[UI DEBUG] Invalid or missing page data structure');
        }
    }
</script>

<script lang="ts" context="module">
    const validatePageData = (data: unknown): data is PageData => {
        if (!data || typeof data !== 'object') return false;
        return 'features' in data;
    }
</script>

<svelte:head>
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
</svelte:head>

<ErrorBoundary>
    <main class="min-h-screen">
        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8" in:fade={{ duration: 1000 }}>
                <div class="max-w-4xl mx-auto text-center">
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">Protect Your Intellectual Property with JanusIPM</h1>
                    <p class="text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto">Advanced AI-powered solutions for comprehensive IP management and brand protection</p>
                    <div class="flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="default" size="lg" class="w-full sm:w-auto">
                            Get Started
                        </Button>
                        <Button variant="outline" size="lg" class="w-full sm:w-auto">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-12 sm:py-16 md:py-20 bg-muted" aria-labelledby="features-heading">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="features-heading" class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Comprehensive IP Management Solutions</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {#each features as feature}
                        <div class="bg-card text-card-foreground p-6 rounded-lg shadow-lg hover:shadow-xl transition-all" role="article">
                            <div class="text-primary mb-4" aria-hidden="true">
                                <span class="text-2xl">{feature.icon || '⚡'}</span>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p class="text-muted-foreground">{feature.description}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Why Choose Us Section -->
        <section class="py-12 sm:py-16 md:py-20" aria-labelledby="why-choose-us-heading">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="max-w-3xl mx-auto text-center">
                    <h2 id="why-choose-us-heading" class="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Why Choose JanusIPM?</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        <div class="text-center" role="article">
                            <div class="text-4xl mb-4" aria-hidden="true">🔍</div>
                            <h3 class="text-xl font-semibold mb-2">AI-Powered Monitoring</h3>
                            <p class="text-muted-foreground">24/7 automated surveillance of your intellectual property</p>
                        </div>
                        <div class="text-center" role="article">
                            <div class="text-4xl mb-4" aria-hidden="true">🛡️</div>
                            <h3 class="text-xl font-semibold mb-2">Proactive Protection</h3>
                            <p class="text-muted-foreground">Early detection and swift response to potential infringements</p>
                        </div>
                        <div class="text-center" role="article">
                            <div class="text-4xl mb-4" aria-hidden="true">📊</div>
                            <h3 class="text-xl font-semibold mb-2">Advanced Analytics</h3>
                            <p class="text-muted-foreground">Comprehensive insights and reporting tools</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="bg-primary text-primary-foreground py-12 sm:py-16" aria-labelledby="cta-heading">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 id="cta-heading" class="text-2xl sm:text-3xl font-bold mb-4">Ready to Protect Your Intellectual Property?</h2>
                <p class="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">Start securing your IP assets with our advanced management platform</p>
                <Button variant="secondary" size="lg" class="w-full sm:w-auto">
                    Schedule a Demo
                </Button>
            </div>
        </section>
    </main>
</ErrorBoundary>

<style lang="postcss">
    :global(html) {
        scroll-behavior: smooth;
    }

    /* Focus styles for better accessibility */
    :global(*:focus-visible) {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
    }

    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
        :global(html) {
            scroll-behavior: auto;
        }
    }
</style>
