import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
	const userRole = useSelector((state) => state.auth.currentUser?.role);
	const location = useLocation();

	if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
		return children;
	}

	return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
