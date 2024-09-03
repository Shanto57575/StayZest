import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { logout, signIn } from "../features/auth/authSlice";

export const axiosInstance = axios.create({
	baseURL: "https://stayzest-backend.onrender.com",
	withCredentials: true,
});

const useAxiosInterceptor = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const interceptor = axiosInstance.interceptors.response.use(
			(response) => {
				if (response.status === 200 && response.data.message) {
					setTimeout(() => {
						toast.success(
							<h1 className="font-serif">{response.data.message}</h1>
						);
					}, 1000);
				}
				return response;
			},
			(error) => {
				if (error.response) {
					if (error.response.status === 404) {
						toast.error(
							<h1 className="text-center font-serif">
								{error.response.data.error || "Resource not found"}
							</h1>
						);
					} else if (error.response.status === 401) {
						dispatch(signIn(null));
						dispatch(logout());
					}
				} else {
					toast.error(
						<h1 className="text-center font-serif">
							Network error. Please check your connection
						</h1>
					);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosInstance.interceptors.response.eject(interceptor);
		};
	}, [dispatch]);

	return axiosInstance;
};

export default useAxiosInterceptor;
