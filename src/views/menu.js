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

  spider() {
    this.router.navigateToRoute('Spider');
  }

  autoGame() {
    this.router.navigateToRoute('Auto');
  }

  autoGame100() {
    this.router.navigateToRoute('AutoX100');
  }
}
