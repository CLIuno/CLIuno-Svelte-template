<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { hydrate, isAuthenticated, logout, user } from '$lib/stores/auth';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import UserIcon from '@lucide/svelte/icons/user';
	import '../app.css';

	let { children } = $props();

	onMount(hydrate);

	async function onLogout() {
		await logout();
		goto('/login');
	}
</script>

<ParaglideJS {i18n}>
	<div class="bg-background text-foreground min-h-screen">
		<nav class="bg-background/95 sticky top-0 z-40 border-b backdrop-blur-sm">
			<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
				<div class="flex items-center gap-6">
					<a href="/" class="text-lg font-bold tracking-tight">CLIuno</a>
					{#if $isAuthenticated}
						<div class="flex items-center gap-4">
							<a
								href="/todos"
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								Todos
							</a>
							<a
								href="/posts"
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								Posts
							</a>
							<a
								href="/users"
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								Users
							</a>
						</div>
					{/if}
				</div>
				<div class="flex items-center gap-3">
					{#if $isAuthenticated}
						<DropdownMenu>
							<DropdownMenuTrigger
								class="focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
							>
								<Avatar>
									<AvatarFallback>
										{$user?.username?.[0]?.toUpperCase() ?? '?'}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>{$user?.username ?? 'Account'}</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={() => goto('/profile')}>
									<UserIcon />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem variant="destructive" onSelect={onLogout}>
									<LogOutIcon />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					{:else}
						<Button href="/login" variant="ghost" size="sm">Login</Button>
						<Button href="/register" size="sm">Register</Button>
					{/if}
				</div>
			</div>
		</nav>
		<main>
			{@render children()}
		</main>
	</div>
</ParaglideJS>
