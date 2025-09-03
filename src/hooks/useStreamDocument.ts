import { CollectionReference, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useStreamDocument = <T>(colRef: CollectionReference<T>, documentId: string | undefined) => {
	const [error, setError] = useState<string | false>(false);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<T | null>(null);

	useEffect(() => {

		const docRef = doc(colRef, documentId);


		const unsubscribe = onSnapshot(docRef, (snapshot) => {

			if (!snapshot.exists()) {
				setError("Document not found");
				setIsLoading(false);
				return;
			}

			const data = {
				...snapshot.data(),
				_id: snapshot.id,
			}

			setData(data);
			setIsLoading(false);
		});

		return unsubscribe;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colRef]);

	return {
		data,
		error,
		isLoading,
	}
}

export default useStreamDocument;