import { useState, useEffect } from "react";
import axios from "axios";
import {
	FaEdit,
	FaTrash,
	FaUserCircle,
	FaComment,
	FaPaperPlane,
} from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { convertToMDY } from "./converter";

const ReviewForm = ({ place }) => {
	const [reviews, setReviews] = useState([]);
	const [text, setText] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(false);
	const user = useSelector((state) => state.auth.currentUser);

	const fetchReviews = async () => {
		try {
			const response = await axios.get(
				`https://stayzest-backend.vercel.app/api/review/reviews-by-place/${place}`,
				{ withCredentials: true }
			);
			setReviews(response.data);
		} catch (error) {
			if (error.response && error.response.status === 404) {
				console.log("No reviews found:", error.response.data.message);
				setReviews([]);
			} else {
				toast.error("Error fetching reviews!");
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingId) {
				const response = await axios.put(
					`https://stayzest-backend.vercel.app/api/review/${editingId}`,
					{ comments: text },
					{ withCredentials: true }
				);
				if (response.data) {
					toast.success(
						<h1 className="font-serif">Review Updated Successfully</h1>
					);
					setEditingId(null);
				}
			} else {
				setLoading(true);
				const response = await axios.post(
					"https://stayzest-backend.vercel.app/api/review/add-review",
					{ user: user._id, place, comments: text },
					{ withCredentials: true }
				);
				if (response.data) {
					toast.success(
						<h1 className="font-serif">Review Added Successfully</h1>
					);
					setLoading(false);
				}
			}
			setText("");
			fetchReviews();
		} catch (error) {
			setLoading(false);
			toast.error(<h1 className="font-serif">Error with review</h1>);
		}
	};

	const handleEdit = (review) => {
		setEditingId(review._id);
		setText(review.comments);
	};

	const handleDeleteReview = async (reviewId) => {
		try {
			const response = await axios.delete(
				`https://stayzest-backend.vercel.app/api/review/${reviewId}`,
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				toast.success(
					<h1 className="font-serif">Review Deleted Successfully</h1>
				);
				fetchReviews();
			} else {
				toast.error(<h1 className="font-serif">{response.data.message} </h1>);
			}
		} catch (error) {
			console.error("Error deleting review:", error.response.data.message);
			toast.error(
				<h1 className="font-serif">{error.response.data.message}</h1>
			);
		}
	};

	useEffect(() => {
		fetchReviews();
	}, [place]);

	return (
		<div className="max-w-7xl mx-auto p-4 min-h-screen font-serif">
			<h1 className="text-3xl font-semibold mb-8 text-center">Reviews</h1>

			<div className="lg:flex lg:space-x-8">
				<div className="lg:w-1/2 mb-8 lg:mb-0">
					<form
						onSubmit={handleSubmit}
						className="space-y-4 p-6 rounded-lg dark:bg-gray-800 shadow-lg shadow-gray-400 dark:shadow-gray-950"
					>
						<div className="flex flex-col">
							<label htmlFor="username" className="mb-1 text-sm font-medium">
								Username
							</label>
							<input
								defaultValue={user.username}
								type="text"
								name="username"
								id="username"
								className="border border-gray-300 dark:bg-gray-900 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								readOnly
							/>
						</div>

						<div className="flex flex-col">
							<label htmlFor="review" className="mb-1 text-sm font-medium">
								Your Review
							</label>
							<textarea
								id="review"
								value={text}
								onChange={(e) => setText(e.target.value)}
								rows="4"
								className="w-full p-2 rounded mb-2 border dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Write a review..."
								required
							/>
						</div>

						{loading ? (
							<button
								type="submit"
								className="w-full bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
							>
								loading...
							</button>
						) : (
							<button
								type="submit"
								className="w-full bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
							>
								<FaPaperPlane className="mr-2" />
								{editingId ? "Update Review" : "Add Review"}
							</button>
						)}
					</form>
				</div>

				<div className="lg:w-1/2 space-y-6">
					{reviews.length > 0 ? (
						reviews.map((review) => (
							<div
								key={review._id}
								className="p-6 rounded-lg shadow-lg hover:shadow-md shadow-gray-400 dark:shadow-gray-950"
							>
								<div className="flex items-center mb-4">
									<FaUserCircle className="mr-2" size={24} />
									<span className="font-medium">{review.user.username}</span>
									{(review.user.username === user.username ||
										user.role === "ADMIN") && (
										<div className="ml-auto flex space-x-2">
											<button
												onClick={() => handleEdit(review)}
												className="text-blue-500 hover:text-blue-600 transition duration-300"
											>
												<FaEdit size={18} />
											</button>
											<button
												onClick={() => handleDeleteReview(review._id)}
												className="text-red-500 hover:text-red-600 transition duration-300"
											>
												<FaTrash size={18} />
											</button>
										</div>
									)}
								</div>
								<p className="mb-2 break-words">
									<FaComment className="inline-block mr-2" size={16} />
									{review.comments}
								</p>
								<p>
									<MdOutlineAccessTimeFilled
										className="inline-block mr-2"
										size={16}
									/>
									{new Date(review.createdAt).toLocaleString()}
								</p>
							</div>
						))
					) : (
						<p className="text-center px-6 py-10 rounded-lg shadow-lg hover:shadow-md shadow-gray-400 dark:shadow-gray-950">
							No reviews yet. Be the first to review!
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ReviewForm;
