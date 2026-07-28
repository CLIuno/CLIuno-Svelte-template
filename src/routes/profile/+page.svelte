<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/apis';
	import { fetchCurrentUser, user } from '$lib/stores/auth';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let firstName = $state('');
	let lastName = $state('');
	let saved = $state(false);
	let uploading = $state(false);
	let uploadError = $state<string | null>(null);
	let avatarInput = $state<HTMLInputElement | null>(null);

	onMount(async () => {
		await fetchCurrentUser();
		if ($user) {
			firstName = $user.first_name;
			lastName = $user.last_name;
		}
	});

	async function onAvatarPicked(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		uploadError = null;
		try {
			const res = await api.upload.uploadImage(file);
			await api.user.updateCurrentUser({ avatar_url: res.data.data.url });
			await fetchCurrentUser();
		} catch {
			uploadError = 'Upload failed';
		} finally {
			uploading = false;
			// reset so re-picking the same file still fires change
			input.value = '';
		}
	}

	async function save(e: SubmitEvent) {
		e.preventDefault();
		await api.user.updateCurrentUser({ first_name: firstName, last_name: lastName });
		await fetchCurrentUser();
		saved = true;
		setTimeout(() => (saved = false), 2000);
	}
</script>

<div class="mx-auto max-w-xl space-y-4 px-4 py-8">
	<h1 class="text-3xl font-bold tracking-tight">My profile</h1>
	{#if $user}
		<Card>
			<CardHeader class="flex-row items-center gap-4 space-y-0">
				<div class="flex flex-col items-center gap-2">
					<Avatar class="size-16 text-xl">
						{#if $user.avatar_url}
							<AvatarImage src={$user.avatar_url} alt={$user.username} />
						{/if}
						<AvatarFallback>{$user.first_name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
					</Avatar>
					<input
						bind:this={avatarInput}
						type="file"
						accept="image/png,image/jpeg,image/webp,image/gif"
						class="hidden"
						onchange={onAvatarPicked}
					/>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={uploading}
						onclick={() => avatarInput?.click()}
					>
						{uploading ? 'Uploading…' : 'Change photo'}
					</Button>
				</div>
				<div class="min-w-0">
					<p class="truncate font-semibold">{$user.first_name} {$user.last_name}</p>
					<p class="text-muted-foreground truncate text-sm">@{$user.username} · {$user.email}</p>
					{#if uploadError}
						<p class="text-destructive mt-1 text-sm">{uploadError}</p>
					{/if}
				</div>
			</CardHeader>
			<CardContent>
				<form onsubmit={save} class="space-y-4">
					{#if saved}
						<Alert>
							<AlertDescription>Saved.</AlertDescription>
						</Alert>
					{/if}
					<div class="space-y-2">
						<Label for="firstName">First name</Label>
						<Input id="firstName" bind:value={firstName} placeholder="First name" />
					</div>
					<div class="space-y-2">
						<Label for="lastName">Last name</Label>
						<Input id="lastName" bind:value={lastName} placeholder="Last name" />
					</div>
					<Button type="submit">Save</Button>
				</form>
			</CardContent>
		</Card>
	{:else}
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<Loader2 class="animate-spin" />
			Loading…
		</div>
	{/if}
</div>
