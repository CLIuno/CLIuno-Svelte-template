<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/apis';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	interface Todo {
		id: string | number;
		title: string;
		description?: string;
		is_completed: boolean;
		user?: { username: string };
	}

	let todos = $state<Todo[]>([]);
	let title = $state('');
	let description = $state('');
	let loading = $state(true);

	async function fetchTodos() {
		try {
			const res = await api.todo.getAllTodos();
			todos = res.data.data.todos;
		} finally {
			loading = false;
		}
	}

	onMount(fetchTodos);

	async function createTodo(e: SubmitEvent) {
		e.preventDefault();
		if (!title.trim()) return;
		await api.todo.createTodo({ title, description });
		title = '';
		description = '';
		await fetchTodos();
	}

	async function toggle(id: Todo['id']) {
		await api.todo.toggleTodo(String(id));
		await fetchTodos();
	}

	async function remove(id: Todo['id']) {
		await api.todo.deleteTodo(String(id));
		await fetchTodos();
	}
</script>

<div class="mx-auto max-w-3xl space-y-6 px-4 py-8">
	<h1 class="text-3xl font-bold tracking-tight">Todos</h1>

	<form onsubmit={createTodo} class="flex gap-2">
		<Input bind:value={title} placeholder="New todo title" required />
		<Input bind:value={description} placeholder="Description (optional)" />
		<Button type="submit">Add</Button>
	</form>

	{#if loading}
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<Loader2 class="animate-spin" />
			Loading…
		</div>
	{/if}
	{#if !loading && todos.length === 0}
		<p class="text-muted-foreground text-sm">No todos yet — add your first one.</p>
	{/if}

	<div class="space-y-2">
		{#each todos as todo (todo.id)}
			<Card class="flex items-center gap-3 p-4">
				<Checkbox checked={todo.is_completed} onCheckedChange={() => toggle(todo.id)} />
				<div class="min-w-0 flex-1">
					<a
						href={`/todos/${todo.id}`}
						class={todo.is_completed ? 'text-muted-foreground line-through' : 'hover:underline'}
					>
						{todo.title}
					</a>
					{#if todo.description}
						<p class="text-muted-foreground truncate text-sm">{todo.description}</p>
					{/if}
					{#if todo.user}
						<p class="text-muted-foreground text-xs">by {todo.user.username}</p>
					{/if}
				</div>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Delete todo"
					onclick={() => remove(todo.id)}
				>
					<Trash2 />
				</Button>
			</Card>
		{/each}
	</div>
</div>
