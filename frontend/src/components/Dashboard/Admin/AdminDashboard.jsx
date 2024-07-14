import { Route, Routes } from "react-router-dom";
import AdminHome from "./AdminHome";
import ManageUsers from "./ManageUsers";
import ManagePlaces from "./ManagePlaces";
import ManageBookings from "./ManageBookings";
import ProfilePage from "../ProfilePage";

const AdminDashboard = () => {
	return (
		<Routes>
			<Route path="/" element={<AdminHome />} />
			<Route path="/manage-users" element={<ManageUsers />} />
			<Route path="/profile" element={<ProfilePage />} />
			<Route path="/manage-places" element={<ManagePlaces />} />
			<Route path="/manage-bookings" element={<ManageBookings />} />
		</Routes>
	);
};

export default AdminDashboard;
