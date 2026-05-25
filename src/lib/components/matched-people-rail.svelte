<script lang="ts">
	import type { MatchedPerson } from '$lib/server/matching';
	import MatchBadge from './match-badge.svelte';
	import { Users } from '@lucide/svelte';

	let { people, city }: { people: MatchedPerson[]; city: string } = $props();
</script>

<section class="mb-10">
	<header class="mb-3 flex items-baseline justify-between">
		<h2 class="text-lg font-medium">
			People in {city} who share your taste
		</h2>
		<span class="text-muted-foreground text-xs"
			>{people.length} match{people.length === 1 ? '' : 'es'}</span
		>
	</header>

	{#if people.length === 0}
		<div class="text-muted-foreground rounded-xl border border-dashed py-8 text-center text-sm">
			<Users class="mx-auto size-6 opacity-60" />
			<p class="mt-2">
				No matches yet. Like 5 places to start finding people who share your taste.
			</p>
		</div>
	{:else}
		<div class="flex gap-3 overflow-x-auto pb-2">
			{#each people as person (person.id)}
				<article class="bg-card flex w-48 shrink-0 flex-col gap-2 rounded-xl border p-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium uppercase"
					>
						{person.name.slice(0, 1)}
					</div>
					<div class="text-sm font-medium">{person.name}</div>
					<div class="text-muted-foreground text-xs">
						{person.sharedCount} shared like{person.sharedCount === 1 ? '' : 's'}
					</div>
					<div class="mt-1">
						<MatchBadge score={person.score} />
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>
