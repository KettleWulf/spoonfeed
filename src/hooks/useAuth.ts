import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error(
			"AuthContext is being accessed outside of its AuthContextProvider."
		);
	}

	return authContext;
};

export default useAuth;
