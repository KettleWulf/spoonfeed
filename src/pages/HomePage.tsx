
import EstablishmentFormModal from "../components/EstablishmentFormModal";
import Map from "../components/Map";


const HomePage = () => {
	return (
	<>
		<h1>HomePage</h1>
		<Map />
		<EstablishmentFormModal onSave={() => {return}} isAdmin={true}/>
	</>
	)
}


export default HomePage;
