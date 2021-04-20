import { Observable } from 'rxjs';

export interface IWebSocketService {
	status: Observable<boolean>;

	on<T>(event: string): Observable<T>;
	send(event: string, data: any): void;
}

export interface IWebSocketConfig {
	url: string;
	reconnectInterval?: number;
	reconnectAttempts?: number;
}

export interface IWebSocketMessage<T> {
	event: string;
	data: T;
}