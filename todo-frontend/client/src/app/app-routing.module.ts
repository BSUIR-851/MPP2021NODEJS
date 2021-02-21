import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

import { OverviewPageComponent } from './overview-page/overview-page.component';
import { ActivePageComponent } from './active-page/active-page.component';
import { CompletedPageComponent } from './completed-page/completed-page.component';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { TasksFormComponent } from './tasks-page/tasks-form/tasks-form.component';

import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { AuthGuard } from './shared/classes/auth.guard';

const routes: Routes = [
	{
		path: '',
		component: AuthLayoutComponent,
		children: [
			{
				path: '', 
				redirectTo: '/login',
				pathMatch: 'full',
			},
			{
				path: 'login', 
				component: LoginPageComponent,
			},
			{
				path: 'register', 
				component: RegisterPageComponent,
			},
		],
	},
	{
		path: '',
		component: SiteLayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'overview',
				component: OverviewPageComponent
			},
			{
				path: 'active',
				component: ActivePageComponent
			},
			{
				path: 'completed',
				component: CompletedPageComponent
			},
			{
				path: 'tasks',
				component: TasksPageComponent
			},
			{
				path: 'tasks/new',
				component: TasksFormComponent
			},
			{
				path: 'tasks/:id',
				component: TasksFormComponent
			},
		],
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
	],
	exports: [
		RouterModule,
	],
})
export class AppRoutingModule {
}