import { useEffect, useState } from "react";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { imagesCol } from "../services/Firebase";
import type { PlaceIMG } from "../types/Place.types";

const useStreamPlaceImages = (placeId?: string) => {
	const [data, setData] = useState<PlaceIMG[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!placeId) {
			setData(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		const queryRef = query(imagesCol(placeId), orderBy("createdAt", "desc"));
		const unsubscribe = onSnapshot(queryRef, (snapshot) => {
			const data = snapshot.docs.map((doc) => {
				return {
					...doc.data(),
					_id: doc.id,
				};
			});

			setData(data);
			setIsLoading(false);
		});

		return unsubscribe;
	}, [placeId]);

	return { data, isLoading };
};

export default useStreamPlaceImages;
