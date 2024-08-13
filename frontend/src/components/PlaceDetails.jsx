import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaceDetails } from "../features/places/placesSlice";
import { differenceInCalendarDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Star, Add, Remove } from "@mui/icons-material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import TvIcon from "@mui/icons-material/Tv";
import BedIcon from "@mui/icons-material/Bed";
import ShowerIcon from "@mui/icons-material/Shower";

import Loader from "./Loader";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PlaceDetails = () => {
	const dispatch = useDispatch();
	const { placeId } = useParams();
	const { viewDetails, loading, error } = useSelector((state) => state.places);
	const { currentUser } = useSelector((state) => state.auth);
	const userId = currentUser?._id;

	const [checkIn, setCheckIn] = useState(null);
	const [checkOut, setCheckOut] = useState(null);
	const [guests, setGuests] = useState({ adults: 1, children: 0 });
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		dispatch(fetchPlaceDetails(placeId));
	}, [dispatch, placeId]);

	const handleGuestsChange = (type, operation) => {
		const totalCurrentGuests = guests.adults + guests.children;
		const maxGuests = viewDetails?.totalGuests || 0;

		if (operation === "increase" && totalCurrentGuests < maxGuests) {
			setGuests((prev) => ({
				...prev,
				[type]: prev[type] + 1,
			}));
		} else if (operation === "decrease") {
			setGuests((prev) => ({
				...prev,
				[type]: Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
			}));
		}
	};

	const totalGuests = guests.adults + guests.children;
	const numOfNights =
		checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;
	const subtotal = numOfNights * (viewDetails?.price || 0);
	const serviceFee = Math.round(subtotal * 0.12 + totalGuests * 2);
	const total = subtotal + serviceFee;

	const handleBooking = async () => {
		if (!checkIn || !checkOut) {
			toast.error("Please select both check-in and check-out dates.");
			return;
		}

		const bookingData = {
			placeId: viewDetails._id,
			userId,
			checkIn,
			checkOut,
			totalGuests,
			total,
		};

		try {
			setProcessing(true);
			const response = await axios.post(
				"http://localhost:5000/api/booking/create-booking-intent",
				bookingData,
				{ withCredentials: true }
			);
			if (response.data) {
				setProcessing(false);
				window.location.href = response.data.url;
			}
		} catch (error) {
			toast.error("Error creating booking Intent. Please try again.");
			setProcessing(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader />
			</div>
		);
	}

	if (error) {
		return <div className="text-red-500 text-center">{error}</div>;
	}

	if (!viewDetails) {
		return <div className="text-center">No place details found</div>;
	}

	return (
		<Elements stripe={stripePromise}>
			<div className="md:px-8 py-8 mt-20 -z-50">
				<h1 className="text-center md:text-left text-2xl md:text-4xl font-bold my-4 mt-0 font-serif">
					{viewDetails.title}
				</h1>
				<div className="flex items-center mb-6 dark:text-cyan-400 text-cyan-600 font-serif">
					<Star className="w-5 h-5 text-yellow-400 mr-1" />
					<span className="font-semibold mr-2">
						{viewDetails.averageRating.toFixed(2)}
					</span>
					<span className="mr-2">·</span>
					<span className="underline font-semibold">
						{viewDetails.location}
					</span>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					<div className="space-y-4">
						<img
							src={viewDetails.photos[0]}
							alt={viewDetails.title}
							className="w-full h-96 object-cover rounded-2xl shadow-2xl"
						/>
						<div className="grid grid-cols-2 gap-4">
							{viewDetails.photos.map((photo, index) => (
								<img
									key={index}
									src={photo}
									alt={`${viewDetails.title} - ${index + 1}`}
									className="w-full h-48 object-cover rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105"
								/>
							))}
						</div>
					</div>
					<div className="space-y-6 font-serif text-black">
						<div className="border rounded-2xl p-6 shadow-lg bg-white">
							<div className="flex justify-between items-center mb-4">
								<span className="text-3xl font-bold">
									${viewDetails.price}{" "}
									<span className="text-base font-normal">Night</span>
								</span>
								<div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
									<Star className="w-4 h-4 text-yellow-400 mr-1" />
									<span className="font-semibold">
										{viewDetails.averageRating.toFixed(2)}
									</span>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2 mb-4">
								<div className="border rounded-tl-lg rounded-bl-lg p-2 focus-within:ring-1 focus-within:ring-sky-500 transition duration-300">
									<label className="block text-xs font-semibold ">
										CHECK-IN
									</label>
									<DatePicker
										selected={checkIn}
										onChange={(date) => setCheckIn(date)}
										selectsStart
										startDate={checkIn}
										endDate={checkOut}
										minDate={new Date()}
										placeholderText="Select date"
										className="w-full border-none focus:ring-0"
									/>
								</div>
								<div className="border rounded-tr-lg rounded-br-lg p-2 focus-within:ring-1 focus-within:ring-grey-500 transition duration-300">
									<label className="block text-xs font-semibold">
										CHECKOUT
									</label>
									<DatePicker
										selected={checkOut}
										onChange={(date) => setCheckOut(date)}
										selectsEnd
										startDate={checkIn}
										endDate={checkOut}
										minDate={checkIn || new Date()}
										placeholderText="Select date"
										className="w-full border-none focus:ring-0"
									/>
								</div>
							</div>
							{numOfNights > 0 && (
								<div className="text-sm text-gray-600 mb-4">
									{numOfNights} night{numOfNights > 1 ? "s" : ""}
								</div>
							)}
							<div className="border rounded-lg p-2 mb-4">
								<label className="block text-xs font-semibold text-gray-600 mb-2">
									GUESTS
								</label>
								<div className="flex justify-between items-center">
									<div>
										<div className="font-medium">Adults</div>
										<div className="text-sm text-gray-500">Ages 13+</div>
									</div>
									<div className="flex items-center space-x-2">
										<button
											onClick={() => handleGuestsChange("adults", "decrease")}
											className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
										>
											<Remove fontSize="small" />
										</button>
										<span className="w-8 text-center">{guests.adults}</span>
										<button
											onClick={() => handleGuestsChange("adults", "increase")}
											className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
										>
											<Add fontSize="small" />
										</button>
									</div>
								</div>
								<div className="flex justify-between items-center mt-4">
									<div>
										<div className="font-medium">Children</div>
										<div className="text-sm text-gray-500">Ages 2-12</div>
									</div>
									<div className="flex items-center space-x-2">
										<button
											onClick={() => handleGuestsChange("children", "decrease")}
											className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
										>
											<Remove fontSize="small" />
										</button>
										<span className="w-8 text-center">{guests.children}</span>
										<button
											onClick={() => handleGuestsChange("children", "increase")}
											className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
										>
											<Add fontSize="small" />
										</button>
									</div>
								</div>
							</div>
							<div className="border rounded-lg p-2 mb-4">
								<h3 className="text-lg font-bold mb-2">Total</h3>
								{numOfNights > 0 && (
									<div className="flex justify-between items-center mb-2">
										<span>
											${viewDetails?.price} x {numOfNights} night
											{numOfNights > 1 ? "s" : ""}
										</span>
										<span>${subtotal.toFixed(2)}</span>
									</div>
								)}
								<div className="flex justify-between items-center mb-2">
									<span>Service Fee</span>
									<span>${serviceFee.toFixed(2)}</span>
								</div>
								<div className="flex justify-between items-center font-bold">
									<span>Total</span>
									<span>${total.toFixed(2)}</span>
								</div>
							</div>
							<button
								onClick={handleBooking}
								disabled={processing}
								className={`w-full py-2 px-4 rounded-lg font-semibold ${
									processing
										? "bg-gray-400 text-gray-600 cursor-not-allowed"
										: "bg-blue-600 text-white hover:bg-blue-700"
								}`}
							>
								{processing ? "Processing..." : "Book & Pay"}
							</button>
						</div>
					</div>
				</div>
				<div className="space-y-8 font-serif">
					<div>
						<h2 className="text-3xl font-semibold mb-2">About this place</h2>
						<p className="leading-relaxed text-justify">
							{viewDetails.description} Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Asperiores distinctio non similique architecto
							perspiciatis quos, molestias minus eius maiores. Corporis non
							ipsam asperiores. Autem rerum deleniti exercitationem quia
							consequatur expedita. Inventore neque ipsa, architecto, quo
							eveniet magni excepturi molestiae unde totam illum eaque,
							accusantium dolore? Odit, illum numquam, nisi deleniti beatae
							accusamus maxime velit sapiente molestias voluptatibus rerum iste
							et. Sit pariatur modi vel ut odit reiciendis quam veritatis,
							laudantium nemo animi, facere similique labore! Beatae deserunt
							quam sapiente odit laboriosam nemo eveniet, tenetur eaque
							dignissimos quia doloremque explicabo soluta. Excepturi blanditiis
							voluptate magni corporis laudantium quibusdam at velit cupiditate
							adipisci libero ipsum, reiciendis aut impedit, perspiciatis autem
							molestias. Placeat odit voluptatem suscipit. Perferendis, dolor
							reiciendis quidem explicabo odio deleniti! Odio perferendis, animi
							mollitia esse ipsa quasi modi omnis praesentium repudiandae sunt
							temporibus soluta beatae quis vitae, officiis non ut cupiditate,
							voluptas quisquam in alias deserunt! Vel omnis quam perferendis!
							Sapiente ea totam enim asperiores hic officiis aperiam nesciunt,
							temporibus veritatis eius dolore magnam reprehenderit, illo natus
							nobis dicta? Facere autem maxime hic quae deserunt incidunt
							nostrum suscipit, rem ut. Delectus, recusandae saepe repellendus
							facere voluptas quo ea provident, molestias eveniet dolorum
							dolores consectetur? Accusamus dolores cupiditate illo autem
							facere maiores, tempore dolore sapiente perspiciatis distinctio
							nihil maxime unde molestias. A Impedit, quaerat
						</p>
					</div>

					<div>
						<h2 className="text-2xl font-semibold mb-4">
							What this place offers
						</h2>
						<ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<li className="flex items-center space-x-2">
								<BedIcon className="dark:text-cyan-400 text-cyan-600" />{" "}
								<span>{viewDetails.bedrooms} Bedrooms</span>
							</li>
							<li className="flex items-center space-x-2">
								<ShowerIcon className="dark:text-cyan-400 text-cyan-600" />{" "}
								<span>{viewDetails.bathrooms} Bathrooms</span>
							</li>
							<li className="flex items-center space-x-2">
								<WifiIcon className="dark:text-cyan-400 text-cyan-600" />{" "}
								<span>Free WiFi</span>
							</li>
							<li className="flex items-center space-x-2">
								<LocalParkingIcon className="dark:text-cyan-400 text-cyan-600" />{" "}
								<span>Free parking</span>
							</li>
							<li className="flex items-center space-x-2">
								<AcUnitIcon className="dark:text-cyan-400 text-cyan-600" />{" "}
								<span>Air conditioning</span>
							</li>
							<li className="flex items-center space-x-2">
								<TvIcon className="dark:text-cyan-400 text-cyan-600" />{" "}
								<span>TV</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<Toaster />
		</Elements>
	);
};

export default PlaceDetails;
