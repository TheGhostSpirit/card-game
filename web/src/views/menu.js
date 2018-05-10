import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { Service } from 'services/service';
import { User } from 'models/user';

@inject(Router, Service, User)
export class Menu {

  constructor(router, service, user) {
    this.router = router;
    this.service = service;
    this.user = user;
  }

  newGame() {
    this.service.updatePlayerStats(this.user.email)
      .then(() => this.router.navigateToRoute('Game', { new: true }));
  }

  restoreGame() {
    this.router.navigateToRoute('Game');
  }

  goToRankings() {
    this.router.navigateToRoute('Leaderboard');
  }

  goToLogin() {
    this.user.status = false;
    this.router.navigateToRoute('Login');
  }
}
