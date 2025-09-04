import { useNavigate } from "react-router";
import { type SubmitHandler } from "react-hook-form";
import type { SignUpCredentials } from "../../types/User.types";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { Card, Col, Container, Row } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import LogInForm from "../../components/auth/LogInForm";


const LoginPage = () => {

    const navigate = useNavigate()



    const { logIn } = useAuth()


    const onSubmit: SubmitHandler<SignUpCredentials> = async (data) => {


        try {
            await logIn(data.email, data.password)

            toast.success("Welcome Back My Friend")

            navigate("/")
        } catch (e) {
            if (e instanceof FirebaseError) {
                toast.error(e.message)
            } else if (e instanceof Error) {
                toast.error(e.message)
            }
        }
    }

    return (

        <Container className="py-3 center-y">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="mb-3">
                        <Card.Body>
                            {
                              <LogInForm onSubmit={onSubmit} />
                            }
                        </Card.Body>
                    </Card>

                </Col>
            </Row >
        </Container >
    );
}

export default LoginPage