import type { Timestamp } from "firebase/firestore";

export type Category =
	| "Café"
	| "Restaurang"
	| "Snabbmat"
	| "Kiosk/grill"
	| "Foodtruck";

export type Offer = 
	| "Fika" 
	| "Lunch" 
	| "After Work" 
	| "Á la carte";

export interface Location {
	lat: number;
	lon: number;
}

export interface Establishment {
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

	updatedAt?: Timestamp;

	location: Location;
}

export type NewEstablishment = Omit<Establishment, "_id">;

export type EstablishmentFormData = Omit<Establishment, "_id" | "updatedAt">;
