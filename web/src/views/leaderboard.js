import { Service } from 'services/service'; //importe la classe qui gère la couche service
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Service, Router) //crée une instance de service
export class Leaderboard {
  constructor(service, router) { //qu'on passe en paramètre
    this.service = service; //accès hors du constructeur
    this.rankings = [];
    this.router = router;
  }

  activate() {
    this.service.getRankings().then(result => this.rankings = result); //récupère le contenu du fichier json et le push dans
  }                                                                   //une array via la couche service

  goToMenu() {
    this.router.navigateToRoute('Menu');
  }
}
