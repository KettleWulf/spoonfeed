import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { ForgotPasswordCredentials} from '../../types/User.types';
import { FirebaseError } from 'firebase/app';
import { toast } from "react-toastify";
import { Card, Col, Container, Row } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';





const ForgotPassword = () => {
    const {forgotPassword} = useAuth()

    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<ForgotPasswordCredentials>()


     const onForgotPassword: SubmitHandler<ForgotPasswordCredentials> = async (data) => {


        try {
            
            await forgotPassword(data.email)

            toast.success("We have send you an link to your email to reset your password (also check your spam)")

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
                            <Card.Title className="mb-3">Forgot Password</Card.Title>

                           

                            { /* Sign up form */}
                            <Form onSubmit={handleSubmit(onForgotPassword)}>

                                {/* Email */}
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email"
                                        placeholder="Email"
                                        {...register("email", {
                                            minLength: {
                                                value: 3,
                                                message: "You have to have at least 3 characters long"
                                            }
                                        })}

                                    />
                                    {errors.email && <p className="text-danger">{errors.email.message || "invalid"}</p>}
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Send
                                </Button>

                            </Form>

                        </Card.Body>
                    </Card>

                </Col>
            </Row >
        </Container >
    )
}

export default ForgotPassword