<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/apis';
	import { user as me, type User } from '$lib/stores/auth';

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
		<div class="flex items-center gap-4 rounded bg-white p-6 shadow">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-xl text-white"
			>
				{profile.first_name?.[0]}
			</div>
			<div class="flex-1">
				<h1 class="text-xl font-bold">{profile.first_name} {profile.last_name}</h1>
				<p class="text-gray-500">@{profile.username}</p>
				<p class="mt-1 text-sm">{followers.length} followers · {following.length} following</p>
			</div>
			{#if $me && String($me.id) !== String(profile.id)}
				<button
					onclick={toggleFollow}
					class={isFollowing
						? 'rounded border px-4 py-2 text-sm'
						: 'rounded bg-blue-600 px-4 py-2 text-sm text-white'}
				>
					{isFollowing ? 'Following' : 'Follow'}
				</button>
			{/if}
		</div>

		{#if followers.length > 0}
			<div class="rounded bg-white p-4 shadow">
				<h2 class="mb-2 font-bold">Followers</h2>
				<div class="flex flex-wrap gap-2">
					{#each followers as f (f.id)}
						<span class="rounded-full border px-3 py-1 text-sm">@{f.username}</span>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<p>Loading…</p>
	{/if}
</div>
