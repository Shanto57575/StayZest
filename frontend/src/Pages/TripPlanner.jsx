import { useState } from "react";
import {
	AttachMoney,
	LocationOn,
	Hotel,
	AccessTime,
	Refresh,
	Description,
	People,
	ArrowBack,
	FileCopy,
} from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const TripPlanner = () => {
	const [step, setStep] = useState(0);
	const [selectedBudget, setSelectedBudget] = useState("");
	const [selectedPlaceType, setSelectedPlaceType] = useState("");
	const [selectedCountry, setSelectedCountry] = useState("");
	const [tripDuration, setTripDuration] = useState("");
	const [numberOfTravelers, setNumberOfTravelers] = useState("");
	const [loading, setLoading] = useState(false);
	const [tripPlan, setTripPlan] = useState(null);

	const budgetOptions = ["Budget", "Moderate", "Luxury"];
	const placeTypes = [
		"🏞️ Lakefront",
		"🌊 Beachfront",
		"🌳 Countryside",
		"🏠 Cozy Cabins",
		"🏰 Majestic Castles",
		"🛌 Comfy Rooms",
		"⛺️ Camping Grounds",
		"🏞️ Mountain Retreats",
		"🌋 Scenic Caves",
		"🏙️ Urban Skylines",
	];

	const countries = [
		"USA",
		"UK",
		"Greece",
		"Australia",
		"UAE",
		"Thailand",
		"France",
		"Switzerland",
	];

	const travelerOptions = [
		"Solo 🏄‍♂️",
		"Couple 👫",
		"Family & Friends 👨‍👩‍👧‍👦(8-10 people)",
	];

	const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 5));
	const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

	const LoadingSpinner = () => (
		<div className="flex items-center justify-center">
			<span className="mr-2 text-xs sm:text-sm">
				Planning your Dream trip...
			</span>
			<div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-y-2 border-white"></div>
		</div>
	);

	const getTripPlan = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				"https://stayzest-backend.vercel.app/api/trip/plan",
				{
					prompt: `I want to plan a trip with a ${selectedBudget} budget to ${selectedCountry} for ${numberOfTravelers}. The ideal setting is ${selectedPlaceType}, and the tripDuration is ${tripDuration} days. Can you help me plan it?`,
				},
				{ withCredentials: true }
			);
			if (response.status === 200) {
				setTripPlan(response.data.plan);
				setLoading(false);
				setStep(5);
			} else {
				setLoading(false);
				alert("Failed to generate trip plan.");
			}
		} catch (error) {
			setLoading(false);
			console.error("Error:", error);
			alert("An error occurred while generating the trip plan.");
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(tripPlan).then(
			() => {
				toast.success(<h1 className="font-serif">Trip plan copied</h1>);
			},
			(err) => {
				toast.error("Failed to copy trip plan: ", err);
			}
		);
	};

	const renderStep = () => {
		switch (step) {
			case 0:
				return (
					<div className="space-y-4 sm:space-y-6">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
							What's your budget? 💰
						</h2>
						<div className="flex flex-col space-y-3 sm:space-y-4">
							{budgetOptions.map((budget) => (
								<button
									key={budget}
									onClick={() => setSelectedBudget(budget)}
									className={`py-3 sm:py-4 px-4 sm:px-6 rounded-full text-lg sm:text-xl font-semibold border-2 border-gray-300 transition-all duration-300 transform hover:scale-105 ${
										selectedBudget === budget
											? "bg-blue-500 shadow-lg"
											: "bg-white bg-opacity-10 hover:bg-opacity-20"
									}`}
								>
									{budget}
								</button>
							))}
						</div>
					</div>
				);
			case 1:
				return (
					<div className="space-y-4 sm:space-y-6">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
							Where to? 📍
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
							{countries.map((country) => (
								<button
									key={country}
									onClick={() => setSelectedCountry(country)}
									className={`py-3 sm:py-4 px-4 sm:px-6 rounded-2xl border-2 border-gray-300 text-base sm:text-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
										selectedCountry === country
											? "bg-blue-500 text-white shadow-lg"
											: "bg-white bg-opacity-10 hover:bg-opacity-20"
									}`}
								>
									{country}
								</button>
							))}
						</div>
					</div>
				);
			case 2:
				return (
					<div className="space-y-4 sm:space-y-6">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
							Your ideal setting? 🌀
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
							{placeTypes.map((placeType) => (
								<button
									key={placeType}
									onClick={() => setSelectedPlaceType(placeType)}
									className={`py-3 sm:py-4 px-4 sm:px-6 rounded-2xl text-sm sm:text-lg font-semibold border-2 border-gray-300 transition-all duration-300 transform hover:scale-105 ${
										selectedPlaceType === placeType
											? "bg-blue-500 text-white shadow-lg"
											: "bg-white bg-opacity-10 hover:bg-opacity-20"
									}`}
								>
									{placeType}
								</button>
							))}
						</div>
					</div>
				);
			case 3:
				return (
					<div className="space-y-4 sm:space-y-6">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
							How many travelers? 👥
						</h2>
						<div className="flex flex-col space-y-3 sm:space-y-4">
							{travelerOptions.map((option) => (
								<button
									key={option}
									onClick={() => setNumberOfTravelers(option)}
									className={`py-3 sm:py-4 px-4 sm:px-6 rounded-full text-lg sm:text-xl border-2 border-gray-300 font-semibold transition-all duration-300 transform hover:scale-105 ${
										numberOfTravelers === option
											? "bg-blue-500 shadow-lg"
											: "bg-white bg-opacity-10 hover:bg-opacity-20"
									}`}
								>
									{option}
								</button>
							))}
						</div>
					</div>
				);
			case 4:
				return (
					<div className="space-y-4 sm:space-y-6">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
							How long is your adventure? 🌲
						</h2>
						<input
							type="text"
							placeholder="e.g., 3 days, 1 week, 1 month"
							value={tripDuration}
							onChange={(e) => setTripDuration(e.target.value)}
							className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-full text-lg sm:text-xl bg-white bg-opacity-10 border-2 border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
						/>
					</div>
				);
			case 5:
				return (
					<div className="space-y-4 sm:space-y-6 w-full shadow-sm shadow-cyan-300 border">
						<div className="rounded-lg p-4 sm:p-6 overflow-auto max-h-[60vh] shadow-xl">
							<pre className="whitespace-pre-wrap text-sm font-serif sm:text-base">
								{loading ? <Loader /> : tripPlan}
							</pre>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen font-serif flex items-center justify-center">
			<div className="w-full max-w-3xl mt-6">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center my-10">
					Dream Trip Planner
				</h1>
				<div className="rounded-3xl shadow-lg shadow-black overflow-hidden p-3 md:p-12">
					<div className="flex justify-between mb-6 sm:mb-8">
						{[
							AttachMoney,
							LocationOn,
							Hotel,
							People,
							AccessTime,
							Description,
						].map((Icon, index) => (
							<div
								key={index}
								className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
									step === index
										? "bg-white text-indigo-600 scale-110 shadow-lg"
										: "bg-indigo-500 text-white"
								}`}
							>
								<Icon fontSize={window.innerWidth < 640 ? "small" : "medium"} />
							</div>
						))}
					</div>

					<div className="flex flex-wrap items-center justify-center">
						{renderStep()}
					</div>

					<div className="flex flex-col md:flex-row gap-5 justify-between mt-10">
						<button
							onClick={prevStep}
							className={`py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
								step === 0
									? "invisible"
									: "bg-white text-indigo-600 hover:bg-gray-200 flex items-center"
							}`}
						>
							<ArrowBack className="mr-2" fontSize="small" />
							Back
						</button>
						{step < 4 && (
							<button
								onClick={nextStep}
								className="py-2 sm:py-3 px-4 sm:px-6 rounded-full bg-cyan-500 text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center"
							>
								Next
								<ArrowBack
									className="ml-2 transform rotate-180"
									fontSize="small"
								/>
							</button>
						)}
						{step === 4 && (
							<button
								disabled={loading}
								onClick={getTripPlan}
								className="py-2 sm:py-3 px-4 sm:px-6 rounded-full border hover:bg-indigo-600 text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center"
							>
								{loading ? <LoadingSpinner /> : "Plan My Trip 🍁"}
							</button>
						)}
						{step === 5 && (
							<>
								<button
									disabled={loading}
									onClick={getTripPlan}
									className="py-2 sm:py-3 px-4 sm:px-6 rounded-full border-2 hover:bg-indigo-600 hover:text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center"
								>
									{loading ? (
										<LoadingSpinner />
									) : (
										<span>
											<Refresh className="mr-2" fontSize="small" />
											Regenerate
										</span>
									)}
								</button>
								<button
									onClick={copyToClipboard}
									className="py-2 sm:py-3 px-4 sm:px-6 rounded-full border-2 hover:bg-indigo-600 hover:text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center"
								>
									<FileCopy className="mr-2" />
									Copy Trip Plan
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TripPlanner;
