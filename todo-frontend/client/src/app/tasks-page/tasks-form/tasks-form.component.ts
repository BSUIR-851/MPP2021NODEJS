import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Task } from '../../shared/interfaces';

import { TasksService } from '../../shared/services/tasks.service';
import { MaterialService } from '../../shared/classes/material.service';

@Component({
	selector: 'app-tasks-form',
	templateUrl: './tasks-form.component.html',
	styleUrls: ['./tasks-form.component.css']
})
export class TasksFormComponent implements OnInit {

	@ViewChild('input') inputRef: ElementRef;
	form: FormGroup;
	files: string[] = [];
	uploads: File[] = [];
	isNew = true;

	task: Task;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private tasksService: TasksService) { }

	ngOnInit(): void {
		this.form = new FormGroup({
			description: new FormControl(null, Validators.required),
			expireDate: new FormControl(null, Validators.required),
		});

		this.form.disable();

		this.route.params
			.pipe(
				switchMap(
					(params: Params) => {
						if (params['id']) {
							this.isNew = false;
							return this.tasksService.getById(params['id']);
						}
						return of(null);
					}
				)
			)
			.subscribe(
				(task: Task) => {
					if (task) {
						this.task = task;
						this.form.patchValue({
							description: task.description,
							expireDate: task.expireDate,
						});
						this.files = task.files;
						MaterialService.updateTextInputs();
					}
					this.form.enable();
				},
				error => MaterialService.toast(error.error.message),
			);
	}

	triggerClick() {
		this.inputRef.nativeElement.click();
	}

	onFileUpload(event: any) {
		this.uploads = event.target.files;
		this.files = [];
	}

	onSubmit() {
		let obs$;
		this.form.disable();

		if (this.isNew) {
			obs$ = this.tasksService.create(this.form.value.description, new Date(this.form.value.expireDate), this.uploads);
		} else {
			obs$ = this.tasksService.update(this.task._id, this.form.value.description, new Date(this.form.value.expireDate), this.uploads);
		}
		obs$.subscribe(
			(task: Task) => {
				this.task = task;
				this.form.patchValue({
					description: task.description,
					expireDate: task.expireDate,
				});
				this.files = task.files;
				MaterialService.updateTextInputs();
				this.uploads = [];
				MaterialService.toast("Task has been saved successfully");
				this.form.enable();
			},
			error => {
				MaterialService.toast(error.error.message);
				this.form.enable();
			}
		);
	}

	deleteTask() {
		const decision = window.confirm('Are you sure you want to delete this task?');
		if (decision) {
			this.tasksService.delete(this.task._id)
				.subscribe(
					response => MaterialService.toast(response.message),
					error => MaterialService.toast(error.error.message),
					() => this.router.navigate(['/tasks'])
				);
		}
	}

}
