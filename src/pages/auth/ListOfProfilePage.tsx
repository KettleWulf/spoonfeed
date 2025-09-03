import { Image } from "react-bootstrap"
import SortableTable from "../../components/SortableTable"
import { useGetUsers } from "../../hooks/useGetUsers"
import type { UserList } from "../../types/User.types"
import type { ColumnDef } from "@tanstack/react-table"

const ListOfProfilePage = () => {
  const { users, isLoading } = useGetUsers()

  const columns: ColumnDef<UserList>[] = [ 
    {
      header: "Profile Piqture",
      accessorKey: "photoFiles",
      cell: cell => {
        const url = cell.getValue() as string
        console.log(url, "min bild");
        
        return (
          <Image
            src={url ?? "dds"}
            alt="Profile Piqture"
            width={50}
            height={50}
            roundedCircle
         />   
        )
      }
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: name => name.getValue() 
    },
    {
      header: "Email",
      accessorKey:"email",
      cell: email => email.getValue() 
    },

  ]
  console.log(users);

  if(isLoading) {
    return <p>Loading Admins</p>
  }

  
    
  return (
    <div>
      <h2>Admins</h2>
			{users && <SortableTable data={users} columns={columns} />}
    </div>
  )
}

export default ListOfProfilePage