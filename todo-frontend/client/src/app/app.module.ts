import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebSocketModule } from './shared/services/websocket/websocket.module';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { ActivePageComponent } from './active-page/active-page.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { CompletedPageComponent } from './completed-page/completed-page.component';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { TasksFormComponent } from './tasks-page/tasks-form/tasks-form.component';
import { GamePageComponent } from './game-page/game-page.component';
import { SnakeGameComponent } from './shared/games/snake-game/snake-game.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        AuthLayoutComponent,
        SiteLayoutComponent,
        RegisterPageComponent,
        ActivePageComponent,
        OverviewPageComponent,
        CompletedPageComponent,
        TasksPageComponent,
        LoaderComponent,
        TasksFormComponent,
        GamePageComponent,
        SnakeGameComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        WebSocketModule.config({
            url: environment.ws
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: TokenInterceptor,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
