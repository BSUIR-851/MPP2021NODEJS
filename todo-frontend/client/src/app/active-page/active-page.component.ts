import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

	form: FormGroup;
	activeTasks$: Observable<Task[]>;

	constructor(private tasksService: TasksService) { }

	ngOnInit(): void {
		this.form = new FormGroup({
			choosedTask: new FormControl('', Validators.required),
		});

		this.activeTasks$ = this.tasksService.getAllActive();
	}

	onSubmit() {
		let obs$;
		this.form.disable();
		let taskId = this.form.value.choosedTask;
		if (taskId) {
			obs$ = this.tasksService.complete(taskId);
			obs$.subscribe(
				(task: Task) => {
					MaterialService.toast(`Task ${task.description} has been completed successfully`);
					this.form.enable();
				},
				error => {
					MaterialService.toast(error.error.message);
					this.form.enable();
				}
			);
		}
		
	}

}
