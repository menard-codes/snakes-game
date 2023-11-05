import { Coordinate } from "./SnakeGame";

type SnakeMovements = "to right" | "to left" | "to bottom" | "to top";

export default class Snake {
  private movement: SnakeMovements;
  private _headCoordinate: Coordinate;
  private _bodyCoordinates: Coordinate[];
  private allowMovementChange: boolean;
  justAte: boolean;
  readonly defaultlength: number;

  constructor() {
    this.movement = "to right";
    this._bodyCoordinates = [];
    this.defaultlength = 3;
    this._headCoordinate = {
      row: -1,
      col: -1,
    };
    this.allowMovementChange = true;
    this.justAte = false;
  }

  get length() {
    return this._bodyCoordinates.length;
  }

  get bodyCoordinates() {
    if (this._bodyCoordinates.length === 0) {
      const initialPoint: Coordinate = {
        row: 1,
        col: 1,
      };
      for (let i = 1; i <= this.defaultlength; i++) {
        this._bodyCoordinates.push({
          row: initialPoint.row,
          col: initialPoint.col * i,
        });
      }
    }
    return this._bodyCoordinates;
  }

  private set bodyCoordinates(newSnakeCoords: Coordinate[]) {
    this._bodyCoordinates = newSnakeCoords;
  }

  get headCoordinate() {
    if (this._headCoordinate.row < 0 || this._headCoordinate.col < 0) {
      this._headCoordinate = this.bodyCoordinates[this.length - 1];
    }

    return this._headCoordinate;
  }

  private set headCoordinate(newCoord: Coordinate) {
    this._headCoordinate = newCoord;
  }

  changeMovement(newMove: SnakeMovements) {
    if (!this.allowMovementChange) {
      return;
    }

    const rowOpposite =
      (newMove === "to bottom" && this.movement === "to top") ||
      (newMove === "to top" && this.movement === "to bottom");
    const columnOpposite =
      (newMove === "to right" && this.movement === "to left") ||
      (newMove === "to left" && this.movement === "to right");

    if (rowOpposite || columnOpposite) {
      // just ignore the oposing movement
      return;
    }

    this.movement = newMove;
    this.allowMovementChange = false;
  }

  private canEat(nextHead: Coordinate, foodCoord: Coordinate) {
    return nextHead.col === foodCoord.col && nextHead.row === foodCoord.row;
  }

  move(foodCoord: Coordinate) {
    // TODO: Set justAte if has eaten or not

    let nextHead: Coordinate = { ...this.headCoordinate };

    switch (this.movement) {
      case "to right":
        nextHead = {
          ...nextHead,
          col: this.headCoordinate.col + 1,
        };
        break;
      case "to left":
        nextHead = {
          ...nextHead,
          col: this.headCoordinate.col - 1,
        };
        break;
      case "to top":
        nextHead = {
          ...nextHead,
          row: this.headCoordinate.row - 1,
        };
        break;
      case "to bottom":
        nextHead = {
          ...nextHead,
          row: this.headCoordinate.row + 1,
        };
        break;
      default:
        throw new Error(`Snake movement is invalid: ${this.movement}`);
    }
    if (this.canEat(nextHead, foodCoord)) {
      // we don't cut the snake
      const newSnakeCoordinates = [...this.bodyCoordinates];
      this.headCoordinate = nextHead;
      newSnakeCoordinates.push(this.headCoordinate);
      this.bodyCoordinates = newSnakeCoordinates;
      this.allowMovementChange = true;
      this.justAte = true;
    } else {
      const newSnakeCoordinates = this.bodyCoordinates.slice(1);
      this.headCoordinate = nextHead;
      newSnakeCoordinates.push(this.headCoordinate);
      this.bodyCoordinates = newSnakeCoordinates;
      this.allowMovementChange = true;
      this.justAte = false;
    }
  }
}
