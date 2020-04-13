import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BetbitcoinPage } from './betbitcoin.page';

const routes: Routes = [
  {
    path: '',
    component: BetbitcoinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BetbitcoinPageRoutingModule {}
