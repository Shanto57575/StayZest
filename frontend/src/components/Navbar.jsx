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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const [isClicked, setIsClicked] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const darkMode = useSelector((state) => state.theme.darkMode);
	const user = useSelector((state) => state.auth.currentUser);
	const navigate = useNavigate();

	const handleDarkModeToggle = () => {
		dispatch(toggleDarkMode());
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleCliked = () => {
		setIsClicked(!isClicked);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
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

	const navLinks = (
		<>
			<Link
				to="/dashboard/profile"
				className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
			>
				<PortraitIcon />
				Profile
			</Link>
			<Link
				to={`/dashboard/${user?.role?.toLowerCase()}`}
				className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
			>
				<DashboardIcon />
				Dashboard
			</Link>
			{user ? (
				<button
					onClick={handleLogOut}
					className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
				>
					<LogoutIcon />
					Sign Out
				</button>
			) : (
				<Link
					to="/signin"
					className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
				>
					<LoginIcon />
					Sign In
				</Link>
			)}
		</>
	);

	return (
		<nav className="bg-white dark:bg-gray-800 fixed w-full py-1 h-20 shadow-lg z-50 transition-all duration-300">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<Link
					to="/"
					className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-gray-800 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-6 h-6 md:w-8 md:h-8 -rotate-90"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
						/>
					</svg>
					<span className="text-3xl font-extrabold my-4 text-transparent bg-sky-200 bg-clip-text hover:bg-gradient-to-r from-sky-400 via-rose-400 to-pink-600">
						StayZest
					</span>
				</Link>

				<div className="flex items-center space-x-4">
					<button
						onClick={handleDarkModeToggle}
						className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300"
					>
						{darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
					</button>

					<div className="relative hidden md:block">
						<button
							onClick={toggleDropdown}
							className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300"
						>
							{user ? (
								<div
									onClick={handleCliked}
									className="flex items-center space-x-2"
								>
									{isClicked ? (
										<HighlightOffIcon />
									) : (
										<>
											<AccountCircleIcon />
											<span className="font-serif">{user.username}</span>
										</>
									)}
								</div>
							) : (
								<img
									alt=""
									src="https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
									className="w-8 h-8 rounded-full"
								/>
							)}
						</button>

						{isOpen && (
							<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div className="py-1">
									{user && (
										<p className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 flex items-center space-x-2">
											<EmailIcon className="w-4 h-4" />
											<span>{user.email}</span>
										</p>
									)}
									{navLinks}
								</div>
							</div>
						)}
					</div>

					<button
						onClick={toggleMobileMenu}
						className="md:hidden text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300"
					>
						<MenuIcon />
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden mt-2 py-2 bg-white dark:bg-gray-700 rounded-md shadow-lg">
					{user && (
						<p className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
							{user.email}
						</p>
					)}
					{navLinks}
				</div>
			)}
			<Toaster />
		</nav>
	);
};

export default Navbar;
