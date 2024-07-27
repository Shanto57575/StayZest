import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Routes, Route, Outlet, useNavigate } from "react-router-dom";
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
import AdminHome from "./Admin/AdminHome";
import ProfilePage from "./ProfilePage";
import ManageUsers from "./Admin/ManageUsers";
import ManagePlaces from "./Admin/ManagePlaces";
import ManageBookings from "./Admin/ManageBookings";
import UserBookings from "./User/UserBookings";
import HostHome from "./Host/HostHome";
import UserHome from "./User/UserHome";
import ManageReviews from "./Admin/ManageReviews";
import ManagePayments from "./Admin/ManagePayments";
import { toggleDarkMode } from "../../features/theme/themeSlice";
import axios from "axios";
import { userLogOut } from "../../features/auth/authSlice";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const userTypes = useSelector((state) => state.auth.currentUser?.role);

	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.theme.darkMode);

	const handleDarkModeToggle = () => {
		dispatch(toggleDarkMode());
	};

	const navigate = useNavigate();

	const handleLogOut = async () => {
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

	const DrawerList = (
		<Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
			<List className="font-serif">
				<ListItem className="cursor-pointer" onClick={handleDarkModeToggle}>
					{darkMode ? (
						<ListItemIcon>
							<WbSunnyIcon />
						</ListItemIcon>
					) : (
						<ListItemIcon>
							<DarkModeIcon />
						</ListItemIcon>
					)}
				</ListItem>
				<ListItem component={Link} to="/dashboard">
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard Home" />
				</ListItem>
				<ListItem component={Link} to="/dashboard/profile">
					<ListItemIcon>
						<AdminPanelSettingsIcon />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</ListItem>

				{/* ADMIN ROUTES */}

				{userTypes === "ADMIN" && (
					<>
						<ListItem component={Link} to="/dashboard/admin/manage-users">
							<ListItemIcon>
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Users" />
						</ListItem>
						<ListItem component={Link} to="/dashboard/admin/manage-places">
							<ListItemIcon>
								<PlaceIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Places" />
						</ListItem>
						<ListItem component={Link} to="/dashboard/admin/manage-bookings">
							<ListItemIcon>
								<BookIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Bookings" />
						</ListItem>
						<ListItem component={Link} to="/dashboard/admin/manage-reviews">
							<ListItemIcon>
								<RateReviewIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Reviews" />
						</ListItem>
						<ListItem component={Link} to="/dashboard/admin/manage-payments">
							<ListItemIcon>
								<PaymentIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Payments" />
						</ListItem>
					</>
				)}
				{userTypes === "GUEST" && (
					<ListItem component={Link} to="/dashboard/guest/bookings">
						<ListItemIcon>
							<BookIcon />
						</ListItemIcon>
						<ListItemText primary="Manage Bookings" />
					</ListItem>
				)}
				{userTypes === "HOST" && (
					<ListItem component={Link} to="/dashboard/host/manage-listings">
						<ListItemIcon>
							<PlaceIcon />
						</ListItemIcon>
						<ListItemText primary="Manage Listings" />
					</ListItem>
				)}
			</List>
			<Divider />
			<List className="font-serif">
				<ListItem component={Link} to="/">
					<ListItemIcon>
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
					<ListItemIcon>
						<LogoutIcon />
					</ListItemIcon>
					Sign Out
				</ListItem>
				<Toaster />
			</List>
		</Box>
	);

	return (
		<div>
			<Button onClick={toggleDrawer(true)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
					/>
				</svg>
			</Button>
			<Outlet />
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>

			<div className="w-full">
				<Routes>
					<Route path="/profile" element={<ProfilePage />} />
					{userTypes === "ADMIN" && (
						<>
							<Route path="/" element={<AdminHome />} />
							<Route path="/admin/manage-users" element={<ManageUsers />} />
							<Route path="/admin/manage-places" element={<ManagePlaces />} />
							<Route
								path="/admin/manage-bookings"
								element={<ManageBookings />}
							/>
							<Route path="/admin/manage-reviews" element={<ManageReviews />} />
							<Route
								path="/admin/manage-payments"
								element={<ManagePayments />}
							/>
						</>
					)}
					{userTypes === "GUEST" && (
						<>
							<Route path="/" element={<UserHome />} />
							<Route path="/guest/bookings" element={<UserBookings />} />
						</>
					)}
					{userTypes === "HOST" && (
						<>
							<Route path="/host/manage-listings" element={<HostHome />} />
						</>
					)}
				</Routes>
			</div>
		</div>
	);
};

export default Dashboard;
