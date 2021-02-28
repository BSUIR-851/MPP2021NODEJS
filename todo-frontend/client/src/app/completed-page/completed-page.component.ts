import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Task } from '../shared/interfaces';

import { TasksService } from '../shared/services/tasks.service';
import { MaterialService } from '../shared/classes/material.service';

@Component({
	selector: 'app-completed-page',
	templateUrl: './completed-page.component.html',
	styleUrls: ['./completed-page.component.css']
})
export class CompletedPageComponent implements OnInit {

	completedTasks$: Observable<Task[]>;

	constructor(private tasksService: TasksService) { }

	ngOnInit(): void {
		this.completedTasks$ = this.tasksService.getAllCompleted();
	}
}
