<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import SkipLink from '$lib/components/ui/SkipLink.svelte';
	import RouteTransition from '$lib/components/ui/RouteTransition.svelte';
	import PerformanceMonitor from '$lib/components/ui/PerformanceMonitor.svelte';
	import { theme } from '$lib/stores/theme';
	import { navigation } from '$lib/stores/navigation';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	
	// Show breadcrumb only on non-home pages
	$: showBreadcrumb = $navigation.activeRoute !== '/';
</script>

<svelte:head>
	<meta name="theme-color" content={$theme === 'dark' ? '#1a1a1a' : '#ffffff'} />
</svelte:head>

<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
	<ErrorBoundary>
		<SkipLink>
			<Navbar user={data.user} />
			
			{#if showBreadcrumb}
				<div class="container mx-auto px-4 py-1">
					<Breadcrumb />
				</div>
			{/if}
			
			<main class="pt-8">
				<RouteTransition>
					<slot />
				</RouteTransition>
			</main>
		</SkipLink>
	</ErrorBoundary>
	
	<PerformanceMonitor />
</div>
