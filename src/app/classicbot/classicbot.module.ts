import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassicbotPageRoutingModule } from './classicbot-routing.module';

import { ClassicbotPage } from './classicbot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassicbotPageRoutingModule
  ],
  declarations: [ClassicbotPage]
})
export class ClassicbotPageModule {}
