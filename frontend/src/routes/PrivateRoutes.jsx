import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoutes = () => {
	const { currentUser, loading } = useSelector((state) => state.auth);
	const location = useLocation();

	if (currentUser === null || currentUser === undefined) {
		return <Navigate to="/signin" state={{ from: location }} replace />;
	}

	if (loading) return <p className="font-serif text-4xl">Loading....</p>;

	if (!currentUser)
		<Navigate to="/signin" state={{ from: location }} replace />;

	return <Outlet />;
};

export default PrivateRoutes;
