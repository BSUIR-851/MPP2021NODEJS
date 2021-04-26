import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { CONTROLS, COLORS, BOARD_SIZE, GAME_MODES } from './snake-game.constants';

export interface IMessageGameData {
  mode: string;
  board: Array<boolean>;
  obstacles: Array<object>;
  fruit: object;
  snake: object;
  score: number;
}

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css'],
  host: {
  	'(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class SnakeGameComponent implements OnInit {

	form: FormGroup;
	@Input() public messagesGameData: IMessageGameData[];
  @Input() EVENTS: object;

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
  public gameStarted = false;

  private snake = {
    direction: CONTROLS.LEFT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };

  private fruit = {
    x: -1,
    y: -1
  };
  
  constructor() { }

  ngOnInit(): void {
  	this.form = new FormGroup({});
  	this.setBoard();
  }

  handleKeyboardEvents(e: KeyboardEvent) {
		if (e.keyCode === CONTROLS.LEFT && this.snake.direction !== CONTROLS.RIGHT) {
		  this.tempDirection = CONTROLS.LEFT;
		} else if (e.keyCode === CONTROLS.UP && this.snake.direction !== CONTROLS.DOWN) {
		  this.tempDirection = CONTROLS.UP;
		} else if (e.keyCode === CONTROLS.RIGHT && this.snake.direction !== CONTROLS.LEFT) {
		  this.tempDirection = CONTROLS.RIGHT;
		} else if (e.keyCode === CONTROLS.DOWN && this.snake.direction !== CONTROLS.UP) {
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
      return this.gameOver();
    } else if (this.defaultMode === 'no_walls') {
      this.noWallsTransition(newHead);
    } else if (this.defaultMode === 'obstacles') {
      this.noWallsTransition(newHead);
      if (this.obstacleCollision(newHead)) {
        return this.gameOver();
      }
    }

    if (this.selfCollision(newHead)) {
      return this.gameOver();
    } else if (this.fruitCollision(newHead)) {
      this.eatFruit();
    }

    let oldTail = this.snake.parts.pop();
    this.board[oldTail.y][oldTail.x] = false;

    this.snake.parts.unshift(newHead);
    this.board[newHead.y][newHead.x] = true;

    this.snake.direction = this.tempDirection;

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

  gameOver(): void {
    this.isGameOver = true;
    this.gameStarted = false;
    let me = this;

    setTimeout(() => {
      me.isGameOver = false;
    }, 500);

    this.setBoard();
  }

  randomNumber(): any {
    return Math.floor(Math.random() * BOARD_SIZE);
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

  showMenu(): void {
    this.showMenuChecker = !this.showMenuChecker;
  }

  newGame(mode: string): void {
    this.defaultMode = mode || 'classic';
    this.showMenuChecker = false;
    this.gameStarted = true;
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
    this.updatePositions();
  }

}
