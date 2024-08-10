import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Fade } from "react-awesome-reveal";
import { ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";

const StatCard = ({ title, value, icon: Icon, bgColor }) => (
	<div className={`${bgColor} text-white rounded-lg shadow-md p-4`}>
		<div className="flex justify-between items-center mb-2">
			<h3 className="text-sm font-medium">{title}</h3>
			<Icon className="h-5 w-5 opacity-70" />
		</div>
		<p className="text-2xl font-bold">{value}</p>
	</div>
);

const ManageBookings = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/booking/all-Bookings",
					{ withCredentials: true }
				);
				setBookings(response.data);
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch bookings. Please try again later.");
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);

	const handleStatus = async (bookingId) => {
		try {
			await axios.put(
				`http://localhost:5000/api/booking/${bookingId}`,
				{ status: "CONFIRMED" },
				{ withCredentials: true }
			);

			setBookings(
				bookings.map((booking) =>
					booking._id === bookingId
						? { ...booking, status: "CONFIRMED" }
						: booking
				)
			);

			toast.success("Booking confirmed successfully");
		} catch (err) {
			toast.error("Failed to confirm booking");
		}
	};

	const handleCancelBooking = async (bookingId) => {
		try {
			await axios.delete(`http://localhost:5000/api/booking/${bookingId}`, {
				withCredentials: true,
			});

			setBookings(bookings.filter((booking) => booking._id !== bookingId));
			toast.success("Booking has been cancelled", {
				icon: "🗑️",
				duration: 3000,
				className: "bg-rose-600 text-white",
			});
		} catch (err) {
			toast.error("Failed to cancel booking");
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-center h-screen">
				<ThreeDots color="#00BFFF" height={80} width={80} />
			</div>
		);

	if (error)
		return (
			<p className="text-center text-rose-500 font-serif h-screen text-3xl flex justify-center items-center">
				{error}
			</p>
		);

	const totalBookings = bookings.length;
	const pendingBookings = bookings.filter(
		(booking) => booking.status === "PENDING"
	).length;
	const confirmedBookings = bookings.filter(
		(booking) => booking.status === "CONFIRMED"
	).length;
	const totalCollection = bookings.reduce(
		(total, booking) => total + booking.price,
		0
	);

	return (
		<Fade>
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold font-serif mb-6">Manage Bookings</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-serif">
					<StatCard
						title="Total Bookings"
						value={totalBookings}
						icon={PendingIcon}
						bgColor="bg-blue-500"
					/>
					<StatCard
						title="Total Collection"
						value={`$${totalCollection}`}
						icon={CheckCircleOutlineIcon}
						bgColor="bg-indigo-400"
					/>
					<StatCard
						title="Pending Bookings"
						value={pendingBookings}
						icon={PendingIcon}
						bgColor="bg-yellow-500"
					/>
					<StatCard
						title="Confirmed Bookings"
						value={confirmedBookings}
						icon={CheckCircleOutlineIcon}
						bgColor="bg-green-500"
					/>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full mx-auto font-serif bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
						<thead className="bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
							<tr>
								<th className="py-3 px-4 text-center">Action</th>
								<th className="py-3 px-4 text-center">Place</th>
								<th className="py-3 px-4 text-center">CheckIn</th>
								<th className="py-3 px-4 text-center">CheckOut</th>
								<th className="py-3 px-4 text-center">Price</th>
								<th className="py-3 px-4 text-center">User</th>
								<th className="py-3 px-4 text-center">Status</th>
								<th className="py-3 px-4 text-center">Booking Date</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-center">
							{bookings.map((booking) => (
								<tr
									key={booking._id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="py-3 px-4">
										<button
											onClick={() => handleCancelBooking(booking._id)}
											className="text-rose-600 hover:text-rose-800"
										>
											<HighlightOffIcon />
										</button>
									</td>
									<td className="py-3 px-4 flex items-center space-x-2">
										<img
											className="h-14 w-14 rounded-md object-cover"
											src={booking.place?.photos[0] || booking.place?.photos[1]}
											alt={booking.place?.title}
										/>
										<span className="text-xs">{booking.place?.title}</span>
									</td>
									<td className="py-3 px-4 text-sm">
										{format(new Date(booking.checkIn), "MMM dd, yyyy")}
									</td>
									<td className="py-3 px-4 text-sm">
										{format(new Date(booking.checkOut), "MMM dd, yyyy")}
									</td>
									<td className="py-3 px-4">${booking.price}</td>
									<td className="py-3 px-4">
										<p className="font-bold">{booking.user?.username}</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{booking.email}
										</p>
									</td>
									<td className="py-3 px-4">
										<span
											onClick={() => handleStatus(booking._id)}
											className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${
												booking.status === "PENDING"
													? "bg-yellow-200 text-yellow-800"
													: "bg-green-200 text-green-800"
											}`}
										>
											{booking.status}
										</span>
									</td>
									<td className="py-3 px-4 text-sm">
										{format(new Date(booking.createdAt), "MMM dd, yyyy")}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Toaster />
			</div>
		</Fade>
	);
};

export default ManageBookings;
