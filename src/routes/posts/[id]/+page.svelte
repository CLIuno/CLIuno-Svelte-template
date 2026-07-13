<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/apis';

	interface Comment {
		id: string | number;
		content: string;
		user?: { username: string };
	}

	interface Post {
		id: string | number;
		title: string;
		content: string;
		user?: { username: string };
		comments?: Comment[];
	}

	let post = $state<Post | null>(null);
	let comment = $state('');

	async function fetchPost() {
		const res = await api.post.getPostById($page.params.id);
		post = res.data.data.post;
	}

	onMount(fetchPost);

	async function addComment(e: SubmitEvent) {
		e.preventDefault();
		if (!comment.trim()) return;
		await api.post.createComment($page.params.id, { content: comment });
		comment = '';
		await fetchPost();
	}
</script>

<div class="mx-auto max-w-2xl space-y-4 px-4 py-8">
	<a href="/posts" class="text-sm underline">← Back to posts</a>

	{#if post}
		<div class="rounded bg-white p-6 shadow">
			<h1 class="text-2xl font-bold">{post.title}</h1>
			<p class="mt-2 text-gray-700">{post.content}</p>
			{#if post.user}<p class="mt-3 text-sm text-gray-500">by {post.user.username}</p>{/if}
		</div>

		<div class="space-y-3 rounded bg-white p-6 shadow">
			<h2 class="font-bold">Comments ({post.comments?.length ?? 0})</h2>
			<form onsubmit={addComment} class="flex gap-2">
				<input
					bind:value={comment}
					placeholder="Write a comment…"
					class="flex-1 rounded border p-2"
					required
				/>
				<button class="rounded bg-blue-600 px-4 text-white">Send</button>
			</form>
			<ul class="space-y-2">
				{#each post.comments ?? [] as c (c.id)}
					<li class="rounded bg-gray-100 p-3">
						<p class="text-sm">{c.content}</p>
						{#if c.user}<p class="mt-1 text-xs text-gray-500">— {c.user.username}</p>{/if}
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<p>Loading…</p>
	{/if}
</div>
