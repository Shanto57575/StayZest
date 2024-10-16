import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { axiosInstance } from "../hooks/useAxiosInterceptor";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { useDispatch } from "react-redux";
import { refreshToken } from "../features/auth/authSlice";

const PrivateRoutes = ({ children }) => {
	const [auth, setAuth] = useState(null);

	const dispatch = useDispatch();

	const checkAuthentication = async () => {
		try {
			const response = await axiosInstance.get("/api/auth/check");
			if (response.status === 200) {
				setAuth(true);
			}
		} catch (error) {
			if (error.response && error.response.status === 401) {
				const refreshResponse = await dispatch(refreshToken());
				if (refreshResponse.error) {
					setAuth(false);
				} else {
					await checkAuthentication();
				}
			} else {
				setAuth(false);
			}
		}
	};

	useEffect(() => {
		checkAuthentication();
	}, []);

	if (auth === null)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="relative w-24 h-24">
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
					<FlightTakeoffIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
				</div>
			</div>
		);

	return auth ? children : <Navigate to="/signin" />;
};

export default PrivateRoutes;
