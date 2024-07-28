import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../Loader";
import toast, { Toaster } from "react-hot-toast";

const ManageUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/user/alluserswithbookingcount",
					{
						withCredentials: true,
					}
				);
				setUsers(response.data);
				console.log(response);
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
			// await axios.put(
			// 	`http://localhost:5000/api/user/${userId}`,
			// 	{ role: newRole },
			// 	{
			// 		withCredentials: true,
			// 	}
			// );

			const updatedUsers = users.map((user) =>
				user._id === userId ? { ...user, role: newRole } : user
			);
			setUsers(updatedUsers);
			toast.success(`${username} is an ${newRole} Now!`, {
				iconTheme: {
					primary: "#ffffff",
					secondary: "blue",
				},
				duration: 3000,
				position: "bottom-right",
				className: "bg-sky-600 text-white",
			});
		} catch (err) {
			setError("Failed to update user role. Please try again later.");
		}
	};

	if (loading) return <Loader />;
	if (error)
		return (
			<div className="text-center mt-8 text-red-500 font-serif h-screen">
				{error}
			</div>
		);

	return (
		<div className="container mx-auto p-4 h-screen">
			<h1 className="text-2xl font-bold mb-4 font-serif text-center underline">
				Total Users : {users?.length}
			</h1>
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
											src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
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
										<Toaster />
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
