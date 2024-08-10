import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

const EditPlaceModal = ({ isOpen, onClose, onSubmit, initialData }) => {
	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: initialData,
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

	useEffect(() => {
		if (isOpen) {
			reset(initialData);
		}
	}, [isOpen, initialData, reset]);

	const onFormSubmit = (data) => {
		onSubmit(data);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 overflow-y-auto font-serif">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
					<div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-3xl font-bold dark:text-white">
							Edit Place Details
						</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
						>
							<CloseIcon fontSize="large" />
						</button>
					</div>
					<form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
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
									className="block text-sm font-medium dark:text-gray-300"
								>
									Description
								</label>
								<input
									{...register("description", {
										required: "Description is required",
									})}
									id="description"
									rows="3"
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
								/>
								{errors.description && (
									<p className="mt-1 text-sm text-rose-600">
										{errors.description.message}
									</p>
								)}
							</div>

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
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
								>
									<option value="USA">USA</option>
									<option value="UK">UK</option>
									<option value="GREECE">GREECE</option>
									<option value="AUSTRALIA">AUSTRALIA</option>
									<option value="UAE">UAE</option>
									<option value="THAILAND">THAILAND</option>
									<option value="FRANCE">FRANCE</option>
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
									{...register("location", {
										required: "Location is required",
									})}
									id="location"
									type="text"
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
								/>
								{errors.location && (
									<p className="mt-1 text-sm text-rose-600">
										{errors.location.message}
									</p>
								)}
							</div>

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
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
								/>
								{errors.price && (
									<p className="mt-1 text-sm text-rose-600">
										{errors.price.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="rating"
									className="block text-sm font-medium dark:text-gray-300"
								>
									Rating
								</label>
								<input
									{...register("rating", {
										required: "Rating is required",
										min: { value: 0, message: "Rating must be positive" },
										max: { value: 5, message: "Rating must be 5 or less" },
									})}
									id="rating"
									type="number"
									step="0.1"
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
								/>
								{errors.rating && (
									<p className="mt-1 text-sm text-rose-600">
										{errors.rating.message}
									</p>
								)}
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
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
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
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
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
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
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
									className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
								/>
								{errors.bathrooms && (
									<p className="mt-1 text-sm text-rose-600">
										{errors.bathrooms.message}
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
										className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
									/>
									<button
										type="button"
										onClick={() => removePhoto(index)}
										className="ml-2 text-rose-600"
									>
										<DeleteOutlineIcon />
									</button>
								</div>
							))}
							<button
								type="button"
								onClick={() => appendPhoto("")}
								className="mt-2 flex items-center text-indigo-600 font-serif"
							>
								<AddCircleIcon className="mr-1" /> Add Photo
							</button>
						</div>

						<div>
							<label className="block text-sm font-medium dark:text-gray-300">
								Availability
							</label>
							{availabilityFields.map((field, index) => (
								<div
									key={field.id}
									className="flex flex-wrap gap-3 items-center mt-2 space-x-2"
								>
									<input
										{...register(`availability.${index}.startDate`, {
											required: "Start date is required",
										})}
										type="date"
										className="flex-grow rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
									/>
									<input
										{...register(`availability.${index}.endDate`, {
											required: "End date is required",
										})}
										type="date"
										className="flex-grow rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-transparent dark:text-white dark:border-gray-600"
									/>
									<button
										type="button"
										onClick={() => removeAvailability(index)}
										className="text-rose-600"
									>
										<DeleteOutlineIcon />
									</button>
								</div>
							))}
							<button
								type="button"
								onClick={() =>
									appendAvailability({ startDate: "", endDate: "" })
								}
								className="mt-2 flex items-center text-indigo-600 font-serif"
							>
								<AddCircleIcon className="mr-1" /> Add Availability
							</button>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg font-semibold"
							>
								Save Changes
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditPlaceModal;
