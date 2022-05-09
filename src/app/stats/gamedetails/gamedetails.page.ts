import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { ClassicGame } from 'src/app/types/classicgame';

@Component({
  selector: 'app-gamedetails',
  templateUrl: './gamedetails.page.html',
  styleUrls: ['./gamedetails.page.scss'],
})
export class GamedetailsPage implements OnInit {
  classicGameObj: ClassicGame;
  id = this.activatedRoute.snapshot.paramMap.get('id');
  averageThrowPlayer: number;

  constructor(private database: DatabaseService, public activatedRoute: ActivatedRoute, public navController: NavController) {
    this.database.retrieveGameById(this.id).then(res => {
      this.classicGameObj = res;
      this.averageThrowPlayer = Number(this.classicGameObj.playerThrows.slice(-1));
      this.averageThrowPlayer = this.getSumOfThrows(this.classicGameObj.playerThrows) / this.classicGameObj.playerThrows.length;
    });
  }

  ngOnInit() {}

  private getSumOfThrows(array): number {
    let total = 0;
    array.forEach(value => {
      total = total + value;
    });

    return total;
  }
}
