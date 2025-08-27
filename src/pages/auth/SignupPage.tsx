import { useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { SignUpCredentials } from '../../types/User.types';
import { AuthContext } from '../../context/AuthContext';
import { FirebaseError } from 'firebase/app';
import { toast } from "react-toastify";
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const SignupPage = () => {
    const { handleSubmit, register, watch, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>()
    const navigate = useNavigate()

    const authContext = useContext(AuthContext)

    if (!authContext) {
        throw new Error("Trying to use authcontext outside of authcontextprovider");

    }

    const { signUp } = authContext


    const onSubmit: SubmitHandler<SignUpCredentials> = async (data) => {


        try {
            await signUp(data.email, data.password)
            toast.success("Welcome to the team")
            navigate("/")
        } catch (e) {
            if (e instanceof FirebaseError) {
                toast.error(e.message)
            } else if (e instanceof Error) {
                toast.error(e.message)
            }
        }
    }

    const password = watch("password")
    return (

        <Container className="py-3 center-y">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title className="mb-3">Sign Up</Card.Title>

                            { /* Sign up form */}
                            <Form onSubmit={handleSubmit(onSubmit)}>

                                {/* Email */}
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email"
                                        placeholder="Enter email"
                                        {...register("email", {
                                            required: "You must enter an Email"
                                        })}
                                    />
                                    {errors.email
                                        ? <p className="text-danger">{errors.email.message || "invalid"}</p>
                                        : <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                                        </Form.Text>
                                    }


                                </Form.Group>

                                {/* Password */}
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" autoComplete="new-password" placeholder="Password"
                                        {...register("password", {
                                            required: "You must enter an password",
                                            minLength: {
                                                message: "Enter at least 6 characters",
                                                value: 6
                                            }
                                        })}
                                    />
                                    {errors.password && <p className="text-danger">{errors.password.message || "invalid"}</p>}
                                </Form.Group>

                                {/* Comfirm Password */}
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" autoComplete="off" placeholder="Confirm Password"
                                        {...register("confirmPassword", {
                                            required: "You must enter an password",
                                            validate: (value) => value === password || "Paswords do not match"
                                        })}
                                    />
                                    {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message || "invalid"}</p>}
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>

                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </Container >
    );
}







export default SignupPage