import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { Solitaire } from 'models/solitaire';
import { Service } from 'services/service';
import { User } from 'models/user';

@inject(Router, Solitaire, Service, User)
export class Menu {

  constructor(router, solitaire, service, user) {
    this.router = router;
    this.solitaire = solitaire;
    this.service = service;
    this.user = user;
  }

  newGame() {
    this.router.navigate('game');
    this.solitaire.newGame();
    this.service.updatePlayerStats(this.user.email);
  }

  restoreGame() {
    alert('no game found');
  }
}
