import { Component, OnInit } from '@angular/core';
import { ClassicGame } from '../types/classicgame';
import { DatabaseService } from './../services/database.service';
import Helpers from '../helpers/helpers';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-classicbot',
  templateUrl: './classicbot.page.html',
  styleUrls: ['./classicbot.page.scss'],
})
export class ClassicbotPage implements OnInit {
  startScore: number;
  difficulty: number;
  classicGames: ClassicGame[] = [];
  helper: Helpers;

  constructor(private database: DatabaseService, public alertController: AlertController) {
    this.helper = new Helpers();
    this.database.retrieveOpenGamesInRealTime('classicGame', x => this.classicGames = x);
  }

  ngOnInit() {
    this.difficulty = 3;
  }

  public customFormatter(value: number): string {
    return `${value}`;
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
    if (!this.checkPlayerThrow()) {return;}
    await this.database.startNewGame(this.startScore, this.difficulty);
  }

  public checkPlayerThrow(): boolean {
    if (this.startScore === undefined || this.startScore === null) {
      this.presentAlert('Oeps!', 'No startscore selected', 'Please select a startscore!');
      return false;
    } else if (this.difficulty === undefined || this.difficulty === null) {
      this.presentAlert('Oeps!', 'No difficulty selected', 'Please select a difficulty!');
      return false;
    }

    return true;
  }

  public async presentAlert(headerTxt, subheaderTxt, messageTxt): Promise<void> {
    const alert = await this.alertController.create({
      header: headerTxt,
      subHeader: subheaderTxt,
      message: messageTxt,
      buttons: ['OK']
    });

    await alert.present();
  }
}
