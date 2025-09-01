import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Navigation from "./pages/partials/Navigation"
import "./assets/scss/App.scss";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import PlacesPage from "./pages/PlacesPage";
import { ToastContainer } from "react-toastify"



function App() {


	return (
		<div id="App">

			<Navigation />

			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/places" element={<PlacesPage />} />


				{/* Auth Routes */}
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/login" element={<LoginPage />} />


			</Routes>

			<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
		</div>
	)
}

export default App
