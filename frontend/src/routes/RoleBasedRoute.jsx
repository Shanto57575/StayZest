import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ roles, children }) => {
	const userRole = useSelector((state) => state.auth.currentUser?.role);

	if (!roles || !userRole || !roles.includes(userRole)) {
		return <Navigate to="/" replace={true} />;
	}

	return children;
};

export default RoleBasedRoute;
