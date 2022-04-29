export interface ClassicGame {
    startScore: number;
    remainingScore: number;
    averageThrowBot: number;
    averageThrowPlayer: number;
    playerThrows: number[];
    botThrows: number[];
    user: string;
    key?: string;
    date: number;
}
