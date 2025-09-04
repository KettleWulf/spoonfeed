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

// Definerar biblioteket som Google Maps-apiet ska använda när kartan laddas
const libraries: ("places" | "geocoding")[] = ["places", "geocoding"];

// Fallback till sthlm om användaren inte get platsdata.
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

    // States
    const [currentCity, setCurrentCity] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<ClickedLocation | null>(null)
    const [showModal, setShowModal] = useState(false)

    // Hooks
    const { data: places = [], isLoading: placesLoading } = useGetPlacesByCity(currentCity);
    const { userLocation, userCity, isLoading: locationLoading, error: locationError } = useUserLocation();
    const { getAddress } = useGeocoding();
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        id: "googe-map-script",
        libraries: libraries,
        language: "sv",
        region: "SE",
    });

    // Med mapRef kan vi kontrollera kartan, skapar en referens till kartan från google maps
    const mapRef = useRef<google.maps.Map | null>(null);

    // useEffect som sätter currentCity till userCity, när denna är tillgänglig, userCity hämtas från useUserLocation

    useEffect(() => {
        if (userCity && userCity !== currentCity) {
            console.log("Setting currentCity to user location:", userCity);
            setCurrentCity(userCity);
        }
    }, [userCity, currentCity]);

    useEffect(() => {
        if (userLocation && mapRef.current) {
            mapRef.current.panTo(userLocation);
            mapRef.current.setZoom(14);
        }
    }, [userLocation]);

    // Handler för när någon söker efter en stad, panorerar till och zoom in på vår sökning samt sätter currentCity till det som står i sökfältet
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


    // Handler för kartan när den laddas in
    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;

        // styling så points of interests som google har satt ut inte syns
        map.setOptions({
            styles: [
                { featureType: "poi", stylers: [{ visibility: "off" }] },
                { featureType: "poi.business", stylers: [{ visibility: "off" }] }
            ]
        });

        // centrerar kartan på på användaren om denna är tillgänglig
        if (userLocation) {
            map.panTo(userLocation);
            map.setZoom(14);
        }
    };

    // handler för när man trycker på kartan
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        // Koordinaters om har hämtats från knapptryckning på kartan
        const clickedCoords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        }

        // visar loading state
        setSelectedLocation({
            coords: clickedCoords,
            address: "Getting address...",
            city: undefined,
        });

        // hämtar adress, getAddress kommer från useGeocoding och tar lat och lng och omvandlar till en adress
        getAddress(clickedCoords, (foundAddress, city) => {
            console.log("Extracted city:", city);

            setSelectedLocation({
                coords: clickedCoords,
                address: foundAddress,
                city,
            });
            // Om där finns en stad uppdateras staden (om det inte är samma som currentCity)
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

    // Sparar platsen man klickade på till databasen
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

    if (!isLoaded || locationLoading || !currentCity) {
        return (
            <Container>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-2" />
                    <p>Loading map and detecting location...</p>
                </div>
            </Container>
        );
    }

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
                    <p>Laddar karta</p>
                </div>
            </Container>
        )
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
                mapContainerStyle={{ width: "750px", height: "750px" }}
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
