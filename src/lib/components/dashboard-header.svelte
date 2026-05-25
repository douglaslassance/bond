<script lang="ts">
	import { MapPin } from '@lucide/svelte';
	import type { UserLocation } from '$lib/server/db/schema';
	import type { Weather } from '$lib/server/weather';

	let {
		location,
		weather
	}: {
		location: UserLocation;
		weather: Weather | null;
	} = $props();

	// Re-render local time every minute so the header stays current without
	// the user reloading. Kept simple: setInterval, untracked write.
	let now = $state(new Date());
	$effect(() => {
		const id = setInterval(() => (now = new Date()), 60_000);
		return () => clearInterval(id);
	});

	const timeFormatter = $derived(
		new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			timeZone: location.timezone ?? undefined
		})
	);

	const localTime = $derived(timeFormatter.format(now));
</script>

<section class="border-border/60 mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b pb-4">
	<div class="flex items-center gap-2 text-lg font-medium">
		<MapPin class="size-5" />
		{location.city}
	</div>
	<div class="text-muted-foreground text-sm tabular-nums">{localTime}</div>
	{#if weather}
		<div class="text-muted-foreground flex items-center gap-1.5 text-sm">
			<span aria-hidden="true">{weather.icon}</span>
			<span>{weather.temperatureC}°C · {weather.description}</span>
		</div>
	{/if}
</section>
