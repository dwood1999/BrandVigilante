<script lang="ts">
import { Button } from '$lib/components/ui/button';
</script>

<div class="min-h-screen bg-background text-foreground">
    <section class="container mx-auto px-4 py-20">
        <h1 class="text-5xl font-bold text-center mb-8 text-foreground">Marketplace Enforcement</h1>
        <div class="flex flex-wrap justify-center gap-6 mb-8">
            <a href="/platform" class="px-8 py-4 rounded-lg bg-lime-600 text-white font-semibold text-lg shadow hover:bg-lime-700 transition">Platform</a>
            <a href="/pricing" class="px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition">Pricing</a>
            <a href="/enforcement" class="px-8 py-4 rounded-lg bg-orange-600 text-white font-semibold text-lg shadow hover:bg-orange-700 transition">Enforcement</a>
            <a href="/technology" class="px-8 py-4 rounded-lg bg-gray-800 text-white font-semibold text-lg shadow hover:bg-gray-900 transition">Technology</a>
        </div>
        <p class="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Safeguard your brand's reputation across major marketplaces with AI-powered monitoring and automated takedown procedures. Our solution has helped brands remove over 100,000 counterfeit listings in 2023 alone.
        </p>
        <div class="flex flex-col md:flex-row gap-12 items-center justify-center">
            <div class="flex-1">
                <ul class="space-y-4 text-lg">
                    <li>24/7 AI-powered monitoring across 50+ marketplaces</li>
                    <li>Automated takedown with 94% success rate</li>
                    <li>Real-time alerts for policy violations</li>
                    <li>Direct integration with marketplace APIs</li>
                    <li>Legal support for persistent violators</li>
                </ul>
                <div class="mt-8">
                    <div class="bg-accent/50 rounded-lg p-6 border border-accent inline-block">
                        <div class="text-4xl font-bold text-lime-600 mb-1">100K+</div>
                        <div class="text-sm text-muted-foreground">Counterfeit Listings Removed</div>
                        <div class="text-xs text-muted-foreground/70 mt-1">Based on 2023 data</div>
                    </div>
                </div>
            </div>
            <div class="flex-1 flex justify-center">
                <svg class="w-full max-w-md h-auto" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                </svg>
            </div>
        </div>
    </section>
</div> 