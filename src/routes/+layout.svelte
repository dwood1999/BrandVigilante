<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import SkipLink from '$lib/components/ui/SkipLink.svelte';
	import RouteTransition from '$lib/components/ui/RouteTransition.svelte';
	import PerformanceMonitor from '$lib/components/ui/PerformanceMonitor.svelte';
	import { theme } from '$lib/stores/theme';
	import { navigation } from '$lib/stores/navigation';
	import type { LayoutData as PageLayoutData } from './$types';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import EmailVerificationBanner from '$lib/components/EmailVerificationBanner.svelte';

	export const data: PageLayoutData = {
		user: undefined,
		cookieNameToClear: ''
	};
	
	// Show breadcrumb only on non-home pages
	$: showBreadcrumb = $navigation.activeRoute !== '/';
</script>

<svelte:head>
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<div class="flex flex-col min-h-screen bg-white text-gray-900">
	<ErrorBoundary>
		<SkipLink>
			<Navbar />
			
			<main class="pt-8 flex-grow">
				{#if showBreadcrumb}
					<div class="container mx-auto px-1 py-4">
						<Breadcrumb />
					</div>
				{/if}
				
				<RouteTransition>
					<EmailVerificationBanner />
					<slot />
				</RouteTransition>
			</main>

			<Footer />
			<CookieConsent />
		</SkipLink>
	</ErrorBoundary>
	
	<PerformanceMonitor />
</div>
