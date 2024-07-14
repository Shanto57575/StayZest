import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	userSignUpFailed,
	userSignUpStart,
	userSignUpSuccess,
} from "../features/auth/authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const SignUp = () => {
	const dispatch = useDispatch();
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

	const onSubmit = async (userdata) => {
		try {
			dispatch(userSignUpStart());
			const response = await axios.post(
				"http://localhost:5000/api/auth/signup",
				userdata,
				{ withCredentials: true }
			);
			if (response.data) {
				dispatch(userSignUpSuccess(response.data.userData));
				toast.success("Signed Up Successfully!");
				setTimeout(() => {
					navigate(from, { replace: true });
					reset();
				}, 500);
			}
		} catch (error) {
			dispatch(userSignUpFailed(error.response.data.error));
			toast.error(error.response.data.error);
			console.error(error.response.data.error);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="flex items-center justify-center font-serif">
			<div className="w-full md:w-96 md:mx-5">
				<plaintext className="flex items-center justify-center gap-x-2 text-3xl text-center text-cyan-500 font-extrabold">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-8 h-8 -rotate-90"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
						/>
					</svg>
					StayZest
				</plaintext>
				<h1 className="text-center mb-5 text-2xl font-bold">
					Create your account
				</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="shadow-md bg-slate-950 shadow-white rounded px-8 pt-6 pb-8 mb-4 my-auto"
				>
					<div className="mb-4">
						<label
							className="block text-gray-50 text-sm font-bold mb-2"
							htmlFor="username"
						>
							*Username
						</label>
						<input
							{...register("username", {
								required: "Username is required",
								maxLength: {
									value: 20,
									message: "Username should not exceed 20 characters",
								},
							})}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="username"
							type="text"
							placeholder="Username"
						/>
						{errors.username && (
							<span className="text-rose-500 my-1.5">
								{errors.username.message}
							</span>
						)}
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-50 text-sm font-bold mb-2"
							htmlFor="email"
						>
							*Email
						</label>
						<input
							{...register("email", {
								pattern: {
									value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
									message: "Invalid email address",
								},
								required: "Email is required",
							})}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="email"
							type="email"
							placeholder="Email"
						/>
						{errors.email && (
							<span className="text-rose-600 my-1.5">
								{errors.email.message}
							</span>
						)}
					</div>
					<div className="mb-6 relative">
						<label
							className="block text-gray-50 text-sm font-bold mb-2"
							htmlFor="password"
						>
							*Password
						</label>
						<div className="relative">
							<input
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 6,
										message: "Password should be at least 6 characters long",
									},
									maxLength: {
										value: 15,
										message: "Password should not exceed 15 characters",
									},
									pattern: {
										value:
											/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?!.*\s).{6,15}$/,
										message:
											"Password should contain at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces",
									},
								})}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="******************"
							/>
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className="absolute top-2 right-0 pr-3 flex items-center text-sm leading-5"
							>
								{showPassword ? (
									<VisibilityOffIcon className="h-5 w-5 text-gray-500" />
								) : (
									<VisibilityIcon className="h-5 w-5 text-gray-500" />
								)}
							</button>
						</div>
						{errors.password && (
							<span className="text-rose-600 my-1.5">
								{errors.password.message}
							</span>
						)}
					</div>
					<section className="text-center">
						<input
							type="submit"
							className="bg-gray-900 cursor-pointer text-white hover:bg-slate-700 duration-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						/>
						<p className="text-sm text-white mt-2">
							Already have an account?
							<Link
								className="text-purple-500 hover:text-blue-500 ml-2 underline"
								to="/signin"
							>
								Sign In
							</Link>
						</p>
					</section>
					<Toaster />
				</form>
				<p className="text-center text-xs">
					©{new Date().getFullYear()} St@yZest. All rights reserved.
				</p>
			</div>
		</div>
	);
};

export default SignUp;
