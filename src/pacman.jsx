import React, { useEffect, useRef, useState } from "react";
import "./PacManGame.css";
import chompSound from "../src/assets/pacman_chomp.mp3";
import deathSound from "../src/assets/pacman_death.mp3";
import { useNavigate } from "react-router-dom";

const tileSize = 20;
const rows = 20;
const cols = 20;
const initialPacman = { x: 1, y: 1, dx: 0, dy: 0 };
const initialGhosts = [
  { x: 18, y: 18, dx: 1, dy: 0 },
  { x: 1, y: 18, dx: 0, dy: -1 },
  { x: 1, y: 10, dx: 0, dy: -1 },
  { x: 10, y: 18, dx: 0, dy: -1 }
];


const walls = Array.from({ length: rows }, (_, y) =>
  Array.from({ length: cols }, (_, x) =>
    (x === 0 || y === 0 || x === cols - 1 || y === rows - 1 || 
      ((x % 2 === 0 && y % 2 === 0) && !(x % 4 === 0 && y % 4 === 0))) ? 1 : 0
  )
);

const initialDots = walls.map(row => row.map(cell => (cell === 0 ? 1 : 0)));


const PacManGame = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [pacman, setPacman] = useState(initialPacman);
  const [ghosts, setGhosts] = useState(initialGhosts);
  const [dots, setDots] = useState(initialDots);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showWin, setShowWin] = useState(false);


  // Play intro sound on mount
 

  // Main game loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const interval = setInterval(updateGame, 200);
    return () => clearInterval(interval);
  }, [pacman, ghosts]);

  useEffect(() => {
    drawGame();
  }, [pacman, ghosts, dots]);

  // Handle keyboard input for movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      const directions = {
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 }
      };
      if (directions[e.key]) {
        setPacman((prev) => ({
          ...prev,
          dx: directions[e.key].dx,
          dy: directions[e.key].dy
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update game state
  const updateGame = () => {
    if (gameOver) return;

    let newPacman = { ...pacman, x: pacman.x + pacman.dx, y: pacman.y + pacman.dy };

    // Collision with walls
    if (walls[newPacman.y]?.[newPacman.x] === 1) return;

    // Eat dotp
    let newDots = dots.map((row, y) =>
      row.map((dot, x) => {
        if (x === newPacman.x && y === newPacman.y && dot === 1) {
          setScore((prev) => prev + 10);
          new Audio(chompSound).play();
          return 0;
        }
        return dot;
      })
    );

    // Check for win condition
    if (!newDots.flat().includes(1)) {
      setGameOver(true);
      setShowWin(true);
      return;
    }

    // Move ghosts randomly
    let newGhosts = ghosts.map((ghost) => {
      let possibleMoves = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
      ].filter(
        (move) =>
          ghost.x + move.dx >= 0 &&
          ghost.x + move.dx < cols &&
          ghost.y + move.dy >= 0 &&
          ghost.y + move.dy < rows &&
          walls[ghost.y + move.dy]?.[ghost.x + move.dx] === 0
      );

      if (possibleMoves.length > 0) {
        let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return { ...ghost, x: ghost.x + move.dx, y: ghost.y + move.dy };
      }
      return ghost;
    });

    // Check for collision with ghosts
    if (newGhosts.some((ghost) => ghost.x === newPacman.x && ghost.y === newPacman.y)) {
      new Audio(deathSound).play();
      setGameOver(true);
      setShowGameOver(true); // Show the modal instead of alert
      return;
    }
    

    setPacman(newPacman);
    setGhosts(newGhosts);
    setDots(newDots);
  };

  // Draw game elements on canvas
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    ctx.fillStyle = "blue";
    walls.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell === 1) {
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      })
    );

    // Draw dots
    ctx.fillStyle = "white";
    dots.forEach((row, y) =>
      row.forEach((dot, x) => {
        if (dot === 1) {
          ctx.beginPath();
          ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      })
    );

    // Draw Pac-Man
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2, tileSize / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
    ctx.fill();

    // Draw ghosts
    ctx.fillStyle = "red";
    ghosts.forEach((ghost) => {
      ctx.beginPath();
      ctx.arc(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2, tileSize / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const restartGame = () => {    
    // setShowGameOver(false);
    // setShowWin(false);
    // setDots(initialDots); 
    // setPacman(initialPacman);
    // setGhosts(initialGhosts);
    // setScore(0);
    // navigate("/game");
    window.location.reload();
  
  };
  
  const backGame = () => {    
    navigate("/");
  };
  

  return (
    <div className="pacman-container">
      <h1 className="pacman-title">Pac-Man Game</h1>
      <h2 className="pacman-score">Score: {score}</h2>
      <canvas ref={canvasRef} width={cols * tileSize} height={rows * tileSize} className="pacman-canvas"></canvas>
      {(showGameOver || showWin) && (
  <div className="modal">
    <div className="modal-content">
      <h2>{showGameOver ? "Game Over!" : "Congratulations!"}</h2>
      <h3>Your Score : {score}</h3>
      <h4>{showGameOver ? "You were caught by a ghost." : "You Win!"}</h4>
      <button onClick={restartGame}>Play Again</button>
    </div>
  </div>
)}

      <button className="pacman-back" onClick={backGame} disabled={gameOver}>Back</button>
    </div>
  );
};

export default PacManGame;
