import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the type for the context value
interface GameContextType {
  state: {};
  setState: Dispatch<SetStateAction<{}>>;
}

// Initialize the context with the correct type
const GameContext = createContext<GameContextType | undefined>(undefined);

const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState({});

  return (
    <GameContext.Provider value={{ state, setState }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook for accessing the context
export const useGameContext = () => {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export { GameContext, GameProvider };
