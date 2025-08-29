import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Navigation from "./pages/partials/Navigation"
import "./assets/scss/App.scss";
import SignupPage from "./pages/auth/SignupPage";

import LoginPage from "./pages/auth/LoginPage";

import { ToastContainer } from "react-toastify"
import EstablishmentsPage from "./pages/EstablishmentsPage";

function App() {


	return (
		<div id="App">

			<Navigation />

			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/establishments" element={<EstablishmentsPage />} />


				{/* Auth Routes */}
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/login" element={<LoginPage />} />


			</Routes>

			<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
		</div>
	)
}

export default App
