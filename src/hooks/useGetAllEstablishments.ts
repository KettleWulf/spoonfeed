import { orderBy } from "firebase/firestore";
import { establishmentsCol } from "../services/Firebase"
import useStreamCollection from "./useStreamCollection"

const useGetEstablishments = () => {
	return useStreamCollection(establishmentsCol,
		orderBy("name")
	);
}

export default useGetEstablishments