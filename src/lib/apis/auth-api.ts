import http from '$lib/apis/http';

const authApi = {
	login: (credentials: { usernameOrEmail: string; password: string }) =>
		http.post('/auth/login', credentials),
	register: (userData: {
		first_name: string;
		last_name: string;
		username: string;
		email: string;
		phone: string;
		password: string;
		password_confirmation: string;
	}) => http.post('/auth/register', userData),
	logout: () => http.post('/auth/logout'),
	forgotPassword: (email: string) => http.post('/auth/forgot-password', { email })
};

export default authApi;
