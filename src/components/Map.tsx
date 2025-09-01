import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import useUserLocation from "../hooks/useUserLocation";
import useGeocoding from "../hooks/useGeocoding";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import type { Location, PlaceFormData } from "../types/Place.types";
import { toast } from "react-toastify";
import PlaceFormModal from "./PlaceFormModal";


const libraries: ("places" | "geocoding" | "geometry")[] = ["places", "geocoding", "geometry"];

interface ClickedLocation {
    coords: google.maps.LatLngLiteral;
    address: string
}

interface MapProps {
    onSavePlace: (place: PlaceFormData) => Promise<string | void>
}

const Map: React.FC<MapProps> = ({ onSavePlace }) => {

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        id: "googe-map-script",
        libraries: libraries,
        language: "sv",
        region: "SE",
    });

    const mapRef = useRef<google.maps.Map | null>(null);

    const FALLBACK_CENTER = {
        // Coordinates to STOCKHOLM as fallback 
        lat: 59.334591,
        lng: 18.063240,
    }

    const [selectedLocation, setSelectedLocation] = useState<ClickedLocation | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [mapCenter, setMapCenter] = useState<Location>(FALLBACK_CENTER);
    const [mapZoom, setMapZoom] = useState(12);


    const {
        userLocation,
        isLoading: locationLoading,
        error: locationError
    } = useUserLocation();

    const { 
        getAddress,
        // error: geocodingError,
    } = useGeocoding();

    const containerStyle = {
        width: "400px",
        height: "400px",
    }


    // const mapCenter = userLocation || FALLBACK_CENTER;
    useEffect(()=>{
        if(userLocation && isLoaded ){
            setMapCenter(userLocation)
        }
    }, [userLocation, isLoaded]);


    // const handleLocationFound = useCallback((coords: Location, address: string) => {
    //     setSelectedLocation({
    //         coords: coords,
    //         address: address,
    //     });

    //     setMapCenter(coords);
    //     setMapZoom(16);

    //     if(mapRef.current) {
    //         mapRef.current.panTo(coords);
    //         mapRef.current.setZoom(16);
    //     }
    // }, []);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    {/*funktion för när man trycker på kartan */ }
    const onHandleMapClick = useCallback((e: google.maps.MapMouseEvent) => {

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

        getAddress(
            clickedCoords,
            (foundAddress) => {
                setSelectedLocation({
                    coords: clickedCoords,
                    address: foundAddress,
                });
                setIsLoadingAddress(false);
                setMapZoom(16);
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
    }, [getAddress]);

    const handleOpenModal = () => {
        if (selectedLocation && 
            selectedLocation.address !== "Hämtar adress..." && 
            selectedLocation.address !== "Kunde inte hämta adress") {
            setShowModal(true);
        }
    }

    const handleSavePlace = useCallback(async (place: PlaceFormData) => {
        try {
            await onSavePlace(place);

            setShowModal(false);
            setSelectedLocation(null);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Fel vid sparning ", error.message)
                toast.error("Något gick fel vid sparningen ");
            }

        }
    }, [onSavePlace]);

    {/*Loading states*/ }

    if(loadError){
        return (
            <Alert variant="danger">
                <p>Fel vid laddning av Google Maps</p>
                <p>Kontrollera API-nyckel och nödvändiga API-inställningar</p>
                <p>{loadError.message}</p>
            </Alert>
        );
    }

    if(!isLoaded){
        return (
            <Container>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-2"/>
                    <p>Laddar karta</p>
                </div>
            </Container>
        )
    }

    if (locationLoading) {
        return <p>Hämtar din position... </p>
    }

    if (locationError && !userLocation) {
        return <p>Kunde inte hämta din position. Visar Stockholm istället.</p>
    }

    return (

        <>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={mapZoom}
                onClick={onHandleMapClick}
                onLoad={onMapLoad}
                options={{
                    fullscreenControl: true,
                    zoomControl: true,
                }}

            >

                {userLocation && (
                    <Marker
                        position={userLocation}
                        title="Din position"
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                        animation={google.maps.Animation.DROP}
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
                                <p>Vald plats:</p>
                                <p>{selectedLocation.address}</p>
                                {!isLoadingAddress && selectedLocation.address !== "Kunde inte hämta adess" && (
                                    <Button
                                        onClick={handleOpenModal}
                                        className="btn btn-sm btn-primary"
                                        style={{ width: "100%" }}
                                    >
                                        Lägg till ett matställe här
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
