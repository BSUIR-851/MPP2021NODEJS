import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { TasksService } from '../shared/services/tasks.service';
import { Task } from '../shared/interfaces';

@Component({
	selector: 'app-tasks-page',
	templateUrl: './tasks-page.component.html',
	styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent implements OnInit {

	tasks$: Observable<Task[]>;

	constructor(private tasksService: TasksService) { }

	ngOnInit(): void {
		this.tasks$ = this.tasksService.fetch();
	}

}
