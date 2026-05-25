<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { invalidateAll } from '$app/navigation';
	import { Compass, Loader2 } from '@lucide/svelte';

	let status = $state<'idle' | 'asking' | 'resolving' | 'error'>('idle');
	let errorMessage = $state<string | null>(null);

	async function requestLocation() {
		errorMessage = null;

		if (typeof navigator === 'undefined' || !navigator.geolocation) {
			status = 'error';
			errorMessage = 'Your browser does not support geolocation.';
			return;
		}

		status = 'asking';
		try {
			const position = await new Promise<GeolocationPosition>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: false,
					timeout: 10_000,
					maximumAge: 5 * 60_000
				});
			});

			status = 'resolving';
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
			const res = await fetch('/api/location', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					timezone
				})
			});
			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(text || `Server returned ${res.status}`);
			}
			await invalidateAll();
		} catch (err) {
			console.error('Geolocation failed:', err);
			status = 'error';
			if (err instanceof GeolocationPositionError) {
				errorMessage =
					err.code === err.PERMISSION_DENIED
						? 'Location permission denied. Allow it in your browser settings to continue.'
						: 'Could not get your current location.';
			} else if (err instanceof Error) {
				errorMessage = err.message;
			} else {
				errorMessage = 'Something went wrong.';
			}
		}
	}
</script>

<div class="bg-card mx-auto max-w-md rounded-xl border p-8 text-center">
	<Compass class="text-primary mx-auto size-8" />
	<h2 class="mt-4 text-lg font-medium">Where are you right now?</h2>
	<p class="text-muted-foreground mt-2 text-sm">
		Bond surfaces places and people in your current city. We need to know where you are.
	</p>
	<Button
		onclick={requestLocation}
		disabled={status === 'asking' || status === 'resolving'}
		class="mt-6"
	>
		{#if status === 'asking' || status === 'resolving'}
			<Loader2 class="size-4 animate-spin" />
			{status === 'asking' ? 'Asking your browser…' : 'Resolving city…'}
		{:else}
			Use my location
		{/if}
	</Button>
	{#if errorMessage}
		<p class="text-destructive mt-4 text-sm">{errorMessage}</p>
	{/if}
</div>
