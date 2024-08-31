import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signUp } from "../features/auth/authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Alert } from "@mui/material";
import GoogleSignIn from "../components/GoogleSignIn";
import toast, { Toaster } from "react-hot-toast";

const SignUp = () => {
	const dispatch = useDispatch();
	const { loading } = useSelector((state) => state.auth);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const from = location?.state?.from?.pathname || "/";

	const onSubmit = async (userData) => {
		try {
			const signUpResult = await dispatch(signUp(userData));
			if (signUp.fulfilled.match(signUpResult)) {
				reset();
				navigate(from);
			}
		} catch (err) {
			toast.error(
				<div className="font-serif text-center">
					An unexpected error occurred, Please try again!
				</div>
			);
		}
	};

	return (
		<div className="min-h-screen font-serif flex items-center justify-center">
			<div className="w-full max-w-md p-8 bg-white rounded-2xl space-y-6 shadow-2xl shadow-gray-500">
				<div className="text-center">
					<div className="flex items-center justify-center mb-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-12 h-12 text-cyan-500 transform -rotate-90"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
							/>
						</svg>
						<h1 className="text-4xl font-extrabold text-black ml-2">
							<span className="text-cyan-500">Stay</span>Zest
						</h1>
					</div>
					<p className="text-gray-700 mt-2">Begin Your Travel Journey</p>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-black"
						>
							Username
						</label>
						<input
							{...register("username", { required: "Username is required" })}
							className="w-full px-4 py-3 rounded-lg bg-black text-white border-transparent focus:border-gray-900 focus:border-b-4 focus:ring-0 text-sm"
							placeholder="shanto7"
						/>
						{errors.username && (
							<Alert className="mt-2">
								<p>{errors.username.message}</p>
							</Alert>
						)}
					</div>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-black"
						>
							Email
						</label>
						<input
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Invalid email address",
								},
							})}
							className="w-full px-4 py-3 rounded-lg bg-black text-white border-transparent focus:border-gray-900 focus:border-b-4 focus:ring-0 text-sm"
							placeholder="you@example.com"
						/>
						{errors.email && (
							<Alert variant="destructive" className="mt-2">
								<p>{errors.email.message}</p>
							</Alert>
						)}
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-black"
						>
							Password
						</label>
						<div className="relative mt-1">
							<input
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
								})}
								type={showPassword ? "text" : "password"}
								className="w-full px-4 py-3 rounded-lg bg-black text-white border-transparent focus:border-gray-900 focus:border-b-4 focus:ring-0 text-sm"
								placeholder="*********"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<VisibilityOffIcon className="h-5 w-5" />
								) : (
									<VisibilityIcon className="h-5 w-5" />
								)}
							</button>
						</div>
						{errors.password && (
							<Alert variant="destructive" className="mt-2">
								<p>{errors.password.message}</p>
							</Alert>
						)}
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-300 flex items-center justify-center"
					>
						{loading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Loading...
							</>
						) : (
							"Sign Up"
						)}
					</button>
				</form>
				{/*  */}
				<GoogleSignIn />
				<p className="text-xs text-gray-700 text-center">
					Already have an account? {""}
					<Link
						to="/signin"
						className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
					>
						Sign In
					</Link>
				</p>
			</div>
			<Toaster />
		</div>
	);
};

export default SignUp;
