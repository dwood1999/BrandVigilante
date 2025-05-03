<script lang="ts">
    import PageTemplate from '$lib/components/ui/PageTemplate.svelte';
</script>

<PageTemplate
    title="About JanusIPM"
    description="Learn more about our mission and what we do."
>
    <div class="prose dark:prose-invert max-w-none">
        <p class="lead">
            JanusIPM is a cutting-edge platform designed to help businesses protect and manage their intellectual property across digital marketplaces.
        </p>

        <h2>Our Mission</h2>
        <p>
            We're dedicated to providing businesses with powerful tools to monitor, detect, and respond to potential intellectual property infringements across various online platforms.
        </p>

        <h2>What We Do</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-2">Brand Protection</h3>
                <p>Automated monitoring and detection of counterfeit products and unauthorized sellers across multiple marketplaces.</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-2">Market Intelligence</h3>
                <p>Comprehensive analytics and insights about your brand's presence and potential threats in the digital marketplace.</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-2">Enforcement Actions</h3>
                <p>Streamlined process for taking action against infringers, from automated notices to legal proceedings.</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-2">Reporting & Analytics</h3>
                <p>Detailed reports and analytics to track the effectiveness of your brand protection efforts.</p>
            </div>
        </div>

        <h2 class="mt-8">Why Choose Us</h2>
        <ul>
            <li>Advanced AI-powered detection systems</li>
            <li>Real-time monitoring across multiple platforms</li>
            <li>Comprehensive reporting and analytics</li>
            <li>Expert support team</li>
            <li>Customizable enforcement workflows</li>
        </ul>

        <div class="mt-8 bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
            <h2 class="text-blue-800 dark:text-blue-200">Get Started Today</h2>
            <p class="text-blue-700 dark:text-blue-300">
                Ready to protect your brand? Contact us to learn more about how JanusIPM can help safeguard your intellectual property.
            </p>
            <a 
                href="/contact" 
                class="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
                Contact Us
            </a>
        </div>
    </div>
</PageTemplate> 