import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import AuthContextProvider from "./context/AuthContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthContextProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</AuthContextProvider>
	</StrictMode>
);

