import { establishmentsCol } from "../services/Firebase"
import useStreamCollection from "./useStreamCollection"

const useGetEstablishments = () => {
	return useStreamCollection(establishmentsCol);
}

export default useGetEstablishments