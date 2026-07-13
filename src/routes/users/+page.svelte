<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/apis';
	import type { User } from '$lib/stores/auth';

	let users = $state<User[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await api.user.getUsers();
			users = res.data.data.users;
		} finally {
			loading = false;
		}
	});
</script>

<div class="mx-auto max-w-3xl space-y-6 px-4 py-8">
	<h1 class="text-3xl font-bold">Users</h1>
	{#if loading}<p>Loading…</p>{/if}
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#each users as u (u.id)}
			<a href={`/users/${u.id}`} class="rounded bg-white p-4 shadow-sm hover:shadow">
				<p class="font-semibold">{u.first_name} {u.last_name}</p>
				<p class="text-sm text-gray-500">@{u.username}</p>
			</a>
		{/each}
	</div>
</div>
