import {
	GoogleMap,
	InfoWindow,
	Marker,
	useJsApiLoader,
} from "@react-google-maps/api";
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
	lng: 18.06324,
};

const FALLBACK_CITY = "Stockholm";

interface ClickedLocation {
	coords: google.maps.LatLngLiteral;
	address: string;
	city?: string;
}

interface MapProps {
	onSavePlace: (place: PlaceFormData) => Promise<string | void>;
}

const Map: React.FC<MapProps> = ({ onSavePlace }) => {
	const [searchParams] = useSearchParams();

	const queryCity = searchParams.get("query") || "";

	const [currentCity, setCurrentCity] = useState(queryCity || "");
	const [selectedLocation, setSelectedLocation] =
		useState<ClickedLocation | null>(null);
	const [showModal, setShowModal] = useState(false);
	const { data: places = [], isLoading: placesLoading } =
		useGetPlacesByCity(currentCity);
	const {
		userLocation,
		isLoading: locationLoading,
		error: locationError,
	} = useUserLocation();
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
						lng: location.lng(),
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

		setSelectedLocation(null);
	};

	const handleMapLoad = (map: google.maps.Map) => {
		mapRef.current = map;

		map.setOptions({
			styles: [
				{ featureType: "poi", stylers: [{ visibility: "off" }] },
				{ featureType: "poi.business", stylers: [{ visibility: "off" }] },
			],
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
		};

		setSelectedLocation({
			coords: clickedCoords,
			address: "Getting address...",
			city: undefined,
		});

		getAddress(
			clickedCoords,
			(foundAddress, city) => {
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
			}
		);
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
		if (
			selectedLocation &&
			selectedLocation.address !== "Could not get address" &&
			selectedLocation.address !== "Getting address..."
		) {
			setShowModal(true);
		}
	};

	if (loadError) {
		return (
			<div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
				<p>Error when loading Google Maps</p>
				<p>Check API-key and necessary API-settings</p>
				<p>{loadError.message}</p>
			</div>
		);
	}

	if (!isLoaded || locationLoading) {
		return (
			<div className="p-6 text-center">
				<div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
				<p>Loading map and detecting location...</p>
			</div>
		);
	}

	if (locationError && !userLocation) {
		toast.warn("Could not get your position, showing " + FALLBACK_CITY);
	}

	return (
		<>
			<div className="mb-3">
				<AddressSearch onLocationFound={handleSearchLocation} />
				{placesLoading && (
					<div className="mt-2 flex items-center justify-center gap-2">
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
						<p>Loading places to eat in {currentCity} </p>
					</div>
				)}
				{places && places.length === 0 && !placesLoading && (
					<div className="mt-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700">
						<small>No places to eat in {currentCity}, please add some!</small>
					</div>
				)}
			</div>

			<GoogleMap
				id="google-map"
				mapContainerClassName="h-[600px] w-full rounded-xl"
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
							url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
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
						animation={google.maps.Animation.DROP}
					/>
				))}

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
							<div className="p-1">
								<p>Address:</p>
								<p>{selectedLocation.address}</p>
								{selectedLocation.address !== "Could not get address" && (
									<button
										onClick={handleOpenModal}
										className="mt-1 w-full rounded-md bg-[#5e936c] px-3 py-2 text-white transition-colors hover:bg-[#67c090] hover:text-black"
									>
										Add a place to eat
									</button>
								)}
							</div>
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
	);
};

export default Map;
