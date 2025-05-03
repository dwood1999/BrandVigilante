<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { logger } from '$lib/logger';
    import { browser } from '$app/environment';

    let sessionId = '';
    let allCookies: { name: string; value: string }[] = [];
    let lastAction = '';
    let lastActionTime = '';
    let testUserId = '1'; // Default to user ID 1

    // Function to get all cookies
    function getAllCookies() {
        if (!browser) return;
        try {
            const cookies = document.cookie.split(';');
            allCookies = cookies
                .map(cookie => {
                    const parts = cookie.trim().split('=');
                    if (parts.length >= 2) {
                        const name = parts[0].trim();
                        const value = parts.slice(1).join('=').trim();
                        return { name, value };
                    }
                    return null;
                })
                .filter((cookie): cookie is { name: string; value: string } => cookie !== null);
            
            console.log('Current cookies:', allCookies);
            console.log('Raw cookie string:', document.cookie);
        } catch (error) {
            console.error('Error getting cookies:', error);
        }
    }

    // Function to set a test session cookie
    function setTestSession() {
        if (!browser) return;
        try {
            const date = new Date();
            date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
            
            // Use the input user ID
            const userId = testUserId;
            
            // Get the current domain
            const domain = window.location.hostname;
            
            // Set cookie with all necessary attributes in a single line
            const cookieString = `session=${userId};path=/;domain=${domain};expires=${date.toUTCString()};SameSite=Lax${window.location.protocol === 'https:' ? ';Secure' : ''}`;
            
            console.log('Setting cookie:', cookieString);
            document.cookie = cookieString;
            
            lastAction = `Set session cookie: ${userId}`;
            lastActionTime = new Date().toLocaleTimeString();
            
            // Force refresh cookies after setting
            setTimeout(getAllCookies, 100);
        } catch (error) {
            console.error('Error setting cookie:', error);
        }
    }

    // Function to clear all cookies
    function clearAllCookies() {
        if (!browser) return;
        try {
            const cookies = document.cookie.split(';');
            const domain = window.location.hostname;
            console.log('Clearing cookies:', cookies);
            for (const cookie of cookies) {
                const [name] = cookie.trim().split('=');
                const cookieString = `${name}=;path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax${window.location.protocol === 'https:' ? ';Secure' : ''}`;
                console.log('Clearing cookie:', cookieString);
                document.cookie = cookieString;
            }
            lastAction = 'Cleared all cookies';
            lastActionTime = new Date().toLocaleTimeString();
            setTimeout(getAllCookies, 100);
        } catch (error) {
            console.error('Error clearing cookies:', error);
        }
    }

    // Function to test redirect
    function testRedirect() {
        if (!browser) return;
        console.log('Testing redirect with cookies:', document.cookie);
        window.location.href = '/session-test/redirect';
    }

    // Initialize only in browser
    if (browser) {
        getAllCookies();
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Session Cookie Test Page</h1>

    <div class="mb-6 p-4 border rounded">
        <h2 class="text-xl font-semibold mb-2">Current Session Status</h2>
        <p>User: {$page.data.user ? $page.data.user.email : 'Not logged in'}</p>
        <p>Session ID: {$page.data.user?.id || 'No session'}</p>
    </div>

    <div class="mb-6 p-4 border rounded">
        <h2 class="text-xl font-semibold mb-2">Last Action</h2>
        <p class="font-mono">{lastAction || 'No actions yet'}</p>
        <p class="text-sm text-gray-600">Time: {lastActionTime || 'N/A'}</p>
    </div>

    <div class="mb-6 p-4 border rounded">
        <h2 class="text-xl font-semibold mb-2">Test User ID</h2>
        <div class="flex items-center space-x-2">
            <input
                type="text"
                bind:value={testUserId}
                class="border rounded px-2 py-1"
                placeholder="Enter user ID"
            />
            <span class="text-sm text-gray-600">Enter a valid user ID from your database</span>
        </div>
    </div>

    <div class="mb-6 p-4 border rounded">
        <h2 class="text-xl font-semibold mb-2">All Cookies</h2>
        <div class="mb-4">
            <button 
                on:click={getAllCookies}
                class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
                Refresh Cookies
            </button>
            <button 
                on:click={clearAllCookies}
                class="bg-red-500 text-white px-4 py-2 rounded"
            >
                Clear All Cookies
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
                <thead>
                    <tr>
                        <th class="px-4 py-2 border">Name</th>
                        <th class="px-4 py-2 border">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {#if allCookies.length === 0}
                        <tr>
                            <td colspan="2" class="px-4 py-2 border text-center">No cookies found</td>
                        </tr>
                    {:else}
                        {#each allCookies as cookie}
                            <tr>
                                <td class="px-4 py-2 border">{cookie.name}</td>
                                <td class="px-4 py-2 border">{cookie.value}</td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>

    <div class="mb-6 p-4 border rounded">
        <h2 class="text-xl font-semibold mb-2">Test Actions</h2>
        <div class="space-y-4">
            <div>
                <button 
                    on:click={setTestSession}
                    class="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                    Set Test Session Cookie
                </button>
                <span class="text-sm text-gray-600">Sets a test session cookie that expires in 7 days</span>
            </div>
            <div>
                <button 
                    on:click={testRedirect}
                    class="bg-purple-500 text-white px-4 py-2 rounded mr-2"
                >
                    Test Redirect
                </button>
                <span class="text-sm text-gray-600">Tests cookie persistence across redirects</span>
            </div>
        </div>
    </div>

    <div class="mb-6 p-4 border rounded">
        <h2 class="text-xl font-semibold mb-2">Debug Information</h2>
        <pre class="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify($page.data, null, 2)}
        </pre>
    </div>
</div> 