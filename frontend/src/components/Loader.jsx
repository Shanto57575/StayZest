import { ThreeDots } from "react-loader-spinner";

const Loader = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<>
				<ThreeDots
					height={100}
					width={100}
					radius={5}
					color="#6F00FF"
					ariaLabel="ball-triangle-loading"
					wrapperStyle={{}}
					wrapperClass=""
					visible={true}
				/>
				<p className="text-3xl font-serif font-extrabold text-indigo-600">
					Planning your Dream trip....
				</p>
			</>
		</div>
	);
};

export default Loader;
