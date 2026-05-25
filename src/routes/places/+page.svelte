<script lang="ts">
	import MapView from '$lib/components/map-view.svelte';
	import AddPlaceDialog from '$lib/components/add-place-dialog.svelte';
	import { page } from '$app/state';

	let { data } = $props();
	const signedIn = $derived(!!page.data.user);
</script>

<!--
  Escape the constrained <main> from the root layout: position the map
  fixed below the header (h-14 = 3.5rem) so it fills the viewport. The
  outer <main> still exists in the DOM but contributes nothing visually
  on this route.
-->
<div class="fixed inset-x-0 bottom-0 top-14 z-0">
	<MapView places={data.places} center={data.center} likedIds={data.likedIds} />

	{#if signedIn}
		<div class="absolute bottom-6 right-6 z-20">
			<AddPlaceDialog center={data.center} />
		</div>
	{/if}
</div>
