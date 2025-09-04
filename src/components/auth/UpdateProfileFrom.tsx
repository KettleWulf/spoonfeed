import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import blankProfile from "../../assets/images/blank-profile-picture-973460_1280.png"
import {useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UppdateUserCredentials } from '../../types/User.types';
import { Image } from 'react-bootstrap';
import type { User } from 'firebase/auth';



type UpdateProfileFromProps = {
    currentUser: User | null, 
    userUrl: string | null,
    userEmail: string | null,
    userName: string | null,
    onUppdateProfile: SubmitHandler<UppdateUserCredentials>
}

const UpdateProfileFrom: React.FC<UpdateProfileFromProps> = ({ currentUser, userUrl, userEmail, userName, onUppdateProfile}) => {
    const [urlUpload, seturlUpload] = useState<string | null>(null)

    const { handleSubmit, register, watch, formState: { errors, isSubmitting } } = useForm<UppdateUserCredentials>({
        defaultValues: {
            email: userEmail ?? "",
            username: userName ?? "",
        }
    })

    

    const password = watch("password")
    return (
        <>

            <div className='d-flex justify-content-center'>
                <Image alt={currentUser?.photoURL ?? ""} src={userUrl || urlUpload || blankProfile || undefined} roundedCircle className="img-cover w-75 UppdateProfileImg" />
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
                    <Form.Label>Profile Picture</Form.Label>
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


                <Button className='btn' type="submit" disabled={isSubmitting}>
                    Save
                </Button>

            </Form>
        </>
    )
}

export default UpdateProfileFrom