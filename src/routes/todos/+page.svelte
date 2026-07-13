<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/apis';

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
	<h1 class="text-3xl font-bold">Todos</h1>

	<form onsubmit={createTodo} class="flex gap-2">
		<input
			bind:value={title}
			placeholder="New todo title"
			class="flex-1 rounded border p-2"
			required
		/>
		<input
			bind:value={description}
			placeholder="Description (optional)"
			class="flex-1 rounded border p-2"
		/>
		<button class="rounded bg-blue-600 px-4 text-white">Add</button>
	</form>

	{#if loading}<p>Loading…</p>{/if}
	{#if !loading && todos.length === 0}<p>No todos yet — add your first one.</p>{/if}

	<ul class="space-y-2">
		{#each todos as todo (todo.id)}
			<li class="flex items-center gap-3 rounded bg-white p-4 shadow-sm">
				<input type="checkbox" checked={todo.is_completed} onchange={() => toggle(todo.id)} />
				<div class="flex-1">
					<a href={`/todos/${todo.id}`} class={todo.is_completed ? 'line-through opacity-60' : ''}>
						{todo.title}
					</a>
					{#if todo.user}<p class="text-xs text-gray-500">by {todo.user.username}</p>{/if}
				</div>
				<button onclick={() => remove(todo.id)} class="text-sm text-red-600 hover:underline">
					Delete
				</button>
			</li>
		{/each}
	</ul>
</div>
