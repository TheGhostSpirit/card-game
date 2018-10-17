import { SSolitaire } from '../models/simple/ssolitaire';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(SSolitaire, Router)
export class Game {

  constructor(solitaire, router) {
    this.solitaire = solitaire;
    this.router = router;
  }

  activate() {
    this.solitaire.newGame();
  }

  quit() {
    this.router.navigateToRoute('Menu');
  }
}
