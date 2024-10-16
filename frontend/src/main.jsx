import App from "./App.jsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./app/store.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<Elements stripe={stripePromise}>
				<App />
			</Elements>
		</PersistGate>
	</Provider>
);
