import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPlaces, setPage } from "../features/places/placesSlice";
import Loader from "./Loader";
import { Rotate } from "react-awesome-reveal";
import { formatDate } from "./converter";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Select, MenuItem, TextField, Button } from "@mui/material";

const Places = () => {
	const dispatch = useDispatch();
	const { places, loading, error, totalPages, currentPage } = useSelector(
		(state) => state.places
	);

	const [wish, setWish] = useState(false);
	const [sortBy, setSortBy] = useState("price_asc");
	const [filterCountry, setFilterCountry] = useState("");
	const [searchTitle, setSearchTitle] = useState("");

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
					className="bg-white dark:bg-gray-900 border border-gray-400 p-3 w-48"
				>
					<option value="price_asc">Price: Low to High</option>
					<option value="price_desc">Price: High to Low</option>
				</select>

				<select
					value={filterCountry}
					onChange={(e) => setFilterCountry(e.target.value)}
					className="bg-white dark:bg-gray-900 border border-gray-400 p-3 w-48"
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
					className="bg-white dark:bg-gray-900 border border-gray-400 p-3 w-48"
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
									<Link
										to={`details/${place._id}`}
										className="space-y-1 cursor-pointer"
									>
										<Rotate>
											<img
												className="w-full h-60 rounded-xl hover:scale-100 scale-105 duration-500 mb-4 shadow-2xl shadow-cyan-900"
												src={place.photos[0]}
												alt="loading..."
											/>
											<div
												onClick={() => setWish(!wish)}
												className="absolute bottom-56 right-3"
											>
												{wish ? (
													<FavoriteIcon color="error" />
												) : (
													<FavoriteBorderIcon />
												)}
											</div>
										</Rotate>
										<article className="pt-3">
											<p className="font-black text-xl">{place.country}</p>
											<p className="font-black text-xl">{place.location}</p>
											<p className="text-gray-500">${place.price} Night</p>
											<p>
												{formatDate(place.availability[0].startDate)} -{" "}
												{formatDate(place.availability[0].endDate)}
											</p>
										</article>
									</Link>
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
			</div>
		</>
	);
};

export default Places;
