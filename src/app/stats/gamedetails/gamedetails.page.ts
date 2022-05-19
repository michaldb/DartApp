import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { ClassicGame } from 'src/app/types/classicgame';
import Helpers from '../../helpers/helpers';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-gamedetails',
  templateUrl: './gamedetails.page.html',
  styleUrls: ['./gamedetails.page.scss'],
})
export class GamedetailsPage{
  classicGameObj: ClassicGame;
  id = this.activatedRoute.snapshot.paramMap.get('id');
  averageThrowPlayer: number;
  helper: Helpers;

  constructor(private database: DatabaseService, public activatedRoute: ActivatedRoute, public navController: NavController) {
    this.helper = new Helpers();
    this.database.retrieveGameById(this.id).then(res => {
      this.classicGameObj = res;
      this.averageThrowPlayer = Number(this.classicGameObj.playerThrows.slice(-1));
      this.averageThrowPlayer = this.helper.getSumOfThrows(this.classicGameObj.playerThrows) / this.classicGameObj.playerThrows.length;
    });
  }

  public async shareGameDetails(): Promise<void> {
    let difficulty: string;

    switch (this.classicGameObj.difficulty) {
      case 1:
        difficulty = 'Beginner';
        break;
      case 2:
        difficulty = 'Easy';
        break;
      case 3:
        difficulty = 'Medium';
        break;
      case 4:
        difficulty = 'Hard';
        break;
      case 5:
        difficulty = 'Extreme';
        break;
    }
    await Share.share({
      title: 'See my dart game stats!',
      // Dit moet op een single line staan anders geeft dit rare uitkomsten voor de layout op bepaalde platformen
      // eslint-disable-next-line max-len
      text: `Hey, i played a game of darts, look at my stats!\nGame outcome: ${this.classicGameObj.haswon ? 'Win' : 'Lose'}\nGame startdate: ${this.helper.formatFirestoreDatetime(this.classicGameObj.date)}\nStartscore: ${this.classicGameObj.startScore}\nDifficulty: ${difficulty} (${this.classicGameObj.difficulty})\nAverage throw player: ${this.averageThrowPlayer.toFixed(2)}`
    });
  }
}
