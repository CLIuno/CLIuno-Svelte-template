<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/apis';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	interface Todo {
		id: string | number;
		title: string;
		description?: string;
		is_completed: boolean;
		user?: { username: string };
	}

	let todo = $state<Todo | null>(null);

	onMount(async () => {
		const res = await api.todo.getTodoById($page.params.id);
		todo = res.data.data.todo;
	});
</script>

<div class="mx-auto max-w-2xl space-y-4 px-4 py-8">
	<a
		href="/todos"
		class="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
	>
		← Back to todos
	</a>
	{#if todo}
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl">{todo.title}</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3">
				{#if todo.description}
					<p class="text-muted-foreground">{todo.description}</p>
				{/if}
				<div class="flex items-center gap-2 text-sm">
					<span class="text-muted-foreground">Status:</span>
					<Badge variant={todo.is_completed ? 'default' : 'secondary'}>
						{todo.is_completed ? 'Completed' : 'Open'}
					</Badge>
				</div>
				{#if todo.user}
					<p class="text-muted-foreground text-sm">Owner: {todo.user.username}</p>
				{/if}
			</CardContent>
		</Card>
	{:else}
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<Loader2 class="animate-spin" />
			Loading…
		</div>
	{/if}
</div>
