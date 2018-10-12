import { Solitaire } from 'models/solitaire';
import { inject } from 'aurelia-framework';

@inject(Solitaire)
export class Game {

  constructor(solitaire) {
    this.solitaire = solitaire;
  }

  activate(param) {
    if (param.cheat) {
      this.solitaire.cheat();
    } else {
      this.solitaire.newGame();
    }
  }
}
