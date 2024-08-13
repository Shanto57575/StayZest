import { Link } from "react-router-dom";
import wrongLogo from "../assets/wronglogo.png";

const CancelPage = () => {
	return (
		<div className="h-screen flex items-center text-center justify-center font-serif">
			<article className="w-96 h-[350px] bg-red-100 border shadow-md shadow-gray-700 dark:shadow-black px-10">
				<img className="w-16 mt-10 mb-4 mx-auto" src={wrongLogo} alt="" />
				<h1 className="bg-red-200 flex items-center justify-around hover:bg-red-300 mb-3 text-xl rounded-full py-3 px-6 border-2 border-red-300 text-red-700 font-extrabold">
					Payment Failed
				</h1>
				<p className="text-red-900 tracking-wider">
					Please Try Again! <br /> to confirm Your booking
				</p>
				<Link to="/">
					<button className="bg-red-500 text-white hover:bg-red-600 duration-300 px-6 py-2 mt-3 rounded-full font-semibold">
						Back to Home
					</button>
				</Link>
			</article>
		</div>
	);
};

export default CancelPage;
