import { Card, Col, Container, Image, Row } from "react-bootstrap"
import SortableTable from "../../components/SortableTable"
import { useGetUsers } from "../../hooks/useGetUsers"
import type { UserList } from "../../types/User.types"
import type { ColumnDef } from "@tanstack/react-table"
import blankProfile from "../../assets/images/blank-profile-picture-973460_1280.png"

const ListOfProfilePage = () => {
  const { users, isLoading } = useGetUsers()

  const columns: ColumnDef<UserList>[] = [
    {
      header: "Profile Picture",
      accessorKey: "photoFiles",
      cell: cell => {
        const url = cell.getValue() as string
        console.log(url, "min bild");

        return (
          <Image
            src={url ?? blankProfile }
            alt="Profile Picture"
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
      accessorKey: "email",
      cell: email => email.getValue()
    },

  ]
  console.log(users);

  if (isLoading) {
    return <p>Loading Admins</p>
  }



  return (

    <Container className="py-5 center-y">
      <Row>
        <Col>
          <Card className="mb-3  shadow-lg rounded-3 border-0">
            <Card.Body>
              <h2>Admins</h2>
              <hr />
              {users && <SortableTable data={users} columns={columns} />}
            </Card.Body>
          </Card>
        </Col>
      </Row >
    </Container >
  )
}

export default ListOfProfilePage