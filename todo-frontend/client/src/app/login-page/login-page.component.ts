import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/classes/material.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

	form: FormGroup;

	aSub: Subscription;

	constructor(private auth: AuthService,
				private router: Router,
				private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.form = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
		});

		this.route.queryParams.subscribe((params: Params) => {
			if (params['registered']) {
				MaterialService.toast('You have been registered and you can login');
			} else if (params['accessDenied']) {
				MaterialService.toast('You have to login');
			} else if (params['sessionFailed']) {
				MaterialService.toast('Please, login to system again');
			}
		});
	}

	ngOnDestroy(): void {
		if (this.aSub) {
			this.aSub.unsubscribe();
		}
	}

	onSubmit() {
		this.form.disable();
		this.aSub = this.auth.login(this.form.value).subscribe(
			() => this.router.navigate(['/overview']),
			error => {
				MaterialService.toast(error.error.message);
				this.form.enable();
			}
		);
	}

}
