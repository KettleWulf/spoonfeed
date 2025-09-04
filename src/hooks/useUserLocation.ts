import { useEffect, useState } from "react"
import type { Location } from "../types/Place.types";
import extractCityFromResults from "../helpers/extractCityFromResults";

const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ userCity, setUserCity ] =  useState<string | null>(null)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const getUserLocationWithCity = async () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const coords = { lat, lng };

                setUserLocation(coords);

                // Vänta på att Google Maps API laddas innan geocoding
                const waitForGoogleMaps = () => {
                    return new Promise<void>((resolve) => {
                        const checkGoogle = () => {
                            if (window.google?.maps?.Geocoder) {
                                resolve();
                            } else {
                                setTimeout(checkGoogle, 100);
                            }
                        };
                        checkGoogle();
                    });
                };

                try {
                    await waitForGoogleMaps();
                    const geocoder = new google.maps.Geocoder();
                    
                    geocoder.geocode({ location: coords }, (results, status) => {
                        if (status === 'OK' && results?.[0]) {
                            const city = extractCityFromResults(results[0]);
                            console.log("User detected city:", city);
                            setUserCity(city);
                        }
                        setIsLoading(false);
                    });
                } catch (error) {
                    console.error("Geocoding failed:", error);
                    setIsLoading(false);
                }
            },
            (error) => {
                setError(error.message);
                setIsLoading(false);
            }
        );
    };

    getUserLocationWithCity();
}, []);

    return {
        userLocation,
        isLoading,
        userCity,
        error,
    };
}

export default useUserLocation
