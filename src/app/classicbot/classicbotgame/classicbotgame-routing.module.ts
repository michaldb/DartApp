import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassicbotgamePage } from './classicbotgame.page';

const routes: Routes = [
  {
    path: '',
    component: ClassicbotgamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassicbotgamePageRoutingModule {}
