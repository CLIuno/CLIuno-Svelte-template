<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	data-slot="avatar-fallback"
	class={cn(
		'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full font-medium',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</AvatarPrimitive.Fallback>
