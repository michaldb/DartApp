import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { ClassicGame } from '../types/classicgame';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  classicGames: ClassicGame[] = [];
  recentGames: ClassicGame[] = [];
  totalPlayedGames: number;
  totalWonGames: number;
  totalLostGames: number;

  constructor(private database: DatabaseService) {
    this.database.retrieveAllClosedGamesInRealTime('classicGame', x => {
      this.classicGames = x;
      this.recentGames = x.slice(0, 5);
      this.totalPlayedGames = x.length;
      this.totalWonGames = x.filter(game => game.haswon === true).length;
      this.totalLostGames = x.filter(game => game.haswon === false).length;
    });
  }

  ngOnInit() {}

  public formatFirestoreDatetime(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours()}:${('0'+ date.getMinutes()).slice(-2)}`;
  }
}
