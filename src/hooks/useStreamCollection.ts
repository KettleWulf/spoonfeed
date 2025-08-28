import { onSnapshot, query, type CollectionReference, type QueryConstraint } from "firebase/firestore";
import { useEffect, useState } from "react";

const useStreamCollection = <T>(
	colRef: CollectionReference<T>,
	... queryConstraints: QueryConstraint[]
) => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<T[] | null>(null);

	useEffect(() => {
		const queryRef = query(colRef, ...queryConstraints);

		const unsubscribe = onSnapshot(queryRef, (snapshot) => {

			const data = snapshot.docs.map(doc => {
				return {
					... doc.data(),
					_id: doc.id
				}
			});

			setData(data);
			setIsLoading(false);
		});

		return unsubscribe

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colRef])

	return {
		data,
		isLoading
	}
}

export default useStreamCollection;