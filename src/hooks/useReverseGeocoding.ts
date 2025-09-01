import {useState, useCallback } from "react"
import type { Location } from "../types/Place.types"

{/*Gör till stor del detsamma som useGeocoding men tar emot en adress istället. vet inte om det skulle vara fördelaktigt om jag kombinerar
    eftersom de är rätt mycket upprepning i koden
    */}
export const useReverseGeocoding = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] =  useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<Location | null>(null);

    const getCoordinates = useCallback((
        address: string,
        onSuccess?: (coords: Location, formattedAddress: string) => void,
        onError?: (error: string) => void,
    ) => {
        if(!window.google || !window.google.maps) {
            setError("Google Maps API hasn't loaded");
            onError?.("Google Maps API hasn't loaded");
            return;
        }

        if(!address || address.trim().length === 0){
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
            // Kanske behöver göra detta mer dynamiskt
        }

        geocoder.geocode(request, (results, status) => {
            if(status === google.maps.GeocoderStatus.OK && results && results[0]){
                const location = results[0].geometry.location;
                const coords: Location = {
                    lat: location.lat(),
                    lng: location.lng()
                };
                const formattedAddress = results[0].formatted_address;

                setCoordinates(coords);
                setIsLoading(false);

                onSuccess?.(coords, formattedAddress);
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
        })
    }, []);

    return {
        isLoading,
        error,
        coordinates,
        getCoordinates,
    };
};

export default useReverseGeocoding;