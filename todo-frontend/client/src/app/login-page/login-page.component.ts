import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

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
				// you have been registered and you can login
			} else if (params['accessDenied']) {
				// you have to login
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
			() => this.router.navigate(['/active']),
			error => {
				console.warn(error);
				this.form.enable();
			}
		);
	}

}
