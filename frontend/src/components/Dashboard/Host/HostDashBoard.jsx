import { Routes, Route } from "react-router-dom";
import ProfilePage from "../ProfilePage";
import HostHome from "./HostHome";

const HostDashboard = () => {
	return (
		<Routes>
			<Route path="/" element={<HostHome />} />
			<Route path="profile" element={<ProfilePage />} />
		</Routes>
	);
};

export default HostDashboard;
