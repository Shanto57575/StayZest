import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	deletePlace,
	fetchPlaces,
	setPage,
	updatePlace,
} from "../features/places/placesSlice";
import Loader from "./Loader";
import { formatDate } from "./converter";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import toast, { Toaster } from "react-hot-toast";
import EditPlaceModal from "./EditPlaceModal";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

const Places = () => {
	const dispatch = useDispatch();
	const { places, loading, error, totalPages, currentPage } = useSelector(
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
	};

	if (error)
		return (
			<div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800">
				<p className="text-4xl text-red-600 dark:text-red-400 font-bold font-serif animate-pulse">
					Error: {error}
				</p>
			</div>
		);

	return (
		<div className="p-8 font-serif">
			<div className="max-w-7xl mx-auto">
				<div className="my-12 space-y-6">
					<h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-rose-400 to-pink-600">
						Discover Amazing Places
					</h1>
					<div className="flex flex-wrap items-center justify-between gap-4">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="w-48 font-serif px-4 py-2 rounded-full bg-white dark:bg-gray-800 border-2 border-sky-300 dark:border-sky-600 focus:border-pink-500 focus:ring focus:ring-pink-200 dark:focus:ring-pink-800 transition duration-300"
						>
							<option value="price_asc">Price: Low to High</option>
							<option value="price_desc">Price: High to Low</option>
						</select>
						<select
							value={filterCountry}
							onChange={(e) => setFilterCountry(e.target.value)}
							className="w-48 font-serif px-4 py-2 rounded-full bg-white dark:bg-gray-800 border-2 border-sky-300 dark:border-sky-600 focus:border-pink-500 focus:ring focus:ring-pink-200 dark:focus:ring-pink-800 transition duration-300"
						>
							<option value="">All Countries</option>
							<option value="USA">USA</option>
							<option value="UK">UK</option>
							<option value="GREECE">Greece</option>
							<option value="AUSTRALIA">Australia</option>
							<option value="UAE">UAE</option>
							<option value="THAILAND">Thailand</option>
							<option value="FRANCE">France</option>
						</select>
						<input
							type="text"
							placeholder="Search by title"
							value={searchTitle}
							onChange={(e) => setSearchTitle(e.target.value)}
							className="w-48 font-serif px-4 py-2 rounded-full bg-white dark:bg-gray-800 border-2 border-sky-300 dark:border-sky-600 focus:border-pink-500 focus:ring focus:ring-pink-200 dark:focus:ring-pink-800 transition duration-300"
						/>
					</div>
				</div>

				{loading ? (
					<Loader />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{places.length === 0 ? (
							<p className="col-span-full h-screen text-center text-3xl font-bold">
								No places found. Time to explore new horizons!
							</p>
						) : (
							places.map((place) => (
								<div
									key={place._id}
									className="group relative overflow-hidden rounded-2xl transform hover:scale-105 transition duration-300 shadow-2xl shadow-black"
								>
									<img
										className="w-full cursor-pointer h-64 object-cover filter group-hover:brightness-75 transition duration-300 shadow-2xl shadow-white dark:shadow-black"
										src={place.photos[0] || place.photos[1]}
										alt={place.location}
									/>
									<div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
										<h3 className="text-2xl font-bold text-white mb-1">
											{place.location}
										</h3>
										<p className="text-lg font-semibold text-sky-300 mb-2">
											{place.country}
										</p>
										<p className="text-3xl font-extrabold text-yellow-400 mb-2">
											${place.price}
											<span className="text-sm font-normal text-yellow-200">
												{" "}
												/ night
											</span>
										</p>
										<p className="text-sm text-gray-300">
											{formatDate(place.availability[0].startDate)} -{" "}
											{formatDate(place.availability[0].endDate)}
										</p>
										{currentUser.role === "ADMIN" && (
											<div className="flex justify-end mt-4 space-x-2">
												<Tooltip title="View Details" placement="top" arrow>
													<Link
														className="bg-black p-2 rounded-full hover:bg-gray-900 transition duration-300"
														to={`details/${place._id}`}
													>
														<InfoIcon />
													</Link>
												</Tooltip>
												<Tooltip title="Edit" placement="top" arrow>
													<button
														onClick={() => handlePlaceEdit(place)}
														className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition duration-300"
													>
														<ModeEditIcon className="text-white" />
													</button>
												</Tooltip>
												<Tooltip title="Delete" placement="top" arrow>
													<button
														onClick={() => handlePlaceDelete(place._id)}
														className="p-2 bg-rose-600 rounded-full hover:bg-rose-500 transition duration-300"
													>
														<DeleteForeverIcon className="text-white" />
													</button>
												</Tooltip>
											</div>
										)}
									</div>
								</div>
							))
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
							rating: editingPlace.averageRating,
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
