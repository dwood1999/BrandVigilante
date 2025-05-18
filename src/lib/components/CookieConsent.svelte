<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import type { CookieConsent } from '$lib/types/cookies';
	import { applyCookieConsent, clearNonNecessaryCookies } from '$lib/services/cookieManager';

	// Cookie consent store
	const cookieConsent = writable<CookieConsent>({
		necessary: true, // Always true as these are essential
		analytics: false,
		marketing: false,
		preferences: false
	});

	// Modal visibility
	let showModal = false;
	let showBanner = false;

	// Check if user has already made a choice
	onMount(() => {
		const savedConsent = localStorage.getItem('cookieConsent');
		if (savedConsent) {
			const parsedConsent = JSON.parse(savedConsent) as CookieConsent;
			cookieConsent.set(parsedConsent);
			applyCookieConsent(parsedConsent);
		} else {
			showBanner = true;
			// Apply necessary cookies by default
			applyCookieConsent({ necessary: true, analytics: false, marketing: false, preferences: false });
		}
	});

	// Handle accepting all cookies
	function acceptAll() {
		const newConsent = {
			necessary: true,
			analytics: true,
			marketing: true,
			preferences: true
		};
		cookieConsent.set(newConsent);
		saveConsent();
		applyCookieConsent(newConsent);
		showBanner = false;
	}

	// Handle accepting only necessary cookies
	function acceptNecessary() {
		const newConsent = {
			necessary: true,
			analytics: false,
			marketing: false,
			preferences: false
		};
		cookieConsent.set(newConsent);
		saveConsent();
		clearNonNecessaryCookies();
		applyCookieConsent(newConsent);
		showBanner = false;
	}

	// Save consent to localStorage
	function saveConsent() {
		localStorage.setItem('cookieConsent', JSON.stringify($cookieConsent));
	}

	// Toggle cookie category
	function toggleCategory(category: keyof CookieConsent) {
		if (category !== 'necessary') {
			const newConsent = {
				...$cookieConsent,
				[category]: !$cookieConsent[category]
			};
			cookieConsent.set(newConsent);
			applyCookieConsent(newConsent);
		}
	}
</script>

{#if showBanner}
	<div
		class="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4"
		transition:fade
	>
		<div class="container mx-auto max-w-6xl">
			<div class="flex flex-col md:flex-row items-center justify-between gap-4">
				<div class="flex-1">
					<h3 class="text-lg font-semibold mb-2">Cookie Consent</h3>
					<p class="text-gray-600">
						We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
					</p>
				</div>
				<div class="flex flex-col sm:flex-row gap-2">
					<button
						on:click={() => (showModal = true)}
						class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
					>
						Customize
					</button>
					<button
						on:click={acceptNecessary}
						class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
					>
						Necessary Only
					</button>
					<button
						on:click={acceptAll}
						class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
					>
						Accept All
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if showModal}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-label="Cookie preferences"
		tabindex="-1"
		transition:fade
	>
		<div
			class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
			role="document"
			aria-label="Cookie preferences content"
			transition:slide={{ duration: 200 }}
		>
			<div class="flex justify-between items-start mb-4">
				<h2 class="text-2xl font-bold">Cookie Preferences</h2>
				<button
					type="button"
					class="text-gray-500 hover:text-gray-700"
					on:click={() => (showModal = false)}
					aria-label="Close cookie preferences"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<p class="text-gray-600 mb-6">
				Manage your cookie preferences. You can enable or disable different types of cookies below.
			</p>

			<div class="space-y-4">
				<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
					<div>
						<h3 class="font-semibold">Necessary Cookies</h3>
						<p class="text-sm text-gray-600">
							Essential for the website to function properly. Cannot be disabled.
						</p>
					</div>
					<label class="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={$cookieConsent.necessary}
							disabled
							class="sr-only peer"
						/>
						<div
							class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
						></div>
					</label>
				</div>

				<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
					<div>
						<h3 class="font-semibold">Analytics Cookies</h3>
						<p class="text-sm text-gray-600">
							Help us understand how visitors interact with our website.
						</p>
					</div>
					<label class="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={$cookieConsent.analytics}
							on:change={() => toggleCategory('analytics')}
							class="sr-only peer"
						/>
						<div
							class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
						></div>
					</label>
				</div>

				<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
					<div>
						<h3 class="font-semibold">Marketing Cookies</h3>
						<p class="text-sm text-gray-600">
							Used to track visitors across websites for marketing purposes.
						</p>
					</div>
					<label class="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={$cookieConsent.marketing}
							on:change={() => toggleCategory('marketing')}
							class="sr-only peer"
						/>
						<div
							class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
						></div>
					</label>
				</div>

				<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
					<div>
						<h3 class="font-semibold">Preference Cookies</h3>
						<p class="text-sm text-gray-600">
							Remember your settings and preferences for a better experience.
						</p>
					</div>
					<label class="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={$cookieConsent.preferences}
							on:change={() => toggleCategory('preferences')}
							class="sr-only peer"
						/>
						<div
							class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
						></div>
					</label>
				</div>
			</div>

			<div class="mt-6 flex justify-end gap-4">
				<button
					type="button"
					on:click={() => (showModal = false)}
					class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
				>
					Cancel
				</button>
				<button
					type="button"
					on:click={() => {
						saveConsent();
						showModal = false;
						showBanner = false;
					}}
					class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
				>
					Save Preferences
				</button>
			</div>
		</div>
	</div>
{/if} 