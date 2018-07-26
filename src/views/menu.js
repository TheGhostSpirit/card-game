import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';

@inject(Router)
export class Menu {

  constructor(router) {
    this.router = router;
  }

  newGame() {
    this.router.navigateToRoute('Game');
  }

  cheatGame() {
    this.router.navigateToRoute('Game', { cheat: true });
  }

  autoGame() {
    this.router.navigateToRoute('Game', { auto: true });
  }
}
