import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IceCream } from '../entities/ice-cream';
import { IceCreamService } from '../ice-cream.service';

@Component({
  selector: 'app-random',
  templateUrl: './random.page.html',
  styleUrls: ['./random.page.scss'],
})
export class RandomPage implements OnInit {

  choice: IceCream[] | null = null;
  randomGroup = this.fb.group({
    bolesControl: [ 2, Validators.required],
  });

  constructor(
    private iceCreamService: IceCreamService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
  }

  async randomize(){
    const boles = this.randomGroup.value.bolesControl;
    if(boles) this.choice = await this.iceCreamService.randomize(boles);
  }
}
