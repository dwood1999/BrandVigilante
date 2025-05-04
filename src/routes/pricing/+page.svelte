<script lang="ts">
import { Button } from '$lib/components/ui/button';
</script>

<div class="min-h-screen bg-background text-foreground">
    <section class="container mx-auto px-4 py-20">
        <h1 class="text-5xl font-bold text-center mb-8 text-foreground">Pricing</h1>
        <p class="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Choose the plan that fits your brand protection needs. All plans include core monitoring and reporting features.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {#each [
                {
                    name: "Basic",
                    price: "$499",
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
            ] as plan}
                <div class="bg-card dark:bg-card/50 rounded-lg p-8 shadow-md border border-border">
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
    </section>
</div> 