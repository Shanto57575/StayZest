import { useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Avatar, IconButton } from "@mui/material";
import { Edit, Cancel, CloudUpload } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import toast, { Toaster } from "react-hot-toast";
import { userSignUpSuccess } from "../../features/auth/authSlice";
import Loader from "../Loader";

const ProfilePage = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.currentUser);
	const [isEditing, setIsEditing] = useState(false);
	const [newImage, setNewImage] = useState(null);
	console.log(user);

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

			for (let pair of formData.entries()) {
				console.log(pair[0] + ", " + pair[1]);
			}

			const response = await axiosInstance.put(`/user/${user._id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			console.log("Server response:", response.data);
			if (response.status === 200) {
				dispatch(userSignUpSuccess(response.data.user));
				toast.success("User data updated successfully!", {
					position: "top-center",
				});
			}
		} catch (error) {
			console.error("Update Error:", error);
			toast.error(error.response.data.error);
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
			toast(
				<div className="font-serif text-red-500 bg-white">
					! No changes Has been made !
				</div>
			);
		}
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setNewImage(e.target.files[0]);
			setValue("profilePicture", URL.createObjectURL(e.target.files[0]));
		}
	};

	if (!user) return <Loader />;

	return (
		<div className="max-w-96 mx-auto mt-10 p-6 bg-white rounded-lg shadow-md shadow-black h-full">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="flex justify-between items-center">
					<h2 className="text-3xl font-bold text-gray-800 font-serif">
						Profile
					</h2>
					{!isEditing ? (
						<IconButton onClick={() => setIsEditing(true)} color="primary">
							<Edit />
						</IconButton>
					) : (
						<div>
							<IconButton onClick={() => setIsEditing(false)} color="error">
								<Cancel />
							</IconButton>
						</div>
					)}
				</div>

				<div className="flex flex-col items-center space-y-4">
					<Controller
						name="profilePicture"
						control={control}
						render={({ field }) => (
							<Avatar
								src={
									newImage
										? URL.createObjectURL(newImage)
										: `http://localhost:5000/${user.profilePicture}`
								}
								alt={user.username}
								sx={{ width: 120, height: 120 }}
							/>
						)}
					/>
					{isEditing && (
						<div>
							<input
								accept="image/*"
								id="icon-button-file"
								type="file"
								onChange={handleImageChange}
								style={{ display: "none" }}
							/>
							<label htmlFor="icon-button-file">
								<Button
									variant="contained"
									color="primary"
									component="span"
									startIcon={<CloudUpload />}
								>
									Upload New Image
								</Button>
							</label>
						</div>
					)}
					<div>
						<p className="dark:text-black font-bold font-serif flex items-center gap-x-1">
							{user?.role === "ADMIN" ? (
								<>
									<span>{user?.role}</span>{" "}
									<AdminPanelSettingsIcon color="info" />
								</>
							) : (
								<>
									<span>{user?.role}</span> <AssignmentIndIcon color="info" />
								</>
							)}
						</p>
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
						/>
					)}
				/>

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
							disabled={!isEditing}
							variant={isEditing ? "outlined" : "filled"}
						/>
					)}
				/>

				{isEditing && (
					<div className="text-center">
						<button
							className="bg-sky-600 font-serif px-5 py-2 rounded hover:text-sky-600 hover:bg-white hover:border border-sky-500 duration-300"
							type="submit"
						>
							SUBMIT
						</button>
						<Toaster />
					</div>
				)}
			</form>
		</div>
	);
};

export default ProfilePage;
