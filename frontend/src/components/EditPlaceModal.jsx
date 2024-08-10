import { useState } from "react";

const EditPlaceModal = ({ isOpen, onClose, onSubmit, initialData }) => {
	const [formData, setFormData] = useState(initialData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold dark:text-white">
						Edit Place Details
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
					>
						×
					</button>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="location"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Location
							</label>
							<input
								id="location"
								name="location"
								type="text"
								value={formData.location}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md p-2.5 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							/>
						</div>
						<div>
							<label
								htmlFor="country"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Country
							</label>
							<input
								id="country"
								name="country"
								type="text"
								value={formData.country}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							/>
						</div>
						<div>
							<label
								htmlFor="price"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Price
							</label>
							<input
								id="price"
								name="price"
								type="number"
								value={formData.price}
								onChange={handleChange}
								className="mt-1 block w-full rounded-md p-2.5 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							/>
						</div>
						<div className="flex flex-col md:flex-row items-center justify-between">
							<div>
								<label
									htmlFor="startDate"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Start Date
								</label>
								<input
									id="startDate"
									name="startDate"
									type="date"
									value={formData.startDate}
									onChange={handleChange}
									className="mt-1 block w-full rounded-md p-2.5 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
								/>
							</div>
							<div>
								<label
									htmlFor="endDate"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									End Date
								</label>
								<input
									id="endDate"
									name="endDate"
									type="date"
									value={formData.endDate}
									onChange={handleChange}
									className="mt-1 block w-full rounded-md p-2.5 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
								/>
							</div>
						</div>
					</div>
					<div className="mt-6">
						<button
							type="submit"
							className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
						>
							Save changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditPlaceModal;
