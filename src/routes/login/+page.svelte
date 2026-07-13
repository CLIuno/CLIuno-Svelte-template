<script lang="ts">
	import { goto } from '$app/navigation';
	import { authError, authLoading, login } from '$lib/stores/auth';

	let usernameOrEmail = $state('');
	let password = $state('');

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		try {
			await login(usernameOrEmail, password);
			goto('/todos');
		} catch {
			// error state handled by the store
		}
	}
</script>

<div class="flex justify-center px-4 py-16">
	<form onsubmit={onSubmit} class="w-full max-w-sm space-y-4 rounded bg-white p-8 shadow">
		<h1 class="text-2xl font-bold">Login</h1>
		{#if $authError}<p class="rounded bg-red-100 p-2 text-sm text-red-700">{$authError}</p>{/if}
		<input
			bind:value={usernameOrEmail}
			placeholder="Username or email"
			class="w-full rounded border p-2"
			required
		/>
		<input
			bind:value={password}
			type="password"
			placeholder="Password"
			class="w-full rounded border p-2"
			required
		/>
		<button disabled={$authLoading} class="w-full rounded bg-blue-600 py-2 text-white">
			{$authLoading ? 'Signing in…' : 'Login'}
		</button>
		<div class="flex justify-between text-sm">
			<a href="/forgot-password" class="underline">Forgot password?</a>
			<a href="/register" class="underline">Create account</a>
		</div>
	</form>
</div>
