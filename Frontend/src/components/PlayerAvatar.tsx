import React from "react";

// Import all the player avatars
import player1 from "../assets/avatars/player_1.png";
import player2 from "../assets/avatars/player_2.png";
import player3 from "../assets/avatars/player_3.png";
import player4 from "../assets/avatars/player_4.png";
import player5 from "../assets/avatars/player_5.png";
import player6 from "../assets/avatars/player_6.png";
import player7 from "../assets/avatars/player_7.png";
import player8 from "../assets/avatars/player_8.png";

// Array to easily reference avatars by index
const avatars = [
  player1,
  player2,
  player3,
  player4,
  player5,
  player6,
  player7,
  player8,
];

interface PlayerAvatarProps {
  playerNumber: number; // Expect player number between 1 and 8
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ playerNumber }) => {
  // Ensure the playerNumber is within bounds (1-8)
  const avatarSrc = avatars[playerNumber - 1] || avatars[0]; // Default to player_1 if out of bounds

  return (
    <div className="avatar-container">
      <img src={avatarSrc} alt={`Player ${playerNumber}`} className="avatar" />
    </div>
  );
};

export default PlayerAvatar;
