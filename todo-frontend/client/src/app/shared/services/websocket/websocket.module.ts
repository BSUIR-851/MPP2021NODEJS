import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSocketService } from './websocket.service';
import { config } from './websocket.config';
import { IWebSocketConfig } from './websocket.interfaces';


@NgModule({
	imports: [
		CommonModule
	],
	declarations: [],
	providers: [
		WebSocketService
	]
	
})
export class WebSocketModule {
	public static config(websocketConfig: IWebSocketConfig): ModuleWithProviders<any> {
		return {
			ngModule: WebSocketModule,
			providers: [{ provide: config, useValue: websocketConfig}]
		};
	}
}