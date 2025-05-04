<script lang="ts">
    import { page } from '$app/stores';
    export let form: any = null;
    let loading = false;
    let formError: string | null = form?.error || null;
    let formSuccess: string | null = form?.success ? 'User created successfully!' : null;
    let firstName = '';
    let lastName = '';
    let email = '';
    let phone = '';
    let password = '';
    let role = 'user';

    function handleInput(event: Event) {
        formError = null;
        formSuccess = null;
    }

    async function handleSubmit(event: Event) {
        loading = true;
        // Let the form submit normally (SvelteKit will handle the POST)
    }
</script>

<svelte:head>
    <title>Add New User - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col items-center sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-xl" in:fade>
        <h2 class="mt-2 text-center text-2xl font-bold text-gray-900">Add New User</h2>
        <p class="mt-2 text-center text-base text-gray-600">Fill in the details below to add a new user.</p>
        <div class="mt-4 text-center">
            <a href="/admin/users" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Back to Users</a>
        </div>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-xl" in:fade={{ delay: 150 }}>
        <form method="POST" class="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6" on:submit={handleSubmit} on:input={handleInput} autocomplete="off">
            {#if formError}
                <div class="rounded-md bg-red-50 p-4 text-red-700 text-sm">{formError}</div>
            {/if}
            {#if formSuccess}
                <div class="rounded-md bg-green-50 p-4 text-green-700 text-sm">{formSuccess}</div>
            {/if}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label for="firstName" class="block text-sm font-medium text-gray-900">First Name</label>
                    <input id="firstName" name="firstName" type="text" required bind:value={firstName} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div class="space-y-1">
                    <label for="lastName" class="block text-sm font-medium text-gray-900">Last Name</label>
                    <input id="lastName" name="lastName" type="text" required bind:value={lastName} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
            </div>
            <div class="space-y-1">
                <label for="email" class="block text-sm font-medium text-gray-900">Email</label>
                <input id="email" name="email" type="email" required bind:value={email} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="phone" class="block text-sm font-medium text-gray-900">Phone</label>
                <input id="phone" name="phone" type="tel" bind:value={phone} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
                <input id="password" name="password" type="password" required bind:value={password} class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div class="space-y-1">
                <label for="role" class="block text-sm font-medium text-gray-900">Role *</label>
                <select id="role" name="role" bind:value={role} required class="block w-full bg-white border border-gray-200 rounded-lg h-12 px-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" class="mt-4 w-full h-12 bg-blue-600 text-white rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                {#if loading}
                    Creating...
                {:else}
                    Create User
                {/if}
            </button>
        </form>
    </div>
</div> 