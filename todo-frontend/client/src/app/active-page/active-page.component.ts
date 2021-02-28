import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Task } from '../shared/interfaces';

import { TasksService } from '../shared/services/tasks.service';
import { MaterialService } from '../shared/classes/material.service';

@Component({
	selector: 'app-active-page',
	templateUrl: './active-page.component.html',
	styleUrls: ['./active-page.component.css']
})
export class ActivePageComponent implements OnInit {

	activeTasks$: Observable<Task[]>;

	constructor(private router: Router,
				private tasksService: TasksService) { }

	ngOnInit(): void {
		this.activeTasks$ = this.tasksService.getAllActive();
	}

	onClick(event: Event, taskId: string) {
		let obs$;
		if (taskId) {
			obs$ = this.tasksService.complete(taskId);
			obs$.subscribe(
				(task: Task) => {
					MaterialService.toast(`Task ${task.description} has been completed successfully`);
					this.ngOnInit();
				},
				error => {
					MaterialService.toast(error.error.message);
					this.ngOnInit();
				}
			);
		}
		
	}

}
