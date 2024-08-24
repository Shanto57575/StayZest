import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Fade } from "react-awesome-reveal";
import {
	Person,
	Book,
	SupervisorAccount,
	Home,
	Group,
} from "@mui/icons-material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

const API_BASE_URL = "http://localhost:5000/api";

const StatCard = ({ icon: Icon, title, value, bgColor, color }) => (
	<Fade>
		<div
			className={`${bgColor} ${color} rounded-lg shadow-md shadow-white hover:shadow-xl p-4 font-serif`}
		>
			<div className="flex flex-col items-center justify-center">
				<Icon className="mb-2 text-4xl" />
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

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/user/alluserswithbookingcount`,
					{ withCredentials: true }
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

	const handleRoleChange = async (username, userId, newRole) => {
		try {
			const response = await axios.put(
				`${API_BASE_URL}/user/${userId}`,
				{ role: newRole },
				{ withCredentials: true }
			);

			if (response.data) {
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user._id === userId ? { ...user, role: newRole } : user
					)
				);
				toast.success(
					<h1 className="font-serif">
						{username} is now an {newRole}
					</h1>,
					{
						position: "top-center",
					}
				);
			}
		} catch (err) {
			toast.error("Failed to update user role. Please try again later.");
		}
	};

	const totalUsers = users.length;
	const totalAdmin = users.filter((user) => user.role === "ADMIN").length;
	const totalHost = users.filter((user) => user.role === "HOST").length;
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
					<FlightTakeoffIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
				</div>
			</div>
		);

	if (error)
		return (
			<p className="text-center text-rose-600 font-serif h-screen text-3xl flex justify-center items-center">
				{error}
			</p>
		);

	return (
		<div className="container mx-auto p-4">
			<Fade cascade>
				<h1 className="text-3xl font-bold mb-8 font-serif">Manage Users</h1>
			</Fade>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
				<StatCard
					icon={Group}
					title="Total Users"
					value={totalUsers}
					bgColor="bg-blue-200"
					color="text-blue-600"
				/>
				<StatCard
					icon={Book}
					title="Total Bookings"
					value={totalBookings}
					bgColor="bg-pink-200"
					color="text-pink-600"
				/>
				<StatCard
					icon={SupervisorAccount}
					title="Total Admin"
					value={totalAdmin}
					bgColor="bg-cyan-200"
					color="text-cyan-600"
				/>
				<StatCard
					icon={Home}
					title="Total Host"
					value={totalHost}
					bgColor="bg-green-200"
					color="text-green-600"
				/>
				<StatCard
					icon={Person}
					title="Total Guest"
					value={totalGuest}
					bgColor="bg-orange-200"
					color="text-orange-600"
				/>{" "}
			</div>
			<div className="overflow-x-auto font-serif">
				<table className="min-w-full shadow-2xl shadow-black">
					<thead className="text-center">
						<tr>
							<th className="px-6 py-3 text-xs font-medium  uppercase tracking-wider">
								userImage
							</th>
							<th className="px-6 py-3 text-xs font-medium  uppercase tracking-wider">
								username
							</th>
							<th className="px-6 py-3  text-xs font-medium  uppercase tracking-wider">
								email
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
										<img
											className="h-12 w-12 rounded-full text-center mx-auto"
											src={user.profilePicture}
											// src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
											alt=""
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap italic">
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
												handleRoleChange(
													user.username,
													user._id,
													e.target.value
												)
											}
											className={`px-2 py-1 mt-7 inline-flex text-xs leading-5 font-semibold rounded cursor-pointer ${
												user.role === "GUEST"
													? "bg-rose-200 text-rose-700"
													: user.role === "ADMIN"
													? "bg-green-200 text-green-700"
													: "bg-sky-200 text-sky-700"
											}`}
										>
											<option value="GUEST">Guest</option>
											<option value="HOST">Host</option>
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
