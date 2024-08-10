import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
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

	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	const handleDarkModeToggle = () => {
		dispatch(toggleDarkMode());
	};

	const handleLogOut = async () => {
		console.log("LOGOUT");
		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/logout"
			);
			if (response.status === 200) {
				dispatch(userLogOut());
				toast.success(response?.data.message);
				setOpen(false);
				navigate("/signin");
			}
		} catch (error) {
			toast.error(error?.message);
			console.log(error?.message);
		}
	};

	const activeClassName = (path) =>
		location.pathname === path ? "rounded-full bg-blue-500 text-white" : "";

	const DrawerList = (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleDrawer(false)}
			className="font-serif border-r-2"
		>
			<List>
				<ListItem className="cursor-pointer" onClick={handleDarkModeToggle}>
					<ListItemIcon className="dark:text-white">
						{darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
					</ListItemIcon>
				</ListItem>
				<ListItem
					component={Link}
					to={`/dashboard/${userTypes?.toLowerCase()}`}
					className={activeClassName("/dashboard/admin")}
				>
					<ListItemIcon className="dark:text-white">
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard Home" />
				</ListItem>
				<ListItem
					component={Link}
					to="/dashboard/profile"
					className={activeClassName("/dashboard/profile")}
				>
					<ListItemIcon className="dark:text-white">
						<AdminPanelSettingsIcon />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</ListItem>

				{/* ADMIN ROUTES */}

				{userTypes === "ADMIN" && (
					<>
						<ListItem
							component={Link}
							to="/dashboard/admin/manage-users"
							className={activeClassName("/dashboard/admin/manage-users")}
						>
							<ListItemIcon className="dark:text-white">
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Users" />
						</ListItem>
						<ListItem
							component={Link}
							to="/dashboard/admin/manage-places"
							className={activeClassName("/dashboard/admin/manage-places")}
						>
							<ListItemIcon className="dark:text-white">
								<PlaceIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Places" />
						</ListItem>
						<ListItem
							component={Link}
							to="/dashboard/admin/manage-bookings"
							className={activeClassName("/dashboard/admin/manage-bookings")}
						>
							<ListItemIcon className="dark:text-white">
								<BookIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Bookings" />
						</ListItem>
						<ListItem
							component={Link}
							to="/dashboard/admin/manage-reviews"
							className={activeClassName("/dashboard/admin/manage-reviews")}
						>
							<ListItemIcon className="dark:text-white">
								<RateReviewIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Reviews" />
						</ListItem>
						<ListItem
							component={Link}
							to="/dashboard/admin/manage-payments"
							className={activeClassName("/dashboard/admin/manage-payments")}
						>
							<ListItemIcon className="dark:text-white">
								<PaymentIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Payments" />
						</ListItem>
					</>
				)}
				{userTypes === "GUEST" && (
					<>
						<ListItem
							component={Link}
							to="/dashboard/guest/bookings"
							className={activeClassName("/dashboard/guest/bookings")}
						>
							<ListItemIcon className="dark:text-white">
								<BookIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Bookings" />
						</ListItem>
					</>
				)}
				{userTypes === "HOST" && (
					<ListItem
						component={Link}
						to="/dashboard/host/manage-listings"
						className={activeClassName("/dashboard/host/manage-listings")}
					>
						<ListItemIcon className="dark:text-white">
							<PlaceIcon />
						</ListItemIcon>
						<ListItemText primary="Manage Listings" />
					</ListItem>
				)}
			</List>
			<div className="mr-2 myt-2">
				<hr />
			</div>
			<List>
				<ListItem component={Link} to="/" className={activeClassName("/")}>
					<ListItemIcon className="dark:text-white font-serif">
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary="Back To Home" />
				</ListItem>
				<ListItem
					className="cursor-pointer"
					onClick={() => {
						handleLogOut();
						toggleDrawer(false)();
					}}
				>
					<ListItemIcon className="dark:text-white">
						<LogoutIcon />
					</ListItemIcon>
					Sign Out
				</ListItem>
				<Toaster />
			</List>
		</Box>
	);

	return (
		<div className="flex min-h-screen">
			<div className="hidden lg:block lg:w-64 dark:text-white">
				{DrawerList}
			</div>
			<div className="flex flex-col w-full">
				<div className="lg:hidden">
					<Button onClick={toggleDrawer(true)} className="p-4">
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
				<Drawer open={open} onClose={toggleDrawer(false)}>
					{DrawerList}
				</Drawer>
				{/* Render the content based on the route */}
				<div className="flex-grow p-4">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
