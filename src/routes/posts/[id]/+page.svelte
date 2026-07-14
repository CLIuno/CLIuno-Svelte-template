<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/apis';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import Loader2 from '@lucide/svelte/icons/loader-2';

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
	<a
		href="/posts"
		class="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
	>
		← Back to posts
	</a>

	{#if post}
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl">{post.title}</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3">
				<p class="text-muted-foreground">{post.content}</p>
				{#if post.user}
					<p class="text-muted-foreground text-sm">@{post.user.username}</p>
				{/if}
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="text-base">Comments ({post.comments?.length ?? 0})</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<form onsubmit={addComment} class="flex gap-2">
					<Input bind:value={comment} placeholder="Write a comment…" required />
					<Button type="submit">Send</Button>
				</form>
				<Separator />
				<ul class="space-y-3">
					{#each post.comments ?? [] as c (c.id)}
						<li class="space-y-1">
							<p class="text-sm">{c.content}</p>
							{#if c.user}
								<p class="text-muted-foreground text-xs">— @{c.user.username}</p>
							{/if}
						</li>
					{/each}
				</ul>
			</CardContent>
		</Card>
	{:else}
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<Loader2 class="animate-spin" />
			Loading…
		</div>
	{/if}
</div>
