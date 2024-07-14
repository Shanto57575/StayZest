import { Routes, Route } from "react-router-dom";
import UserHome from "./UserHome";
import ProfilePage from "../ProfilePage";
import UserBookings from "./UserBookings";

const UserDashboard = () => {
	return (
		<Routes>
			<Route path="/" element={<UserHome />} />
			<Route path="profile" element={<ProfilePage />} />
			<Route path="bookings" element={<UserBookings />} />
		</Routes>
	);
};

export default UserDashboard;
