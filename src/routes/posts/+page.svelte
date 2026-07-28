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
		image_url?: string | null;
		user?: { username: string };
		comments?: unknown[];
	}

	let posts = $state<Post[]>([]);
	let title = $state('');
	let content = $state('');
	let loading = $state(true);
	let imageUrl = $state('');
	let uploading = $state(false);
	let uploadError = $state<string | null>(null);
	let imageInput = $state<HTMLInputElement | null>(null);

	async function fetchPosts() {
		try {
			const res = await api.post.getAllPosts();
			posts = res.data.data.posts;
		} finally {
			loading = false;
		}
	}

	onMount(fetchPosts);

	async function onImagePicked(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		uploadError = null;
		try {
			const res = await api.upload.uploadImage(file);
			imageUrl = res.data.data.url;
		} catch {
			uploadError = 'Upload failed';
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	async function createPost(e: SubmitEvent) {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;
		await api.post.createPost({ title, content, ...(imageUrl ? { image_url: imageUrl } : {}) });
		title = '';
		content = '';
		imageUrl = '';
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
				<div class="flex items-center gap-3">
					<input
						bind:this={imageInput}
						type="file"
						accept="image/png,image/jpeg,image/webp,image/gif"
						class="hidden"
						onchange={onImagePicked}
					/>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={uploading}
						onclick={() => imageInput?.click()}
					>
						{uploading ? 'Uploading…' : imageUrl ? 'Replace image' : 'Add image'}
					</Button>
					{#if imageUrl}
						<Button type="button" variant="ghost" size="sm" onclick={() => (imageUrl = '')}>
							Remove
						</Button>
					{/if}
				</div>
				{#if imageUrl}
					<img
						src={imageUrl}
						alt="Selected preview"
						class="max-h-40 rounded-md border object-cover"
					/>
				{/if}
				{#if uploadError}
					<p class="text-destructive text-sm">{uploadError}</p>
				{/if}
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
						{#if post.image_url}
							<img
								src={post.image_url}
								alt={post.title}
								class="mt-2 max-h-64 w-full rounded-md border object-cover"
							/>
						{/if}
						<p class="text-muted-foreground mt-2 text-xs">
							@{post.user?.username} · {post.comments?.length ?? 0} comments
						</p>
					</CardContent>
				</Card>
			</a>
		{/each}
	</div>
</div>
