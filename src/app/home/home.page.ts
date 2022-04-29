import { Component } from '@angular/core';
import { Message } from '../types/message';
import { DatabaseService } from './../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  channelName = 'Home';
  newMessage: string;
  messages: Message[] = [];
  playerOneScore = 501;
  testinput: number;

  constructor(private database: DatabaseService) {
  }

  async sendMessage(): Promise<void> {
    // await this.database.sendMessage(this.channelName, this.newMessage);
    this.newMessage = '';
  }

  test(): void {
    this.playerOneScore = this.playerOneScore - this.testinput;
    this.testinput = null;
  }
}
