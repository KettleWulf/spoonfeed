import { GoogleMap, LoadScript } from "@react-google-maps/api";
import useUserLocation from "../hooks/useUserLocation";
import useGeocoding from "../hooks/useGeocoding";
import { useState } from "react";

const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface ClickedLocation {
    coords: google.maps.LatLngLiteral;
    address: string
}

const Map = () => {

    const FALLBACK_CENTER = {
        // Coordinates to STOCKHOLM as fallback 
        lat: 59.334591,
        lng: 18.063240,
    }

    const [selectedLocation, setSelectedLocation] = useState<ClickedLocation | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);


    const {
        userLocation,
        isLoading: locationLoading,
        error: locationError
    } = useUserLocation();

    const { getAdress,
        address,
        // lägg till error handling senare : error: geocodingError, isLoading: geocoingIsLoading
    } = useGeocoding();

    const containerStyle = {
        width: "400px",
        height: "400px",
    }

    if (locationError && !userLocation) {
        return <p>Kunde inte hämta din position. Visar Stockholm istället.</p>
    }

    if (locationLoading) {
        return <p>Hämtar din position... </p>
    }

    const mapCenter = userLocation || FALLBACK_CENTER;

    {/*funktion för när man trycker på kartan */ }
    const onHandleMapClick = async (e: google.maps.MapMouseEvent) => {

        if (!e.latLng) {
            return;
        }

        const clickedCoords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        }

        setSelectedLocation({
            coords: clickedCoords,
            address: "Hämtar adress..."
        });
        setIsLoadingAddress(true);

        getAdress(
            clickedCoords,
            (foundAddress) => {
                setSelectedLocation({
                    coords: clickedCoords,
                    address: foundAddress,
                });
                setIsLoadingAddress(false)
                console.log("Found address", foundAddress);
                console.log("For coordinates", clickedCoords);
            },
            (error) => {
                setSelectedLocation({
                    coords: clickedCoords,
                    address: "Kunde inte hämta adress"
                });
                setIsLoadingAddress(false);
                console.error("Geocoding fel: ", error);
            }
        );

        console.log("Last clicked address: ", address);
    }


    return (
        <LoadScript
            googleMapsApiKey={mapApiKey}

        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                onClick={onHandleMapClick}

            ></GoogleMap>

        </LoadScript>
    )
}

export default Map
