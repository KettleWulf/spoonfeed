import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Navigation from "./pages/partials/Navigation"
import "./assets/scss/App.scss";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import PlacesPage from "./pages/PlacesPage";
import { ToastContainer } from "react-toastify"
import UppdateProfile from "./pages/auth/UppdateProfile";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PasswordCheck from "./components/auth/PasswordCheck";
import { LoadScript } from "@react-google-maps/api";

const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {


	return (
		<LoadScript googleMapsApiKey={mapApiKey} >

			<div id="App">

				<Navigation />

				<Routes>
					<Route path="/hej" element={<PasswordCheck />} />
					<Route path="/login" element={<LoginPage />} />


					<Route element={<ProtectedRoutes />}>
						<Route path="/forgot-Password" element={<ForgotPassword />} />
						<Route path="/signup" element={<SignupPage />} />
						<Route path="/Profile" element={<UppdateProfile />} />
					</Route>


					<Route path="/" element={<HomePage />} />
					<Route path="/places" element={<PlacesPage />} />


					{/* Auth Routes */}
					


				</Routes>

				<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
			</div>
		</LoadScript>
	)
}

export default App
