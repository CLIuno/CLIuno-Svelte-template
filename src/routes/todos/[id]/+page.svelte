<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/apis';

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
	<a href="/todos" class="text-sm underline">← Back to todos</a>
	{#if todo}
		<div class="space-y-2 rounded bg-white p-6 shadow">
			<h1 class="text-2xl font-bold">{todo.title}</h1>
			{#if todo.description}<p class="text-gray-700">{todo.description}</p>{/if}
			<p class="text-sm">
				Status:
				<span class={todo.is_completed ? 'text-green-600' : 'text-amber-600'}>
					{todo.is_completed ? 'Completed' : 'Open'}
				</span>
			</p>
			{#if todo.user}<p class="text-sm text-gray-500">Owner: {todo.user.username}</p>{/if}
		</div>
	{:else}
		<p>Loading…</p>
	{/if}
</div>
