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