import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TacticsbotPageRoutingModule } from './tacticsbot-routing.module';

import { TacticsbotPage } from './tacticsbot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TacticsbotPageRoutingModule
  ],
  declarations: [TacticsbotPage]
})
export class TacticsbotPageModule {}
