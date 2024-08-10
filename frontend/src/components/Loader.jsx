import { ThreeDots } from "react-loader-spinner";

const Loader = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<>
				<ThreeDots
					height={100}
					width={100}
					radius={5}
					color="#1E90FF"
					ariaLabel="ball-triangle-loading"
					wrapperStyle={{}}
					wrapperClass=""
					visible={true}
				/>
				<p className="text-3xl font-serif font-extrabold text-sky-500">
					Loading....
				</p>
			</>
		</div>
	);
};

export default Loader;
