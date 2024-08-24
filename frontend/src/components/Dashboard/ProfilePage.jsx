import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Avatar, IconButton } from "@mui/material";
import {
	Edit,
	Cancel,
	CloudUpload,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { userSignUpSuccess } from "../../features/auth/authSlice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ProfilePage = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.currentUser);
	const [isEditing, setIsEditing] = useState(false);
	const [newImage, setNewImage] = useState(null);
	const [showEmail, setShowEmail] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			username: user?.username,
			email: user?.email,
			profilePicture: user?.profilePicture,
		},
	});

	const axiosInstance = axios.create({
		baseURL: "http://localhost:5000/api",
		withCredentials: true,
	});

	const onUpdate = async (data, imageFile) => {
		try {
			const formData = new FormData();
			formData.append("username", data.username);
			formData.append("email", data.email);

			if (imageFile) {
				formData.append("profilePicture", imageFile);
			}

			const response = await axiosInstance.put(`/user/${user._id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 200) {
				dispatch(userSignUpSuccess(response.data.user));
				toast.success(
					<h1 className="font-serif">Profile updated successfully</h1>,
					{
						position: "top-center",
						icon: "🎉",
					}
				);
			}
		} catch (error) {
			console.error("Update Error:", error);
			toast.error(
				error.response?.data?.error ||
					"An error occurred while updating the profile"
			);
		}
	};

	const onSubmit = (data) => {
		const isDataChanged =
			data.username !== user.username ||
			data.email !== user.email ||
			(newImage && data.profilePicture !== user.profilePicture);

		if (isDataChanged) {
			onUpdate(data, newImage);
			setIsEditing(false);
		} else {
			toast.error("No changes have been made!");
		}
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setNewImage(e.target.files[0]);
			setValue("profilePicture", URL.createObjectURL(e.target.files[0]));
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-4 md:p-8 bg-gradient-to-tr from-blue-200 via-emerald-100 to-purple-100 rounded-lg shadow-md shadow-gray-500">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl md:text-3xl font-bold text-blue-600 font-serif">
						My Profile
					</h2>
					<IconButton
						onClick={() => setIsEditing(!isEditing)}
						color={isEditing ? "error" : "primary"}
						className="transition-transform hover:scale-110"
					>
						{isEditing ? <Cancel /> : <Edit />}
					</IconButton>
				</div>

				<div className="flex flex-col items-center space-y-4">
					<Controller
						name="profilePicture"
						control={control}
						render={({ field }) => (
							<div className="relative">
								<Avatar
									src={
										newImage
											? URL.createObjectURL(newImage)
											: `http://localhost:5000/${user.profilePicture}`
									}
									alt={user.username}
									sx={{ width: 120, height: 120 }}
									className="border-4 border-sky-700 shadow-lg shadow-sky-900 dark:shadow-white"
								/>
								{isEditing && (
									<label
										htmlFor="icon-button-file"
										className="absolute -bottom-2 -right-2"
									>
										<input
											accept="image/*"
											id="icon-button-file"
											type="file"
											onChange={handleImageChange}
											style={{ display: "none" }}
										/>
										<IconButton
											color="primary"
											component="span"
											className="bg-white shadow-md"
										>
											<CloudUpload />
										</IconButton>
									</label>
								)}
							</div>
						)}
					/>
					<div className="flex items-center font-serif space-x-2 bg-indigo-100 px-3 py-1 rounded-full">
						<span className="text-sky-900 font-semibold">{user?.role}</span>
						{user?.role === "ADMIN" ? (
							<AdminPanelSettingsIcon color="primary" />
						) : (
							<AssignmentIndIcon color="primary" />
						)}
					</div>
				</div>

				<Controller
					name="username"
					control={control}
					rules={{ required: "Username is required" }}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							label="Username"
							error={!!errors.username}
							helperText={errors.username?.message}
							disabled={!isEditing}
							variant={isEditing ? "outlined" : "filled"}
							InputProps={{
								className: "bg-white",
							}}
						/>
					)}
				/>

				<div className="relative">
					<Controller
						name="email"
						control={control}
						rules={{
							required: "Email is required",
							pattern: {
								value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
								message: "Invalid email address",
							},
						}}
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								label="Email"
								error={!!errors.email}
								helperText={errors.email?.message}
								disabled={true}
								variant={isEditing ? "outlined" : "filled"}
								type={showEmail ? "text" : "password"}
								InputProps={{
									className: "bg-white",
									endAdornment: (
										<IconButton
											onClick={() => setShowEmail(!showEmail)}
											edge="end"
										>
											{showEmail ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									),
								}}
							/>
						)}
					/>
				</div>

				{isEditing && (
					<div className="text-center">
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className="w-full py-3 text-lg font-semibold transition-all hover:bg-indigo-700"
						>
							Save Changes
						</Button>
					</div>
				)}
			</form>

			<div className="flex items-center gap-x-2 mt-3">
				<CheckCircleIcon color="info" />
				<p className="font-serif text-blue-600">
					Last updated :
					<span className="font-sans ml-2 font-semibold">
						{new Date(user?.updatedAt).toLocaleString()}
					</span>
				</p>
			</div>
			<Toaster />
		</div>
	);
};

export default ProfilePage;
