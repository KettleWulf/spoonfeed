import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import AuthContextProvider from "./context/AuthContextProvider.tsx";
import { LoadScript } from "@react-google-maps/api";

const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthContextProvider>
			<BrowserRouter>
				<LoadScript googleMapsApiKey={mapApiKey}>
					<App />
				</LoadScript>
			</BrowserRouter>
		</AuthContextProvider>
	</StrictMode>
);

