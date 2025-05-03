<script lang="ts">
    import PageTemplate from '$lib/components/ui/PageTemplate.svelte';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';

    let saving = false;
    let success = false;
    let error = '';

    $: user = $page.data.user;
</script>

<PageTemplate
    title="Settings"
    description="Manage your account settings and preferences."
>
    <div class="space-y-8">
        <!-- Profile Settings -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Settings</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update your personal information and profile settings.
                </p>
                <form
                    method="POST"
                    action="?/updateProfile"
                    use:enhance={() => {
                        saving = true;
                        return async ({ result, update }) => {
                            saving = false;
                            if (result.type === 'success') {
                                success = true;
                                await update();
                            } else {
                                error = 'Failed to update profile. Please try again.';
                            }
                        };
                    }}
                    class="mt-6 space-y-6"
                >
                    <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                            <label for="first_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={user?.first_name || ''}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                        </div>

                        <div>
                            <label for="last_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={user?.last_name || ''}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                        </div>

                        <div class="sm:col-span-2">
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={user?.email || ''}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                        </div>
                    </div>

                    {#if error}
                        <div class="text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    {/if}

                    {#if success}
                        <div class="text-green-600 dark:text-green-400 text-sm">
                            Profile updated successfully!
                        </div>
                    {/if}

                    <div class="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            class="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {#if saving}
                                Saving...
                            {:else}
                                Save Changes
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Password Settings -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Password Settings</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update your password to keep your account secure.
                </p>
                <form
                    method="POST"
                    action="?/updatePassword"
                    use:enhance={() => {
                        saving = true;
                        return async ({ result, update }) => {
                            saving = false;
                            if (result.type === 'success') {
                                success = true;
                                await update();
                            } else {
                                error = 'Failed to update password. Please try again.';
                            }
                        };
                    }}
                    class="mt-6 space-y-6"
                >
                    <div class="space-y-6">
                        <div>
                            <label for="current_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="current_password"
                                id="current_password"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                        </div>

                        <div>
                            <label for="new_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="new_password"
                                id="new_password"
                                required
                                minlength="8"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                        </div>

                        <div>
                            <label for="confirm_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                required
                                minlength="8"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            class="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {#if saving}
                                Updating...
                            {:else}
                                Update Password
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Notification Settings</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Choose how you want to receive notifications.
                </p>
                <form
                    method="POST"
                    action="?/updateNotifications"
                    use:enhance={() => {
                        saving = true;
                        return async ({ result, update }) => {
                            saving = false;
                            if (result.type === 'success') {
                                success = true;
                                await update();
                            } else {
                                error = 'Failed to update notification settings. Please try again.';
                            }
                        };
                    }}
                    class="mt-6 space-y-6"
                >
                    <div class="space-y-4">
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    name="email_notifications"
                                    id="email_notifications"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div class="ml-3">
                                <label for="email_notifications" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Notifications
                                </label>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Receive notifications about important updates and activity via email.
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    name="browser_notifications"
                                    id="browser_notifications"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div class="ml-3">
                                <label for="browser_notifications" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Browser Notifications
                                </label>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Receive notifications in your browser when you're online.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            class="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {#if saving}
                                Saving...
                            {:else}
                                Save Preferences
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</PageTemplate> 