import { orderBy, where, type QueryConstraint } from "firebase/firestore";
import { placesCol } from "../services/Firebase";
import useStreamCollection from "./useStreamCollection";

type OrderField = "name" | "createdAt";
type OrderDir = "asc" | "desc";

interface Options {
	isSuggestion: boolean;
	orderByField: OrderField;
	orderDir: OrderDir;
	city?: string; 
}

const useGetPlacesBase = (opts: Options) => {
	const constraints: QueryConstraint[] = [
		where("isSuggestion", "==", opts.isSuggestion),
	];

	if (opts.city) {
		constraints.push(where("city", "==", opts.city));
	}

	constraints.push(orderBy(opts.orderByField, opts.orderDir));

	return useStreamCollection(placesCol, ...constraints);
}

export default useGetPlacesBase