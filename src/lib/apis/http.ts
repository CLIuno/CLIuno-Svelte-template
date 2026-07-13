import axios from 'axios';
import { browser } from '$app/environment';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1';

const http = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' }
});

http.interceptors.request.use((config) => {
	const token = browser ? localStorage.getItem('token') : null;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (browser && error.response?.status === 401) {
			localStorage.removeItem('token');
			localStorage.removeItem('refreshToken');
			if (location.pathname !== '/login') {
				location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default http;
