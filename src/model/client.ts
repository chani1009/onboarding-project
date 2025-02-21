import axios from "axios";
// import { deleteCookie } from "cookies-next";

const staffClient = axios.create({
	baseURL: `https://picsum.photos/v2/`,
});

// 응답 가로채기: 401 오류 처리 및 토큰 갱신
staffClient.interceptors.response.use(
	(response) => response, // 성공한 응답은 그대로 반환
	async (error) => {
		const originalRequest = error.config;

		// 토큰 만료로 인한 401 처리
		// if (error.response?.status === 401 && !originalRequest._retry) {
		// 	originalRequest._retry = true; // 무한 루프 방지
		//
		// 	deleteCookie(COOKIE_SESSION_ID);
		// 	// window.location.reload();
		//
		// 	return Promise.reject(error); // 401 에러 전달
		// }

		// 401 이외의 모든 에러는 그대로 전달
		return Promise.reject(error);
	},
);

export default staffClient;
