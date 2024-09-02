import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
	Edit,
	Cancel,
	CloudUpload,
	AdminPanelSettings,
	AssignmentInd,
	CheckCircle,
} from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { signUp, updateUserProfile } from "../../features/auth/authSlice";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";

const ProfilePage = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.currentUser);
	const [isEditing, setIsEditing] = useState(false);
	const [newImage, setNewImage] = useState(null);
	const [hue, setHue] = useState(0);
	const axiosInstance = useAxiosInterceptor();

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

	useEffect(() => {
		const interval = setInterval(() => {
			setHue((prev) => (prev + 1) % 360);
		}, 50);
		return () => clearInterval(interval);
	}, []);

	const onUpdate = async (data, imageFile) => {
		try {
			const formData = new FormData();
			formData.append("username", data.username);
			formData.append("email", data.email);

			if (imageFile) {
				formData.append("profilePicture", imageFile);
			}

			const response = await axiosInstance.put(
				`/api/user/${user._id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				dispatch(updateUserProfile(response.data.user));
			}
		} catch (error) {
			console.error("Update Error:", error);
		}
	};

	const onSubmit = (data) => {
		const isDataChanged =
			data.username !== user?.username ||
			data.email !== user?.email ||
			(newImage && data?.profilePicture !== user?.profilePicture);

		if (isDataChanged) {
			onUpdate(data, newImage);
			setIsEditing(false);
		} else {
			toast.error(<h1 className="font-serif">No changes have been made!</h1>, {
				position: "top-center",
			});
		}
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setNewImage(e.target.files[0]);
			setValue("profilePicture", URL.createObjectURL(e.target.files[0]));
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 sm:p-2 md:p-4 overflow-hidden">
			<Toaster />
			<div className="w-full max-w-screen-xl mx-auto bg-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
				<div className="absolute inset-0 flex">
					<div className="w-1/2 h-full bg-gray-700 transform skew-x-6 -ml-10"></div>
					<div className="w-1/2 h-full bg-gray-600 transform -skew-x-6 -mr-10"></div>
				</div>
				<div className="relative z-10 flex flex-col md:flex-row h-full py-16 px-2 md:px-5">
					<div className="w-full md:w-1/2 md:p-4 flex flex-col items-center justify-center space-y-4 md:space-y-6">
						<div className="relative group">
							<div
								className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-8 shadow-lg transform transition-all duration-300 group-hover:scale-110"
								style={{
									borderColor: `hsl(${hue}, 70%, 60%)`,
									boxShadow: `0 0 20px hsl(${hue}, 70%, 60%)`,
								}}
							>
								<img
									src={
										newImage
											? URL.createObjectURL(newImage)
											: `https://stayzest-backend.onrender.com/${user?.profilePicture}`
									}
									alt={user?.username}
									className="w-full h-full object-cover"
								/>
							</div>
							{isEditing && (
								<label
									htmlFor="icon-button-file"
									className="absolute bottom-0 right-0 bg-white rounded-full p-2 md:p-3 cursor-pointer transform translate-x-1/4 translate-y-1/4 transition-all duration-300 hover:scale-110"
									style={{
										backgroundColor: `hsl(${hue}, 70%, 60%)`,
									}}
								>
									<input
										accept="image/*"
										id="icon-button-file"
										type="file"
										onChange={handleImageChange}
										className="hidden"
									/>
									<CloudUpload className="text-gray-800" />
								</label>
							)}
						</div>
						<div className="text-center font-serif">
							<h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
								{user?.username}
							</h2>
							<div
								className="inline-flex items-center px-2 py-1 md:px-4 md:py-2 rounded-full"
								style={{
									backgroundColor: `hsl(${hue}, 70%, 20%)`,
								}}
							>
								<span
									className="font-semibold mr-1 md:mr-2"
									style={{ color: `hsl(${hue}, 70%, 60%)` }}
								>
									{user?.role}
								</span>
								{user?.role === "ADMIN" ? (
									<AdminPanelSettings
										style={{ color: `hsl(${hue}, 70%, 60%)` }}
									/>
								) : (
									<AssignmentInd style={{ color: `hsl(${hue}, 70%, 60%)` }} />
								)}
							</div>
						</div>
					</div>

					<div className="w-full md:w-1/2 px-3 pt-5 md:p-4 flex flex-col justify-center">
						<div className="flex justify-between items-center mb-6 md:mb-8">
							<h1 className="text-xl md:text-2xl font-extrabold text-white font-serif">
								Profile Details
							</h1>
							<button
								onClick={() => setIsEditing(!isEditing)}
								className={`p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110`}
								style={{
									backgroundColor: isEditing
										? "rgb(239, 68, 68)"
										: `hsl(${hue}, 70%, 60%)`,
								}}
							>
								{isEditing ? (
									<Cancel className="text-white" />
								) : (
									<Edit className="text-white" />
								)}
							</button>
						</div>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-4 md:space-y-6 font-serif"
						>
							<Controller
								name="username"
								control={control}
								rules={{ required: "Username is required" }}
								render={({ field }) => (
									<div className="relative">
										<label
											htmlFor="username"
											className="block text-sm ml-1 mb-2 font-bold text-gray-300"
										>
											Username
										</label>
										<input
											{...field}
											id="username"
											disabled={!isEditing}
											className={`w-full bg-gray-800 text-white border-2 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-hsl(${hue}, 70%, 60%) ${
												isEditing ? "border-gray-600" : "border-transparent"
											}`}
											style={{
												boxShadow: `0 0 10px hsl(${hue}, 70%, 60%)`,
											}}
											placeholder="Username"
										/>
										{errors?.username && (
											<p className="text-red-400 text-sm mt-1">
												{errors?.username.message}
											</p>
										)}
									</div>
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
									<div className="relative">
										<label
											htmlFor="email"
											className="block text-sm ml-1 mb-2 font-bold text-gray-300"
										>
											Email
										</label>
										<input
											{...field}
											id="email"
											disabled={true}
											className="w-full bg-gray-800 text-white border-2 border-transparent rounded-lg py-2 px-3 focus:outline-none"
											style={{
												boxShadow: `0 0 10px hsl(${hue}, 70%, 60%)`,
											}}
											placeholder="Email"
										/>
										{errors?.email && (
											<p className="text-red-400 text-sm mt-1">
												{errors?.email.message}
											</p>
										)}
									</div>
								)}
							/>
							{isEditing && (
								<div className="text-center">
									<button
										type="submit"
										className="w-full font-bold py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
										style={{
											backgroundColor: `hsl(${hue}, 70%, 60%)`,
											color: "rgb(31, 41, 55)", // dark blue-gray
										}}
									>
										Save Changes
									</button>
								</div>
							)}
						</form>

						<div className="flex items-center gap-x-1 md:gap-x-2 mt-4 md:mt-6 text-cyan-100">
							<CheckCircle style={{ color: `hsl(${hue}, 70%, 60%)` }} />
							<p className="font-serif text-sm md:text-base">
								Last updated:
								<span className="font-sans ml-1 md:ml-2 font-semibold">
									{new Date(user?.updatedAt).toLocaleString()}
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
