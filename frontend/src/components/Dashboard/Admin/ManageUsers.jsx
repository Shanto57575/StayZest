import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../Loader";

const ManageUsers = () => {
	const [users, setusers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/user/allusers",
					{
						withCredentials: true,
					}
				);
				setusers(response.data);
				console.log(response);
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch Users. Please try again later.");
				setLoading(false);
			}
		};

		fetchAllUsers();
	}, []);

	const handleRoles = async (userId) => {
		try {
			const response = await axios.put(
				`http://localhost:5000/api/user/${userId}`,
				{ role: "ADMIN" },
				{
					withCredentials: true,
				}
			);

			const updateUser = users.map((user) =>
				user._id === userId ? { ...user, role: "ADMIN" } : user
			);
			setusers(updateUser);
			console.log(updateUser);
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch bookings. Please try again later.");
			setLoading(false);
		}
	};

	console.log(users);
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
									<td
										onClick={() => handleRoles(user._id)}
										className={`px-2 py-1 mt-7 inline-flex text-xs leading-5 font-semibold rounded ${
											user.role === "GUEST"
												? "bg-rose-200 text-rose-700 cursor-pointer"
												: user.role === "ADMIN"
												? "bg-green-200 text-green-700 hover:bg-green-300 cursor-not-allowed"
												: "bg-red-100 text-red-800"
										}`}
									>
										{user.role}
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
