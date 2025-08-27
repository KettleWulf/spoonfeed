import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Navigation from "./pages/partials/Navigation"
import "./assets/scss/App.scss";

import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import { ToastContainer } from "react-toastify"

function App() {


	return (
		<div id="App">

			<Navigation />
<<<<<<< HEAD
		
			<Routes>
				<Route path="/" element={<HomePage />}/>
			</Routes>
=======

			<>
				<Routes>
					{/* <Route path="*" element={<NotFoundPage />} /> */}
					<Route path="/" element={<HomePage />} />

					{/* Auth Routes */}




				</Routes>
			</>

			<ToastContainer closeOnClick theme="colored" limit={5} stacked position="bottom-right" />
>>>>>>> 9b509d4c51fa5831ab4533d8dc530bb1ce4e9119
		</div>
	)
}

export default App
