import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Alert, Container, Spinner, Button } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";

import useUserLocation from "../hooks/useUserLocation";
import useGeocoding from "../hooks/useGeocoding";
import { useGetPlacesByCity } from "../hooks/useGetPlacesByCity";

import PlaceFormModal from "./PlaceFormModal";
import AddressSearch from "./AddressSearch";
import type { PlaceFormData, Location, Place } from "../types/Place.types";
import { toast } from "react-toastify";


const libraries: ("places" | "geocoding" | "geometry")[] = ["places", "geocoding", "geometry"];

// Fallback till sthlm om användaren inte get platsdata.
const FALLBACK_CENTER = {
    lat: 59.334591,
    lng: 18.063240,
}

interface ClickedLocation {
    coords: google.maps.LatLngLiteral;
    address: string;
}

interface MapProps {
    onSavePlace: (place: PlaceFormData) => Promise<string | void>
}


const Map: React.FC<MapProps> = ({ onSavePlace }) => {


    const [currentCity, setCurrentCity] = useState<string>("Stockholm");
    const [mapCenter, setMapCenter] = useState<Location>(FALLBACK_CENTER);
    const [mapZoom, setMapZoom] = useState(12)
    const [selectedLocation, setSelectedLocation] = useState<ClickedLocation | null>(null)
    const [searchResult, setSearchResult] = useState<Location | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);


    const { data: places = [], isLoading: placesLoading } = useGetPlacesByCity(currentCity);
    const { userLocation, isLoading: locationLoading, error: locationError } = useUserLocation();
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
        if (userLocation && isLoaded) {
            setMapCenter(userLocation);
        }
    }, [userLocation, isLoaded]);

    const handleLocationFound = useCallback((coords: Location, city?: string) => {
        setSearchResult(coords);
        setSelectedLocation(null);

        if (city && city !== currentCity) {
            setCurrentCity(city);
        }

        setMapCenter(coords);
        setMapZoom(16);

        if (mapRef.current) {
            mapRef.current.panTo(coords);
            mapRef.current.setZoom(16);
        }
    }, [currentCity]);

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
        });
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
            address: "Getting address..."
        });

        setIsLoadingAddress(true);

        getAddress(clickedCoords, (foundAddress, city) => {
            setSelectedLocation({
                coords: clickedCoords,
                address: foundAddress,
            });
            setIsLoadingAddress(false);

            if (city && city !== currentCity) {
                setCurrentCity(city);
            }
        },
            (error) => {
                setSelectedLocation({
                    coords: clickedCoords,
                    address: "Could not get address",
                });
                setIsLoadingAddress(false);
                console.error("Geocoding error:", error);
            });
    }, [getAddress, currentCity]);

    const handleSavePlace = useCallback(async (place: PlaceFormData) => {
        try {
            await onSavePlace(place);
            setShowModal(false);
            setSelectedLocation(null);
            toast.success("Added a place to eat!")
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error when trying to save", error.message);
                toast.error("Something went wrong when trying to add a place to eat");
            }
        }
    }, [onSavePlace]);

    const handlePlaceClick = useCallback((place: Place) => {
        const { lat, lng } = place.location;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, "_blank");
    }, []);

    const handleOpenModal = () => {
        if (selectedLocation &&
            selectedLocation.address !== "Could not get address" &&
            selectedLocation.address !== "Getting address...") {
            setShowModal(true);
        }
    };

    const getMarkerIcon = (category: Place['category']) => {
        const iconMap: Record<Place['category'], string> = {
            'Café': 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            'Restaurant': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            'Fast food': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            'Bodega': 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
            'Foodtruck': 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
            'Slop house': 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
        };

        return { url: iconMap[category] };
    };


    {/*Loading states*/ }

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
                    <p>Laddar karta</p>
                </div>
            </Container>
        )
    }

    if (locationError && !userLocation) {
        toast.warn("Could not get your position, showing Stockholm");
    }

    if (locationError && !userLocation) {
        return <p>Couldn't get your position showing Stockholm instead.</p>
    }

    return (

        <>
            <div className="mb-3">

                <AddressSearch onLocationFound={handleLocationFound} />
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
                mapContainerStyle={{ width: "750px", height: "750px" }}
                center={mapCenter}
                zoom={mapZoom}
                onClick={handleMapClick}
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
                    <Marker 
                        key={place._id}
                        position={place.location}
                        title={`${place.name} - ${place.category}`}
                        icon={getMarkerIcon(place.category)}
                        onClick={() => handlePlaceClick(place)}
                        animation={google.maps.Animation.BOUNCE}
                    />
                ))}


                {searchResult && (
                    <Marker
                        position={searchResult}
                        title="Search results"
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }}
                    />
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
                                {!isLoadingAddress && selectedLocation.address !== "Could not get address" && (
                                    <Button
                                        onClick={handleOpenModal}
                                        style={{ width:"100%" }}
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
                coords={selectedLocation?.coords}
                onSave={handleSavePlace}
            />

        </>

    )
}

export default Map
