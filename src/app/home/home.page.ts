import { Component } from '@angular/core';
import { DatabaseService } from './../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private database: DatabaseService) {
  }
}
