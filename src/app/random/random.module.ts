import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RandomPageRoutingModule } from './random-routing.module';

import { RandomPage } from './random.page';
import { ThreePageModule } from '../three/three.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RandomPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ThreePageModule
  ],
  declarations: [RandomPage]
})
export class RandomPageModule {}
