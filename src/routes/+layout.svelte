<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { hydrate, isAuthenticated, logout, user } from '$lib/stores/auth';
	import '../app.css';

	let { children } = $props();

	onMount(hydrate);

	async function onLogout() {
		await logout();
		goto('/login');
	}
</script>

<ParaglideJS {i18n}>
	<nav class="flex items-center justify-between bg-white px-6 py-3 shadow">
		<div class="flex items-center gap-4">
			<a href="/" class="text-lg font-bold">CLIuno</a>
			{#if $isAuthenticated}
				<a href="/todos" class="text-sm hover:underline">Todos</a>
				<a href="/posts" class="text-sm hover:underline">Posts</a>
				<a href="/users" class="text-sm hover:underline">Users</a>
			{/if}
		</div>
		<div class="flex items-center gap-3">
			{#if $isAuthenticated}
				<a href="/profile" class="text-sm hover:underline">{$user?.username ?? 'Profile'}</a>
				<button onclick={onLogout} class="rounded border px-3 py-1 text-sm hover:bg-gray-100">
					Logout
				</button>
			{:else}
				<a href="/login" class="text-sm hover:underline">Login</a>
				<a href="/register" class="rounded bg-blue-600 px-3 py-1 text-sm text-white">Register</a>
			{/if}
		</div>
	</nav>
	<main class="min-h-screen bg-gray-50">
		{@render children()}
	</main>
</ParaglideJS>
