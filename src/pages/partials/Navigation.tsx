import useAuth from "../../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router";
import loga from "../../assets/images/Loga.png";

const Navigation = () => {
	const navigate = useNavigate();
	const { currentUser, logOut, userUrl, userEmail, userName } = useAuth();

	const handleLogOut = async () => {
		try {
			const logout = await logOut();
			navigate("/");

			return logout;
		} catch (e) {
			if (e instanceof FirebaseError) {
				toast.error(e.message);
			} else if (e instanceof Error) {
				toast.error(e.message);
			}
		}
	};

	return (
		<nav className="bg-[#2e7d32]">
			<div
				className={`mx-auto flex w-full max-w-[1400px] items-center px-4 py-3 sm:px-6 lg:px-8 ${currentUser ? "justify-between" : "justify-center"}`}
			>
				<Link to="/" className="shrink-0">
					<img className="w-[120px]" src={loga} alt="SpoonFeed logo" />
				</Link>

				{currentUser ? (
					<div className="flex items-center gap-4 text-sm text-white">
						<NavLink
							to="/Admins"
							className={({ isActive }) =>
								`transition-colors hover:text-[#a5d6a7] ${isActive ? "text-[#a5d6a7]" : ""}`
							}
						>
							Admins
						</NavLink>
						<NavLink
							to="/Profile"
							className={({ isActive }) =>
								`transition-colors hover:text-[#a5d6a7] ${isActive ? "text-[#a5d6a7]" : ""}`
							}
						>
							Profile
						</NavLink>
						<NavLink
							to="/places"
							className={({ isActive }) =>
								`transition-colors hover:text-[#a5d6a7] ${isActive ? "text-[#a5d6a7]" : ""}`
							}
						>
							Restaurants
						</NavLink>

						<details className="relative">
							<summary className="list-none cursor-pointer">
								{userUrl ? (
									<img
										src={userUrl}
										title={userName || userEmail || ""}
										className="h-8 w-8 rounded-full object-cover"
										alt="Profile"
									/>
								) : (
									<span className="rounded-md bg-white/15 px-2 py-1">
										{userName || userEmail}
									</span>
								)}
							</summary>
							<div className="absolute right-0 z-20 mt-2 min-w-32 rounded-md bg-white p-2 shadow-lg">
								<button
									type="button"
									onClick={handleLogOut}
									className="w-full rounded-md bg-[#5e936c] px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[#67c090] hover:text-black"
								>
									Log Out
								</button>
							</div>
						</details>
					</div>
				) : (
					<Link
						to="/login"
						className="text-sm text-white transition-colors hover:text-[#a5d6a7]"
					>
						Log In
					</Link>
				)}
			</div>
		</nav>
	);
};

export default Navigation;
