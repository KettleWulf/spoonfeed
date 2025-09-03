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
import ListOfProfilePage from "./pages/auth/ListOfProfilePage";

function App() {

	return (

		<div id="App">

			<Navigation />

			<Routes>
				<Route path="/login" element={<LoginPage />} />

				{/* Auth Routes */}
				<Route path="/signup" element={<SignupPage />} />

				<Route element={<ProtectedRoutes />}>
					<Route path="/forgot-Password" element={<ForgotPassword />} />
					<Route path="/Profile" element={<UppdateProfile />} />
					<Route path="/Admins" element={<ListOfProfilePage />} />
				</Route>
				<Route path="/" element={<HomePage />} />
				<Route path="/places" element={<PlacesPage />} />
			</Routes>









			<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
		</div>
	)
}

export default App
