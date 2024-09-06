import React, { createContext, useState, useEffect } from "react";

// Define the shape of the context data
interface PlayerContextType {
  playerId: string | null;
  playerIcon: number | null;
  nickname: string | null;
  setPlayerData: (id: string, icon: number, name: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerIcon, setPlayerIcon] = useState<number | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const storedPlayerId = localStorage.getItem("playerId");
    const storedPlayerIcon = localStorage.getItem("playerIcon");
    const storedNickname = localStorage.getItem("nickname");

    if (storedPlayerId) setPlayerId(storedPlayerId);
    if (storedPlayerIcon) setPlayerIcon(Number(storedPlayerIcon));
    if (storedNickname) setNickname(storedNickname);
  }, []);

  // Function to update the player data and store it in localStorage
  const setPlayerData = (id: string, icon: number, name: string) => {
    setPlayerId(id);
    setPlayerIcon(icon);
    setNickname(name);

    localStorage.setItem("playerId", id);
    localStorage.setItem("playerIcon", icon.toString());
    localStorage.setItem("nickname", name);
  };

  return (
    <PlayerContext.Provider
      value={{ playerId, playerIcon, nickname, setPlayerData }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = React.useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};
