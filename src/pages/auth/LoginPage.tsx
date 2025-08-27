import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { SignUpCredentials } from "../../types/User.types";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const LoginPage = () => {
    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>()

    const navigate = useNavigate()

    const authContext = useContext(AuthContext)

    if (!authContext) {
        throw new Error("Trying to use authcontext outside of authcontextprovider");

    }

    const { logIn } = authContext


    const onSubmit: SubmitHandler<SignUpCredentials> = async (data) => {


        try {
            await logIn(data.email, data.password)

            toast.success("Welcome Back My friend")

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
                            <Card.Title className="mb-3">Log In</Card.Title>

                            { /* log in form */}
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
                                                message: "Enter at least a few characters",
                                                value: 6
                                            }
                                        })}
                                    />
                                    {errors.password && <p className="text-danger">{errors.password.message || "invalid"}</p>}
                                </Form.Group>



                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Log In
                                </Button>
                            </Form>

                        </Card.Body>
                        <div className="text-center">
                            Have you <Link to="/forgot-password">Forgot Password</Link>
                        </div>
                    </Card>

                    <div className="text-center">
                        Sign up here <Link to="/signup">Sign Up</Link>                  
                    </div>
                </Col>
            </Row >
        </Container >
    );
}

export default LoginPage