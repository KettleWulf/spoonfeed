import { collection, CollectionReference, type DocumentData } from "firebase/firestore";
import { db } from "../services/Firebase";


export const createCollection = <T = DocumentData>(collectionName: string) => {
	return collection(db, collectionName) as CollectionReference<T>;
}