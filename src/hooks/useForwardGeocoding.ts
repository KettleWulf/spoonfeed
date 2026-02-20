import { useState, useCallback } from "react";
import type { Location } from "../types/Place.types";
import extractCityFromResults from "../helpers/extractCityFromResults";

const STATUS_MESSAGES: Partial<Record<google.maps.GeocoderStatus, string>> = {
	INVALID_REQUEST: "Invalid request",
	REQUEST_DENIED: "Request denied",
	OVER_QUERY_LIMIT: "Query limit exceeded",
	ZERO_RESULTS: "No results found for this location",
};

export const useForwardGeocoding = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [coordinates, setCoordinates] = useState<Location | null>(null);

	const getCoordinates = useCallback((
		address: string,
		onSuccess?: (coords: Location, city: string) => void,
		onError?: (error: string) => void,
	) => {
		if (!window.google || !window.google.maps) {
			setError("Google Maps API hasn't loaded");
			onError?.("Google Maps API hasn't loaded");
			return;
		}

		if (!address || address.trim().length === 0) {
			setError("Please provide an address");
			onError?.("Please provide an address");
			return;
		}

		const geocoder = new google.maps.Geocoder();

		setIsLoading(true);
		setError(null);

		const request: google.maps.GeocoderRequest = {
			address: address,
			region: "SE",
		};

		geocoder.geocode(request, (results, status) => {
			if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
				const location = results[0].geometry.location;
				const coords: Location = {
					lat: location.lat(),
					lng: location.lng(),
				};

				const city = extractCityFromResults(results[0]);

				if (!city) {
					const msg = "Could not determine city for this location";
					setError(msg);
					setIsLoading(false);
					onError?.(msg);
					return;
				}

				setCoordinates(coords);
				setIsLoading(false);
				onSuccess?.(coords, city);
			} else {
				const msg = STATUS_MESSAGES[status] ?? "Geocoding failed";
				setError(msg);
				setIsLoading(false);
				onError?.(msg);
			}
		});
	}, []);

	return {
		isLoading,
		error,
		coordinates,
		getCoordinates,
	};
};

export default useForwardGeocoding;
