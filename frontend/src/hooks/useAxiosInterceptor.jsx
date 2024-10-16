import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { BiSolidError } from "react-icons/bi";
import { logout, refreshToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export const axiosInstance = axios.create({
	baseURL: "https://stayzest-backend.onrender.com",
	withCredentials: true,
});

const useAxiosInterceptor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const responseInterceptor = axiosInstance.interceptors.response.use(
			(response) => {
				if (response.data.message == "Access token refreshed successfully") {
					return response;
				}
				if (
					response.data.message &&
					response.config.showSuccessToast !== false
				) {
					toast.success(
						<h1 className="font-serif">{response.data.message}</h1>
					);
				}

				return response;
			},
			async (error) => {
				console.log("Error in interceptor", error);
				const originalRequest = error.config;

				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;

					try {
						await dispatch(refreshToken()).unwrap();
						return axiosInstance(originalRequest);
					} catch (refreshError) {
						console.log("refreshError", refreshError);
						dispatch(logout());
						navigate("/signin");
						toast(
							<h1 className="flex items-center gap-x-3 font-serif text-center py-1">
								<BiSolidError color="red" size={25} />
								<div>
									<p>Session Expired</p>
									<p>Please login again to continue...</p>
								</div>
							</h1>
						);
						return Promise.reject(refreshError);
					}
				}

				if (error.response && originalRequest.showErrorToast !== false) {
					toast.error(
						<h1 className="font-serif">
							{error.response.data.error || "An error occurred"}
						</h1>
					);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}, [dispatch]);

	return axiosInstance;
};

export default useAxiosInterceptor;
