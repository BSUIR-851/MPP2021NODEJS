export interface User {
	email: string;
	password: string;
}

export interface Task {
	user?: string;
	description: string;
	expireDate: Date;
	files: Array<string>;
	_id?: string;
}

export interface Message {
	message: string;
}