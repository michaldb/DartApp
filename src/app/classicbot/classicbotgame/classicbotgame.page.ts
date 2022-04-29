import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  lastthrow;

  constructor(private database: DatabaseService, public activatedRoute: ActivatedRoute) {
    this.database.retrieveGameById(this.id).then(res => this.classicGameObj = res);
  }

  ngOnInit() {
    this.lastthrow = this.classicGameObj.playerThrows.slice(-1);
  }

  public formatFirestoreDatetime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours()}:${('0'+ date.getMinutes()).slice(-2)}`;
  }

  public inputScore(): void {
    if (this.playerThrow != null && this.playerThrow >= 0 && this.classicGameObj.remainingScorePlayer > 1) {
      this.classicGameObj.playerThrows.push(Number(this.playerThrow));

      this.classicGameObj.remainingScorePlayer = this.classicGameObj.startScore - this.getSumOfplayerThrows();
      this.classicGameObj.averageThrowPlayer = this.getSumOfplayerThrows() / this.classicGameObj.playerThrows.length;

      this.playerThrow = null;

      this.takeTurnBot();

      this.database.updateGameById(this.id, this.classicGameObj);
    }
  }

  private getSumOfplayerThrows(): number {
    let total = 0;
    this.classicGameObj.playerThrows.forEach(value => {
      total = total + value;
    });

    return total;
  }

  private takeTurnBot(): void {
    setTimeout(() => {
      this.classicGameObj.remainingScoreBot = this.classicGameObj.remainingScoreBot - (Math.floor(Math.random() * (60 - 30 + 1)) + 30);
    }, 2000);
  }
}
