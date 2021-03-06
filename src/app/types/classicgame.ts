export interface ClassicGame {
    startScore: number;
    remainingScorePlayer: number;
    remainingScoreBot: number;
    playerThrows: number[];
    botThrows: number[];
    difficulty: number;
    finished: boolean;
    haswon: boolean;
    user: string;
    key?: string;
    date: number;
}
