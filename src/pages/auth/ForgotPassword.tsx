import { type SubmitHandler } from 'react-hook-form';
import type { ForgotPasswordCredentials} from '../../types/User.types';
import { FirebaseError } from 'firebase/app';
import { toast } from "react-toastify";
import { Card, Col, Container, Row } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';





const ForgotPassword = () => {
    const {forgotPassword} = useAuth()



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
        <Container className="py-5 center-y">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="mb-3 shadow-lg rounded-3 border-0">
                        <Card.Body>
                            <ForgotPasswordForm onForgotPassword={onForgotPassword} />
                        </Card.Body>
                    </Card>

                </Col>
            </Row >
        </Container >
    )
}

export default ForgotPassword