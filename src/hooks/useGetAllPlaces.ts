import { orderBy } from "firebase/firestore";
import { placesCol } from "../services/Firebase"
import useStreamCollection from "./useStreamCollection"

const useGetAllPlaces = () => {
	return useStreamCollection(placesCol,
		orderBy("name")
	);
}

export default useGetAllPlaces