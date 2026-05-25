<script lang="ts">
	import EventCard from './event-card.svelte';
	import type { Event } from '$lib/server/db/schema';

	let {
		title,
		events,
		timezone,
		empty
	}: {
		title: string;
		events: Event[];
		timezone: string | null;
		empty: string;
	} = $props();
</script>

<section class="mb-10">
	<header class="mb-3 flex items-baseline justify-between">
		<h2 class="text-lg font-medium">{title}</h2>
	</header>

	{#if events.length === 0}
		<p class="text-muted-foreground rounded-xl border border-dashed py-6 text-center text-sm">
			{empty}
		</p>
	{:else}
		<div class="grid gap-3 sm:grid-cols-2">
			{#each events as ev (ev.id)}
				<EventCard event={ev} {timezone} />
			{/each}
		</div>
	{/if}
</section>
