import { useCallback, useState } from "react";
import type { Location } from "../types/Place.types";
import extractCityFromResults from "../helpers/extractCityFromResults";

const STATUS_MESSAGES: Partial<Record<google.maps.GeocoderStatus, string>> = {
	INVALID_REQUEST: "Invalid request",
	REQUEST_DENIED: "Request denied",
	OVER_QUERY_LIMIT: "Query limit exceeded",
	ZERO_RESULTS: "No results found for this location",
};

export const useGeocoding = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [address, setAddress] = useState<string | null>(null);

	const getAddress = useCallback(
		(
			coords: Location,
			onSuccess?: (address: string, city?: string) => void,
			onError?: (error: string) => void
		) => {
			if (!window.google || !window.google.maps) {
				setError("Google Maps API hasn't loaded");
				onError?.("Google Maps API hasn't loaded");
				return;
			}
			const geocoder = new google.maps.Geocoder();

			setIsLoading(true);
			setError(null);

			const request = {
				location: coords,
			};

			geocoder.geocode(request, (results, status) => {
				if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
					const foundAddress = results[0].formatted_address;
					const city = extractCityFromResults(results[0]);

					setAddress(foundAddress);
					setIsLoading(false);

					onSuccess?.(foundAddress, city || undefined);
				} else {
					const msg = STATUS_MESSAGES[status] ?? "Geocoding failed";
					setError(msg);
					setIsLoading(false);
					onError?.(msg);
				}
			});
		},
		[]
	);

	return {
		isLoading,
		error,
		address,
		getAddress,
	};
};

export default useGeocoding;
