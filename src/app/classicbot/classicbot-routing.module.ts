import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassicbotPage } from './classicbot.page';

const routes: Routes = [
  {
    path: '',
    component: ClassicbotPage
  },
  {
    path: 'classicbotgame/:id',
    loadChildren: () => import('./classicbotgame/classicbotgame.module').then( m => m.ClassicbotgamePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassicbotPageRoutingModule {}
