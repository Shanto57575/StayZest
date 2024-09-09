import { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
	PeopleAlt,
	EventAvailable,
	MonetizationOn,
	TrendingUp,
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsExporting from "highcharts/modules/exporting";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { MdDashboard } from "react-icons/md";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);

Highcharts.setOptions({
	colors: ["#2794e1", "#e12762"],
	chart: {
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
			stops: [
				[0, "#2a2a2a"],
				[1, "#3e3e3e"],
			],
		},
		style: {
			fontFamily: "'Poppins', sans-serif",
		},
		borderRadius: 5,
		plotBorderColor: "#606063",
	},
	title: {
		style: {
			color: "#E0E0E3",
			fontSize: "20px",
			fontWeight: "bold",
		},
	},
	subtitle: {
		style: {
			color: "#E0E0E3",
			fontSize: "12px",
		},
	},
	xAxis: {
		gridLineColor: "#707073",
		labels: {
			style: {
				color: "#E0E0E3",
			},
		},
		lineColor: "#707073",
		minorGridLineColor: "#505053",
		tickColor: "#707073",
		title: {
			style: {
				color: "#A0A0A3",
			},
		},
	},
	yAxis: {
		gridLineColor: "#707073",
		labels: {
			style: {
				color: "#E0E0E3",
			},
		},
		lineColor: "#707073",
		minorGridLineColor: "#505053",
		tickColor: "#707073",
		tickWidth: 1,
		title: {
			style: {
				color: "#A0A0A3",
			},
		},
	},
	tooltip: {
		backgroundColor: "rgba(0, 0, 0, 0.85)",
		style: {
			color: "#F0F0F0",
		},
	},
	plotOptions: {
		series: {
			dataLabels: {
				color: "#F0F0F3",
				style: {
					fontSize: "13px",
				},
			},
			marker: {
				lineColor: "#333",
			},
		},
		boxplot: {
			fillColor: "#505053",
		},
		candlestick: {
			lineColor: "white",
		},
		errorbar: {
			color: "white",
		},
	},
	legend: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		itemStyle: {
			color: "#E0E0E3",
		},
		itemHoverStyle: {
			color: "#FFF",
		},
		itemHiddenStyle: {
			color: "#606063",
		},
		title: {
			style: {
				color: "#C0C0C0",
			},
		},
	},
	credits: {
		style: {
			color: "#666",
		},
	},
	drilldown: {
		activeAxisLabelStyle: {
			color: "#F0F0F3",
		},
		activeDataLabelStyle: {
			color: "#F0F0F3",
		},
	},
	navigation: {
		buttonOptions: {
			symbolStroke: "#DDDDDD",
			theme: {
				fill: "#505053",
			},
		},
	},
	rangeSelector: {
		buttonTheme: {
			fill: "#505053",
			stroke: "#000000",
			style: {
				color: "#CCC",
			},
			states: {
				hover: {
					fill: "#707073",
					stroke: "#000000",
					style: {
						color: "white",
					},
				},
				select: {
					fill: "#000003",
					stroke: "#000000",
					style: {
						color: "white",
					},
				},
			},
		},
		inputBoxBorderColor: "#505053",
		inputStyle: {
			backgroundColor: "#333",
			color: "silver",
		},
		labelStyle: {
			color: "silver",
		},
	},
	navigator: {
		handles: {
			backgroundColor: "#666",
			borderColor: "#AAA",
		},
		outlineColor: "#CCC",
		maskFill: "rgba(255,255,255,0.1)",
		series: {
			color: "#7798BF",
			lineColor: "#A6C7ED",
		},
		xAxis: {
			gridLineColor: "#505053",
		},
	},
	scrollbar: {
		barBackgroundColor: "#808083",
		barBorderColor: "#808083",
		buttonArrowColor: "#CCC",
		buttonBackgroundColor: "#606063",
		buttonBorderColor: "#606063",
		rifleColor: "#FFF",
		trackBackgroundColor: "#404043",
		trackBorderColor: "#404043",
	},
});

const AdminHome = () => {
	const [users, setUsers] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTimeRange, setSelectedTimeRange] = useState("30");
	const axiosInstance = useAxiosInterceptor();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [usersResponse, bookingsResponse, paymentsResponse] =
				await Promise.all([
					axiosInstance.get("/api/user/alluserswithbookingcount"),
					axiosInstance.get("/api/booking/all-Bookings"),
					axiosInstance.get("/api/payment/all-payments"),
				]);
			setUsers(usersResponse.data);
			setBookings(bookingsResponse.data);
			setPayments(paymentsResponse.data);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const getTimeRangeData = (data, days) => {
		const now = new Date();
		const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
		return data.filter((item) => new Date(item.createdAt) >= pastDate);
	};

	const getChartData = () => {
		const days =
			selectedTimeRange === "1" ? 1 : selectedTimeRange === "7" ? 7 : 30;
		const filteredData = getTimeRangeData(payments, days);
		return filteredData.map((payment) => [
			new Date(payment.createdAt).getTime(),
			payment.price,
		]);
	};

	const revenueOverTimeOptions = {
		chart: {
			type: "area",
			spacing: [30, 30, 30, 50],
			events: {
				render: function () {
					const chart = this;
					const container = chart.container;
					const buttonsContainer = container.querySelector(
						".highcharts-buttons-container"
					);

					if (!buttonsContainer) {
						const buttonsHtml = `
				  <div class="highcharts-buttons-container absolute top-4 left-4 z-10 flex flex-wrap items-center bg-gray-900 font-serif text-white text-xs sm:text-sm">
					<button class="highcharts-button px-2 py-1 sm:px-4 sm:py-2 transition border-r-2 hover:bg-zinc-700 duration-300 ${
						selectedTimeRange === "1" ? "bg-zinc-700" : ""
					}" data-range="1">Day</button>
					<button class="highcharts-button px-2 py-1 sm:px-4 sm:py-2 transition border-r-2 hover:bg-zinc-700 duration-300 ${
						selectedTimeRange === "7" ? "bg-zinc-700" : ""
					}" data-range="7">Week</button>
					<button class="highcharts-button px-2 py-1 sm:px-4 sm:py-2 transition hover:bg-zinc-700 duration-300 ${
						selectedTimeRange === "30" ? "bg-zinc-700" : ""
					}" data-range="30">Month</button>
				  </div>
				`;
						container.insertAdjacentHTML("beforeend", buttonsHtml);

						const buttons = container.querySelectorAll(".highcharts-button");
						buttons.forEach((button) => {
							button.addEventListener("click", () => {
								const range = button.getAttribute("data-range");
								setSelectedTimeRange(range);
								buttons.forEach((btn) => btn.classList.remove("bg-zinc-700"));
								button.classList.add("bg-zinc-700");
								chart.update({
									series: [
										{
											data: getChartData().sort((a, b) => a[0] - b[0]),
										},
									],
								});
							});
						});
					}
				},
			},
		},
		title: { text: "Revenue Over Time" },
		xAxis: {
			type: "datetime",
			labels: {
				style: {
					fontSize: "10px",
				},
			},
		},
		yAxis: {
			title: { text: "Revenue ($)" },
			labels: {
				style: {
					fontSize: "10px",
				},
			},
		},
		series: [
			{
				name: "Revenue",
				data: getChartData().sort((a, b) => a[0] - b[0]),
			},
		],
		plotOptions: {
			series: {
				marker: {
					enabled: false,
				},
			},
		},
		responsive: {
			rules: [
				{
					condition: {
						maxWidth: 500,
					},
					chartOptions: {
						legend: {
							enabled: false,
						},
						yAxis: {
							labels: {
								align: "left",
								x: 0,
								y: -5,
							},
							title: {
								text: null,
							},
						},
						subtitle: {
							text: null,
						},
						credits: {
							enabled: false,
						},
					},
				},
			],
		},
	};

	const bookingStatusOptions = {
		chart: { type: "pie", spacing: [20, 20, 20, 20] },
		title: { text: "Booking Statuses" },
		plotOptions: {
			pie: {
				innerSize: "50%",
				colors: ["#3da1db", "#6c42eb", "#ed2449"],
				dataLabels: {
					enabled: true,
					format: "{point.name}: {point.y}",
					style: {
						color: "#E0E0E3",
					},
				},
			},
		},
		series: [
			{
				name: "Booking Status",
				data: [
					[
						"CONFIRMED",
						bookings.filter((b) => b.status === "CONFIRMED").length,
					],
					["PENDING", bookings.filter((b) => b.status === "PENDING").length],
					[
						"CANCELLED",
						bookings.filter((b) => b.status === "CANCELLED").length,
					],
				],
			},
		],
	};

	const userActivityOptions = {
		chart: { type: "line", spacing: [20, 20, 20, 20] },
		title: { text: "User Activity" },
		xAxis: { categories: users.map((user) => user.name) },
		yAxis: { title: { text: "Number of Activities" } },
		series: [
			{
				name: "Activities",
				data: users.map((user) => user.bookingCount),
			},
		],
	};

	const groupedPayments = payments.reduce((acc, payment) => {
		const date = new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(new Date(payment.createdAt));

		if (!acc[date]) {
			acc[date] = 0;
		}
		acc[date] += payment.price;
		return acc;
	}, {});

	const paymentSummaryOptions = {
		chart: {
			type: "column",
			spacing: [20, 20, 20, 20],
		},
		title: { text: "Payment Summary" },
		xAxis: {
			categories: Object.keys(groupedPayments),
			title: { text: "Payments" },
		},
		yAxis: {
			title: { text: "Amount ($)" },
		},
		series: [
			{
				name: "Payments",
				data: Object.values(groupedPayments),
			},
		],
	};

	// Growth rate starts
	const periodStart = new Date();
	periodStart.setDate(periodStart.getDate() - 7);

	const previousPeriodStart = new Date();
	previousPeriodStart.setDate(previousPeriodStart.getDate() - 14);

	const currentPeriodBookings = bookings.filter(
		(booking) => new Date(booking.createdAt) >= periodStart
	);

	const previousPeriodBookings = bookings.filter(
		(booking) =>
			new Date(booking.createdAt) < periodStart &&
			new Date(booking.createdAt) >= previousPeriodStart
	);

	const aggregateBookings = (bookings) => {
		return bookings.reduce((acc, booking) => {
			acc[booking.place] = (acc[booking.place] || 0) + 1;
			return acc;
		}, {});
	};

	const currentPeriodCounts = aggregateBookings(currentPeriodBookings);
	const previousPeriodCounts = aggregateBookings(previousPeriodBookings);

	const growthRates = Object.keys(currentPeriodCounts).map((place) => {
		const currentCount = currentPeriodCounts[place];
		const previousCount = previousPeriodCounts[place] || 0;

		const growthRate = previousCount
			? ((currentCount - previousCount) / previousCount) * 100
			: 100;

		return {
			place,
			currentCount,
			previousCount,
			growthRate,
		};
	});

	const trendingBookings = growthRates.sort(
		(a, b) => b.growthRate - a.growthRate
	);

	const locationCounts = bookings.reduce((acc, booking) => {
		const location = booking?.place?.location;
		acc[location] = (acc[location] || 0) + 1;
		return acc;
	}, {});

	const sortedLocations = Object.entries(locationCounts).sort(
		(a, b) => b[1] - a[1]
	);
	const top3TrendingLocations = sortedLocations
		.slice(0, 5)
		.map(([location]) => location);

	const trendingLocationData = top3TrendingLocations.map((location) => {
		return {
			location,
			bookings: bookings.filter(
				(booking) => booking?.place?.location === location
			),
		};
	});

	const totalBookings = trendingLocationData.reduce(
		(sum, location) => sum + location.bookings.length,
		0
	);

	const popularityData = trendingLocationData.map((location) => ({
		place: location.bookings[0].place.location,
		popularity: (location.bookings.length / totalBookings) * 100,
	}));

	const popularityOptions = {
		chart: {
			type: "pie",
			backgroundColor: "#333333",
			margin: [0, 0, 0, 0],
			spacing: [20, 20, 20, 20],
			height: 320,
			width: 300,
		},
		title: {
			text: "Trending Places",
			style: {
				color: "#FFFFFF",
			},
		},
		plotOptions: {
			pie: {
				innerSize: "50%",
				startAngle: -90,
				endAngle: 90,
				dataLabels: {
					format: "{point.name}: {point.y:.1f}%",
					style: {
						color: "#FFFFFF",
					},
				},
			},
		},
		series: [
			{
				name: "Popularity",
				data: popularityData.map((data) => [data.place, data.popularity]),
				colorByPoint: true,
			},
		],
		colors: ["#ADD8E6", "#90EE90", "#9370DB", "#F08080", "#FAFAD2"],
		tooltip: {
			backgroundColor: "#333333",
			style: { color: "#FFFFFF" },
		},
		center: ["50%", "50%"],
	};

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="relative w-24 h-24">
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
					<MdDashboard className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
				</div>
			</div>
		);
	}

	return (
		<div className="p-2 max-w-full md:max-w-[1000px]">
			<h1 className="text-2xl sm:text-3xl font-bold font-serif mb-3">
				Admin Dashboard
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 dark:bg-gray-700 bg-gray-300 shadow-lg shadow-gray-700 dark:shadow-black p-5 rounded-lg font-serif">
				<div className="dark:bg-gray-800 bg-gray-400 dark:hover:bg-slate-900 hover:bg-slate-500 p-4 rounded-lg space-y-2 shadow-md shadow-white">
					<PeopleAlt className="mb-4" />
					<p className="text-2xl">{users.length}</p>
					<h3 className="text-lg font-semibold">Users</h3>
				</div>
				<div className="dark:bg-gray-800 bg-gray-400 dark:hover:bg-slate-900 hover:bg-slate-500 p-4 rounded-lg space-y-2 shadow-md shadow-white">
					<EventAvailable className="mb-4" />
					<p className="text-2xl">{bookings.length}</p>
					<h3 className="text-lg font-semibold">Bookings</h3>
				</div>
				<div className="dark:bg-gray-800 bg-gray-400 dark:hover:bg-slate-900 hover:bg-slate-500 p-4 rounded-lg space-y-2 shadow-md shadow-white">
					<MonetizationOn className="mb-4" />
					<p className="text-2xl font-sans">
						${payments.reduce((acc, payment) => acc + payment.price, 0)}
					</p>
					<h3 className="text-lg font-semibold">Revenue</h3>
				</div>
				<div className="dark:bg-gray-800 bg-gray-400 dark:hover:bg-slate-900 hover:bg-slate-500 p-4 rounded-lg space-y-2 shadow-md shadow-white">
					<TrendingUp className="mb-4" />
					<p className="text-2xl">
						{trendingBookings[0]?.growthRate.toFixed(2)} %
					</p>
					<h3 className="text-lg font-semibold">Growth Rate</h3>
				</div>
			</div>

			<div className="w-full mx-auto font-serif">
				<h2 className="my-10 font-bold font-serif text-2xl sm:text-4xl ml-2 sm:ml-4">
					Trending Locations <TrendingUpIcon />
				</h2>

				<div className="flex flex-col md:flex-row items-center justify-between">
					<div className="w-full md:w-80 h-80 mx-auto">
						<HighchartsReact
							highcharts={Highcharts}
							options={popularityOptions}
						/>
					</div>
					<div className="w-full lg:w-2/3 h-80">
						<Slider {...settings}>
							{trendingLocationData.map((location) => (
								<div key={location.bookings[0]._id} className="p-2">
									<div className="rounded-lg shadow-md">
										<div className="flex space-x-2">
											{location.bookings[0].place.photos.map((photo, index) => (
												<img
													key={index}
													src={photo}
													alt={`${location.location} photo ${index + 1}`}
													className="w-1/2 h-32 sm:h-64 object-cover"
												/>
											))}
										</div>
										<div className="p-2 sm:p-4">
											<h3 className="text-lg sm:text-xl font-bold">
												{location.location}
											</h3>
										</div>
									</div>
								</div>
							))}
						</Slider>
					</div>
				</div>
			</div>

			<div className="mt-4 sm:mt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
				<div className="w-full lg:w-1/3">
					<HighchartsReact
						highcharts={Highcharts}
						options={bookingStatusOptions}
					/>
				</div>
				<div className="w-full lg:w-2/3">
					<HighchartsReact
						highcharts={Highcharts}
						options={revenueOverTimeOptions}
					/>
				</div>
			</div>

			<div className="mt-4 sm:mt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
				<div className="w-full lg:w-1/3">
					<HighchartsReact
						highcharts={Highcharts}
						options={userActivityOptions}
					/>
				</div>
				<div className="w-full lg:w-2/3">
					<HighchartsReact
						highcharts={Highcharts}
						options={paymentSummaryOptions}
					/>
				</div>
			</div>
		</div>
	);
};

export default AdminHome;
