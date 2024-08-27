import React, { useState, useEffect } from "react";
import axios from "axios";
import { Fade } from "react-awesome-reveal";
import toast, { Toaster } from "react-hot-toast";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import StatCard from "./StatCard";
import BookingTable from "./BookingTable";

const ManageBookings = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedBookingId, setSelectedBookingId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchBookings = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/booking/all-Bookings`,
				{ withCredentials: true }
			);
			setBookings(response.data);
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch bookings. Please try again later.");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	const handleStatus = async (bookingId, newStatus) => {
		setSelectedBookingId(bookingId);
		try {
			await axios.put(
				`http://localhost:5000/api/booking/${bookingId}`,
				{ status: newStatus },
				{ withCredentials: true }
			);

			setBookings(
				bookings.map((booking) =>
					booking._id === bookingId
						? { ...booking, status: newStatus }
						: booking
				)
			);

			if (newStatus === "CONFIRMED") {
				toast.success(
					<h1 className="font-serif">Booking {newStatus.toLowerCase()}</h1>,
					{
						position: "top-center",
					}
				);
			} else if (newStatus === "CANCELLED") {
				toast(
					<h1 className="font-serif">
						❌ Booking {newStatus.toLowerCase()} ❌
					</h1>,
					{
						position: "top-center",
					}
				);
			}
		} catch (err) {
			toast.error(`Failed to ${newStatus.toLowerCase()} booking`);
		}
	};

	// TODO: KEEP IT FOR DELETE
	const handleCancellation = async () => {
		try {
			await axios.put(
				`http://localhost:5000/api/booking/${selectedBookingId}`,
				{ status: "CANCELLED" },
				{ withCredentials: true }
			);

			setBookings(
				bookings.map((booking) =>
					booking._id === selectedBookingId
						? { ...booking, status: "CANCELLED" }
						: booking
				)
			);

			toast.success("Booking Cancelled successfully", {
				position: "top-center",
				icon: "❌",
			});
		} catch (err) {
			toast.error("Failed to cancel booking");
		}
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

	if (error)
		return (
			<p className="text-center text-rose-600 font-serif h-screen text-3xl flex justify-center items-center">
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
	const cancelledBookings = bookings.filter(
		(booking) => booking.status === "CANCELLED"
	).length;

	const totalCollection = bookings.reduce((total, booking) => {
		return total + booking.price;
	}, 0);

	if (bookings.length === 0)
		return (
			<div className="h-screen flex items-center justify-center text-2xl md:text-5xl dark:text-sky-500 text-sky-600 font-serif">
				No Bookings Yet!
			</div>
		);

	return (
		<Fade>
			<div className="container mx-auto">
				<div className="flex flex-col md:flex-row items-center justify-between mb-3">
					<h1 className="text-3xl text-center md:text-left font-bold font-serif mb-6">
						Manage Bookings
					</h1>
					<input
						type="text"
						placeholder="Search booking By Place"
						className="px-3 py-2 border rounded-md bg-transparent font-serif"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 font-serif">
					<StatCard
						title="Total Bookings"
						value={totalBookings}
						icon={PendingIcon}
						bgColor="bg-blue-500"
					/>
					<StatCard
						title="Total Collection"
						value={`$${totalCollection}`}
						icon={CheckCircleIcon}
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
						icon={CheckCircleIcon}
						bgColor="bg-green-500"
					/>
					<StatCard
						title="Cancelled Bookings"
						value={cancelledBookings}
						icon={CancelIcon}
						bgColor="bg-red-500"
					/>
				</div>

				<BookingTable
					bookings={bookings}
					handleStatus={handleStatus}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
			</div>
			<Toaster />
		</Fade>
	);
};

export default ManageBookings;
