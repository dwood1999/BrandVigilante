<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import Header from "$lib/components/Header.svelte";
    import SignupForm from "$lib/components/SignupForm.svelte";
</script>

<Header />

<div class="min-h-screen bg-gradient-to-b from-background to-background/50">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20">
        <div class="flex flex-col lg:flex-row items-center gap-12">
            <!-- Left Column - Text Content -->
            <div class="flex-1 text-left">
                <h1 class="text-7xl tracking-wide font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                    Data-Driven Brand Protection Analysis
                </h1>
                <p class="text-xl text-muted-foreground mb-8">
                    Leverage advanced analytics and AI to detect, prevent, and respond to brand threats in real-time. 
                    Stay ahead of digital risks with our comprehensive brand protection platform.
                </p>
                <div class="flex gap-4">
                    <SignupForm>
                        <Button size="lg" class="bg-lime-600 hover:bg-lime-700">
                            Get Started
                        </Button>
                    </SignupForm>
                    <Button size="lg" variant="outline">
                        Schedule Demo
                    </Button>
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

    <!-- Stats Section -->
    <section class="bg-card py-16">
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
    <section class="py-20">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12 text-foreground">Comprehensive Brand Protection</h2>
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
                <div class="p-6 bg-card dark:bg-card/50 rounded-lg shadow-sm border border-border">
                    <h3 class="text-xl font-semibold mb-4 text-foreground">Global Coverage</h3>
                    <p class="text-muted-foreground">Comprehensive protection across all digital channels and platforms worldwide.</p>
                </div>
                <div class="p-6 bg-card dark:bg-card/50 rounded-lg shadow-sm border border-border">
                    <h3 class="text-xl font-semibold mb-4 text-foreground">Expert Support</h3>
                    <p class="text-muted-foreground">Dedicated security analysts and threat intelligence experts at your service.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-accent/50 dark:bg-accent/20 py-20">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold mb-6 text-foreground">Ready to Protect Your Brand?</h2>
            <p class="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
                Join leading companies in safeguarding their digital presence with our data-driven brand protection platform.
            </p>
            <SignupForm>
                <Button size="lg" class="bg-lime-600 hover:bg-lime-700 dark:bg-lime-500 dark:hover:bg-lime-600">
                    Start Free Trial
                </Button>
            </SignupForm>
        </div>
    </section>
</div>



