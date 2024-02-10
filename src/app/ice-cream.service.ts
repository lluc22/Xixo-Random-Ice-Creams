import { Injectable } from '@angular/core';
import { IceCream } from './entities/ice-cream';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class IceCreamService {

  allIceCreams: IceCream[] = [
    {"id": 1, "label": "Vainilla", "baseColor": "vanilla"},
    {"id": 2, "label": "Xocolata", "baseColor": "chocolate"},
    {"id": 3, "label": "Maduixa", "baseColor": "strawberry"},
    {"id": 4, "label": "After eight", "baseColor": "aftereight"},
    {"id": 5, "label": "Llimona", "baseColor": "lemon"},
    {"id": 6, "label": "Nata", "baseColor": "white"},
    {"id": 7, "label": "Cafe", "baseColor": "coffee"},
    {"id": 8, "label": "Stracciatella", "baseColor": "white"},
    {"id": 9, "label": "Xixona", "baseColor": "beige"},
    {"id": 10, "label": "Llet merengada", "baseColor": "beigeLight", baseColorVarName: "beige-light"},
    {"id": 11, "label": "Trufa", "baseColor": "chocolateTruffle", baseColorVarName: "chocolate-truffle"},
    {"id": 12, "label": "Xocolata negra", "baseColor": "darkChocolate", baseColorVarName: "dark-chocolate"},
    {"id": 13, "label": "Festuc", "baseColor": "pistachio"},
    {"id": 14, "label": "Xocolata blanca", "baseColor": "whiteChocolate", baseColorVarName: 'white-chocolate'},
    {"id": 15, "label": "Dulce de leche", "baseColor": "vanilla"},
    {"id": 16, "label": "Gingebre amb mango", "baseColor": "mango"},
    {"id": 17, "label": "Avellana", "baseColor": "almond"},
    {"id": 18, "label": "Iogurt amb mora", "baseColor": "berry"},
    {"id": 19, "label": "Caramel", "baseColor": "almond"},
    {"id": 20, "label": "Pa amb nutella", "baseColor": "chocolate"},
    {"id": 21, "label": "Amarena", "baseColor": "cherry"},
    {"id": 22, "label": "Ratafia amb torró", "baseColor": "vanilla"},
    {"id": 23, "label": "Cheesecake", "baseColor": "vanilla"},
    {"id": 24, "label": "Coco", "baseColor": "white"},
    {"id": 25, "label": "Gerds", "baseColor": "cherry"},
    {"id": 26, "label": "Plàtan", "baseColor": "lemon"},
    {"id": 27, "label": "Mel i mató amb avellana caramelitzada", "baseColor": "vanilla"},
    {"id": 28, "label": "Sorbet de llimona", "baseColor": "lemon"},
    {"id": 29, "label": "Sorbet de mango", "baseColor": "mango"},
    {"id": 30, "label": "Sorbet de xocolata", "baseColor": "chocolate"},
    {"id": 31, "label": "Sorbet de vainilla", "baseColor": "vanilla"},
    {"id": 32, "label": "Sorbet de mojito", "baseColor": "pistachio"},
    {"id": 33, "label": "Regalèssia", "baseColor": "darkChocolate"},
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
