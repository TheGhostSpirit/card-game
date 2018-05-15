import { Solitaire } from 'models/solitaire';
import { inject } from 'aurelia-framework';

@inject(Solitaire)
export class Game {

  constructor(solitaire) {
    this.solitaire = solitaire;
  }

  activate(param) {
    if (param.new) {
      this.solitaire.newGame();
    } else if (param.cheat) {
      this.solitaire.cheat();
    } else if (param.challenge) {
      this.solitaire.newChallenge();
    } else {
      this.solitaire.restoreGame();
    }
  }

}
