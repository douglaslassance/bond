<script lang="ts">
	/**
	 * Renders a 0..1 similarity score as a "92%" badge with a color that
	 * communicates strength: strong → primary, mid → muted, weak → subtle.
	 */
	let { score }: { score: number } = $props();

	const pct = $derived(Math.round(score * 100));
	const variant = $derived(pct >= 70 ? 'strong' : pct >= 40 ? 'mid' : 'weak');
</script>

<span
	class="inline-flex h-6 items-center rounded-full px-2 text-xs font-medium tabular-nums"
	class:bg-primary={variant === 'strong'}
	class:text-primary-foreground={variant === 'strong'}
	class:bg-secondary={variant === 'mid'}
	class:text-secondary-foreground={variant === 'mid'}
	class:bg-muted={variant === 'weak'}
	class:text-muted-foreground={variant === 'weak'}
	aria-label={`${pct} percent match`}
>
	{pct}% match
</span>
