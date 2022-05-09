import { Component, OnInit } from '@angular/core';
import { ClassicGame } from '../types/classicgame';
import { DatabaseService } from './../services/database.service';

@Component({
  selector: 'app-classicbot',
  templateUrl: './classicbot.page.html',
  styleUrls: ['./classicbot.page.scss'],
})
export class ClassicbotPage implements OnInit {
  startScore: number;
  difficulty: number;
  classicGames: ClassicGame[] = [];

  constructor(private database: DatabaseService) {
    this.database.retrieveOpenGamesInRealTime('classicGame', x => this.classicGames = x);
  }

  ngOnInit() {
    this.difficulty = 3;
  }

  public customFormatter(value: number) {
    return `${value}`;
  }

  public formatFirestoreDatetime(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours()}:${('0'+ date.getMinutes()).slice(-2)}`;
  }

  public checkIsNew(classicGame: ClassicGame): boolean {
    const gameDate = new Date(classicGame.date + 10*60000);
    const date = new Date();
    if (gameDate > date) {
      return true;
    }
    return false;
  }

  public async startNewGame(): Promise<void> {
    await this.database.startNewGame(this.startScore, this.difficulty);
  }
}
