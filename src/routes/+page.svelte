<script lang="ts">
    import { fade } from 'svelte/transition';
    import type { PageData } from '$lib/types';
    import { onMount } from 'svelte';
    
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

<main class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
        <div class="container mx-auto px-4" in:fade="{{ duration: 1000 }}">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-5xl font-bold mb-6">Protect Your Intellectual Property with JanusIPM</h1>
                <p class="text-xl mb-8">Advanced AI-powered solutions for comprehensive IP management and brand protection</p>
                <div class="flex justify-center gap-4">
                    <button class="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
                        Get Started
                    </button>
                    <button class="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Comprehensive IP Management Solutions</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {#each features as feature}
                    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                        <div class="text-blue-600 mb-4">
                            <!-- Icon placeholder - replace with actual icons -->
                            <span class="text-2xl">⚡</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p class="text-gray-600">{feature.description}</p>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-20">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h2 class="text-3xl font-bold mb-12">Why Choose JanusIPM?</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="text-4xl mb-4">🔍</div>
                        <h3 class="text-xl font-semibold mb-2">AI-Powered Monitoring</h3>
                        <p class="text-gray-600">24/7 automated surveillance of your intellectual property</p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl mb-4">🛡️</div>
                        <h3 class="text-xl font-semibold mb-2">Proactive Protection</h3>
                        <p class="text-gray-600">Early detection and swift response to potential infringements</p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl mb-4">📊</div>
                        <h3 class="text-xl font-semibold mb-2">Advanced Analytics</h3>
                        <p class="text-gray-600">Comprehensive insights and reporting tools</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-blue-600 text-white py-16">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold mb-4">Ready to Protect Your Intellectual Property?</h2>
            <p class="text-xl mb-8">Start securing your IP assets with our advanced management platform</p>
            <button class="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
                Schedule a Demo
            </button>
        </div>
    </section>
</main>

<style lang="postcss">
    :global(html) {
        scroll-behavior: smooth;
    }
</style>

<!-- Update the header section to include both links -->
<div class="absolute top-4 right-4 flex gap-4">
    <a 
        href="/sign-up" 
        class="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full hover:bg-opacity-30 transition-all"
    >
        Sign Up
    </a>
    <a 
        href="/database" 
        class="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full hover:bg-opacity-30 transition-all"
    >
        Database Info
    </a>
</div>
