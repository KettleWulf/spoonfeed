import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { ForgotPasswordCredentials } from '../../types/User.types';
import { Card } from 'react-bootstrap';


type ForgotPasswordFormProps = {
    onForgotPassword: SubmitHandler<ForgotPasswordCredentials>
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onForgotPassword}) => {
        const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<ForgotPasswordCredentials>()


    return (
        <>
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

        </>
    )
}

export default ForgotPasswordForm