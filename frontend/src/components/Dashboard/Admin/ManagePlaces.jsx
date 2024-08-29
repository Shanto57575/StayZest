import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Fade } from "react-awesome-reveal";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ManagePlaces = () => {
	const [loading, setLoading] = useState(false);
	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: "",
			description: "",
			country: "",
			location: "",
			price: "",
			averageRating: "",
			photos: [""],
			availability: [{ startDate: "", endDate: "" }],
			placeTypes: "",
			totalGuests: "",
			bedrooms: "",
			bathrooms: "",
		},
	});

	const {
		fields: photoFields,
		append: appendPhoto,
		remove: removePhoto,
	} = useFieldArray({
		control,
		name: "photos",
	});

	const {
		fields: availabilityFields,
		append: appendAvailability,
		remove: removeAvailability,
	} = useFieldArray({
		control,
		name: "availability",
	});

	const onSubmit = async (data) => {
		try {
			setLoading(true);
			const response = await axios.post(
				"https://stayzest-backend.onrender.com/api/place/add-place",
				data,
				{ withCredentials: true }
			);
			if (response.data) {
				toast.success(<h1 className="font-serif">New Place added 👌</h1>, {
					position: "top-center",
				});
				setLoading(false);
				reset();
			}
		} catch (error) {
			setLoading(false);
			toast.error(error.response?.data.error);
		}
	};

	return (
		<div className="text-black">
			<Fade cascade>
				<h1 className="text-3xl font-bold text-center md:text-left mb-2 ml-12 font-serif dark:text-white">
					Add New Spot
				</h1>
			</Fade>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="max-w-4xl mx-auto p-4 space-y-6"
			>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium dark:text-gray-300"
						>
							Title
						</label>
						<input
							{...register("title", { required: "Title is required" })}
							id="title"
							type="text"
							className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
						/>
						{errors.title && (
							<p className="mt-1 text-sm text-rose-600">
								{errors.title.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium  dark:text-gray-300"
						>
							Description
						</label>
						<textarea
							{...register("description", {
								required: "Description is required",
							})}
							id="description"
							rows="3"
							className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
						></textarea>
						{errors.description && (
							<p className="mt-1 text-sm text-rose-600">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="country"
								className="block text-sm font-medium dark:text-gray-300"
							>
								Country
							</label>
							<select
								{...register("country", { required: "Country is required" })}
								id="country"
								type="text"
								className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent"
							>
								<option value="USA">USA</option>
								<option value="UK">UK</option>
								<option value="GREECE">GREECE</option>
								<option value="AUSTRALIA">AUSTRALIA</option>
								<option value="UAE">UAE</option>
								<option value="THAILAND">THAILAND</option>
								<option value="FRANCE">FRANCE</option>
								<option value="Switzerland">Switzerland</option>
							</select>
							{errors.country && (
								<p className="mt-1 text-sm text-rose-600">
									{errors.country.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="location"
								className="block text-sm font-medium dark:text-gray-300"
							>
								Location
							</label>
							<input
								{...register("location", { required: "Location is required" })}
								id="location"
								type="text"
								className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
							/>
							{errors.location && (
								<p className="mt-1 text-sm text-rose-600">
									{errors.location.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="price"
								className="block text-sm font-medium dark:text-gray-300"
							>
								Price
							</label>
							<input
								{...register("price", {
									required: "Price is required",
									min: { value: 0, message: "Price must be positive" },
								})}
								id="price"
								type="number"
								className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
							/>
							{errors.price && (
								<p className="mt-1 text-sm text-rose-600">
									{errors.price.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="averageRating"
								className="block text-sm font-medium dark:text-gray-300"
							>
								averageRating
							</label>
							<input
								{...register("averageRating", {
									required: "averageRating is required",
									min: { value: 0, message: "averageRating must be positive" },
								})}
								id="averageRating"
								type="number"
								className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
							/>
							{errors.averageRating && (
								<p className="mt-1 text-sm text-rose-600">
									{errors.averageRating.message}
								</p>
							)}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium dark:text-gray-300">
							Photos
						</label>
						{photoFields.map((field, index) => (
							<div key={field.id} className="flex items-center mt-2">
								<input
									{...register(`photos.${index}`, {
										required: "Photo URL is required",
									})}
									type="text"
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
								/>
								<button
									type="button"
									onClick={() => removePhoto(index)}
									className="ml-2 text-rose-600"
								>
									<DeleteOutlineIcon size={20} />
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => appendPhoto("")}
							className="mt-2 flex items-center text-indigo-600 font-serif"
						>
							<AddCircleIcon size={20} className="mr-1" /> Add Photo
						</button>
					</div>

					<div>
						<label className="block text-sm font-medium dark:text-gray-300">
							Availability
						</label>
						{availabilityFields.map((field, index) => (
							<div key={field.id} className="flex items-center mt-2 space-x-2">
								<input
									{...register(`availability.${index}.startDate`, {
										required: "Start date is required",
									})}
									type="date"
									className="flex-grow rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
								/>
								<input
									{...register(`availability.${index}.endDate`, {
										required: "End date is required",
									})}
									type="date"
									className="flex-grow rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
								/>
								<button
									type="button"
									onClick={() => removeAvailability(index)}
									className="text-rose-600"
								>
									<DeleteOutlineIcon size={20} />
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => appendAvailability({ startDate: "", endDate: "" })}
							className="mt-2 flex items-center text-indigo-600 font-serif"
						>
							<AddCircleIcon size={20} className="mr-1" /> Add Availability
						</button>
					</div>

					<div>
						<label
							htmlFor="placeTypes"
							className="block text-sm font-medium dark:text-gray-300 mb-2"
						>
							Place Type
						</label>
						<select
							{...register("placeTypes", {
								required: "Place type is required",
							})}
							id="placeTypes"
							className="flex-grow w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent"
						>
							<option value="lakefront">Lakefront</option>
							<option value="beachfront">Beachfront</option>
							<option value="countryside">Countryside</option>
							<option value="cabins">Cabins</option>
							<option value="castles">Castles</option>
							<option value="rooms">Rooms</option>
							<option value="camp">Camp</option>
							<option value="caves">Caves</option>
						</select>
						{errors.placeTypes && (
							<p className="mt-1 text-sm text-rose-600">
								{errors.placeTypes.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label
								htmlFor="totalGuests"
								className="block text-sm font-medium dark:text-gray-300"
							>
								Total Guests
							</label>
							<input
								{...register("totalGuests", {
									required: "Total guests is required",
									min: { value: 1, message: "Must be at least 1" },
								})}
								id="totalGuests"
								type="number"
								className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
							/>
							{errors.totalGuests && (
								<p className="mt-1 text-sm text-rose-600">
									{errors.totalGuests.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="bedrooms"
								className="block text-sm font-medium dark:text-gray-300"
							>
								Bedrooms
							</label>
							<input
								{...register("bedrooms", {
									required: "Number of bedrooms is required",
									min: { value: 1, message: "Must be at least 1" },
								})}
								id="bedrooms"
								type="number"
								className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
							/>
							{errors.bedrooms && (
								<p className="mt-1 text-sm text-rose-600">
									{errors.bedrooms.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="bathrooms"
								className="block text-sm font-medium dark:text-gray-300"
							>
								Bathrooms
							</label>
							<input
								{...register("bathrooms", {
									required: "Number of bathrooms is required",
									min: { value: 1, message: "Must be at least 1" },
								})}
								id="bathrooms"
								type="number"
								className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white"
							/>
							{errors.bathrooms && (
								<p className="mt-1 text-sm text-rose-600">
									{errors.bathrooms.message}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="pt-5">
					<div className="flex justify-end">
						<button
							disabled={loading}
							type="submit"
							className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							{loading ? (
								<div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-y-2 border-white"></div>
							) : (
								"SUBMIT"
							)}
						</button>
						{/* <Toaster /> */}
					</div>
				</div>
			</form>
		</div>
	);
};

export default ManagePlaces;
