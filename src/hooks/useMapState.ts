import { useState, useEffect } from "react";
import type { Location } from "../types/Place.types";
import useUserLocation from "./useUserLocation";

interface ClickedLocation {
    coords: google.maps.LatLngLiteral;
    address: string;
}

const FALLBACK_CENTER: Location = {
    lat: 59.334591,
    lng: 18.063240,
};

const useMapState = () => {
    const { userLocation, isLoading: locationLoading } = useUserLocation();

    const [currentCity, setCurrentCity] = useState<string>("Stockholm");
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [mapCenter, setMapCenter] = useState<Location>(FALLBACK_CENTER);
    const [mapZoom, setMapZoom] = useState(12);
    const [selectedLocation, setSelectedLocation] = useState<ClickedLocation | null>(null);
    const [searchResult, setSearchResult] = useState<Location | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if(userLocation && ! locationLoading) {
            setMapCenter(userLocation);
        }
    }, [userLocation, locationLoading]);

    return {
        currentCity,
        setCurrentCity,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        selectedLocation,
        setSelectedLocation,
        searchResult,
        setSearchResult,
        showModal,
        setShowModal,
        isLoadingAddress,
        setIsLoadingAddress,
    };
};

export default useMapState;
