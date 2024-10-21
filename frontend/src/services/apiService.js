import axios from 'axios';
import dayjs from 'dayjs';
import {jwtDecode} from 'jwt-decode';
import {useAuthStore} from "@/store/auth.js";

let     accessToken = localStorage.getItem("access");

const   apiClient = axios.create({
	baseURL: 'https://localhost:8443',
	headers: {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use(async (request) => {
	const   authStore = useAuthStore();
	if (!accessToken) {
		accessToken = localStorage.getItem("access");
		request.headers.Authorization = `Bearer ${accessToken}`;
	}
	const   tokenInfo = jwtDecode(accessToken);
	const   isExpired = dayjs.unix(tokenInfo.exp).diff(dayjs()) < 1;
	console.log("Is token expired? " + isExpired);
	if (!isExpired)
	{
		request.headers.Authorization = `Bearer ${accessToken}`;
		return  request;
	}
	const   response = await axios.post(
		'http://localhost:8000/api/authentication/refresh/',
		{
			refresh: authStore.refresh_token,
		},
	);
	authStore.setAccessToken(response.data.access);
	authStore.setRefreshToken(response.data.refresh);
	request.headers.Authorization = `Bearer ${response.data.access}`;
	return request;
});

export default apiClient;
