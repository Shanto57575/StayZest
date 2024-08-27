import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { TbError404 } from "react-icons/tb";

const ErrorPage = () => {
	return (
		<div className="h-screen flex items-center text-center justify-center font-serif">
			<div className="text-center">
				<TbError404 size={100} className="text-red-500 text-6xl mx-auto mb-4" />
				<h2 className="text-2xl font-bold mb-2">Oops! You are lost</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-6">Get</p>
				<Link
					to="/"
					className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out"
				>
					Back to Home
				</Link>
			</div>
		</div>
	);
};

export default ErrorPage;
