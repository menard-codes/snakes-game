import { useRef, useEffect } from "react";
import { SnakeGameEngine } from "./SnakeGame";

import "./SnakesBoardStyles.css";

interface SnakeGameBoard {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  externalScore: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SnakeBoard({
  isPlaying,
  setIsPlaying,
  externalScore,
  setScore,
  setIsGameOver,
}: SnakeGameBoard) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  const snakes = useRef<SnakeGameEngine | null>(null);

  const canvasSidesLength = 500; // 500px

  useEffect(() => {
    if (canvasRef.current === null) {
      throw new Error("canvasRef is not used");
    }

    canvasRef.current.width = canvasSidesLength;
    canvasRef.current.height = canvasSidesLength;
    context.current = canvasRef.current.getContext("2d");

    if (context.current) {
      const ctx = context.current;
      snakes.current = new SnakeGameEngine(
        ctx,
        canvasSidesLength,
        externalScore,
        setScore,
        setIsGameOver,
        isPlaying
      );
      const snakeGame = snakes.current;

      window.onkeydown = (e) => {
        switch (e.key) {
          case "w":
          case "ArrowUp":
            snakeGame.snake.changeMovement("to top");
            break;
          case "s":
          case "ArrowDown":
            snakeGame.snake.changeMovement("to bottom");
            break;
          case "d":
          case "ArrowRight":
            snakeGame.snake.changeMovement("to right");
            break;
          case "a":
          case "ArrowLeft":
            snakeGame.snake.changeMovement("to left");
            break;
          case "Escape":
            setIsPlaying((prevIsPlaying) => {
              return !prevIsPlaying;
            });
            break;
          default:
            break;
        }
      };
    }

    return () => {
      canvasRef.current = null;
      context.current = null;
      snakes.current = null;
    };
  }, []);

  useEffect(() => {
    if (snakes.current) {
      snakes.current.animate(isPlaying);
    }
  }, [isPlaying]);

  return (
    <div>
      <canvas id="game-canvas" ref={canvasRef}></canvas>
    </div>
  );
}
