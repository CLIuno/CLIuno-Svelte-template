<script lang="ts">
	import { goto } from '$app/navigation';
	import { authError, authLoading, register } from '$lib/stores/auth';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Loader2 from '@lucide/svelte/icons/loader-2';

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
	<Card class="w-full max-w-sm">
		<CardHeader>
			<CardTitle class="text-2xl">Create account</CardTitle>
		</CardHeader>
		<CardContent>
			<form onsubmit={onSubmit} class="space-y-4">
				{#if $authError}
					<Alert variant="destructive">
						<AlertDescription>{$authError}</AlertDescription>
					</Alert>
				{/if}
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-2">
						<Label for="first_name">First name</Label>
						<Input id="first_name" bind:value={form.first_name} placeholder="First name" required />
					</div>
					<div class="space-y-2">
						<Label for="last_name">Last name</Label>
						<Input id="last_name" bind:value={form.last_name} placeholder="Last name" required />
					</div>
				</div>
				<div class="space-y-2">
					<Label for="username">Username</Label>
					<Input id="username" bind:value={form.username} placeholder="Username" required />
				</div>
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input id="email" bind:value={form.email} type="email" placeholder="Email" required />
				</div>
				<div class="space-y-2">
					<Label for="phone">Phone</Label>
					<Input id="phone" bind:value={form.phone} placeholder="Phone" />
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						bind:value={form.password}
						type="password"
						placeholder="Password"
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="password_confirmation">Confirm password</Label>
					<Input
						id="password_confirmation"
						bind:value={form.password_confirmation}
						type="password"
						placeholder="Confirm password"
						required
					/>
				</div>
				<Button type="submit" disabled={$authLoading} class="w-full">
					{#if $authLoading}
						<Loader2 class="animate-spin" />
					{/if}
					{$authLoading ? 'Creating…' : 'Register'}
				</Button>
				<p class="text-muted-foreground text-center text-sm">
					Already have an account?
					<a href="/login" class="text-foreground underline underline-offset-4">Login</a>
				</p>
			</form>
		</CardContent>
	</Card>
</div>
