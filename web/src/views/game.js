import { Solitaire } from 'models/solitaire';
import { inject } from 'aurelia-framework';

@inject(Solitaire)
export class Game {

  constructor(solitaire) {
    this.solitaire = solitaire;
  }
}
