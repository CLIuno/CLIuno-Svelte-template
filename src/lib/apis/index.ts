import userApi from './user-api';
import authApi from './auth-api';
import todoApi from './todo-api';
import followApi from './follow-api';
import postApi from './post-api';

const api = {
	user: userApi,
	auth: authApi,
	todo: todoApi,
	follow: followApi,
	post: postApi
};

export default api;
