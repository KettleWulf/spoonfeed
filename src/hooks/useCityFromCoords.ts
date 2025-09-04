import { useEffect, useState } from "react";
import type { Location } from "../types/Place.types";
import extractCityFromResults from "../helpers/extractCityFromResults";

const useCityFromCoords = (coords: Location | null) => {
    const [city, setCity] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!coords || !window.google?.maps?.Geocoder) return;

        setIsLoading(true);
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ location: coords }, (results, status) => {
            setIsLoading(false);
            if (status === 'OK' && results?.[0]) {
                const extractedCity = extractCityFromResults(results[0]);
                setCity(extractedCity);
            }
        });
    }, [coords]);

    return { city, isLoading };
};


export default useCityFromCoords