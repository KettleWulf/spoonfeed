import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import useUserLocation from "../hooks/useUserLocation";
import useGeocoding from "../hooks/useGeocoding";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";



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

    const handleOpenModal = () => {
        if (selectedLocation && selectedLocation.address !== "Hämtar adress...") {
            setShowModal(true);
        }
    }

    {/*Loading states*/ }

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
                zoom={12}
                onClick={onHandleMapClick}

            >

                {userLocation && (
                    <Marker
                        position={userLocation}
                        title="Din position"
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
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
                                <p>Vald plats</p>
                                <p>{selectedLocation.address}</p>
                                {isLoadingAddress && selectedLocation.address !== "Kunde inte hämta adess" && (
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

        </>

    )
}

export default Map
