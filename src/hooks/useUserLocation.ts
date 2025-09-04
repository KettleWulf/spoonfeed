import { useEffect, useState } from "react"
import type { Location } from "../types/Place.types";
import { useSearchParams } from "react-router";

const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const queryCity = searchParams.get("query") || "";

        if (queryCity) {
            setIsLoading(false);
            return;
        }


        const getUserLocationWithCity = () => {
            if (!navigator.geolocation) {
                setError("Geolocation is not supported by this browser");
                setIsLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const coords = { lat, lng };

                    setUserLocation(coords);
                    setIsLoading(false);    
                },
                (error) => {
                    setError(error.message);
                    setIsLoading(false);
                }
            );
        };

        getUserLocationWithCity();
    }, [searchParams]);

    return {
        userLocation,
        isLoading,
        error,
    };
}

export default useUserLocation
