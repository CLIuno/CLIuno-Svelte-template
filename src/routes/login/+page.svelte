<script lang="ts">
	import { goto } from '$app/navigation';
	import { authError, authLoading, login } from '$lib/stores/auth';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Loader2 from '@lucide/svelte/icons/loader-2';

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
	<Card class="w-full max-w-sm">
		<CardHeader>
			<CardTitle class="text-2xl">Login</CardTitle>
		</CardHeader>
		<CardContent>
			<form onsubmit={onSubmit} class="space-y-4">
				{#if $authError}
					<Alert variant="destructive">
						<AlertDescription>{$authError}</AlertDescription>
					</Alert>
				{/if}
				<div class="space-y-2">
					<Label for="usernameOrEmail">Username or email</Label>
					<Input
						id="usernameOrEmail"
						bind:value={usernameOrEmail}
						placeholder="Username or email"
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						bind:value={password}
						type="password"
						placeholder="Password"
						required
					/>
				</div>
				<Button type="submit" disabled={$authLoading} class="w-full">
					{#if $authLoading}
						<Loader2 class="animate-spin" />
					{/if}
					{$authLoading ? 'Signing in…' : 'Login'}
				</Button>
				<div class="flex justify-between text-sm">
					<a
						href="/forgot-password"
						class="text-muted-foreground hover:text-foreground underline underline-offset-4"
					>
						Forgot password?
					</a>
					<a
						href="/register"
						class="text-muted-foreground hover:text-foreground underline underline-offset-4"
					>
						Create account
					</a>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
