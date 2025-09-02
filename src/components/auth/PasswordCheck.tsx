import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type {PasswordcheckCredentials} from '../../types/User.types';
import { toast } from "react-toastify";
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';





const PasswordCheck: React.FC = () => {
    const password = import.meta.env.VITE_SECRET_PASSWORD_TO_LOGIN
    const navigate = useNavigate()

    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<PasswordcheckCredentials>()


     const onForgotPassword: SubmitHandler<PasswordcheckCredentials> = (data) => {

        if(data.password === password){
            toast.success("Welcome My Friend")
            navigate("/login")
        } else{
            toast.error("Wrong password")
        }
        
     }
   


    

    
    return (
        <Container className="py-3 center-y">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title className="mb-3">Forgot Password</Card.Title>

                           

                            <Form onSubmit={handleSubmit(onForgotPassword)}>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Welcome</Form.Label>
                                    <Form.Control type="password"
                                        placeholder="Welcome"
                                        {...register("password", {
                                           required: "Enter a Password"
                                        })}

                                    />
                                    {errors.password && <p className="text-danger">{errors.password.message || "invalid"}</p>}
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    continue
                                </Button>

                            </Form>

                        </Card.Body>
                    </Card>

                </Col>
            </Row >
        </Container >
    )
}

export default PasswordCheck