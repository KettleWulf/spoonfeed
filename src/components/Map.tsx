import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Alert, Container, Spinner, Button } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import useUserLocation from "../hooks/useUserLocation";
import useGeocoding from "../hooks/useGeocoding";
import { useGetPlacesByCity } from "../hooks/useGetPlacesByCity";

import PlaceFormModal from "./PlaceFormModal";
import AddressSearch from "./AddressSearch";
import type { PlaceFormData, Location, Place } from "../types/Place.types";
import { toast } from "react-toastify";
import getMarkerIcon from "../helpers/getMarkerIcon";
import { useSearchParams } from "react-router";
import useCityFromCoords from "../hooks/useCityFromCoords";

const libraries: ("places" | "geocoding")[] = ["places", "geocoding"];

const FALLBACK_CENTER = {
    lat: 59.334591,
    lng: 18.063240,
}

const FALLBACK_CITY = "Stockholm";

interface ClickedLocation {
    coords: google.maps.LatLngLiteral;
    address: string;
    city?: string;
}

interface MapProps {
    onSavePlace: (place: PlaceFormData) => Promise<string | void>
}


const Map: React.FC<MapProps> = ({ onSavePlace }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const queryCity = searchParams.get("query") || "";

    const [currentCity, setCurrentCity] = useState(queryCity || "");
    const [selectedLocation, setSelectedLocation] = useState<ClickedLocation | null>(null)
    const [showModal, setShowModal] = useState(false);
    const { data: places = [], isLoading: placesLoading } = useGetPlacesByCity(currentCity);
    const { userLocation, isLoading: locationLoading, error: locationError } = useUserLocation();
    const { city: userCity } = useCityFromCoords(userLocation);
    const { getAddress } = useGeocoding();
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        id: "googe-map-script",
        libraries: libraries,
        language: "sv",
        region: "SE",
    });
    const mapRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        if (queryCity && queryCity !== currentCity) {
            setCurrentCity(queryCity);
        }
    }, [queryCity, currentCity]);

    useEffect(() => {
        if (userLocation && mapRef.current && userCity) {
            setCurrentCity(userCity);

            setSearchParams({ query: userCity });
        
            mapRef.current.panTo(userLocation);
            mapRef.current.setZoom(14);
        }
    }, [userLocation, userCity]);

    useEffect(() => {
        if (!isLoaded || !mapRef.current || !queryCity) return;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
            { address: queryCity, region: "SE" },
            (results, status) => {
                if (status === "OK" && results && results[0]) {
                    const location = results[0].geometry.location;
                    const coords = {
                        lat: location.lat(),
                        lng: location.lng()
                    };

                    mapRef.current?.panTo(coords);
                    mapRef.current?.setZoom(13);
                }
            }
        );
    }, [queryCity, isLoaded]);

    const handleSearchLocation = (coords: Location, city?: string) => {
        if (mapRef.current) {
            mapRef.current.panTo(coords);
            mapRef.current.setZoom(13);
        }

        if (city && city !== currentCity) {
            setCurrentCity(city);
        }

        setSelectedLocation(null)
    };

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;

        map.setOptions({
            styles: [
                { featureType: "poi", stylers: [{ visibility: "off" }] },
                { featureType: "poi.business", stylers: [{ visibility: "off" }] }
            ]
        });

        if (userLocation) {
            map.panTo(userLocation);
            map.setZoom(14);
        }
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const clickedCoords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        }

        setSelectedLocation({
            coords: clickedCoords,
            address: "Getting address...",
            city: undefined,
        });

        getAddress(clickedCoords, (foundAddress, city) => {
            console.log("Extracted city:", city);

            setSelectedLocation({
                coords: clickedCoords,
                address: foundAddress,
                city,
            });

            if (city && city !== currentCity) {
                setCurrentCity(city);
            }
        },
            (error) => {
                setSelectedLocation({
                    coords: clickedCoords,
                    address: "Could not get address",
                });
                console.error("Geocoding error:", error);
            });
    };

    const handleSavePlace = async (place: PlaceFormData) => {
        try {
            await onSavePlace(place);
            setShowModal(false);
            setSelectedLocation(null);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error when trying to save", error.message);
                toast.error("Something went wrong when trying to add a place to eat");
            }
        }
    };

    const handlePlaceClick = (place: Place) => {
        const { lat, lng } = place.location;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, "_blank");
    };


    const handleOpenModal = () => {
        if (selectedLocation &&
            selectedLocation.address !== "Could not get address" &&
            selectedLocation.address !== "Getting address...") {
            setShowModal(true);
        }
    };

    if (loadError) {
        return (
            <Alert variant="danger">
                <p>Error when loading Google Maps</p>
                <p>Check API-key and necessary API-settings</p>
                <p>{loadError.message}</p>
            </Alert>
        );
    }

    if (!isLoaded || locationLoading) {
        return (
            <Container>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-2" />
                    <p>Loading map and detecting location...</p>
                </div>
            </Container>
        );
    }

    if (locationError && !userLocation) {
        toast.warn("Could not get your position, showing " + FALLBACK_CITY);
    }

    if (locationError && !userLocation) {
        return <p>Couldn't get your position showing Stockholm instead.</p>
    }

    return (

        <>
            <div className="mb-3">

                <AddressSearch onLocationFound={handleSearchLocation} />
                {placesLoading && (
                    <div className="text-center mt-2">
                        <Spinner animation="border" size="sm" className="me-2" />
                        <p>Loading places to eat in {currentCity} </p>
                    </div>
                )}
                {places && places.length === 0 && !placesLoading && (
                    <div className="alert alert-info mt-2">
                        <small>No places to eat in {currentCity}, please add some!</small>
                    </div>
                )}
            </div>

            <GoogleMap
                id="google-map"
                onClick={handleMapClick}
                center={userLocation || FALLBACK_CENTER}
                zoom={userLocation ? 14 : 10}
                onLoad={handleMapLoad}
                options={{
                    fullscreenControl: true,
                    zoomControl: true,
                }}
            >

                {userLocation && (
                    <Marker
                        position={userLocation}
                        title="Your position"
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                        animation={google.maps.Animation.DROP}
                    />
                )}

                {places?.map((place) => (
                    <>
                        <Marker
                            key={place._id}
                            position={place.location}
                            title={`${place.name} - ${place.category}`}
                            icon={getMarkerIcon(place.category)}
                            onClick={() => handlePlaceClick(place)}
                            animation={google.maps.Animation.DROP}
                        />
                    </>
                )
                )}

                {selectedLocation && (
                    <>
                        <Marker
                            position={selectedLocation.coords}
                            title={selectedLocation.address}
                        />

                        <InfoWindow
                            position={selectedLocation.coords}
                            onCloseClick={() => setSelectedLocation(null)}
                        >
                            <Container>
                                <p>Address:</p>
                                <p>{selectedLocation.address}</p>
                                {selectedLocation.address !== "Could not get address" && (
                                    <Button
                                        onClick={handleOpenModal}
                                        style={{ width: "100%" }}
                                    >
                                        Add a places to eat
                                    </Button>
                                )}

                            </Container>
                        </InfoWindow>
                    </>
                )}
            </GoogleMap>

            <PlaceFormModal
                show={showModal}
                onHide={() => setShowModal(false)}
                address={selectedLocation?.address}
                city={selectedLocation?.city}
                coords={selectedLocation?.coords}
                onSave={handleSavePlace}
            />
        </>

    )
}

export default Map
