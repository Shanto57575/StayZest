import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";
import { convertToMDY } from "./converter";
import { useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const BookingForm = ({ placeId, checkIn, checkOut, price, totalGuests }) => {
	const [open, setOpen] = useState(false);
	const user = useSelector((state) => state.auth.user);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	let pending = false;

	const onSubmit = async (bookingData) => {
		console.log("Form submitted:", bookingData);
		try {
			const response = await axios.post(
				"http://localhost:5000/api/booking/add-booking",
				bookingData,
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				toast.success(
					"Your booking has been added! Wait for the confirmation."
				);
				pending = true;
				console.log(response);
				reset();
			} else {
				toast.error(response.data.error || "An unexpected error occurred");
			}
		} catch (error) {
			console.error(error);
			toast.error(
				error.response?.data?.error ||
					"An error occurred while submitting your booking."
			);
		}
		setOpen(false);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div>
			<Toaster />
			{pending ? (
				<button className="w-full mt-4 bg-gradient-to-r from-lime-300 via-lime-400 to-lime-500 text-white py-3 rounded-lg font-semibold shadow-md hover:from-sky-600 hover:to-sky-700 transition duration-300">
					PENDING
				</button>
			) : (
				<button
					disabled={!checkIn || !checkOut}
					onClick={handleOpen}
					className="w-full mt-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-sky-600 hover:to-sky-700 transition duration-300"
				>
					Reserve
				</button>
			)}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
						className="mb-4"
					>
						StayZest
					</Typography>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
						<div className="flex items-center justify-between gap-x-3">
							<Controller
								name="place"
								defaultValue={placeId}
								control={control}
								rules={{ required: "PlaceId is required" }}
								render={({ field }) => (
									<TextField
										{...field}
										label="PlaceId"
										variant="outlined"
										fullWidth
										error={!!errors.place}
										helperText={errors.place?.message}
									/>
								)}
							/>
							<Controller
								name="user"
								defaultValue={user?._id}
								control={control}
								rules={{ required: "User is required" }}
								render={({ field }) => (
									<TextField
										{...field}
										label="UserId"
										variant="outlined"
										fullWidth
										error={!!errors.user}
										helperText={errors.user?.message}
									/>
								)}
							/>
						</div>
						<div className="flex items-center justify-between gap-x-3">
							<Controller
								name="checkIn"
								control={control}
								defaultValue={convertToMDY(checkIn)}
								rules={{ required: "Check-in date is required" }}
								render={({ field }) => (
									<TextField
										{...field}
										label="Check-in Date"
										type="text"
										variant="outlined"
										fullWidth
										InputLabelProps={{ shrink: true }}
										error={!!errors.checkIn}
										helperText={errors.checkIn?.message}
									/>
								)}
							/>
							<Controller
								name="checkOut"
								control={control}
								defaultValue={convertToMDY(checkOut)}
								rules={{ required: "Check-out date is required" }}
								render={({ field }) => (
									<TextField
										{...field}
										label="Check-out Date"
										type="text"
										variant="outlined"
										fullWidth
										InputLabelProps={{ shrink: true }}
										error={!!errors.checkOut}
										helperText={errors.checkOut?.message}
									/>
								)}
							/>
						</div>
						<Controller
							name="email"
							defaultValue={user?.email}
							control={control}
							rules={{ required: "Email is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									type="email"
									variant="outlined"
									fullWidth
									error={!!errors.email}
									helperText={errors.email?.message}
								/>
							)}
						/>
						<div className="flex items-center justify-between gap-x-3">
							<Controller
								name="guests"
								defaultValue={totalGuests}
								control={control}
								rules={{ required: "Total Guests is required" }}
								render={({ field }) => (
									<TextField
										{...field}
										label="Guests"
										type="text"
										variant="outlined"
										fullWidth
										error={!!errors.guests}
										helperText={errors.guests?.message}
									/>
								)}
							/>
							<Controller
								name="price"
								control={control}
								defaultValue={`${price}`}
								rules={{ required: "Price is required" }}
								render={({ field }) => (
									<TextField
										{...field}
										label="Price"
										type="text"
										variant="outlined"
										fullWidth
										error={!!errors.price}
										helperText={errors.price?.message}
									/>
								)}
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button onClick={handleClose} variant="contained" color="error">
								Cancel
							</Button>
							<Button type="submit" variant="contained" color="primary">
								Submit
							</Button>
						</div>
					</form>
				</Box>
			</Modal>
		</div>
	);
};

export default BookingForm;
