export type GameState = {
    roundNumber: number;
    currentQuestion: string;
    playerResponses: Record<string, string>;
    scores: Record<string, number>;
  };
  