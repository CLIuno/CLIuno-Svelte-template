<script lang="ts">
	import api from '$lib/apis';

	let email = $state('');
	let sent = $state(false);
	let loading = $state(false);

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		try {
			await api.auth.forgotPassword(email);
		} finally {
			sent = true; // the API is intentionally silent about unknown emails
			loading = false;
		}
	}
</script>

<div class="flex justify-center px-4 py-16">
	<form onsubmit={onSubmit} class="w-full max-w-sm space-y-4 rounded bg-white p-8 shadow">
		<h1 class="text-2xl font-bold">Forgot password</h1>
		{#if sent}
			<p class="rounded bg-green-100 p-2 text-sm text-green-700">
				If the email exists, a reset link has been sent.
			</p>
		{:else}
			<input
				bind:value={email}
				type="email"
				placeholder="Your email"
				class="w-full rounded border p-2"
				required
			/>
			<button disabled={loading} class="w-full rounded bg-blue-600 py-2 text-white">
				{loading ? 'Sending…' : 'Send reset link'}
			</button>
		{/if}
		<a href="/login" class="text-sm underline">Back to login</a>
	</form>
</div>
