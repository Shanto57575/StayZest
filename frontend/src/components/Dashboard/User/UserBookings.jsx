import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import PersonIcon from "@mui/icons-material/Person";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckIcon from "@mui/icons-material/Check";

const UserBookings = () => {
	const user = useSelector((state) => state.auth.currentUser);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`http://localhost:5000/api/booking/${user?.email}`,
					{ withCredentials: true }
				);
				setBookings(response.data);
				setLoading(false);
				setError(null);
			} catch (err) {
				setError(
					err.response
						? err.response.data.error
						: "An unexpected error occurred"
				);
				setLoading(false);
				setBookings([]);
			}
		};
		if (user?.email) {
			fetchBookings();
		}
	}, [user?.email]);

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (loading)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		);

	return (
		<div className="container mx-auto py-8">
			{error && (
				<div
					className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
					role="alert"
				>
					<p className="font-bold">Error</p>
					<p>{error}</p>
				</div>
			)}

			{bookings.length > 0 ? (
				<>
					<h1 className="text-4xl font-bold mb-10 text-center font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
						My Bookings
					</h1>
					<div className="space-y-8">
						{bookings.map((booking) => (
							<div
								key={booking._id}
								className="bg-gray-200 hover:bg-gray-100 font-serif rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
							>
								<div className="md:flex">
									<div className="md:w-2/5 relative">
										{booking?.place?.photos &&
										booking.place.photos.length > 0 ? (
											<img
												src={booking.place.photos[0] || booking.place.photos[1]}
												alt={"image loading..."}
												className="w-full h-64 md:h-full object-cover"
											/>
										) : (
											<div className="w-full h-64 md:h-full bg-gray-300 flex items-center justify-center">
												<span className="text-gray-700 text-lg">
													No image available
												</span>
											</div>
										)}
										<div className="absolute top-0 right-0 m-4">
											{booking?.status === "CONFIRMED" ? (
												<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
													<CheckIcon className="w-4 h-4 mr-1" />
													Confirmed
												</span>
											) : (
												<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
													<WatchLaterIcon className="w-4 h-4 mr-1" />
													{booking?.status || "Pending"}
												</span>
											)}
										</div>
									</div>
									<div className="md:w-3/5 p-6 md:p-8">
										<h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-4">
											{booking?.place?.title || "Unnamed Booking"}
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
											<p className="flex items-center text-gray-600">
												<AddLocationAltIcon className="mr-2 text-blue-500" />
												{booking?.place?.location || "Location not specified"}
											</p>
											<p className="flex items-center text-gray-600">
												<MonetizationOnIcon className="mr-2 text-green-500" />
												{booking?.price || "Price not available"}
											</p>
											<p className="flex items-center text-gray-600">
												<PersonIcon className="mr-2 text-purple-500" />
												{booking?.guests || "N/A"} guests
											</p>
											<p className="flex items-center text-gray-600">
												<CalendarMonthIcon className="mr-2 text-orange-500" />
												{booking?.checkIn
													? formatDate(booking.checkIn)
													: "Check-in date not set"}
											</p>
											<p className="flex items-center text-gray-600">
												<CalendarMonthIcon className="mr-2 text-orange-500" />
												{booking?.checkIn
													? formatDate(booking.checkOut)
													: "Check-Out date not set"}
											</p>
										</div>
										<p className="border-b border-gray-400"></p>
										<div className="mt-4 pt-4 border-t border-gray-200">
											<p className="text-sm text-gray-500 italic">
												Booked on: {formatDate(booking.createdAt)}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			) : (
				<div className="text-center py-12 font-serif">
					<h2 className="text-3xl font-bold mb-4">No bookings Found!</h2>
					<p className="text-xl">
						Your adventure awaits! ✈️ Start planning your next getaway.
					</p>
				</div>
			)}
		</div>
	);
};

export default UserBookings;
