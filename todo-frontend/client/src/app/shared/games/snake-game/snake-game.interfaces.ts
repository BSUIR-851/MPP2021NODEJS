export interface IPoint {
	x: number;
	y: number;
}

export interface ISnake {
	direction: number;
	parts: Array<IPoint>;
}

export interface IGameDataMessage {
	interval: number;
	tempDirection: number;
	isGameOver: boolean;

  board: Array<boolean>;
  obstacles: Array<IPoint>;
  score: number;
  showMenuChecker: boolean;
  isGameStart: boolean;

  fruit: IPoint;
  snake: ISnake;
}

