<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/apis';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	interface Post {
		id: string | number;
		title: string;
		content: string;
		user?: { username: string };
		comments?: unknown[];
	}

	let posts = $state<Post[]>([]);
	let title = $state('');
	let content = $state('');
	let loading = $state(true);

	async function fetchPosts() {
		try {
			const res = await api.post.getAllPosts();
			posts = res.data.data.posts;
		} finally {
			loading = false;
		}
	}

	onMount(fetchPosts);

	async function createPost(e: SubmitEvent) {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;
		await api.post.createPost({ title, content });
		title = '';
		content = '';
		await fetchPosts();
	}
</script>

<div class="mx-auto max-w-3xl space-y-6 px-4 py-8">
	<h1 class="text-3xl font-bold tracking-tight">Posts</h1>

	<Card>
		<CardContent class="pt-6">
			<form onsubmit={createPost} class="space-y-3">
				<Input bind:value={title} placeholder="Post title" required />
				<Textarea bind:value={content} placeholder="What's on your mind?" rows={3} required />
				<Button type="submit">Publish</Button>
			</form>
		</CardContent>
	</Card>

	{#if loading}
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<Loader2 class="animate-spin" />
			Loading…
		</div>
	{/if}
	{#if !loading && posts.length === 0}
		<p class="text-muted-foreground text-sm">No posts yet.</p>
	{/if}

	<div class="space-y-3">
		{#each posts as post (post.id)}
			<a href={`/posts/${post.id}`} class="block">
				<Card class="transition-shadow hover:shadow-md">
					<CardContent class="pt-6">
						<h2 class="text-lg font-semibold">{post.title}</h2>
						<p class="text-muted-foreground line-clamp-2 text-sm">{post.content}</p>
						<p class="text-muted-foreground mt-2 text-xs">
							@{post.user?.username} · {post.comments?.length ?? 0} comments
						</p>
					</CardContent>
				</Card>
			</a>
		{/each}
	</div>
</div>
