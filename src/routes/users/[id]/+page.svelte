<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/apis';
	import { user as me, type User } from '$lib/stores/auth';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let profile = $state<User | null>(null);
	let followers = $state<User[]>([]);
	let following = $state<User[]>([]);
	let isFollowing = $state(false);

	async function load() {
		const id = $page.params.id;
		const [u, fr, fw, isF] = await Promise.all([
			api.user.getUserById(id),
			api.follow.getFollowers(id),
			api.follow.getFollowing(id),
			api.follow.isFollowing(id)
		]);
		profile = u.data.data.user;
		followers = fr.data.data.followers;
		following = fw.data.data.following;
		isFollowing = isF.data.data.isFollowing;
	}

	onMount(load);

	async function toggleFollow() {
		const id = $page.params.id;
		if (isFollowing) {
			await api.follow.unfollow(id);
		} else {
			await api.follow.follow(id);
		}
		await load();
	}
</script>

<div class="mx-auto max-w-2xl space-y-4 px-4 py-8">
	{#if profile}
		<Card>
			<CardContent class="flex items-center gap-4 pt-6">
				<Avatar class="size-16 text-xl">
					<AvatarFallback>{profile.first_name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
				</Avatar>
				<div class="min-w-0 flex-1">
					<h1 class="truncate text-xl font-bold">{profile.first_name} {profile.last_name}</h1>
					<p class="text-muted-foreground">@{profile.username}</p>
					<p class="text-muted-foreground mt-1 text-sm">
						{followers.length} followers · {following.length} following
					</p>
				</div>
				{#if $me && String($me.id) !== String(profile.id)}
					<Button variant={isFollowing ? 'outline' : 'default'} onclick={toggleFollow}>
						{isFollowing ? 'Following' : 'Follow'}
					</Button>
				{/if}
			</CardContent>
		</Card>

		{#if followers.length > 0}
			<Card>
				<CardHeader>
					<CardTitle class="text-base">Followers</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-wrap gap-2">
					{#each followers as f (f.id)}
						<Badge variant="outline">@{f.username}</Badge>
					{/each}
				</CardContent>
			</Card>
		{/if}
	{:else}
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<Loader2 class="animate-spin" />
			Loading…
		</div>
	{/if}
</div>
