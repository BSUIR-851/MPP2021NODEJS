import { Injectable, OnDestroy, Inject } from '@angular/core';

import { Observable, SubscriptionLike, Subject, Observer, interval } from 'rxjs';
import { filter, map, share, distinctUntilChanged, takeWhile } from 'rxjs/operators';

import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

import { IWebSocketService, IWebSocketMessage, IWebSocketConfig } from './websocket.interfaces';
import { config } from './websocket.config';

import { MaterialService } from '../../classes/material.service';

@Injectable({
	providedIn: 'root'
})
export class WebSocketService implements IWebSocketService, OnDestroy {
	private config: WebSocketSubjectConfig<IWebSocketMessage<any>>;

	private websocket$: WebSocketSubject<IWebSocketMessage<any>>;
	private websocketMessages$: Subject<IWebSocketMessage<any>>;

	private websocketSub: SubscriptionLike;
	private statusSub: SubscriptionLike;

	private connection$: Observer<boolean>;

	private reconnection$: Observable<number>;
	private reconnectInterval: number;
	private reconnectAttempts: number;
	private isConnected: boolean;

	public status: Observable<boolean>;

	constructor(@Inject(config) private websocketConfig: IWebSocketConfig) {
		this.websocketMessages$ = new Subject<IWebSocketMessage<any>>();

		this.reconnectInterval = websocketConfig.reconnectInterval || 5000;
		this.reconnectAttempts = websocketConfig.reconnectAttempts || 10;

		this.config = {
			url: websocketConfig.url,
			closeObserver: {
				next: (event: CloseEvent) => {
					this.websocket$ = null;
					this.connection$.next(false);
				}
			},
			openObserver: {
				next: (event: Event) => {
					MaterialService.toast('WebSocket connected!');
					this.connection$.next(true);
				}
			}
		};

		this.status = new Observable<boolean>((observer) => {
			this.connection$ = observer;
		}).pipe(share(), distinctUntilChanged());

		this.statusSub = this.status
			.subscribe((isConnected) => {
				this.isConnected = isConnected;

				if (! this.reconnection$ && typeof(isConnected) === 'boolean' && !isConnected) {
					this.reconnect();
				}
			});

		this.websocketSub = this.websocketMessages$
			.subscribe(null, (error: ErrorEvent) => {
				MaterialService.toast(error.error.message);
			});

		this.connect();
	}

	ngOnDestroy() {
		this.websocketSub.unsubscribe();
		this.statusSub.unsubscribe();
	}

	private connect(): void {
		this.websocket$ = new WebSocketSubject(this.config);
		this.websocket$
			.subscribe(
				(message) => {
					this.websocketMessages$.next(message);
				},
				(error: Event) => {
					if (!this.websocket$) {
						this.reconnect();
					}
				}
			);
	}

	private reconnect(): void {
		this.reconnection$ = interval(this.reconnectInterval)
			.pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

		this.reconnection$
			.subscribe(
				() => {
					this.connect();
				},
				null,
				() => {
					this.reconnection$ = null;

					if (!this.websocket$) {
						this.websocketMessages$.complete();
						this.connection$.complete();
					}
				}
			);
	}

	public on<T>(event: string): Observable<T> {
		if (event) {
			return this.websocketMessages$
				.pipe(
					filter((message: IWebSocketMessage<T>) => message.event === event),
					map((message: IWebSocketMessage<T>) => message.data)
			);
		}
	}

	public send(event: string, data: any={}): void {
		if (event && this.isConnected) {
			this.websocket$.next(<any>JSON.stringify({ event, data }));
		} else {
			MaterialService.toast('Send error');
		}
	}

}