import { orderBy, where } from "firebase/firestore";
import { placesCol } from "../services/Firebase"
import useStreamCollection from "./useStreamCollection"

const useGetPlacesOrSuggestions = (isSuggestion: boolean) => {
	return useStreamCollection(placesCol, 
		where("isSuggestion", "==", isSuggestion),
		orderBy("createdAt", "desc"),
	);
}

export default useGetPlacesOrSuggestions;