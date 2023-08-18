import { Component, OnInit } from '@angular/core';
import { IonToggle } from '@ionic/angular';
import { IceCream } from '../entities/ice-cream';
import { IceCreamService } from '../ice-cream.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  iceCreamPrefs: {ice_cream: IceCream, excluded: boolean}[] = [];
  excluded: number[] = [];
  constructor(private ics: IceCreamService) { }

  async ngOnInit() {
    this.excluded = await this.ics.getExcludedIceCreams();
    this.iceCreamPrefs = this.ics.allIceCreams.map((ic: IceCream) => ({ice_cream: ic, excluded: this.excluded.indexOf(ic.id) !== -1} ));
  }

  async changeToggle(event: any, pref: {ice_cream: IceCream, excluded: boolean}){
    const toggle = event.target as IonToggle;
    if(toggle.checked){
      this.excluded = this.excluded.filter((x) => x !== pref.ice_cream.id);
      pref.excluded = false;
    }
    else{
      this.excluded.push(pref.ice_cream.id);
      pref.excluded = true;
    }
    await this.ics.setExcludedIceCreams(this.excluded);
  }

  async enableAll(){
    await this.ics.setExcludedIceCreams([]);
    await this.ngOnInit();
  }

  async disableAll(){
    await this.ics.setExcludedIceCreams(this.ics.allIceCreams.map((ic: IceCream) => ic.id));
    await this.ngOnInit();
  }

}
