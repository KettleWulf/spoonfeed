import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UppdateUserCredentials } from '../../types/User.types';
import { FirebaseError } from 'firebase/app';
import { toast } from "react-toastify";
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../services/Firebase';





const UppdateProfile = () => {
    const { currentUser, changeEmail, changePassword, changePhotoUrl, changeUserName, userName, userUrl, userEmail, reloadForm } = useAuth()

    const { handleSubmit, register, reset, watch, formState: { errors, isSubmitting } } = useForm<UppdateUserCredentials>()

    const [urlUpload, seturlUpload] = useState<string | null>(null)

    const password = watch("password")

    useEffect(() => {
        reset({
            email: userEmail ?? "",
            username: userName ?? "",
        })
    }, [userEmail, userName])


    const onUppdateProfile: SubmitHandler<UppdateUserCredentials> = async (data) => {

        if (!currentUser) {
            throw new Error("You must be logged in to update your Profile");
        }

        try {

            if (data.email !== (userEmail ?? "")) {

                await changeEmail(data.email)
                console.log("updated email");
                //toast.success("Success you updated your email")
            }

            if (data.username !== (userName ?? "")) {

                await changeUserName(data.username)
                console.log("updated name", data.username)
                //toast.success("Success you updated your Name")

            }

            if (data.photoUrl.length) {
                const photo = data.photoUrl[0]

                const fileRef = ref(storage, `ProfileImage/${currentUser.uid}/${photo.name}`)

                try {
                    const uploadUrl = await uploadBytes(fileRef, photo)

                    const photoUrl = await getDownloadURL(uploadUrl.ref)

                    await changePhotoUrl(photoUrl)

                } catch (e) {

                    if (e instanceof FirebaseError) {
                        toast.error(e.message)

                    } else if (e instanceof Error) {
                        toast.error(e.message)
                    }
                }

            }

            if (data.password) {

                await changePassword(data.password)
                console.log("updated password")
            }

            reloadForm()

            reset()

            toast.success("Success you updated your Profile")

        }
        catch (e) {
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
                            <Card.Title className="mb-3">Profile</Card.Title>

                            <div>
                                <Image alt={currentUser?.photoURL ?? "Your Profile Piqture"} src={userUrl || urlUpload || undefined} roundedCircle className="w-75" />
                            </div>


                            { /* Sign up form */}
                            <Form onSubmit={handleSubmit(onUppdateProfile)}>

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
                                    {errors.email
                                        ? <p className="text-danger">{errors.email.message || "invalid"}</p>
                                        : <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                                        </Form.Text>
                                    }
                                </Form.Group>


                                {/* Name */}
                                <Form.Group className="mb-3" controlId="displayName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Sven"
                                        {...register("username", {
                                            minLength: {
                                                value: 3,
                                                message: "You have to have at least 3 characters long"
                                            }
                                        })}
                                    />
                                    {errors.username && <p className="text-danger">{errors.username.message || "invalid"}</p>}
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="photoUrl">
                                    <Form.Label>Profile Piqture</Form.Label>
                                    <Form.Control type="file"
                                        accept='image/png, image/jpeg, image/jpg'
                                        {...register("photoUrl", {
                                            onChange: (e) => {
                                                e.target.files?.[0];
                                                seturlUpload(userUrl)
                                            }
                                        })}
                                    />

                                    {errors.photoUrl && <p className="text-danger">{errors.photoUrl.message || "invalid"}</p>}
                                </Form.Group>


                                {/* Password */}
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" autoComplete="new-password" placeholder="Password"
                                        {...register("password", {

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

                                            validate: (value) => value === password || "Paswords do not match"
                                        })}
                                    />
                                    {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message || "invalid"}</p>}
                                </Form.Group>


                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Save
                                </Button>

                            </Form>

                        </Card.Body>
                    </Card>

                </Col>
            </Row >
        </Container >
    )
}

export default UppdateProfile