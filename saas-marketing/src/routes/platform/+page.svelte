<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import Header from "$lib/components/Header.svelte";
    import '../../app.css';
</script>

<Header />

<div class="min-h-screen">
    <!-- Platform Hero -->
    <section class="container mx-auto px-4 py-20">
        <h1 class="text-5xl font-bold text-center mb-8 text-foreground">Our Platform Services</h1>
        <p class="text-xl text-center text-muted-foreground max-w-3xl mx-auto">
            Comprehensive brand protection solutions designed to safeguard your digital presence across all channels.
        </p>
    </section>

    <!-- Services Section -->
    <section class="py-16 font-sans">
        <div class="container px-4 mx-auto">
            {#each [
                {
                    title: "Marketplace Enforcement",
                    description: "Safeguard your brand's reputation across major marketplaces with AI-powered monitoring and automated takedown procedures. Our solution has helped brands remove over 100,000 counterfeit listings in 2023 alone.",
                    features: [
                        "24/7 AI-powered monitoring across 50+ marketplaces",
                        "Automated takedown with 94% success rate",
                        "Real-time alerts for policy violations",
                        "Direct integration with marketplace APIs",
                        "Legal support for persistent violators"
                    ],
                    stats: {
                        value: "100K+",
                        label: "Counterfeit Listings Removed",
                        year: "2023"
                    },
                    svg: `
                        <!-- Marketplace Icons -->
                        <rect x="100" y="150" width="100" height="100" rx="12" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <rect x="220" y="150" width="100" height="100" rx="12" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <rect x="160" y="250" width="100" height="100" rx="12" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <!-- Connection Lines -->
                        <line x1="150" y1="200" x2="270" y2="200" stroke="#164e63" stroke-width="1.5" stroke-dasharray="4"/>
                        <line x1="150" y1="200" x2="210" y2="300" stroke="#164e63" stroke-width="1.5" stroke-dasharray="4"/>
                        <line x1="270" y1="200" x2="210" y2="300" stroke="#164e63" stroke-width="1.5" stroke-dasharray="4"/>
                        <!-- Marketplace Labels -->
                        <text x="150" y="195" text-anchor="middle" fill="#164e63" font-size="14" font-weight="500">Amazon</text>
                        <text x="270" y="195" text-anchor="middle" fill="#164e63" font-size="14" font-weight="500">eBay</text>
                        <text x="210" y="275" text-anchor="middle" fill="#164e63" font-size="14" font-weight="500">Walmart</text>
                        <!-- Protection Indicators -->
                        <circle cx="150" cy="200" r="45" fill="none" stroke="#164e63" stroke-width="1" stroke-dasharray="4"/>
                        <circle cx="270" cy="200" r="45" fill="none" stroke="#164e63" stroke-width="1" stroke-dasharray="4"/>
                        <circle cx="210" cy="300" r="45" fill="none" stroke="#164e63" stroke-width="1" stroke-dasharray="4"/>
                    `
                },
                {
                    title: "Domain Protection",
                    description: "Combat cybersquatting and domain abuse with our advanced protection system. We've prevented over 2.7K malicious domains in 2022, with a 20% increase in protection coverage this year.",
                    features: [
                        "Proactive registration of typosquatting domains",
                        "AI-powered detection of suspicious registrations",
                        "Automated UDRP filing process",
                        "Integration with major registrars",
                        "Dark web monitoring for domain abuse"
                    ],
                    stats: {
                        value: "2.7K+",
                        label: "Malicious Domains Prevented",
                        year: "2022"
                    },
                    svg: `
                        <!-- Domain Protection Layers -->
                        <circle cx="200" cy="150" r="90" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <circle cx="200" cy="150" r="70" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <circle cx="200" cy="150" r="50" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <!-- Domain Text -->
                        <text x="200" y="145" text-anchor="middle" fill="#164e63" font-size="16" font-weight="500">brand.com</text>
                        <text x="200" y="165" text-anchor="middle" fill="#164e63" font-size="14">protected</text>
                        <!-- Protection Indicators -->
                        <path d="M130 150 L270 150" stroke="#164e63" stroke-width="1.5" stroke-dasharray="4"/>
                        <path d="M200 80 L200 220" stroke="#164e63" stroke-width="1.5" stroke-dasharray="4"/>
                        <!-- Security Icons -->
                        <circle cx="140" cy="180" r="6" fill="#164e63"/>
                        <circle cx="200" cy="180" r="6" fill="#164e63"/>
                        <circle cx="260" cy="180" r="6" fill="#164e63"/>
                    `
                },
                {
                    title: "MAP and Pricing Policy",
                    description: "Maintain consistent pricing and protect your brand value across all channels. Our automated enforcement system has helped brands maintain 98% MAP compliance across their retail network.",
                    features: [
                        "Real-time price monitoring across 1000+ retailers",
                        "Automated violation detection and reporting",
                        "Smart escalation workflows",
                        "Retailer education and compliance tracking",
                        "Custom policy creation and management"
                    ],
                    stats: {
                        value: "98%",
                        label: "MAP Compliance Rate",
                        year: "2023"
                    },
                    svg: `
                        <!-- Price Protection Elements -->
                        <rect x="100" y="100" width="200" height="100" rx="10" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <!-- Price Display -->
                        <text x="200" y="145" text-anchor="middle" fill="#164e63" font-size="24" font-weight="bold">$99.99</text>
                        <text x="200" y="165" text-anchor="middle" fill="#164e63" font-size="14">MAP Protected</text>
                        <!-- Price Range Indicator -->
                        <line x1="120" y1="200" x2="280" y2="200" stroke="#164e63" stroke-width="1.5"/>
                        <circle cx="200" cy="200" r="6" fill="#164e63"/>
                        <!-- Retailer Icons -->
                        <rect x="130" y="220" width="30" height="30" rx="4" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <rect x="170" y="220" width="30" height="30" rx="4" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <rect x="210" y="220" width="30" height="30" rx="4" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                        <rect x="250" y="220" width="30" height="30" rx="4" fill="#e5e7eb" stroke="#164e63" stroke-width="1"/>
                    `
                }
            ] as service, i}
                <div class="mb-20">
                    <div class="flex flex-col lg:flex-row items-start gap-12">
                        <div class="flex-1 text-left">
                            <h2 class="text-3xl font-bold mb-6 text-foreground">{service.title}</h2>
                            <div class="space-y-6 text-muted-foreground">
                                <p class="text-lg leading-relaxed">{service.description}</p>
                                {#if service.stats}
                                    <div class="bg-accent/50 dark:bg-accent/20 rounded-lg p-6 border border-accent">
                                        <div class="text-4xl font-bold text-lime-600 dark:text-lime-400 mb-1">{service.stats.value}</div>
                                        <div class="text-sm text-muted-foreground">{service.stats.label}</div>
                                        <div class="text-xs text-muted-foreground/70 mt-1">Based on {service.stats.year} data</div>
                                    </div>
                                {/if}
                                <ul class="space-y-3">
                                    {#each service.features as feature}
                                        <li class="flex items-start group">
                                            <span class="mr-3 text-lime-600 dark:text-lime-400 group-hover:text-lime-700 dark:group-hover:text-lime-300 transition-colors">•</span>
                                            <span class="group-hover:text-foreground transition-colors">{feature}</span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                        <div class="flex-1 flex justify-end">
                            <div class="bg-card dark:bg-card/50 rounded-lg p-8 w-full max-w-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-br from-lime-50/50 dark:from-lime-900/20 to-transparent opacity-50"></div>
                                <svg class="w-full h-auto relative z-10" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {@html service.svg}
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-20 bg-muted/50 dark:bg-muted/20">
        <div class="container mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-12 text-foreground">Choose Your Plan</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {#each [
                    {
                        name: "Basic",
                        price: "$499",
                        isHighlighted: true,
                        features: [
                            "Basic Marketplace Monitoring",
                            "Domain Registration Monitoring",
                            "Basic MAP Monitoring",
                            "Email Support",
                            "Basic Reports",
                            "Standard Response Time"
                        ],
                        buttonText: "Get Started"
                    },
                    {
                        name: "Pro",
                        price: "$999",
                        isHighlighted: true,
                        features: [
                            "Advanced Marketplace Monitoring",
                            "Proactive Domain Protection",
                            "Advanced MAP Enforcement",
                            "Priority Support",
                            "Custom Reports",
                            "Fast Response Time"
                        ],
                        buttonText: "Get Started"
                    },
                    {
                        name: "Enterprise",
                        price: "Custom",
                        isHighlighted: true,
                        features: [
                            "Full-Scale Marketplace Protection",
                            "Comprehensive Domain Security",
                            "Advanced MAP Management",
                            "24/7 Dedicated Support",
                            "Custom Integration",
                            "SLA Guarantees"
                        ],
                        buttonText: "Contact Sales"
                    }
                ] as plan, i}
                    <div class={`bg-card dark:bg-card/50 rounded-lg p-8 shadow-md border border-border ${plan.isHighlighted ? 'transform scale-105 border-accent' : ''}`}>
                        <h3 class="text-2xl font-bold mb-4 text-foreground">{plan.name}</h3>
                        <div class="text-4xl font-bold mb-6 text-lime-600 dark:text-lime-400">{plan.price}<span class="text-lg text-muted-foreground">/month</span></div>
                        <ul class="space-y-4 mb-8 text-muted-foreground">
                            {#each plan.features as feature}
                                <li class="flex items-start">
                                    <span class="mr-3 text-lime-600 dark:text-lime-400">•</span>
                                    <span>{feature}</span>
                                </li>
                            {/each}
                        </ul>
                        <Button class="w-full bg-lime-600 hover:bg-lime-700 dark:bg-lime-500 dark:hover:bg-lime-600 text-white">
                            {plan.buttonText}
                        </Button>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold mb-6 text-foreground">Ready to Protect Your Brand?</h2>
            <p class="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
                Schedule a demo to see how our platform can safeguard your brand across all digital channels.
            </p>
            <Button size="lg" class="bg-lime-600 hover:bg-lime-700 dark:bg-lime-500 dark:hover:bg-lime-600 text-white">
                Schedule Demo
            </Button>
        </div>
    </section>
</div>