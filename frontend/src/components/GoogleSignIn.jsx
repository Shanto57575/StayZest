import { useDispatch, useSelector } from "react-redux";
import { googleSignIn } from "../features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

const GoogleSignIn = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { loading } = useSelector((state) => state.auth);

	const from = location?.state?.from?.pathname || "/";

	const handleGoogleSignIn = () => {
		dispatch(googleSignIn({ navigate, from }));
	};

	return (
		<button
			disabled={loading}
			className="flex items-center justify-center gap-x-1 w-full px-4 py-2 text-sm font-medium text-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-4 bg-black focus:ring-indigo-500"
			onClick={handleGoogleSignIn}
		>
			<GoogleIcon />
			{loading ? "Signing in..." : "Sign in with Google"}
		</button>
	);
};

export default GoogleSignIn;
