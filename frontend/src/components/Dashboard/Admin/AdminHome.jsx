import { useSelector } from "react-redux";

const AdminHome = () => {
	const user = useSelector((state) => state.auth.currentUser);

	return (
		<div className="h-screen font-serif">
			<h1 className="text-2xl">
				Welcome Back{" "}
				<span className="font-bold uppercase text-3xl dark:text-sky-400 text-sky-500">
					{user.username},
				</span>
			</h1>
		</div>
	);
};

export default AdminHome;
