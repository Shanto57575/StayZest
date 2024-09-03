import {
	createBrowserRouter,
	RouterProvider,
	Outlet,
	useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Home from "./Pages/Home";
import PlaceDetails from "./components/PlaceDetails";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Navbar from "./components/Navbar";
import ErrorPage from "./Pages/ErrorPage";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoutes from "./routes/PrivateRoutes";
import ManageReviews from "./components/Dashboard/Admin/ManageReviews";
import ManagePayments from "./components/Dashboard/Admin/ManagePayments";
import ManageUsers from "./components/Dashboard/Admin/ManageUsers";
import ManagePlaces from "./components/Dashboard/Admin/ManagePlaces";
import AdminRoute from "./routes/AdminRoute";
import ProfilePage from "./components/Dashboard/ProfilePage";
import UserBookings from "./components/Dashboard/User/UserBookings";
import AdminHome from "./components/Dashboard/Admin/AdminHome";
import UserHome from "./components/Dashboard/User/UserHome";
import ManageBookings from "./components/Dashboard/Admin/ManageBookings/ManageBookings";
import SuccessPage from "./Pages/SuccessPage";
import CancelPage from "./Pages/CancelPage";
import TripPlanner from "./Pages/TripPlanner";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

const Layout = () => {
	const location = useLocation();
	const showNavbar = !location.pathname.startsWith("/dashboard");

	return (
		<>
			{showNavbar && <Navbar />}
			<div className="container mx-auto px-4 py-8">
				<Outlet />
			</div>
			{showNavbar && <Footer />}
		</>
	);
};

const App = () => {
	const darkMode = useSelector((state) => state.theme?.darkMode);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	const router = createBrowserRouter([
		{
			element: <Layout />,
			errorElement: <ErrorPage />,
			children: [
				{
					element: <PrivateRoutes />,
					children: [
						{
							path: "/",
							element: <Home />,
						},
						{
							path: "details/:placeId",
							element: <PlaceDetails />,
						},
						{
							path: "trip-planner",
							element: <TripPlanner />,
						},
						{
							path: "dashboard",
							element: <Dashboard />,
							children: [
								{
									path: "profile",
									element: <ProfilePage />,
								},
								{
									path: "admin",
									element: (
										<AdminRoute>
											<AdminHome />
										</AdminRoute>
									),
								},
								{
									path: "admin/manage-bookings",
									element: (
										<AdminRoute>
											<ManageBookings />
										</AdminRoute>
									),
								},
								{
									path: "admin/manage-reviews",
									element: (
										<AdminRoute>
											<ManageReviews />
										</AdminRoute>
									),
								},
								{
									path: "admin/manage-payments",
									element: (
										<AdminRoute>
											<ManagePayments />
										</AdminRoute>
									),
								},
								{
									path: "admin/manage-users",
									element: (
										<AdminRoute>
											<ManageUsers />
										</AdminRoute>
									),
								},
								{
									path: "admin/manage-places",
									element: (
										<AdminRoute>
											<ManagePlaces />
										</AdminRoute>
									),
								},
								{
									path: "guest",
									element: <UserHome />,
								},
								{
									path: "guest/bookings",
									element: <UserBookings />,
								},
							],
						},
					],
				},
			],
		},
		{
			path: "/signin",
			element: <SignIn />,
		},
		{
			path: "/signup",
			element: <SignUp />,
		},
		{
			path: "checkout-success",
			element: <SuccessPage />,
		},
		{
			path: "checkout-cancel",
			element: <CancelPage />,
		},
		{
			path: "*",
			element: <ErrorPage />,
		},
	]);

	return (
		<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
			<Toaster />
			<RouterProvider router={router} />
		</div>
	);
};

export default App;
