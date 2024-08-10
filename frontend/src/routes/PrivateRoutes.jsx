import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/Loader";

const PrivateRoutes = () => {
	const { currentUser, loading } = useSelector((state) => state.auth);
	const location = useLocation();

	if (currentUser === null || currentUser === undefined) {
		return <Navigate to="/signin" state={{ from: location }} replace />;
	}

	if (loading) return <Loader />;

	return currentUser ? (
		<Outlet />
	) : (
		<Navigate to="/signin" state={{ from: location }} replace />
	);
};

export default PrivateRoutes;
