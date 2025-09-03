import type { Timestamp } from "firebase/firestore";

export type Category =
	| "Café"
	| "Restaurant"
	| "Fast food"
	| "Bodega"
	| "Foodtruck"
	| "Slop house";

export type Offer = 
	| "Breakfast" 
	| "Lunch" 
	| "After Work" 
	| "Á la carte";

export interface Location {
	lat: number;
	lng: number;
}

export interface Place {
	_id: string;
	name: string;
	address: string;
	city: string;
	description?: string;
	category: Category;
	offers: Offer[];

	email?: string;
	phone?: string;
	website?: string;
	facebook?: string;
	instagram?: string;

	createdAt?: Timestamp;
	updatedAt?: Timestamp;

	isSuggestion: boolean;

	location: Location;
}

export type NewPlace = Omit<Place, "_id">;

export type PlaceFormData = Omit<Place, "_id" | "updatedAt" | "createdAt" | "isSuggestion">;



export interface PlaceIMG {
	_id: string;
	createdAt: Timestamp;
	name: string;
	path: string;
	size: number;
	type: string;
	uid: string;
	url: string;
}

export type NewPlaceIMG = Omit<PlaceIMG, "_id">;
