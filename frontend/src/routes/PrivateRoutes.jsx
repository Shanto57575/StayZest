import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/Loader";

const PrivateRoutes = () => {
	const { user, loading } = useSelector((state) => state.auth);
	const location = useLocation();

	if (loading) return <Loader />;

	return user ? (
		<Outlet />
	) : (
		<Navigate to="/signin" state={{ from: location }} replace />
	);
};

export default PrivateRoutes;
