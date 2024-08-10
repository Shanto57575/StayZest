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
import { Rotate } from "react-awesome-reveal";
import { formatDate } from "./converter";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import EditPlaceModal from "./EditPlaceModal";

const Places = () => {
	const dispatch = useDispatch();
	const { places, loading, error, totalPages, currentPage } = useSelector(
		(state) => state.places
	);

	const { currentUser } = useSelector((state) => state.auth);

	const [sortBy, setSortBy] = useState("price_asc");
	const [filterCountry, setFilterCountry] = useState("");
	const [searchTitle, setSearchTitle] = useState("");

	// New state for modal
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

	// Place Edit
	const handlePlaceEdit = (place) => {
		setEditingPlace(place);
		setIsModalOpen(true);
	};

	// Handle modal close
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingPlace(null);
	};

	// Handle form submission
	const handleSubmit = async (updatedData) => {
		try {
			await dispatch(
				updatePlace({ placeId: editingPlace._id, updatedData })
			).unwrap();

			toast.success("Place has been updated", {
				iconTheme: {
					primary: "#ffffff",
					secondary: "green",
				},
				duration: 3000,
				className: "bg-green-600 text-white",
			});

			handleCloseModal();
		} catch (err) {
			toast.error("Failed to update place. Please try again later.");
		}
	};

	// Place Delete
	const handlePlaceDelete = async (placeId) => {
		try {
			await dispatch(deletePlace(placeId)).unwrap();

			toast.success("Place has been deleted", {
				iconTheme: {
					primary: "#ffffff",
					secondary: "red",
				},
				duration: 3000,
				className: "bg-rose-600 text-white",
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
			toast.error("Failed to delete place. Please try again later.");
		}
	};

	if (error)
		return (
			<p className="h-screen flex items-center justify-center text-4xl text-rose-600 font-serif">
				Error: {error}
			</p>
		);

	return (
		<>
			<div className="flex flex-wrap justify-between mt-24 gap-4 font-serif mb-10">
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="bg-white rounded-md dark:bg-gray-900 border-2 border-gray-400 hover:border-sky-400 p-3 w-48"
				>
					<option value="price_asc">Price: Low to High</option>
					<option value="price_desc">Price: High to Low</option>
				</select>

				<select
					value={filterCountry}
					onChange={(e) => setFilterCountry(e.target.value)}
					className="bg-white rounded-md dark:bg-gray-900 border-2 border-gray-400 hover:border-sky-400 p-3 w-48"
				>
					<option value="">All Countries</option>
					<option value="USA">USA</option>
					<option value="UK">UK</option>
					<option value="GREECE">GREECE</option>
					<option value="AUSTRALIA">AUSTRALIA</option>
					<option value="UAE">UAE</option>
					<option value="THAILAND">THAILAND</option>
					<option value="FRANCE">FRANCE</option>
				</select>

				<input
					type="text"
					placeholder="Search by title"
					value={searchTitle}
					onChange={(e) => setSearchTitle(e.target.value)}
					className="bg-white rounded-md dark:bg-gray-900 border-2 border-gray-400 hover:border-sky-400 p-3 w-48"
				/>
			</div>

			<div className="mt-10 mx-1 font-serif -z-50">
				{loading ? (
					<Loader />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
						{places.length === 0 ? (
							<plaintext className="font-serif text-gray-800 dark:text-white font-extrabold w-full mx-auto flex items-center justify-center text-3xl">
								No Place found!
							</plaintext>
						) : (
							places.map((place) => (
								<div key={place.index}>
									<Rotate>
										<Link
											to={`details/${place._id}`}
											className="space-y-1 cursor-pointer"
										>
											<img
												className="w-full h-60 rounded-xl hover:scale-100 scale-105 duration-500 mb-4 shadow-2xl shadow-cyan-900"
												src={place.photos[0]}
												alt={place.location}
											/>
										</Link>
									</Rotate>
									<article className="pt-3">
										<div className="flex items-center justify-between">
											<p className="font-black text-xl">{place.country}</p>
											{currentUser.role === "ADMIN" ? (
												<p>
													<ModeEditIcon
														onClick={() => handlePlaceEdit(place)}
														className="text-sky-500 cursor-pointer"
													/>
													<DeleteForeverIcon
														onClick={() => handlePlaceDelete(place._id)}
														className="text-rose-600 hover:text-rose-500 cursor-pointer"
													/>
												</p>
											) : (
												""
											)}
											<Toaster />
										</div>
										<p className="font-black text-xl">{place.location}</p>
										<p className="text-gray-500">${place.price} Night</p>
										<p>
											{formatDate(place.availability[0].startDate)} -{" "}
											{formatDate(place.availability[0].endDate)}
										</p>
									</article>
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
								className="rounded px-4 py-1 m-2 cursor-pointer bg-white text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white duration-700"
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
							location: editingPlace.location,
							country: editingPlace.country,
							price: editingPlace.price,
							startDate: editingPlace.availability[0].startDate,
							endDate: editingPlace.availability[0].endDate,
						}}
					/>
				)}
			</div>
		</>
	);
};

export default Places;
