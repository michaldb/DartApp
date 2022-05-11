import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { ClassicGame } from 'src/app/types/classicgame';
import Helpers from '../../helpers/helpers';

@Component({
  selector: 'app-gamedetails',
  templateUrl: './gamedetails.page.html',
  styleUrls: ['./gamedetails.page.scss'],
})
export class GamedetailsPage implements OnInit {
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

  ngOnInit() {}
}
