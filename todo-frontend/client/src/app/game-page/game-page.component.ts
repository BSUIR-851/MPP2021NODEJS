import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { WebSocketService } from '../shared/services/websocket/websocket.service';
import { IWebSocketMessage } from '../shared/services/websocket/websocket.interfaces';
import { WS } from './game.events';

import { MaterialService } from '../shared/classes/material.service';

export interface IMessageGameData {
  mode: string;
  board: Array<boolean>;
  obstacles: Array<object>;
  fruit: object;
  snake: object;
  score: number;
}

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})
export class GamePageComponent implements OnInit {

	messagesGameData$: Observable<IMessageGameData[]>;
	EVENTS: object = WS;

  constructor(private wsService: WebSocketService) { }

  ngOnInit(): void {
  	this.messagesGameData$ = this.wsService.on<IMessageGameData[]>(WS.ON.GAME_DATA);
  }
}
