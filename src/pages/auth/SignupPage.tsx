import { type SubmitHandler } from 'react-hook-form';
import type { SignUpCredentials } from '../../types/User.types';
import { FirebaseError } from 'firebase/app';
import { toast } from "react-toastify";
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import SignUpForm from '../../components/auth/SignUpForm';
import { useState } from 'react';
import PasswordGuard from '../../components/auth/PasswordGuard';

    const password = import.meta.env.VITE_SECRET_PASSWORD_TO_LOGIN


const SignupPage = () => {
	const [passwordCheck, setPasswordCheck] = useState(false)
	const navigate = useNavigate()
	const { signUp } = useAuth()


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

	return (

		<Container className="py-3 center-y">
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card className="mb-3">
						<Card.Body>
							{passwordCheck 
								? <SignUpForm onSubmit={onSubmit} />
								: <PasswordGuard 
									password={password}
									correctPassword={() => setPasswordCheck(true)}
									/>
							}
						</Card.Body>
					</Card>
				</Col>
			</Row >
		</Container >
	);
}







export default SignupPage