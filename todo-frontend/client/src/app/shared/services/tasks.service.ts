import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Task, Message } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class TasksService {
	constructor(private http: HttpClient) { }

	fetch(): Observable<Task[]> {
		return this.http.get<Task[]>('/api/task');
	}

	getById(id: string): Observable<Task> {
		return this.http.get<Task>(`/api/task/${id}`);
	}

	getAllActive(): Observable<Task[]> {
		return this.http.get<Task[]>('/api/task/active');
	}

	getAllCompleted(): Observable<Task[]> {
		return this.http.get<Task[]>('/api/task/completed');
	}

	create(description: string, expireDate: Date, files: Array<File>): Observable<Task> {
		const formData = new FormData();
		formData.append('description', description);
		formData.append('expireDate', expireDate.toDateString());

		for (let file of files) {
			formData.append('files', file, file.name);
		}

		return this.http.post<Task>('/api/task', formData);
	}

	update(id: string, description: string, expireDate: Date, files: Array<File>): Observable<Task> {
		const formData = new FormData();
		formData.append('description', description);
		formData.append('expireDate', expireDate.toDateString());

		for (let file of files) {
			formData.append('files', file, file.name);
		}

		return this.http.patch<Task>(`/api/task/${id}`, formData);
	}

	complete(id: string): Observable<Task> {
		return this.http.get<Task>(`/api/task/complete/${id}`);
	}

	delete(id: string): Observable<Message> {
		return this.http.delete<Message>(`/api/task/${id}`);
	}
}