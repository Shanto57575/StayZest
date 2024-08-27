import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	deletePlace,
	fetchPlaces,
	setPage,
	updatePlace,
} from "../features/places/placesSlice";
import { formatDate } from "./converter";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import toast, { Toaster } from "react-hot-toast";
import EditPlaceModal from "./EditPlaceModal";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Places = () => {
	const dispatch = useDispatch();
	const { places, placeLoading, error, totalPages, currentPage } = useSelector(
		(state) => state.places
	);
	const { currentUser } = useSelector((state) => state.auth);

	const [sortBy, setSortBy] = useState("price_asc");
	const [filterCountry, setFilterCountry] = useState("");
	const [searchTitle, setSearchTitle] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPlace, setEditingPlace] = useState(null);

	useEffect(() => {
		dispatch(
			fetchPlaces({
				page: currentPage,
				limit: 8,
				sortBy,
				filterCountry,
				searchTitle,
			})
		);
	}, [dispatch, currentPage, sortBy, filterCountry, searchTitle]);

	const handlePageChange = (newPage) => {
		dispatch(setPage(newPage));
	};

	const handlePlaceEdit = (place) => {
		setEditingPlace(place);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingPlace(null);
	};

	const handleSubmit = async (updatedData) => {
		try {
			await dispatch(
				updatePlace({ placeId: editingPlace._id, updatedData })
			).unwrap();
			toast.success("Place updated successfully!", {
				duration: 3000,
				className:
					"bg-gradient-to-r from-green-400 to-green-600 text-white font-bold",
			});
			handleCloseModal();
		} catch (err) {
			toast.error("Failed to update place. Please try again.", {
				className:
					"bg-gradient-to-r from-red-400 to-red-600 text-white font-bold",
			});
		}
	};

	const handlePlaceDelete = async (placeId) => {
		toast((t) => (
			<div className="flex flex-col items-center">
				<h2 className="text-lg font-semibold text-center">
					Are you sure you want to delete this place?
				</h2>
				<div className="flex space-x-4 mt-4">
					<button
						onClick={async () => {
							toast.dismiss(t.id);
							try {
								await dispatch(deletePlace(placeId)).unwrap();
								toast.success("Place deleted successfully!", {
									duration: 3000,
									className:
										"bg-gradient-to-r from-sky-400 to-sky-600 text-white font-bold",
								});
								if (places.length === 1 && currentPage > 1) {
									dispatch(setPage(currentPage - 1));
								} else {
									dispatch(
										fetchPlaces({
											page: currentPage,
											limit: 8,
											sortBy,
											filterCountry,
											searchTitle,
										})
									);
								}
							} catch (err) {
								toast.error("Failed to delete place. Please try again.", {
									className:
										"bg-gradient-to-r from-red-400 to-red-600 text-white font-bold",
								});
							}
						}}
						className="bg-blue-500 text-white px-4 py-2 rounded-lg"
					>
						Yes
					</button>
					<button
						onClick={() => toast.dismiss(t.id)}
						className="bg-rose-600 text-white px-4 py-2 rounded-lg"
					>
						No
					</button>
				</div>
			</div>
		));
	};

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		cssEase: "cubic-bezier(0.45, 0, 0.55, 1)",
		fade: true,
	};

	if (error)
		return (
			<div className="h-screen flex items-center justify-center">
				<p className="text-4xl text-rose-600 font-bold font-serif">
					Error: {error}
				</p>
			</div>
		);

	return (
		<div className="py-3 font-serif min-h-screen">
			<div className="w-full mx-auto">
				<div className="my-12 space-y-6">
					<h1 className="text-center mt-20 md:text-left text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-rose-600 to-rose-600">
						Discover Amazing Places
					</h1>
					<div className="flex flex-wrap items-center justify-between gap-4">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="w-full md:w-48 font-serif px-4 py-2 rounded-full bg-white dark:bg-gray-800 border-2 border-sky-300 dark:border-sky-600 focus:border-sky-500 focus:ring focus:ring-sky-200 dark:focus:ring-sky-800 transition duration-300"
						>
							<option value="price_asc">Price: Low to High</option>
							<option value="price_desc">Price: High to Low</option>
						</select>
						<select
							value={filterCountry}
							onChange={(e) => setFilterCountry(e.target.value)}
							className="w-full md:w-48 font-serif px-4 py-2 rounded-full bg-white dark:bg-gray-800 border-2 border-sky-300 dark:border-sky-600 focus:border-sky-500 focus:ring focus:ring-sky-200 dark:focus:ring-sky-800 transition duration-300"
						>
							<option value="">All Countries</option>
							<option value="USA">USA</option>
							<option value="UK">UK</option>
							<option value="GREECE">Greece</option>
							<option value="AUSTRALIA">Australia</option>
							<option value="UAE">UAE</option>
							<option value="THAILAND">Thailand</option>
							<option value="FRANCE">France</option>
							<option value="Switzerland">Switzerland</option>
						</select>
						<input
							type="text"
							placeholder="Search by title"
							value={searchTitle}
							onChange={(e) => setSearchTitle(e.target.value)}
							className="w-full md:w-48 font-serif px-4 py-2 rounded-full bg-white dark:bg-gray-800 border-2 border-sky-300 dark:border-sky-600 focus:border-sky-500 focus:ring focus:ring-sky-200 dark:focus:ring-sky-800 transition duration-300"
						/>
					</div>
				</div>

				{placeLoading ? (
					<div className="flex justify-center items-center h-screen">
						<div className="relative w-24 h-24">
							<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
							<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
							<FlightTakeoffIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
						</div>
					</div>
				) : (
					<div className="">
						{places.length === 0 ? (
							<p className="flex items-center justify-center bg-blue-500 p-4 border-l-8 border-rose-500 max-w-xl mx-auto text-white text-xl font-bold">
								No places found. Time to explore new horizons!
							</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
								{places.map((place) => (
									<div
										key={place._id}
										className="group w-full relative overflow-hidden rounded-2xl hover:scale-105 transition duration-300"
									>
										<Slider {...settings}>
											{place.photos.map((photo, index) => (
												<div key={index} className="relative w-full">
													<img
														className="w-full h-64 -mb-4 object-cover rounded-lg cursor-pointer filter group-hover:brightness-75 transition duration-300 shadow-2xl shadow-white dark:shadow-black"
														src={photo}
														alt={`${place.location} - ${index + 1}`}
													/>
												</div>
											))}
										</Slider>
										<div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
											<h3 className="text-lg md:text-2xl font-bold text-white mb-1">
												{place.location}
											</h3>
											<p className="text-lg font-semibold text-sky-300 mb-2">
												{place.country}
											</p>
											<p className="text-xl md:text-3xl font-extrabold text-yellow-400 mb-2">
												${place.price}
												<span className="text-sm font-normal text-yellow-200">
													{" "}
													/ Night
												</span>
											</p>
											<p className="text-sm text-gray-300">
												{formatDate(place.availability[0].startDate)} -{" "}
												{formatDate(place.availability[0].endDate)}
											</p>
											{currentUser.role !== "ADMIN" && (
												<Link
													className="text-center mt-2 bg-transparent border-b-4 w-32 mx-auto rounded-xl py-2 text-white hover:border-t-2 font-bold duration-700"
													to={`details/${place._id}`}
												>
													View Details
												</Link>
											)}
											{currentUser.role === "ADMIN" && (
												<div className="flex justify-end mt-4 space-x-2">
													<Tooltip title="View Details" placement="top" arrow>
														<Link
															className="p-2 rounded-full bg-sky-500 duration-300 text-white"
															to={`details/${place._id}`}
														>
															<InfoIcon fontSize="medium" />
														</Link>
													</Tooltip>
													<Tooltip title="Edit" placement="top" arrow>
														<button
															onClick={() => handlePlaceEdit(place)}
															className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 duration-300"
														>
															<ModeEditIcon fontSize="medium" />
														</button>
													</Tooltip>
													<Tooltip title="Delete" placement="top" arrow>
														<button
															onClick={() => handlePlaceDelete(place._id)}
															className="p-2 bg-rose-600 rounded-full hover:bg-rose-500 text-white duration-300"
														>
															<DeleteForeverIcon fontSize="medium" />
														</button>
													</Tooltip>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{totalPages > 1 && (
					<div className="flex flex-wrap justify-center mt-10">
						{Array.from({ length: totalPages }, (_, index) => (
							<button
								onClick={() => handlePageChange(index + 1)}
								key={index + 1}
								className={`rounded-full w-10 h-10 m-1 flex items-center justify-center transition shadow-lg shadow-gray-500 dark:shadow-black duration-300 ${
									currentPage === index + 1
										? "bg-sky-500 text-white"
										: "bg-white text-sky-500 border border-sky-500 hover:bg-sky-200"
								}`}
							>
								{index + 1}
							</button>
						))}
					</div>
				)}

				{editingPlace && (
					<EditPlaceModal
						isOpen={isModalOpen}
						onClose={handleCloseModal}
						onSubmit={handleSubmit}
						initialData={{
							title: editingPlace.title,
							description: editingPlace.description,
							location: editingPlace.location,
							country: editingPlace.country,
							price: editingPlace.price,
							averageRating: editingPlace.averageRating,
							bedrooms: editingPlace.bedrooms,
							bathrooms: editingPlace.bathrooms,
							totalGuests: editingPlace.totalGuests,
							photos: editingPlace.photos,
							availability: editingPlace.availability[0],
						}}
					/>
				)}

				<Toaster />
			</div>
		</div>
	);
};

export default Places;
