import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/Firebase";
import { useEffect, useState } from "react";
import { type UserList } from "../types/User.types";

export const useGetUsers = () => {
	const [users, setUsers] = useState<UserList[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getList = async () => {
			const docRef = await getDocs(collection(db, "users"));

			const data = docRef.docs.map((doc) => {
				const d = doc.data() as UserList;
				return {
					_id: doc.id,
					name: d.name,
					email: d.email,
					photoFiles: d.photoFiles,
				};
			});

			setUsers(data);
			setIsLoading(false);
		};

		getList();
	}, []);
	return { isLoading, users };
};
