import Navigation from "./pages/partials/Navigation"
import "./assets/scss/App.scss";
import SignupPage from "./pages/auth/SignupPage";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";


function App() {


	return (
		<div id="App">
			<Navigation />
			<Routes>
				<Route path="/signup" element={<SignupPage />} />
					
				

			</Routes>
			<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
		</div>
	)
}

export default App
