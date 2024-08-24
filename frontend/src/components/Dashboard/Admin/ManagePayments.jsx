import { useEffect, useState } from "react";
import axios from "axios";
import {
	CalendarToday,
	Person,
	AttachMoney,
	LocationOn,
	TrendingUp,
	TrendingDown,
	EventAvailable,
} from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ManagePayments = () => {
	const [allPayments, setAllPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");

	useEffect(() => {
		const GetAllPayments = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/payment/all-payments",
					{ withCredentials: true }
				);
				setAllPayments(response.data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		};

		GetAllPayments();
	}, []);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const totalPayments = allPayments.reduce(
		(sum, payment) => sum + payment.price,
		0
	);
	const totalBookings = allPayments.length;
	const averageBookingValue = totalPayments / totalBookings || 0;

	const statusData = allPayments.reduce((acc, payment) => {
		acc[payment.status] = (acc[payment.status] || 0) + 1;
		return acc;
	}, {});

	const statusChartData = Object.keys(statusData).map((key) => ({
		name: key,
		value: statusData[key],
	}));

	const COLORS = ["#be47e6", "#59b56e", "#e6434e", "#be47e6"];

	const topLocations = allPayments.reduce((acc, payment) => {
		acc[payment.place?.location] = (acc[payment.place?.location] || 0) + 1;
		return acc;
	}, {});

	const topLocationsData = Object.entries(topLocations)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, value]) => ({ name, value }));

	const pieOptions = {
		chart: {
			type: "pie",
			backgroundColor: "#222222",
		},
		title: {
			text: "Booking Status Distribution",
			style: { color: "#FFFFFF" },
		},
		series: [
			{
				name: "Bookings",
				colorByPoint: true,
				data: statusChartData.map((status) => ({
					name: status.name,
					y: status.value,
					color:
						status.name === "CONFIRMED"
							? "#59b56e" // Green
							: status.name === "CANCELLED"
							? "#e6434e" // Red
							: "#be47e6", // Purple
				})),
			},
		],
		plotOptions: {
			pie: {
				borderColor: "#222222",
				dataLabels: {
					enabled: true,
					format: "{point.name}: {point.percentage:.1f} %",
					style: { color: "#FFFFFF" },
				},
			},
		},
		tooltip: {
			backgroundColor: "#333333",
			style: { color: "#FFFFFF" },
		},
		legend: {
			itemStyle: { color: "#FFFFFF" },
		},
	};

	const columnOptions = {
		chart: {
			type: "column",
			backgroundColor: "#222222",
		},
		title: {
			text: "Top 5 Locations",
			style: { color: "#FFFFFF" },
		},
		xAxis: {
			categories: topLocationsData.map((location) => location.name),
			title: {
				text: "Location",
				style: { color: "#FFFFFF" },
			},
			labels: {
				style: { color: "#FFFFFF" },
			},
		},
		yAxis: {
			min: 0,
			title: {
				text: "Number of Bookings",
				style: { color: "#FFFFFF" },
			},
			labels: {
				style: { color: "#FFFFFF" },
			},
		},
		series: [
			{
				name: "Bookings",
				data: topLocationsData.map((location) => location.value),
				color: "#008ECC",
			},
		],
		legend: {
			itemStyle: { color: "#FFFFFF" },
		},
		plotOptions: {
			column: {
				borderWidth: 0,
			},
		},
		tooltip: {
			backgroundColor: "#333333",
			style: { color: "#FFFFFF" },
		},
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="relative w-24 h-24">
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
					<AttachMoneyIcon className="absolute top-10 right-8 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8 font-serif">
					Payment Analytics
				</h1>

				<div className="mb-8 flex justify-center font-serif">
					<button
						onClick={() => setActiveTab("overview")}
						className={`px-4 py-2 mr-2 rounded ${
							activeTab === "overview"
								? "bg-blue-500 text-white hover:bg-blue-600"
								: "bg-gray-200 text-gray-800 hover:bg-gray-100"
						}`}
					>
						Overview
					</button>
					<button
						onClick={() => setActiveTab("details")}
						className={`px-4 py-2 rounded ${
							activeTab === "details"
								? "bg-blue-500 text-white hover:bg-blue-600"
								: "bg-gray-200 text-gray-800 hover:bg-gray-100"
						}`}
					>
						Payment Details
					</button>
				</div>

				{activeTab === "overview" && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<div className="p-4 rounded-lg shadow-md shadow-cyan-400 hover:scale-105 duration-500">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500 font-semibold italic">
										Total Revenue
									</p>
									<p className="text-2xl font-bold">
										${totalPayments.toLocaleString()}
									</p>
								</div>
								<TrendingUp className="text-green-500 text-4xl" />
							</div>
						</div>
						<div className="p-4 rounded-lg shadow-md shadow-emerald-400 hover:scale-105 duration-500">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500 font-semibold italic">
										Total Bookings
									</p>
									<p className="text-2xl font-bold">{totalBookings}</p>
								</div>
								<EventAvailable className="text-blue-500 text-4xl" />
							</div>
						</div>
						<div className="p-4 rounded-lg shadow-md shadow-purple-400 hover:scale-105 duration-500">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500 font-semibold italic">
										Average Booking Value
									</p>
									<p className="text-2xl font-bold">
										$
										{averageBookingValue.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</p>
								</div>
								<TrendingUp className="text-purple-500 text-4xl" />
							</div>
						</div>
						<div className="p-4 rounded-lg shadow-md shadow-rose-500 hover:scale-105 duration-500 ">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500 font-semibold italic">
										Conversion Rate
									</p>
									<p className="text-2xl font-bold">65%</p>
								</div>
								<TrendingDown className="text-red-500 text-4xl" />
							</div>
						</div>
					</div>
				)}

				{activeTab === "overview" && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 font-serif">
						<div className="p-4 rounded-lg shadow-md shadow-cyan-400 hover:shadow-2xl hover:shadow-cyan-500 hover:scale-105 duration-700">
							<HighchartsReact highcharts={Highcharts} options={pieOptions} />
						</div>
						<div className="p-4 rounded-lg shadow-md hover:shadow-2xl hover:shadow-purple-600 shadow-purple-500 hover:scale-105 duration-700">
							<HighchartsReact
								highcharts={Highcharts}
								options={columnOptions}
							/>
						</div>
					</div>
				)}

				{activeTab === "details" && (
					<div className="overflow-x-auto shadow-md rounded-lg">
						<table className="w-full table-auto font-serif mx-auto">
							<thead className="text-center">
								<tr>
									<th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center">
										Place
									</th>
									<th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center">
										Booked By
									</th>
									<th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center">
										Booking Date
									</th>
									<th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center">
										Total Guest
									</th>
									<th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center">
										Price
									</th>
									<th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								{allPayments.map((payment) => (
									<tr key={payment._id}>
										<td className="px-4 py-4 whitespace-nowrap text-center">
											<div className="flex items-center">
												<div className="flex-shrink-0 h-10 w-10">
													<img
														className="h-10 w-10 rounded-full"
														src={payment.place?.photos[0]}
														alt=""
													/>
												</div>
												<div className="ml-4">
													<div className="text-sm flex items-center">
														<LocationOn className="h-4 w-4 mr-1 text-sky-600" />
														{payment.place?.title}
													</div>
												</div>
											</div>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-center">
											<div className="text-sm">{payment.user.email}</div>
											<div className="text-sm">({payment.user.username})</div>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-center">
											<div className="text-sm flex items-center">
												<CalendarToday className="h-4 w-4 mr-1 text-rose-500" />
												{formatDate(payment.createdAt)}
											</div>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-center">
											<div className="text-sm flex items-center">
												<Person className="h-4 w-4 mr-1 text-blue-600" />
												{payment.guests}
											</div>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-center">
											<div className="text-sm flex items-center">
												<AttachMoney className="h-4 w-4 mr-1 text-emerald-500" />
												{payment.price.toLocaleString()}
											</div>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-center">
											<span
												className={`text-xs px-2 py-1.5 font-semibold rounded-full ${
													payment.status === "CONFIRMED"
														? "bg-green-200 text-green-900"
														: "bg-red-200 text-red-900"
												}`}
											>
												{payment.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default ManagePayments;
