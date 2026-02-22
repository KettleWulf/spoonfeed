import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Navigation from "./pages/partials/Navigation"
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import PlacesPage from "./pages/PlacesPage";
import { ToastContainer } from "react-toastify"
import UppdateProfile from "./pages/auth/UppdateProfile";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ListOfProfilePage from "./pages/auth/ListOfProfilePage";
import PlacePage from "./pages/PlacePage";

function App() {
	return (

		<div className="bg-white">
			<Navigation />

			<main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-2 sm:px-6 lg:px-8">
				<Routes>
					<Route path="/login" element={<LoginPage />} />

					{/* Auth Routes */}
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/forgot-Password" element={<ForgotPassword />} />

					<Route element={<ProtectedRoutes />}>
						<Route path="/Profile" element={<UppdateProfile />} />
						<Route path="/Admins" element={<ListOfProfilePage />} />
						<Route path="/places" element={<PlacesPage />} />
					</Route>
					<Route path="/" element={<HomePage />} />
					<Route path="/places/:id" element={<PlacePage />} />
				</Routes>

			</main>

			<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
		</div>

	)
}

export default App
