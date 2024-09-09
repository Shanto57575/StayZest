import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { logout, refreshToken } from "../features/auth/authSlice";
import { BiSolidError } from "react-icons/bi";

export const axiosInstance = axios.create({
	baseURL: "https://stayzest-backend.onrender.com",
	withCredentials: true,
});

const useAxiosInterceptor = () => {
	const dispatch = useDispatch();
	const { isRefreshing } = useSelector((state) => state.auth);
	const isLoggingOut = useRef(false);

	useEffect(() => {
		const requestInterceptor = axiosInstance.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					const accessToken = document.cookie
						.split("; ")
						.find((row) => row.startsWith("accessToken="))
						?.split("=")[1];
					if (accessToken) {
						config.headers["Authorization"] = `Bearer ${accessToken}`;
					}
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseInterceptor = axiosInstance.interceptors.response.use(
			(response) => {
				if (response.status === 200 && response.data.message) {
					if (response.data.message === "Access token refreshed successfully") {
						console.log("OK");
					} else {
						setTimeout(() => {
							toast.success(
								<h1 className="font-serif">{response.data.message}</h1>
							);
						}, 1000);
					}
				}
				return response;
			},
			async (error) => {
				const originalRequest = error.config;

				if (error.response.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;

					if (!isRefreshing) {
						try {
							await dispatch(refreshToken()).unwrap();
							return axiosInstance(originalRequest);
						} catch (refreshError) {
							if (!isLoggingOut.current) {
								isLoggingOut.current = true;
								dispatch(logout());
								toast(
									<h1 className="flex items-center gap-x-3 font-serif text-center py-1">
										<BiSolidError color="red" size={25} />
										<div>
											<p>Session Expired</p>
											<p>Please login again to continue...</p>
										</div>
									</h1>
								);
								setTimeout(() => {
									isLoggingOut.current = false;
								}, 5000); // Reset after 5 seconds
							}
							return Promise.reject(refreshError);
						}
					} else {
						return new Promise((resolve) => {
							const intervalId = setInterval(() => {
								if (!isRefreshing) {
									clearInterval(intervalId);
									resolve(axiosInstance(originalRequest));
								}
							}, 100);
						});
					}
				}

				if (error.response) {
					const { status, data } = error.response;

					if (status === 404 || status === 403) {
						toast.error(
							<h1 className="font-serif">
								{data.error || "Resource Not Found"}
							</h1>
						);
					}
				} else {
					toast.error(
						<h1 className="font-serif">
							Network error. Please check your connection
						</h1>
					);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosInstance.interceptors.request.eject(requestInterceptor);
			axiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}, [dispatch, isRefreshing]);

	return axiosInstance;
};

export default useAxiosInterceptor;
