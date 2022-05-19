import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { ClassicGame } from '../types/classicgame';
import Helpers from '../helpers/helpers';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage {
  classicGames: ClassicGame[] = [];
  recentGames: ClassicGame[] = [];
  totalPlayedGames: number;
  totalWonGames: number;
  totalLostGames: number;
  helper: Helpers;

  constructor(private database: DatabaseService) {
    this.database.retrieveAllClosedGamesInRealTime('classicGame', x => {
      this.helper = new Helpers();
      this.classicGames = x;
      this.recentGames = x.slice(0, 5);
      this.totalPlayedGames = x.length;
      this.totalWonGames = x.filter(game => game.haswon === true).length;
      this.totalLostGames = x.filter(game => game.haswon === false).length;
    });
  }
}
