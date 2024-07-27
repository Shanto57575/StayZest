import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Loader from "../../Loader";
import { convertToMDY } from "../../converter";
import toast, { Toaster } from "react-hot-toast";

const ManageBookings = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/booking/all-Bookings",
					{
						withCredentials: true,
					}
				);
				setBookings(response.data);
				console.log(response.data);
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
				{
					withCredentials: true,
				}
			);

			const updatedBookings = bookings.map((booking) =>
				booking._id === bookingId
					? { ...booking, status: "CONFIRMED" }
					: booking
			);
			setBookings(updatedBookings);
		} catch (err) {
			setError("Failed to fetch bookings. Please try again later.");
		}
	};

	const handleCancelBooking = async (bookingId) => {
		try {
			await axios.delete(`http://localhost:5000/api/booking/${bookingId}`, {
				withCredentials: true,
			});

			const otherBookings = bookings.filter(
				(booking) => booking._id !== bookingId
			);
			setBookings(otherBookings);
			toast.success("Booking has been Cancelled", {
				iconTheme: {
					primary: "#ffffff",
					secondary: "red",
				},
				duration: 3000,
				className: "bg-rose-600 text-white",
			});
		} catch (err) {
			setError("Failed to fetch bookings. Please try again later.");
		}
	};

	if (loading) return <Loader />;

	if (error)
		return (
			<p className="text-center text-rose-500 font-serif h-screen text-3xl flex justify-center items-center">
				{error}
			</p>
		);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4 font-serif text-center underline">
				Total Bookings : {bookings.length}
			</h1>
			<div className="overflow-x-auto font-serif">
				<table className="min-w-full shadow-2xl shadow-black">
					<thead className="text-center">
						<tr>
							<th></th>
							<th className="px-6 py-3 text-xs uppercase tracking-wider font-extrabold">
								Place
							</th>
							<th className="px-6 py-3  text-xs uppercase tracking-wider font-extrabold">
								Check-in
							</th>
							<th className="px-6 py-3  text-xs uppercase tracking-wider font-extrabold">
								Check-out
							</th>
							<th className="px-6 py-3  text-xs uppercase tracking-wider font-extrabold">
								Price
							</th>
							<th className="px-6 py-3  text-xs uppercase tracking-wider font-extrabold">
								User Mail
							</th>
							<th className="px-6 py-3  text-xs uppercase tracking-wider font-extrabold">
								Status
							</th>
							<th className="px-6 py-3  text-xs uppercase tracking-wider font-extrabold">
								Booking Date
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 text-center">
						{bookings &&
							bookings?.map((booking) => (
								<tr key={booking._id}>
									<td
										onClick={() => handleCancelBooking(booking._id)}
										className="px-6 py-4 whitespace-nowrap font-mono text-rose-600 text-xl cursor-pointer"
									>
										X
									</td>
									<Toaster />
									<td className="px-6 py-4 flex items-center gap-x-2 whitespace-nowrap">
										<img
											className="h-12 w-12 rounded-tr-lg rounded-es-lg object-cover shadow-sm cursor-pointer shadow-slate-100 hover:scale-125 duration-700"
											src={booking.place.photos[0] || booking.place.photos[1]}
											alt={booking.place.title}
										/>
										<p className="text-sm font-medium">{booking.place.title}</p>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm ">
											{format(new Date(booking.checkIn), "MMM dd, yyyy")}
										</p>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm">
											{format(new Date(booking.checkOut), "MMM dd, yyyy")}
										</p>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
										${booking.price}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm ">{booking.user?.username}</p>
										<p className="text-sm ">{booking.email}</p>
									</td>
									<td
										onClick={() => handleStatus(booking._id)}
										className="px-6 py-4 whitespace-nowrap cursor-pointer"
									>
										<span
											className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
												booking.status === "PENDING"
													? "bg-amber-200 text-yellow-700"
													: booking.status === "CONFIRMED"
													? "bg-green-200 text-green-700 cursor-not-allowed"
													: "bg-red-100 text-red-800"
											}`}
										>
											{booking.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm ">
											{convertToMDY(booking.createdAt)}
										</p>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageBookings;
