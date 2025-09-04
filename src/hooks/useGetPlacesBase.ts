// useGetPlacesBase.ts
import { orderBy, where, type QueryConstraint } from "firebase/firestore";
import { useMemo } from "react";
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
	const constraints = useMemo<QueryConstraint[]>(() => {
		const arr: QueryConstraint[] = [
			where("isSuggestion", "==", opts.isSuggestion),
		];
		if (opts.city) {
			arr.push(where("city", "==", opts.city));
		}
		arr.push(orderBy(opts.orderByField, opts.orderDir));
		return arr;
	}, [opts.isSuggestion, opts.city, opts.orderByField, opts.orderDir]);

	return useStreamCollection(placesCol, ...constraints);
};

export default useGetPlacesBase;
