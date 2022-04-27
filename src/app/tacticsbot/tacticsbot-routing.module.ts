import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TacticsbotPage } from './tacticsbot.page';

const routes: Routes = [
  {
    path: '',
    component: TacticsbotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TacticsbotPageRoutingModule {}
