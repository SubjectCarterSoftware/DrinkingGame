import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import NavPage from "./NavPage";
import GamePage from "./pages/GamePage";

const App: React.FC = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/game">Game</Link>
      </nav>
      <Routes>
        <Route path="/" element={<NavPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </div>
  );
};

export default App;
