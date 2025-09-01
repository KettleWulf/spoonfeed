import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Navigation from "./pages/partials/Navigation"
import "./assets/scss/App.scss";
import SignupPage from "./pages/auth/SignupPage";

import LoginPage from "./pages/auth/LoginPage";

import { ToastContainer } from "react-toastify"
import UppdateProfile from "./pages/auth/UppdateProfile";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PasswordCheck from "./components/auth/PasswordCheck";

function App() {


	return (
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



			</Routes>

			<Routes>
				<Route path="/" element={<HomePage />} />


				{/* Auth Routes */}


			</Routes>

			<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
		</div>
	)
}

export default App
