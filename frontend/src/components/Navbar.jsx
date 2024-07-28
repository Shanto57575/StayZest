import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { toggleDarkMode } from "../features/theme/themeSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PortraitIcon from "@mui/icons-material/Portrait";
import LoginIcon from "@mui/icons-material/Login";
import EmailIcon from "@mui/icons-material/Email";
import toast, { Toaster } from "react-hot-toast";
import { userLogOut } from "../features/auth/authSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const darkMode = useSelector((state) => state.theme.darkMode);
	const user = useSelector((state) => state.auth.currentUser);

	const navigate = useNavigate();

	const handleDarkModeToggle = () => {
		dispatch(toggleDarkMode());
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleLogOut = async () => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/logout"
			);
			if (response.status === 200) {
				dispatch(userLogOut());
				toast.success(response?.data.message);
				navigate("/signin");
			}
		} catch (error) {
			toast.error(error?.message);
			console.log(error?.message);
		}
	};

	return (
		<div className="bg-base-100 fixed bg-white py-5 w-full dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg shadow-gray-700 px-4 md:px-20 flex items-center justify-between z-50">
			<div className="text-xl font-bold flex items-center gap-x-2">
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
				<Link
					to="/"
					className="font-serif text-gray-800 dark:text-gray-200 hover:text-sky-400 dark:hover:text-sky-400"
				>
					StayZest
				</Link>
			</div>
			<div className="flex items-center gap-4">
				<button className="mb-0.5" onClick={handleDarkModeToggle}>
					{darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
				</button>
				<div className="relative inline-block text-left">
					<button onClick={toggleDropdown} type="button">
						{user ? (
							<div className="flex items-center gap-x-2 font-serif">
								<AccountCircleIcon />
								{user.username}
							</div>
						) : (
							<img
								alt=""
								src="https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
								className="w-full h-full object-cover"
							/>
						)}
					</button>
					{isOpen && (
						<div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 font-serif p-3 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							<>
								{user && (
									<p className="flex items-center gap-x-2">
										<EmailIcon />
										{user.email}
									</p>
								)}
							</>
							<p
								className="py-1 flex items-center gap-x-2 hover:bg-gray-100 dark:hover:bg-gray-600"
								role="none"
							>
								<PortraitIcon />
								<Link to="/dashboard/profile">Profile</Link>
							</p>
							<p
								className="py-1 flex items-center gap-x-2 hover:bg-gray-100 dark:hover:bg-gray-600"
								role="none"
							>
								<DashboardIcon />
								<Link to={`/dashboard`}>Dashboard</Link>
							</p>

							<div className="py-1 flex items-center gap-x-2 hover:bg-gray-100 dark:hover:bg-gray-600">
								{user && user.email ? (
									<p className="flex items-center gap-x-2">
										<LogoutIcon />
										<Link onClick={handleLogOut}>Sign Out</Link>
									</p>
								) : (
									<>
										<p className="py-1 flex items-center gap-x-2 hover:bg-gray-100 dark:hover:bg-gray-600">
											<LoginIcon />
											<Link to="/signin">SignIn</Link>
										</p>
										<Toaster />
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
