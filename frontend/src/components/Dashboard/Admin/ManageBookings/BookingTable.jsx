import React from "react";
import { format } from "date-fns";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

const BookingTable = ({ bookings, handleStatus, searchTerm }) => {
	const [filteredBookings, setFilteredBookings] = useState([]);

	useEffect(() => {
		const filtered = bookings.filter(
			(booking) =>
				booking.user?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
				booking.place?.title?.toLowerCase().includes(searchTerm?.toLowerCase())
		);
		setFilteredBookings(filtered);
	}, [searchTerm, bookings]);

	return (
		<div>
			<div className="overflow-x-auto">
				<Toaster />
				<table className="w-full mx-auto font-serif bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
					<thead className="bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
						<tr>
							<th className="py-3 px-4 text-center">Place</th>
							<th className="py-3 px-4 text-center">CheckIn</th>
							<th className="py-3 px-4 text-center">CheckOut</th>
							<th className="py-3 px-4 text-center">Price</th>
							<th className="py-3 px-4 text-center">User</th>
							<th className="py-3 px-4 text-center">Status</th>
							<th className="py-3 px-4 text-center">Action</th>
							<th className="py-3 px-4 text-center">Booking Date</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-center">
						{filteredBookings.map((booking) => (
							<tr
								key={booking._id}
								className="dark:hover:bg-gray-700 hover:bg-gray-200"
							>
								<td className="py-3 px-4 flex flex-col lg:flex-row items-center space-x-2">
									<img
										className="h-14 w-14 rounded-md object-cover"
										src={booking.place?.photos[0] || booking.place?.photos[1]}
										alt={booking.place?.title}
									/>
									<span className="text-xs mt-1">{booking.place?.title}</span>
								</td>
								<td className="py-3 px-4 text-sm">
									{format(new Date(booking.checkIn), "MMM dd, yyyy")}
								</td>
								<td className="py-3 px-4 text-sm">
									{format(new Date(booking.checkOut), "MMM dd, yyyy")}
								</td>
								<td className="py-3 px-4">${booking.price}</td>
								<td className="py-3 px-4">
									{booking.user?.username
										? booking.user?.username
										: "anonymous"}{" "}
									<br />
									<span className="text-xs">
										({booking.user?.email ? booking.user?.email : "...."})
									</span>
								</td>
								<td className="py-3 px-4">
									<span
										className={`py-2 px-4 rounded-full text-xs hover:tracking-wider duration-500 ${
											booking.status === "PENDING"
												? "bg-yellow-200 text-yellow-600"
												: booking.status === "CONFIRMED"
												? "bg-green-200 text-green-600"
												: "bg-red-200 text-red-600"
										}`}
									>
										{booking.status}
									</span>
								</td>
								<td className="">
									<button
										onClick={() => handleStatus(booking._id, "CONFIRMED")}
										className={`rounded-full bg-green-500 text-white ${
											booking.status === "PENDING"
												? "hover:bg-green-600"
												: "cursor-not-allowed opacity-50"
										} mr-2`}
										disabled={booking.status !== "PENDING"}
									>
										<CheckCircleIcon />
									</button>

									<button
										onClick={() => handleStatus(booking._id, "CANCELLED")}
										className={`rounded-full bg-red-500 text-white ${
											booking.status === "PENDING"
												? "hover:bg-red-600"
												: "cursor-not-allowed opacity-50"
										}`}
										disabled={booking.status !== "PENDING"}
									>
										<CancelIcon />
									</button>
								</td>
								<td className="text-sm">
									{format(new Date(booking.createdAt), "MMM dd, yyyy")}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default BookingTable;
