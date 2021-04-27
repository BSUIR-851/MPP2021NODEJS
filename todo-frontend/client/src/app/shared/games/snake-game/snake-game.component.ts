import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { CONTROLS, COLORS, BOARD_SIZE, GAME_MODES } from './snake-game.constants';
import { IGameDataMessage, ISnake, IPoint } from './snake-game.interfaces';

import { WebSocketService } from '../../services/websocket/websocket.service';
import { IWebSocketMessage } from '../../services/websocket/websocket.interfaces';
import { WS } from './snake-game.events';


@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css'],
  host: {
  	'(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class SnakeGameComponent implements OnInit {

	public form: FormGroup;
  public gameDataMessage$: Observable<IGameDataMessage>;
	public keyCodeMessage$: Observable<number>;
  public startMessage$: Observable<string>;
  public endMessage$: Observable<string>;

	private interval: number;
	private tempDirection: number;
	private defaultMode = 'classic';
  private isGameOver = false;

  public allModes = GAME_MODES;
  public getKeys = Object.keys;
  public board = [];
  public obstacles = [];
  public score = 0;
  public showMenuChecker = false;
  public isGameStart = false;

  private snake: ISnake = {
    direction: CONTROLS.LEFT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };

  private fruit: IPoint = {
    x: -1,
    y: -1
  };
  
  constructor(private wsService: WebSocketService) { }

  ngOnInit(): void {
  	this.form = new FormGroup({});
    this.initObsGameData();
    this.initObsKeyCode();
    this.initObsStartGame();
    this.initObsEndGame();
  	this.setBoard();
  }

  initObsGameData(): void {
    this.gameDataMessage$ = this.wsService.on<IGameDataMessage>(WS.ON.GAME_DATA);
    this.gameDataMessage$.subscribe((message: IGameDataMessage) => { 
      this.unfetchGameData(message);
    });
  }

  initObsKeyCode(): void {
    this.keyCodeMessage$ = this.wsService.on<number>(WS.ON.KEY);
    this.keyCodeMessage$.subscribe((message: number) => {
      this.handleKeyboardEventsWithKeyCode(message);
    });
  }

  initObsStartGame(): void {
    this.startMessage$ = this.wsService.on<string>(WS.ON.START);
    this.startMessage$.subscribe((message: string) => {
      this.newGame(message);
    });
  }

  initObsEndGame(): void {
    this.endMessage$ = this.wsService.on<string>(WS.ON.END);
    this.endMessage$.subscribe((message: string) => {
      this.gameOver();
    });
  }

  sendData(event: string, data: any): void {
    this.wsService.send(event, data);
  }

  fetchGameData(): IGameDataMessage {
    const gameData: IGameDataMessage = {
      interval: this.interval,
      tempDirection: this.tempDirection,
      isGameOver: this.isGameOver,

      board: this.board,
      obstacles: this.obstacles,
      score: this.score,
      showMenuChecker: this.showMenuChecker,
      isGameStart: this.isGameStart,

      fruit: this.fruit,
      snake: this.snake,
    };
    return gameData;
  }

  unfetchGameData(gameData: IGameDataMessage): void {
    this.interval = gameData.interval;
    this.tempDirection = gameData.tempDirection;
    this.isGameOver = gameData.isGameOver;

    this.board = gameData.board;
    this.obstacles = gameData.obstacles;
    this.score = gameData.score;
    this.showMenuChecker = gameData.showMenuChecker;
    this.isGameStart = gameData.isGameStart;

    this.fruit = gameData.fruit;
    this.snake = gameData.snake;
  }

  newGameAll(mode: string): void {
    this.newGame(mode);
    this.sendData(WS.SEND.START, mode);
    this.updatePositions();
  }

  newGame(mode: string): void {
    this.defaultMode = mode || 'classic';
    this.showMenuChecker = false;
    this.isGameStart = true;
    this.score = 0;
    this.tempDirection = CONTROLS.LEFT;
    this.isGameOver = false;
    this.interval = 150;
    this.snake = {
      direction: CONTROLS.LEFT,
      parts: []
    };

    for (let i = 0; i < 3; i++) {
      this.snake.parts.push({ x: 8 + i, y: 8 });
    }

    if (mode === 'obstacles') {
      this.obstacles = [];
      let j = 1;
      do {
        this.addObstacles();
      } while (j++ < 9);
    }

    this.resetFruit();
  }

  setBoard(): void {
    this.board = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i][j] = false;
      }
    }
  }

  handleKeyboardEvents(e: KeyboardEvent): void {
    this.handleKeyboardEventsWithKeyCode(e.keyCode);
    // this.sendData(WS.SEND.KEY, e.keyCode);
	}

  handleKeyboardEventsWithKeyCode(keyCode: number): void {
    if (keyCode === CONTROLS.LEFT && this.snake.direction !== CONTROLS.RIGHT) {
      this.tempDirection = CONTROLS.LEFT;
    } else if (keyCode === CONTROLS.UP && this.snake.direction !== CONTROLS.DOWN) {
      this.tempDirection = CONTROLS.UP;
    } else if (keyCode === CONTROLS.RIGHT && this.snake.direction !== CONTROLS.LEFT) {
      this.tempDirection = CONTROLS.RIGHT;
    } else if (keyCode === CONTROLS.DOWN && this.snake.direction !== CONTROLS.UP) {
      this.tempDirection = CONTROLS.DOWN;
    }
  }

	setColors(col: number, row: number): string {
		if (this.isGameOver) {
		  return COLORS.GAME_OVER;
		} else if (this.fruit.x === row && this.fruit.y === col) {
		  return COLORS.FRUIT;
		} else if (this.snake.parts[0].x === row && this.snake.parts[0].y === col) {
		  return COLORS.HEAD;
		} else if (this.board[col][row] === true) {
		  return COLORS.BODY;
		} else if (this.defaultMode === 'obstacles' && this.checkObstacles(row, col)) {
		  return COLORS.OBSTACLE;
		}

		return COLORS.BOARD;
	}

	updatePositions(): void {
    let newHead = this.repositionHead();
    let me = this;

    if (this.defaultMode === 'classic' && this.boardCollision(newHead)) {
      return this.gameOverAll();
    } else if (this.defaultMode === 'no_walls') {
      this.noWallsTransition(newHead);
    } else if (this.defaultMode === 'obstacles') {
      this.noWallsTransition(newHead);
      if (this.obstacleCollision(newHead)) {
        return this.gameOverAll();
      }
    }

    if (this.selfCollision(newHead)) {
      return this.gameOverAll();
    } else if (this.fruitCollision(newHead)) {
      this.eatFruit();
    }

    let oldTail = this.snake.parts.pop();
    this.board[oldTail.y][oldTail.x] = false;

    this.snake.parts.unshift(newHead);
    this.board[newHead.y][newHead.x] = true;

    this.snake.direction = this.tempDirection;
    this.sendData(WS.SEND.GAME_DATA, this.fetchGameData());

    setTimeout(() => {
      me.updatePositions();
    }, this.interval);
  }

  repositionHead(): any {
    let newHead = Object.assign({}, this.snake.parts[0]);

    if (this.tempDirection === CONTROLS.LEFT) {
      newHead.x -= 1;
    } else if (this.tempDirection === CONTROLS.RIGHT) {
      newHead.x += 1;
    } else if (this.tempDirection === CONTROLS.UP) {
      newHead.y -= 1;
    } else if (this.tempDirection === CONTROLS.DOWN) {
      newHead.y += 1;
    }

    return newHead;
  }

  noWallsTransition(part: any): void {
    if (part.x === BOARD_SIZE) {
      part.x = 0;
    } else if (part.x === -1) {
      part.x = BOARD_SIZE - 1;
    }

    if (part.y === BOARD_SIZE) {
      part.y = 0;
    } else if (part.y === -1) {
      part.y = BOARD_SIZE - 1;
    }
  }

  addObstacles(): void {
    let x = this.randomNumber();
    let y = this.randomNumber();

    if (this.board[y][x] === true || y === 8) {
      return this.addObstacles();
    }

    this.obstacles.push({
      x: x,
      y: y
    });
  }

  checkObstacles(x, y): boolean {
    let res = false;

    this.obstacles.forEach((val) => {
      if (val.x === x && val.y === y) {
        res = true;
      }
    });

    return res;
  }

  obstacleCollision(part: any): boolean {
    return this.checkObstacles(part.x, part.y);
  }

  boardCollision(part: any): boolean {
    return part.x === BOARD_SIZE || part.x === -1 || part.y === BOARD_SIZE || part.y === -1;
  }

  selfCollision(part: any): boolean {
    return this.board[part.y][part.x] === true;
  }

  fruitCollision(part: any): boolean {
    return part.x === this.fruit.x && part.y === this.fruit.y;
  }

  resetFruit(): void {
    let x = this.randomNumber();
    let y = this.randomNumber();

    if (this.board[y][x] === true || this.checkObstacles(x, y)) {
      return this.resetFruit();
    }

    this.fruit = {
      x: x,
      y: y
    };
  }

  eatFruit(): void {
    this.score++;

    let tail = Object.assign({}, this.snake.parts[this.snake.parts.length - 1]);

    this.snake.parts.push(tail);
    this.resetFruit();

    if (this.score % 5 === 0) {
      this.interval -= 15;
    }
  }

  randomNumber(): any {
    return Math.floor(Math.random() * BOARD_SIZE);
  }

  showMenu(): void {
    this.showMenuChecker = !this.showMenuChecker;
  }

  gameOverAll(): void {
    this.gameOver();
    this.sendData(WS.SEND.END, '');
  }

  gameOver(): void {
    this.isGameOver = true;
    this.isGameStart = false;
    let me = this;

    setTimeout(() => {
      me.isGameOver = false;
    }, 500);

    this.setBoard();
  }
}
