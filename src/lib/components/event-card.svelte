<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Calendar, MapPin } from '@lucide/svelte';
	import type { Event } from '$lib/server/db/schema';

	let { event, timezone }: { event: Event; timezone: string | null } = $props();

	const when = $derived(
		new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			timeZone: timezone ?? undefined
		}).format(event.startsAt)
	);
</script>

<article
	class="bg-card hover:border-foreground/30 flex flex-col gap-3 rounded-xl border p-4 transition-colors"
>
	<div class="flex items-start justify-between gap-2">
		<h3 class="text-sm font-medium">{event.name}</h3>
		<Badge variant="secondary" class="capitalize">{event.category}</Badge>
	</div>
	<p class="text-muted-foreground line-clamp-2 text-xs">{event.description}</p>
	<div class="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
		<span class="flex items-center gap-1">
			<Calendar class="size-3" />
			{when}
		</span>
		{#if event.venue}
			<span class="flex items-center gap-1">
				<MapPin class="size-3" />
				{event.venue}
			</span>
		{/if}
	</div>
</article>
