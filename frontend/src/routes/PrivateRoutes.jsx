import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

const PrivateRoutes = () => {
	const { currentUser, loading, isRefreshing } = useSelector(
		(state) => state.auth
	);
	const location = useLocation();

	if (loading || isRefreshing)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="relative w-24 h-24">
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
					<FlightTakeoffIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
				</div>
			</div>
		);

	if (!currentUser) {
		return <Navigate to="/signin" state={{ from: location }} replace />;
	}

	return <Outlet />;
};

export default PrivateRoutes;
