import { useState, useEffect } from "react";
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
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
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
		}
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsMobileMenuOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const navLinks = [
		{ to: "/dashboard/profile", icon: <PortraitIcon />, text: "Profile" },
		{
			to: `/dashboard/${user?.role?.toLowerCase()}`,
			icon: <DashboardIcon />,
			text: "Dashboard",
		},
		user
			? { onClick: handleLogOut, icon: <LogoutIcon />, text: "Sign Out" }
			: { to: "/signin", icon: <LoginIcon />, text: "Sign In" },
	];

	return (
		<nav
			className={`fixed w-full z-50 transition-all duration-500 ${
				darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-serif">
				<div className="flex items-center justify-between h-20">
					<div className="flex-shrink-0">
						<Link to="/" className="flex items-center space-x-2 group">
							<div className="relative w-12 h-12 transform transition-transform duration-300 group-hover:rotate-180">
								<div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-lg transform skew-y-6"></div>
								<div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-rose-600 rounded-lg transform -skew-y-6 opacity-75"></div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="absolute inset-0 w-full h-full text-white p-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<span className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-rose-400 to-indigo-600 group-hover:from-indigo-600 group-hover:via-rose-400 group-hover:to-sky-400 transition-all duration-300">
								StayZest
							</span>
						</Link>
					</div>

					<div className="hidden md:flex items-center space-x-4">
						<Link
							to="/trip-planner"
							className="relative px-4 py-2 rounded-full overflow-hidden group"
						>
							<span className="relative z-10 text-sm font-serif font-medium transition duration-300 group-hover:text-white">
								Plan Your Trip With AI
							</span>
							<div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform origin-left scale-x-0 group-hover:scale-x-100"></div>
						</Link>

						<button
							onClick={handleDarkModeToggle}
							className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-110"
						>
							{darkMode ? (
								<WbSunnyIcon className="text-yellow-400" />
							) : (
								<DarkModeIcon className="text-indigo-600" />
							)}
						</button>

						<div className="relative">
							<button
								onClick={toggleDropdown}
								className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 group"
							>
								{user ? (
									<>
										<img
											src={user.profilePicture}
											alt={user.username}
											className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-sky-400 transition-all duration-300"
										/>
										<span className="group-hover:text-sky-400 transition-colors duration-300">
											{user.username}
										</span>
									</>
								) : (
									<AccountCircleIcon className="group-hover:text-sky-400 transition-colors duration-300" />
								)}
							</button>

							{isOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transform transition-all duration-300 origin-top-right">
									{user && (
										<p className="px-4 py-2 text-sm flex items-center space-x-2 border-b dark:border-gray-700 bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900 dark:to-indigo-900">
											<EmailIcon className="w-4 h-4 text-sky-500" />
											<span className="truncate">{user.email}</span>
										</p>
									)}
									{navLinks.map((link, index) =>
										link.to ? (
											<Link
												key={index}
												to={link.to}
												className="flex items-center gap-x-2 px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-sky-100 hover:to-indigo-100 dark:hover:from-sky-900 dark:hover:to-indigo-900 transition duration-300"
											>
												{link.icon}
												{link.text}
											</Link>
										) : (
											<button
												key={index}
												onClick={link.onClick}
												className="flex items-center gap-x-2 w-full text-left px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-sky-100 hover:to-indigo-100 dark:hover:from-sky-900 dark:hover:to-indigo-900 transition duration-300"
											>
												{link.icon}
												{link.text}
											</button>
										)
									)}
								</div>
							)}
						</div>
					</div>

					<div className="md:hidden">
						<button
							onClick={toggleMobileMenu}
							className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-110"
						>
							{isMobileMenuOpen ? (
								<CloseIcon className="text-rose-500" />
							) : (
								<MenuIcon className="text-sky-500" />
							)}
						</button>
					</div>
				</div>
			</div>

			{isMobileMenuOpen && (
				<div className="md:hidden absolute w-full bg-white dark:bg-gray-900 shadow-lg rounded-b-2xl overflow-hidden transition-all duration-500 ease-in-out">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						<Link
							to="/trip-planner"
							className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-indigo-100 dark:hover:from-sky-900 dark:hover:to-indigo-900 transition duration-300"
						>
							Plan Your Trip With AI
						</Link>
						{navLinks.map((link, index) =>
							link.to ? (
								<Link
									key={index}
									to={link.to}
									className="flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-indigo-100 dark:hover:from-sky-900 dark:hover:to-indigo-900 transition duration-300"
								>
									{link.icon}
									{link.text}
								</Link>
							) : (
								<button
									key={index}
									onClick={link.onClick}
									className="flex items-center gap-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-indigo-100 dark:hover:from-sky-900 dark:hover:to-indigo-900 transition duration-300"
								>
									{link.icon}
									{link.text}
								</button>
							)
						)}
						<button
							onClick={handleDarkModeToggle}
							className="flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-indigo-100 dark:hover:from-sky-900 dark:hover:to-indigo-900 transition duration-300 w-full"
						>
							{darkMode ? (
								<WbSunnyIcon className="text-yellow-400" />
							) : (
								<DarkModeIcon className="text-indigo-600" />
							)}
							{darkMode ? "Light Mode" : "Dark Mode"}
						</button>
					</div>
				</div>
			)}
			<Toaster />
		</nav>
	);
};

export default Navbar;
