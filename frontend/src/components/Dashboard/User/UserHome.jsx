import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FaDollarSign, FaUser } from "react-icons/fa";
import { TbAlarmAverage } from "react-icons/tb";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Fade, Flip, Rotate, Zoom } from "react-awesome-reveal";

const UserHome = () => {
	const axiosInstance = useAxiosInterceptor();
	const user = useSelector((state) => state.auth.currentUser);
	const [userPayment, setUserPayment] = useState([]);
	const [recentBookings, setRecentBookings] = useState([]);
	const [bookingTrends, setBookingTrends] = useState([]);
	const [amount, setAmount] = useState(0);

	const fetchData = async () => {
		try {
			const paymentResponse = await axiosInstance.get(
				`/api/payment/${user?.email}`
			);
			setUserPayment(paymentResponse.data);
			const bookingsResponse = await axiosInstance.get(
				`/api/booking/${user?.email}`
			);
			setRecentBookings(bookingsResponse.data);

			const trends = bookingsResponse.data.reduce((acc, booking) => {
				const month = new Date(booking.checkIn).toLocaleString("default", {
					month: "short",
					year: "numeric",
				});
				acc[month] = (acc[month] || 0) + 1;
				return acc;
			}, {});
			setBookingTrends(
				Object.entries(trends).map(([month, count]) => ({
					name: month,
					y: count,
				}))
			);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const paymentTrendOptions = {
		title: {
			text: "Monthly Payment Trend",
		},
		xAxis: {
			categories: userPayment.map((payment) =>
				new Date(payment.createdAt).toLocaleDateString()
			),
		},
		yAxis: {
			title: {
				text: "Amount ($)",
			},
		},
		series: [
			{
				name: "Amount Paid",
				data: userPayment.map((payment) => payment.amount),
				type: "line",
				color: "#28a745",
			},
		],
		tooltip: {
			formatter: function () {
				return `<b>${this.x}</b><br/>Amount: ${this.y} $`;
			},
		},
	};

	const bookingTrendsOptions = {
		title: {
			text: "Booking Trends Over Time",
		},
		xAxis: {
			type: "category",
		},
		yAxis: {
			title: {
				text: "Number of Bookings",
			},
		},
		series: [
			{
				name: "Bookings",
				data: bookingTrends,
				type: "column",
				color: "#007bff",
			},
		],
		tooltip: {
			formatter: function () {
				return `<b>${this.x}</b><br/>Bookings: ${this.y}`;
			},
		},
	};

	const totalCost = (price, days) => {
		if (price && days) {
			setAmount(price * days);
		}
	};

	return (
		<motion.div
			className="h-screen font-serif"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<div className="text-center text-xl md:text-2xl lg:text-4xl font-extrabold mb-6">
				Welcome Back, {user?.username}
			</div>

			{/* Box cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
				<Zoom>
					<div className="px-4 py-10 shadow-md shadow-white rounded-lg flex items-center transition-transform transform hover:scale-105 hover:shadow-xl">
						<FaUser size={30} className="text-purple-600 mr-4" />
						<div>
							<div className="text-2xl font-semibold">
								{user?.username || "N/A"}
							</div>
							<div className="text-gray-600 dark:text-gray-400">
								{user?.email || "N/A"}
							</div>
						</div>
					</div>
				</Zoom>
				<Zoom>
					<div className="px-4 py-10 shadow-md shadow-white rounded-lg flex items-center transition-transform transform hover:scale-105 hover:shadow-xl">
						<FaDollarSign size={30} className="text-emerald-500 mr-4" />
						<div>
							<div className="text-lg font-medium">Total Amount Paid</div>
							<div className="text-3xl font-bold font-sans">
								$
								{userPayment?.reduce(
									(total, payment) => total + payment.amount,
									0
								)}
							</div>
						</div>
					</div>
				</Zoom>
				<Zoom>
					<div className="px-4 py-10 shadow-md shadow-white rounded-lg flex items-center transition-transform transform hover:scale-105 hover:shadow-xl">
						<TbAlarmAverage size={30} className="text-orange-600 mr-4" />
						<div>
							<div className="text-lg font-medium">Average Cost / booking</div>
							<div className="text-3xl font-bold font-sans">
								$
								{(
									userPayment.reduce(
										(total, payment) => total + payment.amount,
										0
									) / recentBookings.length || 0
								).toFixed(2)}
							</div>
						</div>
					</div>
				</Zoom>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
				<Fade>
					<div className="p-6 shadow-md dark:shadow-cyan-200 shadow-gray-900 rounded-lg">
						<HighchartsReact
							highcharts={Highcharts}
							options={paymentTrendOptions}
						/>
					</div>
				</Fade>
				<Fade>
					<div className="p-6 shadow-md dark:shadow-purple-200 shadow-gray-900 rounded-lg">
						<HighchartsReact
							highcharts={Highcharts}
							options={bookingTrendsOptions}
						/>
					</div>
				</Fade>
			</div>

			{/* Bookings */}
			<div className="mb-10">
				<h2 className="text-3xl font-semibold mb-4">Recent Bookings</h2>
				{recentBookings.length > 0 ? (
					<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{recentBookings.slice(0, 3).map((booking) => (
							<li key={booking._id} className="relative group">
								<Zoom>
									<div
										onMouseEnter={() =>
											totalCost(
												booking.place?.price,
												Math.ceil(
													(new Date(booking.checkOut) -
														new Date(booking.checkIn)) /
														(1000 * 60 * 60 * 24)
												)
											)
										}
										className="relative w-full h-48 sm:h-64 lg:h-72 rounded-lg overflow-hidden"
									>
										<img
											src={booking.place?.photos?.[0]}
											alt={booking.place?.title || "No Image"}
											className="object-cover w-full h-full"
										/>
										<div className="absolute inset-0 bg-black opacity-0 hover:opacity-100 hover:bg-opacity-70 transition duration-300 flex items-center justify-center">
											<div className="text-white italic p-4">
												<div className="text-2xl sm:text-3xl text-blue-400">
													{booking.place?.location || "N/A"}
												</div>
												<div className="mt-2 text-lg">
													Total: ${amount} /{" "}
													{Math.ceil(
														(new Date(booking.checkOut) -
															new Date(booking.checkIn)) /
															(1000 * 60 * 60 * 24)
													)}{" "}
													days
												</div>
												<div className="mt-2">
													Booking :{" "}
													<span
														className={`font-bold ${
															booking?.status === "CONFIRMED"
																? "text-emerald-500"
																: booking?.status === "CANCELLED"
																? "text-rose-600"
																: booking?.status === "PENDING"
																? "text-amber-500"
																: "text-gray-600"
														}`}
													>
														{booking?.status || "N/A"}
													</span>
												</div>
											</div>
										</div>
									</div>
								</Zoom>
							</li>
						))}
					</ul>
				) : (
					<p className="font-bold italic text-purple-600 text-center text-3xl">
						No Bookings Yet
					</p>
				)}
			</div>
		</motion.div>
	);
};

export default UserHome;
