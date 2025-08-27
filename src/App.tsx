import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Navigation from "./pages/partials/Navigation"
import "./assets/scss/App.scss";
import { ToastContainer } from "react-toastify"

function App() {


	return (
		<div id="App">

			<Navigation />
		
			<Routes>
				<Route path="/" element={<HomePage />}/>
			</Routes>
		</div>
	)
}

export default App
