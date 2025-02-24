<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Navbar user={data.user} />

<main class="pt-16">
	<slot />
</main>
