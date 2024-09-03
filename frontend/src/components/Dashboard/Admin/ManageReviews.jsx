import { useState, useEffect, useRef } from "react";
import {
	FaEdit,
	FaTrash,
	FaComment,
	FaExclamationTriangle,
	FaUserCircle,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { convertToMDY } from "../../converter";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";

const ManageReviews = () => {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [edit, setEdit] = useState(null);
	const [text, setText] = useState("");
	const inputRef = useRef(null);
	const axiosInstance = useAxiosInterceptor();

	useEffect(() => {
		fetchReviews();
	}, []);

	useEffect(() => {
		if (edit && inputRef.current) {
			inputRef.current.focus();
		}
	}, [edit]);

	const fetchReviews = async () => {
		try {
			const response = await axiosInstance.get("/api/review/all-reviews");
			setReviews(response.data);
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch reviews");
			setLoading(false);
		}
	};

	const handleEdit = (id, currentText) => {
		setEdit(id);
		setText(currentText);
	};

	const handleUpdate = async () => {
		try {
			const response = await axiosInstance.put(`/api/review/${edit}`, {
				comments: text,
			});
			if (response.data) {
				setReviews(
					reviews.map((review) =>
						review._id === edit ? { ...review, comments: text } : review
					)
				);
				setEdit(null);
				setText("");
			}
		} catch (err) {
			console.error("Error updating review:", error.response?.data?.error);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await axiosInstance.delete(`/api/review/${id}`);
			if (response.status === 200) {
				fetchReviews();
			}
		} catch (error) {
			console.error("Error deleting review:", error.response?.data?.error);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="relative w-24 h-24">
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
					<div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
					<FaComment className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl animate-bounce" />
				</div>
			</div>
		);
	if (error)
		return (
			<div className="h-screen flex items-center text-center justify-center font-serif">
				<div className="text-center">
					<FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
					<h2 className="text-2xl font-bold mb-2">Oops!</h2>
					<h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
					<p className="text-gray-600 dark:text-gray-400">{error}</p>
				</div>
			</div>
		);

	return (
		<div className="w-full font-serif">
			<h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-6">
				Manage Reviews
			</h1>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
				{reviews &&
					reviews?.map((review) => (
						<div
							key={review._id}
							className="px-4 py-6 rounded-lg shadow-lg hover:shadow-md dark:shadow-gray-950 shadow-gray-400"
						>
							<div className="space-y-2">
								<div className="flex flex-wrap items-center justify-between space-y-2 text-sm">
									<div className="flex items-center gap-x-1">
										<FaUserCircle className="mr-2" size={20} />
										<span className="font-semibold">
											{review.user.username}
										</span>
									</div>
									<div>
										<MdOutlineAccessTimeFilled
											className="inline-block mr-2"
											size={20}
										/>
										{convertToMDY(review.createdAt)}
									</div>
								</div>
								<div className="flex items-center gap-x-1 text-sm">
									<FaLocationDot className="mr-2" size={20} />
									{review.place.location}, {review.place.country}
								</div>
								{edit === review._id ? (
									<div className="flex items-center gap-x-1">
										<FaComment className="inline-block" size={20} />
										<input
											ref={inputRef}
											className="bg-transparent px-3 py-1 border cursor"
											value={text}
											onChange={(e) => setText(e.target.value)}
											type="text"
											name="comments"
											id="comments"
										/>
									</div>
								) : (
									<div className="flex items-center gap-x-1">
										<FaComment className="inline-block mr-2" size={20} />
										<h2 className="text-xs break-words">{review.comments}</h2>
									</div>
								)}
							</div>
							<p className="text-gray-600 mb-4 break-words">{review.text}</p>
							<div className="flex justify-end space-x-2">
								{edit === review._id ? (
									<button
										onClick={handleUpdate}
										className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
									>
										Update
									</button>
								) : (
									<button
										onClick={() => handleEdit(review._id, review.comments)}
										className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
									>
										<FaEdit />
									</button>
								)}
								<button
									onClick={() => handleDelete(review._id)}
									className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
								>
									<FaTrash />
								</button>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default ManageReviews;
