import { Lives, useAutomata } from "@/contexts/Automata";
import { range } from "@/helpers/array";
import { CSSProperties, FC, useEffect, useRef, useState } from "react";

export interface MatrixProps {
  style?: CSSProperties;
}

const INTERVAL = 50;

const Matrix: FC<MatrixProps> = ({ style }) => {
  const automata = useAutomata();
  const [lives, setLives] = useState<Lives>(automata.lives);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [matrixInterval, setMatrixInterval] = useState<NodeJS.Timer>();

  // Cold start
  useEffect(() => {
    const interval = setInterval(
      () => setLives(automata.next().value),
      INTERVAL
    );
    setMatrixInterval(interval);
  }, []);

  // Mouse events
  useEffect(() => {
    const canvas = canvasRef?.current;

    if (canvas) {
      canvas.onmousemove = (e) => {
        e.preventDefault();

        if (e.buttons & 0b1) {
          const x = Math.floor(
            ((e.pageX - canvas.offsetLeft) / canvas.width) *
              automata.worldSize.x
          );
          const y = Math.floor(
            ((e.pageY - canvas.offsetTop) / canvas.height) *
              automata.worldSize.y
          );
          const life = { x, y };

          automata.lives.push(life);
          setLives((l) => [...l, life]);
        }
      };

      canvas.onmousedown = (e) => {
        if (matrixInterval) {
          clearInterval(matrixInterval);
          setMatrixInterval(undefined);
        }

        canvas.onmousemove?.(e);
      };

      canvas.onmouseleave = (e) => {
        if (!(e.buttons & 0b1))
          setTimeout(() => {
            const interval = setInterval(
              () => setLives(automata.next().value),
              INTERVAL
            );
            setMatrixInterval(interval);
          }, INTERVAL * 16);
      };
    }

    return matrixInterval && (() => clearInterval(matrixInterval));
  }, [matrixInterval, canvasRef]);

  // Fix the DPI
  useEffect(() => {
    const canvas = canvasRef?.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      const dpi = window.devicePixelRatio;

      const styleWidth = parseInt(
        getComputedStyle(canvas).getPropertyValue("width").slice(0, -2)
      );
      const styleHeight = parseInt(
        getComputedStyle(canvas).getPropertyValue("height").slice(0, -2)
      );

      canvas.setAttribute("height", (styleWidth * dpi).toString());
      canvas.setAttribute("width", (styleHeight * dpi).toString());
    }
  }, [canvasRef]);

  // Screen paint
  useEffect(() => {
    const canvas = canvasRef?.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      const cellWidth = canvas.width / automata.worldSize.x;
      const cellHeight = canvas.height / automata.worldSize.y;

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvas.width, canvas.height);

      for (const { x, y } of lives) {
        context.fillStyle = "white";
        context.fillRect(cellWidth * x, cellHeight * y, cellWidth, cellHeight);
      }

      for (const nx of range(1, automata.worldSize.x)) {
        context.beginPath();
        const x = nx * cellWidth;
        context.lineWidth = 0.2;
        context.strokeStyle = "#303090";
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
      }

      for (const ny of range(1, automata.worldSize.y)) {
        context.beginPath();
        const y = ny * cellHeight;
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.strokeStyle = "#9090FF";
        context.stroke();
      }
    }
  }, [canvasRef, lives]);

  return <canvas style={style} ref={canvasRef} />;
};

export default Matrix;
