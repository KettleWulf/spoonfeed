import { placesCol } from "../services/Firebase";
import useStreamDocument from "./useStreamDocument";

const useGetPlace = (placeId: string | undefined) => {
	return useStreamDocument(placesCol, placeId);
};

export default useGetPlace;
