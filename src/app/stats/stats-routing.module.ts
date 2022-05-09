import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsPage } from './stats.page';

const routes: Routes = [
  {
    path: '',
    component: StatsPage
  },
  {
    path: 'gamedetails/:id',
    loadChildren: () => import('./gamedetails/gamedetails.module').then( m => m.GamedetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsPageRoutingModule {}
