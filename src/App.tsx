import Navigation from "./pages/partials/Navigation"
import "./assets/scss/App.scss";

import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import { ToastContainer } from "react-toastify"

function App() {


	return (
		<div id="App">

			<Navigation />

			<>
				<Routes>
					{/* <Route path="*" element={<NotFoundPage />} /> */}
					<Route path="/" element={<HomePage />} />

					{/* Auth Routes */}




				</Routes>
			</>

			<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
		</div>
	)
}

export default App
