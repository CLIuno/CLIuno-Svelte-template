import http from '$lib/apis/http';

const uploadApi = {
	// Content-Type is left undefined on purpose: the instance default is
	// application/json, and only the browser can add the multipart boundary.
	uploadImage: (file: File) => {
		const form = new FormData();
		form.append('file', file);
		return http.post('/uploads/image', form, {
			headers: { 'Content-Type': undefined }
		});
	}
};

export default uploadApi;
