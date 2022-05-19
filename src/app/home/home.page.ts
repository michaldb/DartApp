import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from './../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private database: DatabaseService, public authService: AuthService) {}
}
