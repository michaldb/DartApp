import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { ClassicGame } from './../../types/classicgame';
import { DifficultySettings } from './../../types/difficultyClassicGame';
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
      this.presentAlert('Oeps!', 'Wrong input value.', 'Value can not be more then remaining score! Fill in 0 if you throw too high.');
      return false;
    } else if (this.classicGameObj.remainingScorePlayer - this.playerThrow === 1) {
      this.presentAlert('Oeps!', 'Wrong input value.', 'Remaining score can not be 1! Fill in 0 if you throw too high.');
      return false;
    }

    return true;
  }

  public inputScore(): void {
    if (this.playerThrow != null && this.classicGameObj.remainingScorePlayer > 1) {
      if (!this.checkPlayerThrow()) {return;}

      if (Number(this.playerThrow) === Number(this.classicGameObj.remainingScorePlayer)) {
        this.presentAlert('You have won!', 'Congratulations you have won the game!', 'You are redirected to the overview page.');
        this.classicGameObj.haswon = true;
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

  public takeTurnBot(): void {
    const difficultySettings = this.setDifficulty();

    if (this.classicGameObj.remainingScoreBot > difficultySettings.startCheckout) {
      // eslint-disable-next-line max-len
      const rndNumber = Math.round(Math.random() * (difficultySettings.maxThrow - difficultySettings.minThrow + 1)) + difficultySettings.minThrow;

      this.classicGameObj.botThrows.push(Number(rndNumber));
      this.classicGameObj.remainingScoreBot = this.classicGameObj.startScore - this.getSumOfThrows(this.classicGameObj.botThrows);
      this.averageThrowBot = this.getSumOfThrows(this.classicGameObj.botThrows) / this.classicGameObj.playerThrows.length;
      this.lastthrowBot = Number(this.classicGameObj.botThrows.slice(-1));
    }
    else {
      const chance = Math.random() * 100;
      let throwBot;

      if (chance < difficultySettings.missChanceCheckout) {
        throwBot = Math.floor(((Math.random() * this.classicGameObj.remainingScoreBot) + 0) / 2);
      } else {
        throwBot = this.classicGameObj.remainingScoreBot;
        this.presentAlert('You have lost!', 'You have lost the game, the bot has won!', 'You are redirected to the overview page.');
        this.endGame();
      }

      this.classicGameObj.remainingScoreBot = this.classicGameObj.remainingScoreBot - throwBot;
      this.lastthrowBot = Number(throwBot);

      if ( this.classicGameObj.remainingScoreBot === 1) {
        this.classicGameObj.remainingScoreBot++;
      }
    }
  }

  private setDifficulty(): DifficultySettings{
    let minThrow: number;
    let maxThrow: number;
    let startCheckout: number;
    let missChanceCheckout: number;

    switch (this.classicGameObj.difficulty) {
      case 1:
        minThrow = 15;
        maxThrow = 40;
        startCheckout = 60;
        missChanceCheckout = 85;
        break;
      case 2:
        minThrow = 25;
        maxThrow = 45;
        startCheckout = 70;
        missChanceCheckout = 80;
        break;
      case 3:
        minThrow = 30;
        maxThrow = 55;
        startCheckout = 80;
        missChanceCheckout = 75;
        break;
      case 4:
        minThrow = 35;
        maxThrow = 65;
        startCheckout = 85;
        missChanceCheckout = 60;
        break;
      case 5:
        minThrow = 40;
        maxThrow = 80;
        startCheckout = 90;
        missChanceCheckout = 50;
        break;
    }

    const difficultySettings: DifficultySettings = {
      minThrow,
      maxThrow,
      startCheckout,
      missChanceCheckout
    };

    return difficultySettings;
  }

  private getSumOfThrows(array): number {
    let total = 0;
    array.forEach(value => {
      total = total + value;
    });

    return total;
  }
}
