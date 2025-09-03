
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UppdateUserCredentials } from '../../types/User.types';
import { FirebaseError } from 'firebase/app';
import { toast } from "react-toastify";
import { Card, Col, Container, Row } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../services/Firebase';
import UpdateProfileFrom from '../../components/auth/UpdateProfileFrom';






const UppdateProfile = () => {
    const { currentUser, changeEmail, changePassword, changePhotoUrl, changeUserName, userName, userUrl, userEmail, reloadForm, updateUserDataName, updateUserDataPhoto } = useAuth()

    const { reset, } = useForm<UppdateUserCredentials>()



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

                await updateUserDataName(currentUser.uid, data.username)
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
                    await updateUserDataPhoto(currentUser.uid, photoUrl)

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
                            {<UpdateProfileFrom 
                            onUppdateProfile={onUppdateProfile}
                            currentUser={currentUser}
                            userUrl={userUrl}
                            userEmail={userEmail}
                            userName={userName}
                            />}
                        </Card.Body>
                    </Card>

                </Col>
            </Row >
        </Container >
    )
}

export default UppdateProfile