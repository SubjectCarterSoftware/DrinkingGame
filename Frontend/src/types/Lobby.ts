import { Player } from './Player'; // Import the Player type from the Player.ts file

export type Lobby = {
  id: string;
  players: Player[];  // Use the imported Player type here
  gameStarted: boolean;
};
