import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BetbitcoinPageRoutingModule } from './betbitcoin-routing.module';

import { BetbitcoinPage } from './betbitcoin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BetbitcoinPageRoutingModule
  ],
  declarations: [BetbitcoinPage]
})
export class BetbitcoinPageModule {}
