<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex min-h-[70vh] items-center justify-center px-4 text-center">
	<div class="max-w-md space-y-4">
		<h1 class="text-5xl font-bold tracking-tight">CLIuno</h1>
		<p class="text-muted-foreground">
			A SvelteKit template wired to the shared CLIuno REST contract — auth, todos, posts and follows
			out of the box.
		</p>
		<Button href="/register" size="lg">Get Started</Button>
	</div>
</div>
