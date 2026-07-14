<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/apis';
	import type { User } from '$lib/stores/auth';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Card, CardContent } from '$lib/components/ui/card';
	import Loader2 from '@lucide/svelte/icons/loader-2';

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
	<h1 class="text-3xl font-bold tracking-tight">Users</h1>
	{#if loading}
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<Loader2 class="animate-spin" />
			Loading…
		</div>
	{/if}
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#each users as u (u.id)}
			<a href={`/users/${u.id}`} class="block">
				<Card class="transition-shadow hover:shadow-md">
					<CardContent class="flex items-center gap-3 pt-6">
						<Avatar>
							<AvatarFallback>{u.first_name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
						</Avatar>
						<div class="min-w-0">
							<p class="truncate font-semibold">{u.first_name} {u.last_name}</p>
							<p class="text-muted-foreground truncate text-sm">@{u.username}</p>
						</div>
					</CardContent>
				</Card>
			</a>
		{/each}
	</div>
</div>
