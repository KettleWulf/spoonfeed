import { useState } from "react"
import type { Location } from "../types/Establishment.types";

export const useGeocoding = () => {
    const [isLoading, setIsLoading ] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [adress, setAdress ] =  useState<string | null>(null);
    
    
    const getAdress = (coords: Location) => {
        const geocoder = new google.maps.Geocoder();

        setIsLoading(true);
        setError(null);

        const request = {
            location: coords,
        }

        geocoder.geocode(request, (results, status) => {
            
            if(status === google.maps.GeocoderStatus.OK && results && results[0]){
                const adress = results[0].formatted_address
                setAdress(adress);
                setIsLoading(false);
            } else if (status === google.maps.GeocoderStatus.INVALID_REQUEST){
                setError("Invalid Request");
                setIsLoading(false);
            } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED){
                setError("Request Denied");
                setIsLoading(false);
            } else {
                setError("Something went wrong");
                setIsLoading(false);
            }
        });
        
    }

    return {
        isLoading,
        error,
        adress,
        getAdress,
    }

}

export default useGeocoding;