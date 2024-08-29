import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
	userSignInFailed,
	userSignInStart,
	userSignInSuccess,
} from "../features/auth/authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleSignIn from "../components/GoogleSignIn";

const SignIn = () => {
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const { loading } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const location = useLocation();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const from = location?.state?.from?.pathname || "/";

	const onSubmit = async (userdata) => {
		try {
			dispatch(userSignInStart());
			const response = await axios.post(
				"https://stay-zest-backend.vercel.app/api/auth/signin",
				userdata,
				{ withCredentials: true }
			);
			if (response.data) {
				dispatch(userSignInSuccess(response.data.user));
				setTimeout(() => {
					navigate(from, { replace: true });
					toast.success(<h1 className="font-serif">Successfully Logged In</h1>);
					reset();
				}, 500);
			}
		} catch (error) {
			dispatch(userSignInFailed(error.response?.data.error));
			toast.error(error.response?.data.error);
			console.error(error.response?.data.error);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="min-h-screen font-serif flex items-center justify-center">
			<div className="w-full max-w-md">
				<div className="bg-white shadow-2xl rounded-lg overflow-hidden transform hover:shadow-3xl transition-shadow duration-300">
					<div className="relative">
						<div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
						<div className="relative bg-white p-8">
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
								<p className="text-gray-700 mt-2">Welcome Back,</p>
							</div>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<div>
									<label htmlFor="email" className="text-gray-800 ml-2">
										Email
									</label>
									<input
										{...register("email", {
											pattern: {
												value:
													/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
												message: "Invalid email address",
											},
											required: "Email is required",
										})}
										className="w-full px-4 py-3 rounded-lg bg-black text-white border-transparent focus:border-gray-900 focus:border-b-4 focus:ring-0 text-sm"
										placeholder="Email address"
									/>
									{errors.email && (
										<p className="mt-2 text-sm text-red-600">
											{errors.email.message}
										</p>
									)}
								</div>
								<div>
									<label htmlFor="password" className="text-gray-800 ml-2">
										Password
									</label>
									<div className="relative">
										<input
											{...register("password", {
												required: "Password is required",
											})}
											type={showPassword ? "text" : "password"}
											className="w-full px-4 py-3 rounded-lg bg-black text-white border-transparent focus:border-gray-900 focus:border-b-4 focus:ring-0 text-sm"
											placeholder="Password"
										/>
										<button
											type="button"
											onClick={togglePasswordVisibility}
											className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
										>
											{showPassword ? (
												<VisibilityOffIcon className="h-5 w-5" />
											) : (
												<VisibilityIcon className="h-5 w-5" />
											)}
										</button>
									</div>
									{errors.password && (
										<p className="mt-2 text-sm text-red-600">
											{errors.password.message}
										</p>
									)}
								</div>
								<div>
									<button
										type="submit"
										disabled={loading}
										className={`w-full flex justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
											loading ? "opacity-50 cursor-not-allowed" : ""
										}`}
									>
										{loading ? (
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
										) : (
											"Sign In"
										)}
									</button>
								</div>
							</form>
							<GoogleSignIn />
						</div>
					</div>
					<div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
						<p className="text-xs text-gray-700 text-center">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="font-medium text-sky-600 hover:text-sky-700"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
				<p className="mt-8 text-center text-sm text-gray-700 dark:text-gray-400">
					&copy; {new Date().getFullYear()} StayZest Corp. All rights reserved.
				</p>
			</div>
		</div>
	);
};

export default SignIn;
