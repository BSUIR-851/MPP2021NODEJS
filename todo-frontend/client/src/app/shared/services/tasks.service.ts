import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Task } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class TasksService {
	constructor(private http: HttpClient) { }

	fetch(): Observable<Task[]> {
		return this.http.get<Task[]>('/api/task');
	}
}