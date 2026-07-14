<script lang="ts">
	import api from '$lib/apis';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Loader2 from '@lucide/svelte/icons/loader-2';

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
	<Card class="w-full max-w-sm">
		<CardHeader>
			<CardTitle class="text-2xl">Forgot password</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if sent}
				<Alert>
					<AlertDescription>If the email exists, a reset link has been sent.</AlertDescription>
				</Alert>
			{:else}
				<form onsubmit={onSubmit} class="space-y-4">
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input id="email" bind:value={email} type="email" placeholder="Your email" required />
					</div>
					<Button type="submit" disabled={loading} class="w-full">
						{#if loading}
							<Loader2 class="animate-spin" />
						{/if}
						{loading ? 'Sending…' : 'Send reset link'}
					</Button>
				</form>
			{/if}
			<a
				href="/login"
				class="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
			>
				Back to login
			</a>
		</CardContent>
	</Card>
</div>
