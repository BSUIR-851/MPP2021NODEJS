export interface User {
	email: string;
	password: string;
}

export interface Task {
	user?: string;
	description: string;
	expireDate: Date;
	fileSrc?: string;
	_id?: string;
}