<script lang="ts">
import { Button } from '$lib/components/ui/button';
import SignupForm from "$lib/components/SignupForm.svelte";
</script>

<div class="min-h-screen bg-background text-foreground">
    <section class="container mx-auto px-4 py-20">
        <h1 class="text-5xl font-bold text-center mb-8 text-foreground">Pricing</h1>
        <div class="flex flex-wrap justify-center gap-6 mb-8">
            <a href="/platform" class="px-8 py-4 rounded-lg bg-lime-600 text-white font-semibold text-lg shadow hover:bg-lime-700 transition">Platform</a>
            <a href="/pricing" class="px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition">Pricing</a>
            <a href="/enforcement" class="px-8 py-4 rounded-lg bg-orange-600 text-white font-semibold text-lg shadow hover:bg-orange-700 transition">Enforcement</a>
            <a href="/technology" class="px-8 py-4 rounded-lg bg-gray-800 text-white font-semibold text-lg shadow hover:bg-gray-900 transition">Technology</a>
        </div>
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
                <div class="bg-card rounded-lg p-8 shadow-md border border-border">
                    <h3 class="text-2xl font-bold mb-4 text-foreground">{plan.name}</h3>
                    <div class="text-4xl font-bold mb-6 text-lime-600">{plan.price}<span class="text-lg text-muted-foreground">/month</span></div>
                    <ul class="space-y-4 mb-8 text-muted-foreground">
                        {#each plan.features as feature}
                            <li class="flex items-start">
                                <span class="mr-3 text-lime-600">•</span>
                                <span>{feature}</span>
                            </li>
                        {/each}
                    </ul>
                    <SignupForm>
                        <Button class="w-full bg-lime-600 hover:bg-lime-700 text-white">
                            {plan.buttonText}
                        </Button>
                    </SignupForm>
                </div>
            {/each}
        </div>
    </section>
</div> 