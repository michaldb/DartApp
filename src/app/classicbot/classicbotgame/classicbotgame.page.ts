import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { ClassicGame } from './../../types/classicgame';
@Component({
  selector: 'app-classicbotgame',
  templateUrl: './classicbotgame.page.html',
  styleUrls: ['./classicbotgame.page.scss'],
})

export class ClassicbotgamePage implements OnInit {
  id = this.activatedRoute.snapshot.paramMap.get('id');
  classicGameObj: ClassicGame;
  playerThrow: number;
  lastthrowPlayer: number;
  lastthrowBot: number;
  averageThrowPlayer: number;
  averageThrowBot: number;

  // eslint-disable-next-line max-len
  constructor(private database: DatabaseService, public activatedRoute: ActivatedRoute, public alertController: AlertController, public router: Router) {
    this.database.retrieveGameById(this.id).then(res => {
      this.classicGameObj = res;
      this.lastthrowPlayer = Number(this.classicGameObj.playerThrows.slice(-1));
      this.lastthrowBot = Number(this.classicGameObj.botThrows.slice(-1));
      this.averageThrowPlayer = this.getSumOfThrows(this.classicGameObj.playerThrows) / this.classicGameObj.playerThrows.length;
      this.averageThrowBot = this.getSumOfThrows(this.classicGameObj.botThrows) / this.classicGameObj.playerThrows.length;
    });
  }
  ngOnInit() {}

  public async presentAlert(headerTxt, subheaderTxt, messageTxt) {
    const alert = await this.alertController.create({
      header: headerTxt,
      subHeader: subheaderTxt,
      message: messageTxt,
      buttons: ['OK']
    });

    await alert.present();
  }

  public formatFirestoreDatetime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours()}:${('0'+ date.getMinutes()).slice(-2)}`;
  }

  public checkPlayerThrow(): boolean {
    if (this.playerThrow < 0) {
      this.presentAlert('Oeps!', 'Wrong input value.', 'Value can not be less then 0!');
      return false;
    } else if (this.playerThrow > 180) {
      this.presentAlert('Oeps!', 'Wrong input value.', 'Value can not be more then 180!');
      return false;
    } else if (this.playerThrow > this.classicGameObj.remainingScorePlayer) {
      this.presentAlert('Oeps!', 'Wrong input value.', 'Value can not be more then remaining score!');
      return false;
    }

    return true;
  }

  public inputScore(): void {
    if (this.playerThrow != null && this.classicGameObj.remainingScorePlayer > 1) {
      if (!this.checkPlayerThrow()) {return;}

      if (Number(this.playerThrow) === Number(this.classicGameObj.remainingScorePlayer)) {
        this.presentAlert('You have won!', 'Congratulations you have won the game!', 'You are redirected to the overview page.');
        this.endGame();
      }

      this.classicGameObj.playerThrows.push(Number(this.playerThrow));
      this.classicGameObj.remainingScorePlayer = this.classicGameObj.startScore - this.getSumOfThrows(this.classicGameObj.playerThrows);
      this.averageThrowPlayer = this.getSumOfThrows(this.classicGameObj.playerThrows) / this.classicGameObj.playerThrows.length;
      this.lastthrowPlayer = Number(this.classicGameObj.playerThrows.slice(-1));

      this.takeTurnBot();

      this.database.updateGameById(this.id, this.classicGameObj);
    }

    this.playerThrow = null;
  }

  public endGame(): void {
    this.classicGameObj.finished = true;
    this.database.updateGameById(this.id, this.classicGameObj);
    this.router.navigate(['/classicbot']);
  }

  private getSumOfThrows(array): number {
    let total = 0;
    array.forEach(value => {
      total = total + value;
    });

    return total;
  }

  private takeTurnBot(): void {
    const difficultySettings = this.setDifficulty();

    //functie samenvoegen met input score zelfde functionaliteit
    if (this.classicGameObj.remainingScoreBot > difficultySettings[2]) {
      const rndNumber = Math.round(Math.random() * (difficultySettings[1] - difficultySettings[0] + 1)) + difficultySettings[0];

      this.classicGameObj.botThrows.push(Number(rndNumber));

      this.classicGameObj.remainingScoreBot = this.classicGameObj.startScore - this.getSumOfThrows(this.classicGameObj.botThrows);

      this.averageThrowBot = this.getSumOfThrows(this.classicGameObj.botThrows) / this.classicGameObj.playerThrows.length;

      this.lastthrowBot = Number(this.classicGameObj.botThrows.slice(-1));
    } else {
      // start checkout
    }
  }

  private setDifficulty() {
    let minThrow: number;
    let maxThrow: number;
    let startCheckout: number;

    switch (this.classicGameObj.difficulty) {
      case 1:
        minThrow = 15;
        maxThrow = 40;
        startCheckout = 60;
        break;
      case 2:
        minThrow = 25;
        maxThrow = 45;
        startCheckout = 70;
        break;
      case 3:
        minThrow = 30;
        maxThrow = 55;
        startCheckout = 80;
        break;
      case 4:
        minThrow = 35;
        maxThrow = 65;
        startCheckout = 85;
        break;
      case 5:
        minThrow = 40;
        maxThrow = 80;
        startCheckout = 90;
        break;
    }

    return [minThrow, maxThrow, startCheckout];
  }
}
