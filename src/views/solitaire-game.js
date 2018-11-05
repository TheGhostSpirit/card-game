import { Solitaire } from '../models/solitaire/solitaire';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Solitaire, Router)
export class SolitaireGame {

  constructor(solitaire, router) {
    this.solitaire = solitaire;
    this.router = router;
  }

  activate(param) {
    if (param.cheat) {
      this.solitaire.cheat();
    } else {
      this.solitaire.newGame();
    }
  }

  quit() {
    this.router.navigateToRoute('Menu');
  }
}
