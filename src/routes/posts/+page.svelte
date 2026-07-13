<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/apis';

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
	<h1 class="text-3xl font-bold">Posts</h1>

	<form onsubmit={createPost} class="space-y-2 rounded bg-white p-4 shadow-sm">
		<input bind:value={title} placeholder="Post title" class="w-full rounded border p-2" required />
		<textarea
			bind:value={content}
			placeholder="What's on your mind?"
			class="w-full rounded border p-2"
			rows="3"
			required
		></textarea>
		<button class="rounded bg-blue-600 px-4 py-2 text-white">Publish</button>
	</form>

	{#if loading}<p>Loading…</p>{/if}
	{#if !loading && posts.length === 0}<p>No posts yet.</p>{/if}

	<div class="space-y-3">
		{#each posts as post (post.id)}
			<a href={`/posts/${post.id}`} class="block rounded bg-white p-4 shadow-sm hover:shadow">
				<h2 class="text-lg font-semibold">{post.title}</h2>
				<p class="line-clamp-2 text-sm text-gray-600">{post.content}</p>
				<p class="mt-2 text-xs text-gray-500">
					{post.user?.username} · {post.comments?.length ?? 0} comments
				</p>
			</a>
		{/each}
	</div>
</div>
