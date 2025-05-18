<script lang="ts">
    let email = '';
    let message = '';
    let messageType: 'success' | 'error' | null = null;
    let loading = false;

    async function handleSubmit(event: Event) {
        event.preventDefault();
        loading = true;
        message = '';
        messageType = null;

        try {
            const response = await fetch('/api/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: email })
            });

            const result = await response.json();

            if (result.success) {
                message = 'Test email sent successfully! Please check your inbox.';
                messageType = 'success';
                email = '';
            } else {
                message = result.message || 'Failed to send test email.';
                messageType = 'error';
            }
        } catch (error) {
            message = 'An error occurred while sending the test email.';
            messageType = 'error';
        } finally {
            loading = false;
        }
    }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test Email Sending
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Enter an email address to test the email sending functionality
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {#if message}
                <div class="rounded-md p-4 mb-4 {messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}">
                    {message}
                </div>
            {/if}

            <form class="space-y-6" on:submit={handleSubmit}>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div class="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            bind:value={email}
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter email address"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Test Email'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div> 