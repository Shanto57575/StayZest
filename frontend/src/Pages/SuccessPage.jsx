import { Link, useLocation } from "react-router-dom";
import ticklogo from "../assets/ticklogo.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const SuccessPage = () => {
	const [status, setStatus] = useState("Processing...");
	const location = useLocation();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const sessionId = urlParams.get("session_id");

		if (sessionId) {
			confirmBooking(sessionId);
		} else {
			setStatus("Error: No session ID found");
		}
	}, [location]);

	const confirmBooking = async (sessionId) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/booking/confirm-booking",
				{ sessionId },
				{ withCredentials: true }
			);
			if (response.data.success) {
				setStatus("confirmed");
			} else {
				setStatus(
					"Error confirming booking: " +
						(response.data.error || "Unknown error")
				);
			}
		} catch (error) {
			console.error("Error in confirmBooking:", error);
			if (error.response) {
				console.error("Error response from server:", error.response.data);
				console.error("Error status:", error.response.status);
				console.error("Error headers:", error.response.headers);
				setStatus(
					`Error confirming booking: ${
						error.response.data.error || error.response.statusText
					}`
				);
			} else if (error.request) {
				console.error("No response received:", error.request);
				setStatus("Error confirming booking: No response from server");
			} else {
				console.error("Error setting up request:", error.message);
				setStatus(`Error confirming booking: ${error.message}`);
			}
		}
	};
	return (
		<div className="h-screen flex items-center text-center justify-center font-serif">
			{status === "confirmed" ? (
				<article className="w-96 h-[350px] bg-green-100 border shadow-md shadow-gray-700 dark:shadow-black px-10">
					<img className="w-32 mx-auto" src={ticklogo} alt="" />
					<h1 className="bg-green-200 flex items-center justify-around hover:bg-green-300 mb-3 text-xl rounded-full py-3 px-6 border-2 border-green-300 text-green-700 font-extrabold">
						Payment Successful
					</h1>
					<p className="text-green-900 tracking-wider">
						Thank you for your payment, <br /> Please Wait For the
						confirmation!!!.
					</p>
					<Link to="/dashboard/guest/bookings">
						<button className="bg-green-500 text-white hover:bg-green-600 duration-300 px-6 py-2 mt-3 rounded-full font-semibold">
							See Booking
						</button>
					</Link>
				</article>
			) : (
				<div className="flex justify-center items-center h-screen">
					<ThreeDots color="#00BFFF" height={80} width={80} />
				</div>
			)}
		</div>
	);
};

export default SuccessPage;
