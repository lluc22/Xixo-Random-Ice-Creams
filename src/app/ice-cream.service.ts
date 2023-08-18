import { Injectable } from '@angular/core';
import { IceCream } from './entities/ice-cream';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class IceCreamService {

  allIceCreams: IceCream[] = [
    {"id": 1, "label": "Vainilla"},
    {"id": 2, "label": "Xocolata"},
    {"id": 3, "label": "Maduixa"},
    {"id": 4, "label": "After eight"},
    {"id": 5, "label": "Llimona"},
    {"id": 6, "label": "Nata"},
    {"id": 7, "label": "Cafe"},
    {"id": 8, "label": "Stracciatella"},
    {"id": 9, "label": "Xixona"},
    {"id": 10, "label": "Llet merengada"},
    {"id": 11, "label": "Trufa"},
    {"id": 12, "label": "Xocolata negra"},
    {"id": 13, "label": "Festuc"},
    {"id": 14, "label": "Xocolata blanca"},
    {"id": 15, "label": "Dulce de leche"},
    {"id": 16, "label": "Gingebre amb mango"},
    {"id": 17, "label": "Avellana"},
    {"id": 18, "label": "Iogurt amb mora"},
    {"id": 19, "label": "Caramel"},
    {"id": 20, "label": "Pa amb nutella"},
    {"id": 21, "label": "Amarena"},
    {"id": 22, "label": "Ratafia amb torró"},
    {"id": 23, "label": "Cheesecake"},
    {"id": 24, "label": "Coco"},
    {"id": 25, "label": "Gerds"},
    {"id": 26, "label": "Plàtan"},
    {"id": 27, "label": "Mel i mató amb avellana caramelitzada"},
    {"id": 28, "label": "Sorbet de llimona"},
    {"id": 29, "label": "Sorbet de mango"},
    {"id": 30, "label": "Sorbet de xocolata"},
    {"id": 31, "label": "Sorbet de vainilla"},
    {"id": 32, "label": "Sorbet de mojito"},
    {"id": 33, "label": "Regalèssia"},
  ];

  constructor() { }

  async randomize(boles: number): Promise<IceCream[]>
  {
    const excluded = await this.getExcludedIceCreams();
    const shuffled = this.shuffle(this.allIceCreams.filter((ic: IceCream) => excluded.indexOf(ic.id) === -1));
    return shuffled.slice(0, boles);
  }

  async getExcludedIceCreams(): Promise<number[]>
  {
    const excluded = (await Preferences.get({key: 'excluded-ice-creams'})).value;
    if(excluded) return JSON.parse(excluded);
    return [];
  }

  async setExcludedIceCreams(excluded: number[])
  {
    await Preferences.set({key: 'excluded-ice-creams', value: JSON.stringify(excluded)})
  }



  shuffle(array: any[]) {
    const aux = [...array];
    for (let i = aux.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [aux[i], aux[j]] = [aux[j], aux[i]];
    }
    return aux;
  }


}
