import { useCallback, useState } from "react"
import type { Location } from "../types/Place.types";
import extractCityFromResults from "../helpers/extractCityFromResults";



export const useGeocoding = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    const getAddress = useCallback((
        coords: Location,
        onSuccess?: (address: string, city?: string) => void, 
        onError?: (error: string) => void
    ) => {

        if(!window.google || !window.google.maps) {
            setError("Google Maps API hasn't loaded");
            onError?.("Google Maps API hasn't loaded");
            return;
        }
        const geocoder = new google.maps.Geocoder();
        
        setIsLoading(true);
        setError(null);

        const request = {
            location: coords,
        }

        geocoder.geocode(request, (results, status) => {

            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                const foundAddress = results[0].formatted_address;
                const city = extractCityFromResults(results[0]);

                setAddress(foundAddress);
                setIsLoading(false);

                onSuccess?.(foundAddress, city || undefined);
            } else {
                if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
                    setError("Invalid Request");
                    setIsLoading(false);
                } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
                    setError("Request Denied");
                    setIsLoading(false);
                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
                    setError("Query limit exceeded");
                    setIsLoading(false);
                } else if(status === google.maps.GeocoderStatus.ZERO_RESULTS){
                    setError("No resluts found on this location");
                    setIsLoading(false);
                }

                onError?.("Something else went wrong");
            }
        });

    }, []);

    return {
        isLoading,
        error,
        address,
        getAddress,
    }

}

export default useGeocoding;