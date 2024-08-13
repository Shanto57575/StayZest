import React from "react";

const StatCard = ({ title, value, icon: Icon, bgColor }) => (
	<div
		className={`${bgColor} text-white rounded-lg shadow-lg shadow-gray-600 p-4`}
	>
		<div className="flex justify-between items-center mb-2">
			<h3 className="text-sm font-medium">{title}</h3>
			<Icon className="h-5 w-5 opacity-70" />
		</div>
		<p className="text-2xl font-bold">{value}</p>
	</div>
);

export default StatCard;
