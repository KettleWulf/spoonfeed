import { orderBy, where } from "firebase/firestore";
import { establishmentsCol } from "../services/Firebase"
import useStreamCollection from "./useStreamCollection"

const useGetEstablishmentsOrSuggestions = (isSuggestion: boolean) => {
	return useStreamCollection(establishmentsCol, 
		where("isSuggestion", "==", isSuggestion),
		orderBy("createdAt", "desc"),
	);
}

export default useGetEstablishmentsOrSuggestions;