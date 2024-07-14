import { useForm, Controller } from "react-hook-form";
import { TextField, MenuItem, Button } from "@mui/material";

const placeTypes = [
	"lakefront",
	"beachfront",
	"countryside",
	"cabins",
	"castles",
	"rooms",
	"camp",
	"caves",
];

const PlaceCreationForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {
		console.log(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-32"
		>
			<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
				Create a New Place
			</h2>

			<div className="space-y-5">
				<div className="flex items-center justify-between gap-x-3">
					<Controller
						name="title"
						control={control}
						defaultValue=""
						rules={{ required: "Title is required" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Title"
								variant="outlined"
								fullWidth
								error={!!errors.title}
								helperText={errors.title?.message}
							/>
						)}
					/>
					<Controller
						name="totalGuests"
						control={control}
						defaultValue=""
						rules={{ required: "Total guests is required", min: 1 }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Total Guests"
								type="number"
								variant="outlined"
								fullWidth
								error={!!errors.totalGuests}
								helperText={errors.totalGuests?.message}
							/>
						)}
					/>
				</div>
				<Controller
					name="description"
					control={control}
					defaultValue=""
					rules={{ required: "Description is required" }}
					render={({ field }) => (
						<div className="flex items-center">
							<TextField
								{...field}
								label="Description"
								variant="outlined"
								fullWidth
								multiline
								rows={4}
								error={!!errors.description}
								helperText={errors.description?.message}
							/>
						</div>
					)}
				/>
				<div className="flex items-center justify-between gap-x-3">
					<Controller
						name="location"
						control={control}
						defaultValue=""
						rules={{ required: "Location is required" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Location"
								variant="outlined"
								fullWidth
								error={!!errors.location}
								helperText={errors.location?.message}
							/>
						)}
					/>
					<Controller
						name="price"
						control={control}
						defaultValue=""
						rules={{ required: "Price is required", min: 0 }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Price"
								type="number"
								variant="outlined"
								fullWidth
								error={!!errors.price}
								helperText={errors.price?.message}
							/>
						)}
					/>
				</div>

				<div className="flex items-center justify-between gap-x-3">
					<Controller
						name="photos"
						control={control}
						defaultValue={[]}
						rules={{ required: "At least one photo is required" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Photo URLs"
								variant="outlined"
								fullWidth
								error={!!errors.photos}
								helperText={errors.photos?.message}
							/>
						)}
					/>
					<Controller
						name="placeTypes"
						control={control}
						defaultValue=""
						rules={{ required: "Place type is required" }}
						render={({ field }) => (
							<TextField
								{...field}
								select
								label="Place Type"
								variant="outlined"
								fullWidth
								error={!!errors.placeTypes}
								helperText={errors.placeTypes?.message}
							>
								{placeTypes.map((option) => (
									<MenuItem key={option} value={option}>
										{option.charAt(0).toUpperCase() + option.slice(1)}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
				</div>

				<div className="flex items-center justify-between gap-x-3">
					<Controller
						name="bedrooms"
						control={control}
						defaultValue=""
						rules={{ required: "Number of bedrooms is required", min: 1 }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Bedrooms"
								type="number"
								variant="outlined"
								fullWidth
								error={!!errors.bedrooms}
								helperText={errors.bedrooms?.message}
							/>
						)}
					/>
					<Controller
						name="bathrooms"
						control={control}
						defaultValue=""
						rules={{ required: "Number of bathrooms is required", min: 1 }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Bathrooms"
								type="number"
								variant="outlined"
								fullWidth
								error={!!errors.bathrooms}
								helperText={errors.bathrooms?.message}
							/>
						)}
					/>
				</div>
				<div className="col-span-full">
					<h3 className="text-lg font-semibold mb-6 flex items-center">
						Select Availability
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<Controller
							name="availabilityStart"
							control={control}
							defaultValue=""
							rules={{ required: "Start date is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label="Start Date"
									type="date"
									variant="outlined"
									fullWidth
									InputLabelProps={{ shrink: true }}
									error={!!errors.availabilityStart}
									helperText={errors.availabilityStart?.message}
								/>
							)}
						/>
						<Controller
							name="availabilityEnd"
							control={control}
							defaultValue=""
							rules={{ required: "End date is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label="End Date"
									type="date"
									variant="outlined"
									fullWidth
									InputLabelProps={{ shrink: true }}
									error={!!errors.availabilityEnd}
									helperText={errors.availabilityEnd?.message}
								/>
							)}
						/>
					</div>
				</div>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
				>
					Create Place
				</Button>
			</div>
		</form>
	);
};

export default PlaceCreationForm;
