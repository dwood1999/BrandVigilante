<script lang="ts">
    import PageTemplate from '$lib/components/ui/PageTemplate.svelte';
    import { enhance } from '$app/forms';

    let sending = false;
    let success = false;
    let error = '';
</script>

<PageTemplate
    title="Contact Us"
    description="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <form
                method="POST"
                use:enhance={() => {
                    sending = true;
                    return async ({ result, update }) => {
                        sending = false;
                        if (result.type === 'success') {
                            success = true;
                            await update();
                        } else {
                            error = 'Failed to send message. Please try again.';
                        }
                    };
                }}
                class="space-y-6"
            >
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="subject" class="block text-sm font-medium text-gray-700">
                        Subject
                    </label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="message" class="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        name="message"
                        id="message"
                        rows="4"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    ></textarea>
                </div>

                {#if error}
                    <div class="text-red-600 text-sm">
                        {error}
                    </div>
                {/if}

                {#if success}
                    <div class="text-green-600 text-sm">
                        Message sent successfully! We'll get back to you soon.
                    </div>
                {/if}

                <button
                    type="submit"
                    disabled={sending}
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if sending}
                        Sending...
                    {:else}
                        Send Message
                    {/if}
                </button>
            </form>
        </div>

        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>
                <dl class="mt-4 space-y-4">
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Email</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            <a href="mailto:contact@janusipm.com" class="text-blue-600 hover:text-blue-500">
                                contact@janusipm.com
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Phone</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            <a href="tel:+1-555-123-4567" class="text-blue-600 hover:text-blue-500">
                                +1 (555) 123-4567
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Address</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            1309 Coffeen Avenue STE 12352<br />
                            Sheridan, Wyoming 82801<br />
                            United States
                        </dd>
                    </div>
                </dl>
            </div>

            <div>
                <h3 class="text-lg font-medium text-gray-900">Office Hours</h3>
                <dl class="mt-4 space-y-4">
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Monday - Friday</dt>
                        <dd class="mt-1 text-sm text-gray-900">9:00 AM - 5:00 PM EST</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Saturday - Sunday</dt>
                        <dd class="mt-1 text-sm text-gray-900">Closed</dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</PageTemplate> 