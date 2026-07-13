import http from '$lib/apis/http';

const todoApi = {
	getAllTodos: () => http.get('/todos'),
	getTodoById: (id: string) => http.get(`/todos/${id}`),
	createTodo: (data: { title: string; description?: string }) => http.post('/todos', data),
	updateTodo: (id: string, data: { title?: string; description?: string }) =>
		http.patch(`/todos/${id}`, data),
	deleteTodo: (id: string) => http.delete(`/todos/${id}`),
	toggleTodo: (id: string) => http.patch(`/todos/${id}/toggle`)
};

export default todoApi;
