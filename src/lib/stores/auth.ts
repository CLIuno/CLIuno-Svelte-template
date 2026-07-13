import axios from 'axios';
import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';

import api from '$lib/apis';

export interface User {
	id: string | number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
}

export const user = writable<User | null>(null);
export const isAuthenticated = writable(false);
export const authError = writable<string | null>(null);
export const authLoading = writable(false);

export function hydrate() {
	if (!browser) return;
	const token = localStorage.getItem('token');
	isAuthenticated.set(!!token);
	if (token) void fetchCurrentUser();
}

export function clearAuth() {
	if (browser) {
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
	}
	user.set(null);
	isAuthenticated.set(false);
}

export async function login(usernameOrEmail: string, password: string) {
	authLoading.set(true);
	authError.set(null);
	try {
		const res = await api.auth.login({ usernameOrEmail, password });
		const data = res.data.data;
		localStorage.setItem('token', data.token);
		localStorage.setItem('refreshToken', data.refreshToken);
		user.set(data.user);
		isAuthenticated.set(true);
	} catch (err: unknown) {
		authError.set(
			axios.isAxiosError(err) ? err.response?.data?.message || 'Login failed' : 'Login failed'
		);
		throw err;
	} finally {
		authLoading.set(false);
	}
}

export async function register(userData: {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	phone: string;
	password: string;
	password_confirmation: string;
}) {
	authLoading.set(true);
	authError.set(null);
	try {
		await api.auth.register(userData);
	} catch (err: unknown) {
		authError.set(
			axios.isAxiosError(err)
				? err.response?.data?.message || 'Registration failed'
				: 'Registration failed'
		);
		throw err;
	} finally {
		authLoading.set(false);
	}
}

export async function logout() {
	try {
		await api.auth.logout();
	} catch {
		// ignore network failures on logout
	} finally {
		clearAuth();
	}
}

export async function fetchCurrentUser() {
	if (!get(isAuthenticated)) return;
	try {
		const res = await api.user.getCurrentUser();
		user.set(res.data.data.user);
	} catch {
		clearAuth();
	}
}
