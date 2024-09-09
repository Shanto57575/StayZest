import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import {
	MdDashboard,
	MdPeople,
	MdPlace,
	MdBook,
	MdPayment,
	MdRateReview,
	MdAdminPanelSettings,
} from "react-icons/md";
import { toggleDarkMode } from "../../features/theme/themeSlice";
import { logout } from "../../features/auth/authSlice";

const Dashboard = () => {
	const [isOpen, setIsOpen] = useState(false);
	const userTypes = useSelector((state) => state.auth.currentUser?.role);
	const darkMode = useSelector((state) => state.theme.darkMode);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const toggleSidebar = () => setIsOpen(!isOpen);

	const handleDarkModeToggle = () => dispatch(toggleDarkMode());

	const handleLogOut = async () => {
		try {
			await dispatch(logout());
			navigate("/signin");
		} catch (error) {}
	};

	const isActive = (path) => location.pathname === path;

	const MenuItem = ({ to, icon: Icon, text }) => (
		<Link
			to={to}
			className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
				isActive(to)
					? "bg-indigo-600 text-white"
					: "hover:bg-indigo-100 dark:hover:bg-indigo-900"
			}`}
		>
			<Icon
				className={`w-5 h-5 mr-3 ${
					isActive(to) ? "text-white" : "text-indigo-600 dark:text-indigo-400"
				}`}
			/>
			<span className="font-medium">{text}</span>
		</Link>
	);

	const SidebarContent = (
		<div className="h-full flex flex-col font-serif bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
			<div className="p-5 flex items-center justify-between border-b dark:border-gray-700">
				<h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
					Dashboard
				</h2>
				<button
					onClick={handleDarkModeToggle}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
				>
					{darkMode ? (
						<FiSun className="w-6 h-6" />
					) : (
						<FiMoon className="w-6 h-6" />
					)}
				</button>
			</div>
			<nav className="flex-grow p-4 space-y-3 overflow-y-auto">
				{userTypes === "GUEST" && (
					<MenuItem
						to={`/dashboard/guest`}
						icon={MdDashboard}
						text="Dashboard"
					/>
				)}
				<MenuItem
					to="/dashboard/profile"
					icon={MdAdminPanelSettings}
					text="My Profile"
				/>

				{(userTypes === "ADMIN" || userTypes === "SUPER_ADMIN") && (
					<>
						<MenuItem
							to={`/dashboard/admin`}
							icon={MdDashboard}
							text="Dashboard"
						/>

						<MenuItem
							to="/dashboard/admin/manage-users"
							icon={MdPeople}
							text="Manage Users"
						/>
						<MenuItem
							to="/dashboard/admin/manage-places"
							icon={MdPlace}
							text="Add Place"
						/>
						<MenuItem
							to="/dashboard/admin/manage-bookings"
							icon={MdBook}
							text="Manage Bookings"
						/>
						<MenuItem
							to="/dashboard/admin/manage-payments"
							icon={MdPayment}
							text="Manage Payments"
						/>
						<MenuItem
							to="/dashboard/admin/manage-reviews"
							icon={MdRateReview}
							text="Manage Reviews"
						/>
					</>
				)}
				{userTypes === "GUEST" && (
					<MenuItem
						to="/dashboard/guest/bookings"
						icon={MdBook}
						text="My Bookings"
					/>
				)}

				<div className="pt-4 border-t dark:border-gray-700">
					<MenuItem to="/" icon={FaHome} text="Back To Home" />
					<button
						onClick={handleLogOut}
						className="w-full flex items-center p-2 rounded-lg transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
					>
						<FaSignOutAlt className="w-5 h-5 mr-3" />
						<span className="font-medium">Sign Out</span>
					</button>
				</div>
			</nav>
		</div>
	);

	return (
		<div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
			{/* Sidebar for larger screens */}
			<aside className="hidden lg:block w-64 shadow-xl">{SidebarContent}</aside>

			{/* Mobile sidebar */}
			<div
				className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			>
				<div
					className="absolute inset-0 bg-gray-900 opacity-50"
					onClick={toggleSidebar}
				></div>
				<aside className="absolute top-0 left-0 w-64 h-full shadow-xl transform transition-transform duration-300 ease-in-out">
					{SidebarContent}
				</aside>
			</div>

			{/* Main content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between lg:justify-end">
					<button onClick={toggleSidebar} className="lg:hidden text-2xl">
						{isOpen ? <FiX /> : <FiMenu />}
					</button>
					<h1 className="text-2xl font-serif font-semibold text-indigo-600 dark:text-indigo-400 lg:hidden">
						Dashboard
					</h1>
				</header>
				<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 scrollbar-hide">
					<div className="container mx-auto px-4 py-6">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

// CSS to hide scrollbar
const style = document.createElement("style");
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default Dashboard;
