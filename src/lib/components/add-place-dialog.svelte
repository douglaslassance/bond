<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Loader2, Plus } from '@lucide/svelte';
	import { mapAppleCategoryClient } from '$lib/map-category';

	let {
		center
	}: {
		/** Bias search to this point (typically the map's current center). */
		center?: { latitude: number; longitude: number };
	} = $props();

	type AppleHit = {
		muid: string;
		name: string;
		address: string;
		latitude: number;
		longitude: number;
		category: 'restaurant' | 'bar' | 'shop' | null;
		locality?: string;
	};

	let open = $state(false);
	let query = $state('');
	let results = $state<AppleHit[]>([]);
	let searching = $state(false);
	let savingMuid = $state<string | null>(null);
	let error = $state<string | null>(null);
	let debounceId: ReturnType<typeof setTimeout> | null = null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let search: any = null;

	async function ensureSearch() {
		if (search) return search;
		if (typeof window === 'undefined' || !window.mapkit) {
			throw new Error('MapKit JS not loaded — open the map first.');
		}
		search = new window.mapkit.Search({
			getsUserLocation: false,
			region: center
				? new window.mapkit.CoordinateRegion(
						new window.mapkit.Coordinate(center.latitude, center.longitude),
						new window.mapkit.CoordinateSpan(0.5, 0.5)
					)
				: undefined
		});
		return search;
	}

	async function runSearch(q: string) {
		if (!q.trim()) {
			results = [];
			return;
		}
		searching = true;
		error = null;
		try {
			const s = await ensureSearch();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = await new Promise<any>((resolve, reject) => {
				s.search(q, (err: unknown, data: unknown) => {
					if (err) reject(err);
					else resolve(data);
				});
			});

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const places = (data?.places ?? []) as any[];
			results = places.slice(0, 12).map((p) => ({
				muid: String(p.muid ?? p.id ?? ''),
				name: p.name ?? '(unnamed)',
				address: p.formattedAddress ?? '',
				latitude: p.coordinate?.latitude ?? 0,
				longitude: p.coordinate?.longitude ?? 0,
				category: mapAppleCategoryClient(p.pointOfInterestCategory),
				locality: p.locality ?? p.subLocality ?? undefined
			}));
		} catch (err) {
			console.error('Search failed:', err);
			error = err instanceof Error ? err.message : 'Search failed.';
			results = [];
		} finally {
			searching = false;
		}
	}

	function onInput(value: string) {
		query = value;
		if (debounceId) clearTimeout(debounceId);
		debounceId = setTimeout(() => runSearch(value), 300);
	}

	async function addHit(hit: AppleHit) {
		if (!hit.category) {
			error = "We don't support this place's category yet (only restaurants, bars, shops).";
			return;
		}
		savingMuid = hit.muid;
		error = null;
		try {
			const res = await fetch('/api/places', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					externalId: hit.muid,
					source: 'apple',
					name: hit.name,
					category: hit.category,
					city: hit.locality ?? '',
					latitude: hit.latitude,
					longitude: hit.longitude
				})
			});
			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(text || `Server returned ${res.status}`);
			}
			open = false;
			query = '';
			results = [];
			await invalidateAll();
		} catch (err) {
			console.error('Add place failed:', err);
			error = err instanceof Error ? err.message : 'Could not add the place.';
		} finally {
			savingMuid = null;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="icon" class="shadow-lg" aria-label="Add a place">
				<Plus class="size-5" />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Add a place</Dialog.Title>
			<Dialog.Description>
				Search Apple Maps for a spot. Adding it likes it and makes it discoverable to people with
				matching taste.
			</Dialog.Description>
		</Dialog.Header>

		<Input
			type="search"
			placeholder="e.g. Bestia, Sushi Saito, Bar Trench…"
			value={query}
			oninput={(e) => onInput(e.currentTarget.value)}
			autofocus
		/>

		{#if error}
			<p class="text-destructive text-sm">{error}</p>
		{/if}

		<div class="-mx-2 max-h-80 overflow-y-auto">
			{#if searching && results.length === 0}
				<p class="text-muted-foreground px-2 py-4 text-center text-sm">Searching…</p>
			{:else if query && !searching && results.length === 0}
				<p class="text-muted-foreground px-2 py-4 text-center text-sm">No results.</p>
			{:else}
				{#each results as hit (hit.muid)}
					<button
						type="button"
						class="hover:bg-accent flex w-full items-start gap-3 rounded-md px-2 py-2 text-left"
						disabled={savingMuid === hit.muid || hit.category === null}
						onclick={() => addHit(hit)}
					>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="truncate text-sm font-medium">{hit.name}</span>
								{#if hit.category}
									<Badge variant="secondary" class="capitalize text-[10px]">{hit.category}</Badge>
								{:else}
									<Badge variant="outline" class="text-[10px]">unsupported</Badge>
								{/if}
							</div>
							<p class="text-muted-foreground mt-0.5 truncate text-xs">{hit.address}</p>
						</div>
						{#if savingMuid === hit.muid}
							<Loader2 class="text-muted-foreground size-4 animate-spin" />
						{/if}
					</button>
				{/each}
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
