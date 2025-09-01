import { useEffect, useState } from "react"
import type { Location } from "../types/Establishment.types";

const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUserLocation = () => {
            setIsLoading(true);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    setUserLocation({ lat, lng });

                    setIsLoading(false);
                },
                (error) => {

                    setError(error.message);
                    setIsLoading(false);

                }
                );

            } else {
                setError("Geolocation is not supported by this browser");
                setIsLoading(false);

            }


        }
        getUserLocation();
    }, []);

    return {
        userLocation,
        isLoading,
        error,
    };
}

export default useUserLocation
