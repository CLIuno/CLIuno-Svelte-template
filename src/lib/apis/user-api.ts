import http from '$lib/apis/http';

const userApi = {
	getCurrentUser: () => http.get('/users/current'),
	updateCurrentUser: (userData: Record<string, unknown>) => http.patch('/users/current', userData),
	getUsers: () => http.get('/users'),
	getUserById: (id: string) => http.get(`/users/${id}`)
};

export default userApi;
