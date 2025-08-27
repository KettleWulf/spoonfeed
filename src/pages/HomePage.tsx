<<<<<<< HEAD
import Map from "../components/Map";


const HomePage = () => {
	return <>
		<h1>HomePage</h1>
		<Map />
	</>;
=======
import EstablishmentFormModal from "../components/EstablishmentFormModal";


const HomePage = () => {
	return <EstablishmentFormModal onSave={() => {return}} isAdmin={true}/>;
>>>>>>> 9b509d4c51fa5831ab4533d8dc530bb1ce4e9119
};

export default HomePage;
