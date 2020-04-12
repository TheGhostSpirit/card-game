import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';

@inject(Router)
export class Menu {

  constructor(router) {
    this.router = router;
  }

  solitaire() {
    this.router.navigateToRoute('Solitaire');
  }

  solver() {
    this.router.navigateToRoute('Solver');
  }
}
