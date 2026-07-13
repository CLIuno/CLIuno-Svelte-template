import http from '$lib/apis/http';

const postApi = {
	getCurrentUserPosts: () => http.get('/posts/current-user'),
	getAllPosts: () => http.get('/posts'),
	getPostById: (id: string) => http.get(`/posts/${id}`),
	createPost: (postData: any) => http.post('/posts', postData),
	updatePostById: (id: string, postData: any) => http.patch(`/posts/${id}`, postData),
	deletePostById: (id: string) => http.delete(`/posts/${id}`),
	getUsersByPost: (postId: string) => http.get(`/posts/${postId}/user`),
	getComments: (postId: string) => http.get(`/posts/${postId}/comments`),
	createComment: (postId: string, data: { content: string }) =>
		http.post(`/posts/${postId}/comments`, data),
	updateComment: (postId: string, commentId: string, data: { content: string }) =>
		http.patch(`/posts/${postId}/comments/${commentId}`, data),
	deleteComment: (postId: string, commentId: string) =>
		http.delete(`/posts/${postId}/comments/${commentId}`)
};

export default postApi;
