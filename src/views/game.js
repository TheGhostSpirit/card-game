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
    } else if (param.auto) {
      this.solitaire.auto();
    } else {
      this.solitaire.newGame();
    }
  }
}
