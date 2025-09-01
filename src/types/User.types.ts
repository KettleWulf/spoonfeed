export interface User {
	_id: string;
	name: string;
	email: string;

	photoFiles: FileList;
}

export type SignUpCredentials = {
	email: string,
	password: string,
	confirmPassword: string
}

export type UppdateUserCredentials = {
	email: string,
	password: string,
	confirmPassword: string,
	photoUrl: FileList,
	username: string ,
}

export type ForgotPasswordCredentials ={
	email: string
}