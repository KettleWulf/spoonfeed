import { GoogleMap,  Marker, useJsApiLoader } from "@react-google-maps/api";
import { Alert, Container, Spinner } from "react-bootstrap";

import useUserLocation from "../hooks/useUserLocation";
import useMapState from "../hooks/useMapState";
import useMapHandlers from "../hooks/useMapHandlers";
import { useGetPlacesByCity } from "../hooks/useGetPlacesByCity";


import PlaceFormModal from "./PlaceFormModal";
import AddressSearch from "./AddressSearch";
import UserLocationMarker from "./UserLocationMarker";
import PlaceMarkers from "./PlaceMarkers";
import ClickedLocationMarker from "./ClickedLocationMarker";

import type { PlaceFormData } from "../types/Place.types";


const libraries: ("places" | "geocoding" | "geometry")[] = ["places", "geocoding", "geometry"];

interface MapProps {
    onSavePlace: (place: PlaceFormData) => Promise<string | void>
}


const Map: React.FC<MapProps> = ({ onSavePlace }) => {

    const {
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
    } = useMapState();

    const {
        handleLocationFound,
        handleMapClick,
        handleMapLoad,
        handleSavePlace,
        handlePlaceClick,
    } = useMapHandlers({
        onSavePlace,
        setCurrentCity,
        setMapCenter,
        setMapZoom,
        setSelectedLocation,
        setSearchResult,
        setShowModal,
        setIsLoadingAddress,
    });


    const {
        data: places = [],
        isLoading: placesLoading,
    } = useGetPlacesByCity(currentCity);

    const {
        userLocation,
        isLoading: locationLoading,
        error: locationError
    } = useUserLocation();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        id: "googe-map-script",
        libraries: libraries,
        language: "sv",
        region: "SE",
    });

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

    if (!isLoaded) {
        return (
            <Container>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-2" />
                    <p>Laddar karta</p>
                </div>
            </Container>
        )
    }

    if (locationLoading) {
        return <p>Getting your position...</p>
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
                <UserLocationMarker userLocation={userLocation} />

                <PlaceMarkers 
                    places={places || []}
                    onPlaceClick={handlePlaceClick}
                />

                {searchResult && (
                    <Marker 
                        position={searchResult}
                        title="Search results"
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }}
                        />
                )}

                <ClickedLocationMarker 
                    selectedLocation={selectedLocation}
                    isLoadingAddress={isLoadingAddress}
                    onCloseClick={() => setSelectedLocation(null)}
                    onOpenModal={() => setShowModal(true)}    
                />
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
