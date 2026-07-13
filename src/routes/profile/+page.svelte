<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/apis';
	import { fetchCurrentUser, user } from '$lib/stores/auth';

	let firstName = $state('');
	let lastName = $state('');
	let saved = $state(false);

	onMount(async () => {
		await fetchCurrentUser();
		if ($user) {
			firstName = $user.first_name;
			lastName = $user.last_name;
		}
	});

	async function save(e: SubmitEvent) {
		e.preventDefault();
		await api.user.updateCurrentUser({ first_name: firstName, last_name: lastName });
		await fetchCurrentUser();
		saved = true;
		setTimeout(() => (saved = false), 2000);
	}
</script>

<div class="mx-auto max-w-xl space-y-4 px-4 py-8">
	<h1 class="text-3xl font-bold">My profile</h1>
	{#if $user}
		<form onsubmit={save} class="space-y-3 rounded bg-white p-6 shadow">
			{#if saved}<p class="rounded bg-green-100 p-2 text-sm text-green-700">Saved.</p>{/if}
			<p class="text-sm text-gray-500">@{$user.username} · {$user.email}</p>
			<input bind:value={firstName} placeholder="First name" class="w-full rounded border p-2" />
			<input bind:value={lastName} placeholder="Last name" class="w-full rounded border p-2" />
			<button class="rounded bg-blue-600 px-4 py-2 text-white">Save</button>
		</form>
	{:else}
		<p>Loading…</p>
	{/if}
</div>
