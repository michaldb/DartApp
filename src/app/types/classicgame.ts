export interface ClassicGame {
    startScore: number;
    remainingScorePlayer: number;
    remainingScoreBot: number;
    averageThrowBot: number;
    averageThrowPlayer: number;
    playerThrows: number[];
    botThrows: number[];
    user: string;
    key?: string;
    date: number;
}
