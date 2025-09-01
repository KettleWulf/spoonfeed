import { useCallback, useRef } from "react";
import { toast } from "react-toastify";
import useGeocoding from "./useGeocoding";
import type {
    Location,
    Place,
    PlaceFormData,
} from "../types/Place.types";

interface ClickedLocation {
    coords: google.maps.LatLngLiteral;
    address: string;
}

interface UseMapHandlersProps {
    onSavePlace: (place: PlaceFormData) => Promise<string | void>;
    setCurrentCity: (city: string | ((prev: string) => string)) => void;
    setMapCenter: (coords: Location) => void;
    setMapZoom: (zoom: number) => void;
    setSelectedLocation: (location: ClickedLocation | null) => void;
    setSearchResult: (result: Location | null) => void;
    setShowModal: (show: boolean) => void;
}

const useMapHandler = ({
    onSavePlace,
    setCurrentCity,
    setMapCenter,
    setMapZoom,
    setSelectedLocation,
    setSearchResult,
    setShowModal,
}: UseMapHandlersProps) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const { getAddress } = useGeocoding();

    const handleLocationFound = useCallback((coords: Location, city?: string) => {
        setSearchResult(coords);
        setSelectedLocation(null);

        if (city) {
            setCurrentCity(prevCity => city !== prevCity ? city : prevCity);
        }

        setMapCenter(coords);
        setMapZoom(15);

        if (mapRef.current) {
            mapRef.current.panTo(coords);
            mapRef.current.setZoom(15);
        }
    }, [setCurrentCity, setMapCenter, setMapZoom, setSelectedLocation, setSearchResult]);

    const handleMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;

        map.setOptions({
            styles: [
                {
                    featureType: "poi",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "poi.business",
                    stylers: [{ visibility: "off" }]
                }
            ]
        })
    }, []);

    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {

        if (!e.latLng) return;

        const clickedCoords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        }

        setSearchResult(null);
        setSelectedLocation({
            coords: clickedCoords,
            address: "Hämtar adress..."
        });

        getAddress(
            clickedCoords,
            (foundAddress, city) => {
                setSelectedLocation({
                    coords: clickedCoords,
                    address: foundAddress,
                });

                if(city) {
                    setCurrentCity(prevCity => city && city !== prevCity ? city : prevCity);
                }
                

            },
            (error) => {
                setSelectedLocation({
                    coords: clickedCoords,
                    address: "Kunde inte hämta adress"
                });
                console.error("Geocoding fel: ", error);
            }
        );
    }, [getAddress, setCurrentCity, setSelectedLocation, setSearchResult]);

    const handleSavePlace = useCallback(async (place: PlaceFormData) => {
        try {
            await onSavePlace(place);
            setShowModal(false);
            setSelectedLocation(null);
            toast.success("Added a spoonful");
        } catch (error){
            if(error instanceof Error) {
                console.error("Error when saving", error.message);
                toast.error("Something went wrong when saving");
            }
        }
    }, [onSavePlace, setShowModal, setSelectedLocation]);

    const handlePlaceClick = useCallback((place: Place) => {
        const { lat, lng } = place.location;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, "_blank");
    }, [])

    return {
        mapRef,
        handleLocationFound,
        handleMapLoad,
        handleMapClick,
        handleSavePlace,
        handlePlaceClick
    };
}

export default useMapHandler;