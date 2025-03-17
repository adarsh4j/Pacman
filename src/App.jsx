import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home"; // Your Home Page component
import PacManGame from "./pacman"; // Your Pac-Man Game component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<PacManGame />} />
    </Routes>
  );
}

export default App;
