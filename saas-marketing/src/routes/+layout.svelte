<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(() => {
		// Initialize theme on mount
		const storedTheme = localStorage.getItem('theme') || 'light';
		$theme = storedTheme as 'light' | 'dark';
		document.documentElement.classList.toggle('dark', storedTheme === 'dark');
	});
</script>

<div class="min-h-screen bg-background text-foreground transition-colors duration-200">
	{@render children()}
</div>

