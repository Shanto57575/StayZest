import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const HostRoute = ({ children }) => {
	const userRole = useSelector((state) => state.auth.currentUser?.role);
	const location = useLocation();

	if (userRole === "HOST") {
		return children;
	}

	return <Navigate to="/" state={{ from: location }} replace={true} />;
};

export default HostRoute;
