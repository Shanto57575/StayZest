import { useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./Pages/Home";
import PlaceDetails from "./components/PlaceDetails";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Navbar from "./components/Navbar";
import ErrorPage from "./Pages/ErrorPage";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoutes from "./routes/PrivateRoutes";

const LayoutWithNavbar = () => (
	<>
		<Navbar />
		<div className="container mx-auto px-4 py-8">
			<Outlet />
		</div>
	</>
);

const LayoutWithoutNavbar = () => (
	<div className="container mx-auto px-4 py-8">
		<Outlet />
	</div>
);

const App = () => {
	const darkMode = useSelector((state) => state.theme.darkMode);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	return (
		<BrowserRouter>
			<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
				<Routes>
					<Route element={<LayoutWithNavbar />}>
						<Route element={<PrivateRoutes />}>
							<Route path="/" element={<Home />} />
							<Route path="/details/:placeId" element={<PlaceDetails />} />
						</Route>
					</Route>
					<Route element={<LayoutWithoutNavbar />}>
						<Route path="/signin" element={<SignIn />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/dashboard/*" element={<Dashboard />} />
					</Route>
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
};

export default App;
