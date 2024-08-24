import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Link,
	Outlet,
	useNavigate,
	useLocation,
	Navigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlaceIcon from "@mui/icons-material/Place";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BookIcon from "@mui/icons-material/Book";
import LogoutIcon from "@mui/icons-material/Logout";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PaymentIcon from "@mui/icons-material/Payment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { toggleDarkMode } from "../../features/theme/themeSlice";
import axios from "axios";
import { userLogOut } from "../../features/auth/authSlice";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const userTypes = useSelector((state) => state.auth.currentUser?.role);
	const darkMode = useSelector((state) => state.theme.darkMode);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	const handleDarkModeToggle = () => {
		dispatch(toggleDarkMode());
	};

	const handleLogOut = async () => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/logout",
				{},
				{ withCredentials: true }
			);
			if (response.status === 200) {
				dispatch(userLogOut());
				localStorage.clear();
				toast.success(response?.data.message);
				navigate("/signin");
			}
		} catch (error) {
			toast.error(error?.message);
		}
	};

	const isActive = (path) => location.pathname === path;

	const MenuItem = ({ to, icon, text }) => (
		<ListItem
			component={Link}
			to={to}
			className={`my-1 rounded-b-lg transition-all duration-200 ${
				isActive(to)
					? "bg-blue-500 border-b-4 text-white"
					: "hover:bg-gray-200 dark:hover:bg-gray-700"
			}`}
		>
			<ListItemIcon className={isActive(to) ? "text-white" : "dark:text-white"}>
				{icon}
			</ListItemIcon>
			<ListItemText primary={text} />
		</ListItem>
	);

	const DrawerList = (
		<Box
			sx={{ width: 230 }}
			role="presentation"
			onClick={toggleDrawer(false)}
			className="font-serif h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white overflow-y-auto"
		>
			<div className="p-4 flex items-center justify-between">
				<h2 className="text-xl font-bold">Dashboard</h2>
				<Button
					onClick={handleDarkModeToggle}
					className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
				>
					{darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
				</Button>
			</div>
			<Divider />
			<List className="p-2 font-serif">
				<MenuItem
					to={`/dashboard/${userTypes?.toLowerCase()}`}
					icon={<DashboardIcon />}
					text="Dashboard"
				/>
				<MenuItem
					to="/dashboard/profile"
					icon={<AdminPanelSettingsIcon />}
					text="My Profile"
				/>

				{userTypes === "ADMIN" && (
					<>
						<MenuItem
							to="/dashboard/admin/manage-users"
							icon={<PeopleIcon />}
							text="Manage Users"
						/>
						<MenuItem
							to="/dashboard/admin/manage-places"
							icon={<PlaceIcon />}
							text="Add Place"
						/>
						<MenuItem
							to="/dashboard/admin/manage-bookings"
							icon={<BookIcon />}
							text="Manage Bookings"
						/>
						<MenuItem
							to="/dashboard/admin/manage-payments"
							icon={<PaymentIcon />}
							text="Manage Payments"
						/>
						{/* <MenuItem
							to="/dashboard/admin/manage-reviews"
							icon={<RateReviewIcon />}
							text="Manage Reviews"
						/> */}
					</>
				)}
				{userTypes === "GUEST" && (
					<MenuItem
						to="/dashboard/guest/bookings"
						icon={<BookIcon />}
						text="My Bookings"
					/>
				)}
				{userTypes === "HOST" && (
					<MenuItem
						to="/dashboard/host/manage-listings"
						icon={<PlaceIcon />}
						text="Manage Listings"
					/>
				)}
			</List>
			<Divider />
			<List className="p-2">
				<MenuItem to="/" icon={<HomeIcon />} text="Back To Home" />
				<ListItem
					onClick={handleLogOut}
					className="my-1 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
				>
					<ListItemIcon className="dark:text-white">
						<LogoutIcon />
					</ListItemIcon>
					<ListItemText primary="Sign Out" />
				</ListItem>
			</List>
		</Box>
	);

	return (
		<div className="flex min-h-screen">
			<div className="hidden lg:block h-full fixed overflow-y-auto shadow-md shadow-white">
				{DrawerList}
			</div>
			<div className="flex flex-col w-full lg:ml-56">
				<div className="lg:hidden bg-white dark:bg-gray-800 shadow-md">
					<Button
						onClick={toggleDrawer(true)}
						className="p-4 text-gray-800 dark:text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
							/>
						</svg>
					</Button>
				</div>
				<Drawer
					anchor="left"
					open={open}
					onClose={toggleDrawer(false)}
					className="lg:hidden"
				>
					{DrawerList}
				</Drawer>
				<div className="flex-grow p-4 md:p-8 overflow-auto">
					<Outlet />
				</div>
			</div>
			<Toaster position="bottom-right" />
		</div>
	);
};

export default Dashboard;
