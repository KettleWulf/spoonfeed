import { Timestamp } from "firebase/firestore";

/**
 * Convert a Firebase Timestamp to a Date
 *
 * @param firebaseTimestamp
 * @returns {Date}
 */
export const firebaseTimestampToDate = (firebaseTimestamp: Timestamp) => {
	return firebaseTimestamp.toDate();
}

/**
 * Convert a Date to an ISO string
 * @param date
 * @returns {string}
 */
export const dateToIsoString = (date: Date) => {
	return date.toISOString();
}

/**
 * Convert a Date to `YYYY-MM-DD HH:mm:ss` string
 * @param date
 * @returns {string}
 */
export const dateToYmdHms = (date: Date) => {
	return Intl.DateTimeFormat("sv-SE", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(date);
}

/**
 * Convert a Firebase Timestamp to an string
 *
 * @param firebaseTimestamp
 * @returns {string}
 */
export const firebaseTimestampToString = (firebaseTimestamp: Timestamp) => {
	return dateToYmdHms(firebaseTimestampToDate(firebaseTimestamp));
}
