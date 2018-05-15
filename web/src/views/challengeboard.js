import { Service } from 'services/service'; //importe la classe qui gère la couche service
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Service, Router) //crée une instance de service
export class Challengeboard {
  constructor(service, router) { //qu'on passe en paramètre
    this.service = service; //accès hors du constructeur
    this.challengers = [];
    this.router = router;
  }

  activate() {
    this.service.getChallengers().then(result => this.challengers = result);
  }

  goToMenu() {
    this.router.navigateToRoute('Menu');
  }

}
