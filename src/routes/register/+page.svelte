<script lang="ts">
	import { goto } from '$app/navigation';
	import { authError, authLoading, register } from '$lib/stores/auth';

	let form = $state({
		first_name: '',
		last_name: '',
		username: '',
		email: '',
		phone: '',
		password: '',
		password_confirmation: ''
	});

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		try {
			await register(form);
			goto('/login');
		} catch {
			// error state handled by the store
		}
	}
</script>

<div class="flex justify-center px-4 py-12">
	<form onsubmit={onSubmit} class="w-full max-w-md space-y-3 rounded bg-white p-8 shadow">
		<h1 class="text-2xl font-bold">Create account</h1>
		{#if $authError}<p class="rounded bg-red-100 p-2 text-sm text-red-700">{$authError}</p>{/if}
		<div class="grid grid-cols-2 gap-3">
			<input
				bind:value={form.first_name}
				placeholder="First name"
				class="rounded border p-2"
				required
			/>
			<input
				bind:value={form.last_name}
				placeholder="Last name"
				class="rounded border p-2"
				required
			/>
		</div>
		<input
			bind:value={form.username}
			placeholder="Username"
			class="w-full rounded border p-2"
			required
		/>
		<input
			bind:value={form.email}
			type="email"
			placeholder="Email"
			class="w-full rounded border p-2"
			required
		/>
		<input bind:value={form.phone} placeholder="Phone" class="w-full rounded border p-2" />
		<input
			bind:value={form.password}
			type="password"
			placeholder="Password"
			class="w-full rounded border p-2"
			required
		/>
		<input
			bind:value={form.password_confirmation}
			type="password"
			placeholder="Confirm password"
			class="w-full rounded border p-2"
			required
		/>
		<button disabled={$authLoading} class="w-full rounded bg-blue-600 py-2 text-white">
			{$authLoading ? 'Creating…' : 'Register'}
		</button>
		<p class="text-sm">Already have an account? <a href="/login" class="underline">Login</a></p>
	</form>
</div>
