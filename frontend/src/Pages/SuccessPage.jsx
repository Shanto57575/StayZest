import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useSelector } from "react-redux";
import useAxiosInterceptor from "../hooks/useAxiosInterceptor";

const SuccessPage = () => {
	const [status, setStatus] = useState("processing");
	const location = useLocation();
	const axiosInstance = useAxiosInterceptor();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const sessionId = urlParams.get("session_id");

		const confirmedSession = localStorage.getItem(
			`confirmedSession-${sessionId}`
		);

		if (sessionId && !confirmedSession) {
			confirmBooking(sessionId);
		} else if (confirmedSession) {
			setStatus("confirmed");
		} else {
			setStatus("error");
		}
	}, [location]);

	useEffect(() => {
		if (status === "confirmed") {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		}
	}, [status]);

	const confirmBooking = async (sessionId) => {
		try {
			const response = await axiosInstance.post(
				"/api/payment/confirm-booking",
				{ sessionId }
			);
			if (response.data.success) {
				localStorage.setItem(`confirmedSession-${sessionId}`, "true");
				setStatus("confirmed");
			} else {
				setStatus("error");
			}
		} catch (error) {
			setStatus("error");
		}
	};

	const renderContent = () => {
		switch (status) {
			case "processing":
				return <ProcessingContent />;
			case "confirmed":
				return <ConfirmedContent />;
			case "error":
				return <ErrorContent />;
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center font-serif">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl shadow-gray-500"
			>
				{renderContent()}
			</motion.div>
		</div>
	);
};

const ProcessingContent = () => (
	<div className="text-center mx-2 md:mx-0 font-serif">
		<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
		<h2 className="text-2xl font-bold text-gray-800 mb-2">
			Processing Payment
		</h2>
		<p className="text-gray-600">Please wait...</p>
	</div>
);

const ConfirmedContent = () => {
	const { currentUser } = useSelector((state) => state.auth);

	return (
		<div className="text-center font-serif">
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
			>
				<FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
			</motion.div>
			<h2 className="text-3xl font-bold text-gray-800 mb-2">
				Payment Successful
			</h2>
			<p className="text-gray-600 mb-6 space-y-2">
				<p className="text-xl">
					Booking Status :{" "}
					<span className="text-cyan-700 mb-1 font-bold text-sm">PENDING</span>
				</p>
				<p>Thank you for your payment!</p>
				<p>Please, Wait For the confirmation</p>
			</p>

			<Link
				to={{
					pathname: "/dashboard/guest/bookings",
					state: { user: currentUser },
				}}
				className="bg-gradient-to-r from-sky-600 to-blue-500 hover:border-b-4 border-gray-700 duration-500 hover:rounded-full text-white font-bold py-2 px-6 rounded-full transition ease-in-out transform hover:scale-105"
			>
				View Booking
			</Link>
		</div>
	);
};

const ErrorContent = () => (
	<div className="h-screen flex items-center text-center justify-center font-serif mx-2 md:mx-0">
		<div className="text-center">
			<FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
			<h2 className="text-2xl font-bold text-gray-800 mb-2">
				Oops! Something went wrong
			</h2>
			<p className="text-gray-600 mb-6">
				We couldn't process your payment. Please try again later.
			</p>
			<Link
				to="/"
				className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out"
			>
				Back to Home
			</Link>
		</div>
	</div>
);

export default SuccessPage;
