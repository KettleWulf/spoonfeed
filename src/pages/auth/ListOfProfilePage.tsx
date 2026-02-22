import SortableTable from "../../components/SortableTable";
import { useGetUsers } from "../../hooks/useGetUsers";
import type { UserList } from "../../types/User.types";
import type { ColumnDef } from "@tanstack/react-table";
import blankProfile from "../../assets/images/blank-profile-picture-973460_1280.png";

const ListOfProfilePage = () => {
	const { users, isLoading } = useGetUsers();

	const columns: ColumnDef<UserList>[] = [
		{
			header: "Profile Picture",
			accessorKey: "photoFiles",
			cell: (cell) => {
				const url = cell.getValue() as string;

				return (
					<img
						src={url ?? blankProfile}
						alt="Profile Picture"
						width={50}
						height={50}
						className="h-[50px] w-[50px] rounded-full object-cover"
					/>
				);
			},
		},
		{
			header: "Name",
			accessorKey: "name",
			cell: (name) => name.getValue(),
		},
		{
			header: "Email",
			accessorKey: "email",
			cell: (email) => email.getValue(),
		},
	];

	if (isLoading) {
		return <p>Loading Admins</p>;
	}

	return (
		<div className="py-5">
			<div className="rounded-2xl border border-white/70 bg-[whitesmoke] p-6 shadow-lg">
				<h2 className="text-2xl font-semibold">Admins</h2>
				<hr className="my-4 border-emerald-100" />
				{users && <SortableTable data={users} columns={columns} />}
			</div>
		</div>
	);
};

export default ListOfProfilePage;
