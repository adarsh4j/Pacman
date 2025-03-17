import React from "react";
import { useNavigate } from "react-router-dom";
import introSound from "../src/assets/pacman_ringtone.mp3";
import "./Home.css";
function Home() {
  const navigate = useNavigate();

  const startGame = () => {
    const audio = new Audio(introSound);
    audio.play();
    setTimeout(() => {
      navigate("/game"); // Navigate to Pac-Man game after sound
    }, 1000);
  };

  return (
    <div className="App">
      <h1>Pac-Man Game</h1>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}

export default Home;
