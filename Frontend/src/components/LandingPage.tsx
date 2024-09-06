import React from "react";
import NavBar from "./NavBar";
import PlayerAvatar from "./PlayerAvatar";
import { usePlayerContext } from "../context/PlayerContext"; // Import the PlayerContext hook

const LandingPage: React.FC = () => {
  const { playerId, playerIcon, nickname, setPlayerData } = usePlayerContext();

  const handleCreateLobby = () => {
    // Example: Set the player data when a lobby is created
    setPlayerData("12345", 1, "PlayerOne");
  };

  return (
    <div className="landing-page">
      <NavBar />

      <div className="landing-content">
        <PlayerAvatar playerNumber={playerIcon || 1} />{" "}
        {/* Use the player icon */}
        <button className="btn large-btn" onClick={handleCreateLobby}>
          Create Lobby
        </button>
        <button className="btn large-btn">Join Lobby</button>
      </div>

      <div>
        <p>Player ID: {playerId}</p>
        <p>Nickname: {nickname}</p>
      </div>
    </div>
  );
};

export default LandingPage;
