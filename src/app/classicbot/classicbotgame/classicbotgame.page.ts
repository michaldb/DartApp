import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-classicbotgame',
  templateUrl: './classicbotgame.page.html',
  styleUrls: ['./classicbotgame.page.scss'],
})

export class ClassicbotgamePage implements OnInit {
  id = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(private database: DatabaseService, public activatedRoute: ActivatedRoute) {}

  ngOnInit() {}

}
