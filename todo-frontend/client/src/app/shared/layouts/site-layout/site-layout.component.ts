import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { MaterialService } from '../../classes/material.service';

@Component({
	selector: 'app-site-layout',
	templateUrl: './site-layout.component.html',
	styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit, AfterViewInit {

	@ViewChild('floating') floatingRef: ElementRef;

	links = [
		{
			url: '/overview',
			name: 'Overview',
		},
		{
			url: '/active',
			name: 'Active tasks',
		},
		{
			url: '/completed',
			name: 'Completed tasks',
		},
		{
			url: '/tasks/new',
			name: 'Add task',
		},
		{
			url: '/tasks',
			name: 'All tasks',
		},
	];

	constructor(private auth: AuthService,
				private router: Router) { }

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		MaterialService.initializeFloatingButton(this.floatingRef);
	}

	logout(event: Event) {
		event.preventDefault();
		this.auth.logout();
		this.router.navigate(['/']);
	}

}
