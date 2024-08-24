import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import PersonIcon from "@mui/icons-material/Person";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import Alert from "@mui/material/Alert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useLocation } from "react-router-dom";

const UserBookings = () => {
	const location = useLocation();
	const user =
		location.state?.user || useSelector((state) => state.auth.currentUser);

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
	}, [user]);

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
				<div className="relative w-24 h-24">
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
					<FlightTakeoffIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
				</div>
			</div>
		);

	const getStatusColor = (status) => {
		switch (status) {
			case "CONFIRMED":
				return "bg-green-100 text-green-800 border-green-300";
			case "PENDING":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "CANCELLED":
				return "bg-red-100 text-red-800 border-red-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	};

	if (error) {
		return (
			<Alert className="mb-6 text-white bg-red-500">
				<p>Error : {error}!</p>
			</Alert>
		);
	}

	return (
		<div className="container mx-auto py-8 md:px-4 font-serif">
			<h1 className="text-5xl font-extrabold mb-10 text-center font-serif">
				<span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-emerald-500 to-purple-500">
					My Travel Journal
				</span>
			</h1>

			{bookings.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{bookings.map((booking) => (
						<div
							key={booking._id}
							className="rounded-xl overflow-hidden transform transition-all hover:border-b-4 border-sky-400 duration-300 shadow-2xl"
						>
							<div className="relative h-48 md:h-64">
								{booking?.place?.photos && booking.place.photos.length > 0 ? (
									<img
										src={booking.place.photos[0] || booking.place.photos[1]}
										alt={"image loading..."}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full bg-gray-300 flex items-center justify-center">
										<span className="text-lg">No image available</span>
									</div>
								)}
								<div className="absolute top-0 left-0 m-4">
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
											booking?.status
										)}`}
									>
										{booking?.status === "CONFIRMED" && (
											<CheckIcon className="w-4 h-4 mr-1" />
										)}
										{booking?.status === "PENDING" && (
											<WatchLaterIcon className="w-4 h-4 mr-1" />
										)}
										{booking?.status === "CANCELLED" && (
											<CancelIcon className="w-4 h-4 mr-1" />
										)}
										{booking?.status || "Pending"}
									</span>
								</div>
							</div>
							<div className="p-6 ">
								<h2 className="text-2xl font-semibold mb-4 line-clamp-2">
									{booking?.place?.title || "Unnamed Booking"}
								</h2>
								<div className="space-y-2 mb-4">
									<p className="flex items-center">
										<AddLocationAltIcon className="mr-2 text-blue-500" />
										{booking?.place?.location || "Location not specified"}
									</p>
									<p className="flex items-center">
										<MonetizationOnIcon className="mr-2 text-green-500" />
										{booking?.price || "Price not available"}
									</p>
									<p className="flex items-center">
										<PersonIcon className="mr-2 text-purple-500" />
										{booking?.guests || "N/A"} guests
									</p>
									<p className="flex items-center">
										<AccessTimeIcon className="mr-2 text-purple-500" />
										Booked on: {formatDate(booking.createdAt)}
									</p>
								</div>
								<div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
									<p className="flex items-center">
										<CalendarMonthIcon className="mr-1 text-orange-500" />
										{booking?.checkIn
											? formatDate(booking.checkIn)
											: "Check-in not set"}
									</p>
									<p className="flex items-center">
										<CalendarMonthIcon className="mr-1 text-red-500" />
										{booking?.checkOut
											? formatDate(booking.checkOut)
											: "Check-out not set"}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl shadow-lg">
					<FlightTakeoffIcon className="text-6xl mb-4 text-purple-500 animate-bounce" />
					<h2 className="text-3xl font-bold mb-4 text-gray-800">
						No bookings yet!
					</h2>
					<p className="text-xl text-gray-600">
						Your adventure awaits! ✈️ Start planning your next getaway.
					</p>
				</div>
			)}
		</div>
	);
};

export default UserBookings;
