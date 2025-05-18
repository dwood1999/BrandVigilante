<script lang="ts">
    import { fade } from 'svelte/transition';
    import type { PageData } from '$lib/types';
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
    import SignupForm from "$lib/components/SignupForm.svelte";
    
    export let data: PageData;

    // Initialize with default values using reactive statements
    $: features = data?.features || [];
    $: meta = data?.meta || {
        title: 'Data-Driven Brand Protection Analysis',
        description: 'Leverage advanced analytics and AI to detect, prevent, and respond to brand threats in real-time. Stay ahead of digital risks with our comprehensive brand protection platform.'
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
    <title>Data-Driven Brand Protection Analysis</title>
    <meta name="description" content={meta.description} />
</svelte:head>

<ErrorBoundary>
    <main class="min-h-screen bg-white text-black">
        <!-- Hero Section -->
        <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50" in:fade={{ duration: 1000 }}>
            <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <!-- Left Column - Text Content -->
                <div class="flex-1 text-left">
                    <h1 class="text-4xl sm:text-5xl lg:text-7xl tracking-wide font-extrabold mb-4 sm:mb-6 text-black">
                        Data-Driven Brand Protection Analysis
                    </h1>
                    <p class="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">
                        Leverage advanced analytics and AI to detect, prevent, and respond to brand threats in real-time. 
                        Stay ahead of digital risks with our comprehensive brand protection platform.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="/sign-up" class="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-lg bg-blue-600 text-white font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition">
                            Get Started
                        </a>
                        <SignupForm>
                            <Button size="lg" variant="outline" class_name="w-full sm:w-auto">
                                Get More Information
                            </Button>
                        </SignupForm>
                    </div>
                </div>
                
                <!-- Right Column - Vector Image -->
                <div class="flex-1 flex justify-center items-center">
                    <div class="w-full max-w-xl">
                        <svg class="w-full h-auto" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Background Grid -->    
                            <g stroke="currentColor" stroke-width="1" class="text-muted">
                                <line x1="50" y1="50" x2="450" y2="50" />
                                <line x1="50" y1="150" x2="450" y2="150" />
                                <line x1="50" y1="250" x2="450" y2="250" />
                                <line x1="50" y1="350" x2="450" y2="350" />
                                <line x1="50" y1="450" x2="450" y2="450" />
                                <line x1="50" y1="50" x2="50" y2="450" />
                                <line x1="150" y1="50" x2="150" y2="450" />
                                <line x1="250" y1="50" x2="250" y2="450" />
                                <line x1="350" y1="50" x2="350" y2="450" />
                                <line x1="450" y1="50" x2="450" y2="450" />
                            </g>

                            <!-- Data Points -->
                            <g fill="currentColor" class="text-foreground">
                                <!-- Normal Distribution of Points -->
                                <circle cx="150" cy="200" r="5" />
                                <circle cx="250" cy="180" r="5" />
                                <circle cx="350" cy="150" r="5" />
                                <circle cx="450" cy="180" r="5" />
                                
                                <!-- Anomaly Points (Threats) -->
                                <circle cx="180" cy="400" r="7" fill="#f97316" />
                                <circle cx="420" cy="380" r="7" fill="#f97316" />
                                
                                <!-- Trend Line -->
                                <path d="M50 300 Q250 150 450 300" 
                                      stroke="currentColor" 
                                      stroke-width="2" 
                                      fill="none" 
                                      stroke-dasharray="4 4"/>
                            </g>

                            <!-- Analysis Overlay -->
                            <g stroke="currentColor" stroke-width="2" class="text-foreground">
                                <!-- Analysis Circle -->
                                <circle cx="250" cy="250" r="150" 
                                        fill="none" 
                                        stroke-dasharray="4 4"/>
                                
                                <!-- Analysis Lines -->
                                <line x1="100" y1="250" x2="400" y2="250" />
                                <line x1="250" y1="100" x2="250" y2="400" />
                            </g>

                            <!-- Labels -->
                            <g font-family="Arial" font-size="14" class="text-muted-foreground">
                                <text x="450" y="470" text-anchor="end">Time</text>
                                <text x="30" y="30" text-anchor="start">Risk Level</text>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Links Section -->
        <section class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-8">
                <a href="/platform" class="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-lg bg-lime-600 text-white font-semibold text-base sm:text-lg shadow hover:bg-lime-700 transition text-center">Platform</a>
                <a href="/pricing" class="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold text-base sm:text-lg shadow hover:bg-blue-700 transition text-center">Pricing</a>
                <a href="/enforcement" class="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-lg bg-orange-600 text-white font-semibold text-base sm:text-lg shadow hover:bg-orange-700 transition text-center">Enforcement</a>
                <a href="/technology" class="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-lg bg-gray-800 text-white font-semibold text-base sm:text-lg shadow hover:bg-gray-900 transition text-center">Technology</a>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="bg-white py-16">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div class="text-4xl font-bold text-lime-600 mb-2">164%</div>
                        <p class="text-muted-foreground">Increase in Digital Threats (2023)</p>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-lime-600 mb-2">700+</div>
                        <p class="text-muted-foreground">Global Disruption Partners</p>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-lime-600 mb-2">24/7</div>
                        <p class="text-muted-foreground">Continuous Brand Monitoring</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12 text-black">Comprehensive Brand Protection</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="p-6 bg-card rounded-lg shadow-sm border border-border">
                        <h3 class="text-xl font-semibold mb-4 text-foreground">AI-Powered Detection</h3>
                        <p class="text-muted-foreground">Advanced algorithms analyze millions of data points to identify brand threats and impersonation attempts.</p>
                    </div>
                    <div class="p-6 bg-card rounded-lg shadow-sm border border-border">
                        <h3 class="text-xl font-semibold mb-4 text-foreground">Real-Time Monitoring</h3>
                        <p class="text-muted-foreground">24/7 surveillance across surface, deep, and dark web to protect your brand assets and reputation.</p>
                    </div>
                    <div class="p-6 bg-card rounded-lg shadow-sm border border-border">
                        <h3 class="text-xl font-semibold mb-4 text-foreground">Automated Response</h3>
                        <p class="text-muted-foreground">Swift takedown of malicious content and automated threat mitigation to minimize brand damage.</p>
                    </div>
                    <div class="p-6 bg-card rounded-lg shadow-sm border border-border">
                        <h3 class="text-xl font-semibold mb-4 text-foreground">Risk Analytics</h3>
                        <p class="text-muted-foreground">Data-driven insights and risk scoring to prioritize threats and optimize protection strategies.</p>
                    </div>
                    <div class="p-6 bg-card rounded-lg shadow-sm border border-border">
                        <h3 class="text-xl font-semibold mb-4 text-foreground">Global Coverage</h3>
                        <p class="text-muted-foreground">Comprehensive protection across all digital channels and platforms worldwide.</p>
                    </div>
                    <div class="p-6 bg-card rounded-lg shadow-sm border border-border">
                        <h3 class="text-xl font-semibold mb-4 text-foreground">Expert Support</h3>
                        <p class="text-muted-foreground">Dedicated security analysts and threat intelligence experts at your service.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="bg-gray-50 py-20">
            <div class="container mx-auto px-4 text-center">
                <h2 class="text-3xl font-bold mb-6 text-black">Ready to Protect Your Brand?</h2>
                <p class="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
                    Join leading companies in safeguarding their digital presence with our data-driven brand protection platform.
                </p>
                <SignupForm>
                    <Button size="lg" variant="default">
                        Start Free Trial
                    </Button>
                </SignupForm>
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
