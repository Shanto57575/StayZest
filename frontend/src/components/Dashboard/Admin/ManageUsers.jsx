import { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { Person, Group } from "@mui/icons-material";
import { FaUsers, FaUserShield, FaExclamationTriangle } from "react-icons/fa";
import { IoMdBookmarks } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/auth/authSlice";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";

const StatCard = ({ icon: Icon, title, value, bgColor, color }) => (
	<Fade>
		<div
			className={`${bgColor} ${color} rounded-lg shadow-md shadow-white hover:shadow-xl p-4 font-serif`}
		>
			<div className="flex flex-col items-center justify-center">
				<Icon size={24} className="mb-2 text-4xl" />
				<h3 className="text-lg font-semibold mb-1">{title}</h3>
				<p className="text-2xl font-bold">{value}</p>
			</div>
		</div>
	</Fade>
);
const ManageUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { currentUser } = useSelector((state) => state.auth);
	const axiosInstance = useAxiosInterceptor();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const response = await axiosInstance.get(
					"/api/user/alluserswithbookingcount"
				);
				setUsers(response.data);
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch Users. Please try again later.");
				setLoading(false);
			}
		};

		fetchAllUsers();
	}, []);

	const handleRoleChange = async (userId, newRole) => {
		try {
			const response = await axiosInstance.patch(`/api/user/${userId}`, {
				role: newRole,
			});
			if (response.data) {
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user._id === userId ? { ...user, role: newRole } : user
					)
				);

				if (userId === currentUser._id && newRole !== "ADMIN") {
					dispatch(logout());
				}
			}
		} catch (err) {}
	};

	const totalUsers = users.length;
	const totalAdmin = users.filter((user) => user.role === "ADMIN").length;
	const totalGuest = users.filter((user) => user.role === "GUEST").length;
	const totalBookings = users.reduce(
		(total, user) => total + user.bookingCount,
		0
	);

	if (loading)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="relative w-24 h-24">
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
					<FaUsers className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
				</div>
			</div>
		);

	if (error)
		return (
			<div className="h-screen flex items-center text-center justify-center font-serif">
				<div className="text-center">
					<FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
					<h2 className="text-2xl font-bold mb-2">Oops!</h2>
					<h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
					<p className="text-gray-600 dark:text-gray-400">{error}</p>
				</div>
			</div>
		);

	return (
		<div className="container mx-auto p-4">
			<Fade cascade>
				<h1 className="text-3xl font-bold mb-8 font-serif">Manage Users</h1>
			</Fade>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				<StatCard
					icon={Group}
					title="Total Users"
					value={totalUsers}
					bgColor="bg-cyan-200"
					color="text-cyan-600"
				/>
				<StatCard
					icon={IoMdBookmarks}
					title="Total Bookings"
					value={totalBookings}
					bgColor="bg-amber-200"
					color="text-amber-600"
				/>
				<StatCard
					icon={FaUserShield}
					title="Total Admin"
					value={totalAdmin}
					bgColor="bg-emerald-200"
					color="text-emerald-600"
				/>
				<StatCard
					icon={Person}
					title="Total Guest"
					value={totalGuest}
					bgColor="bg-rose-200"
					color="text-rose-600"
				/>
			</div>
			<div className="overflow-x-auto font-serif">
				<table className="min-w-full shadow-2xl shadow-black">
					<thead className="text-center">
						<tr>
							<th className="px-6 py-3 text-xs font-medium  uppercase tracking-wider">
								userImage
							</th>
							<th className="px-6 py-3 text-xs font-medium  uppercase tracking-wider">
								userName
							</th>
							<th className="px-6 py-3  text-xs font-medium  uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3  text-xs font-medium  uppercase tracking-wider">
								Total Bookings
							</th>
							<th className="px-6 py-3  text-xs font-medium  uppercase tracking-wider">
								role
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 text-center">
						{users &&
							users.map((user) => (
								<tr key={user._id}>
									<td className="px-6 py-4 whitespace-nowrap">
										<Tooltip title={user.username} placement="top">
											<img
												className="h-12 w-12 rounded-full text-center mx-auto"
												// src={user.profilePicture}
												src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
												alt=""
											/>
										</Tooltip>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										{user.username}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{user.bookingCount}
									</td>
									<td>
										<select
											value={user.role}
											onChange={(e) =>
												handleRoleChange(user._id, e.target.value)
											}
											className={`px-2 py-1 mt-7 inline-flex text-xs leading-5 font-semibold rounded cursor-pointer ${
												user.role === "GUEST"
													? "bg-rose-200 text-rose-700"
													: "bg-green-200 text-green-700"
											}`}
										>
											<option value="GUEST">Guest</option>
											<option value="ADMIN">Admin</option>
										</select>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageUsers;
