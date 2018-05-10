import { Service } from 'services/service'; //importe la classe qui gère la couche service
import { inject } from 'aurelia-framework';
import { User } from 'models/user';
import { Router } from 'aurelia-router';

@inject(Service, User, Router) //crée une instance de service
export class Login {
  constructor(service, user, router) { //qu'on passe en paramètre
    this.service = service; //accès hors du constructeur
    this.user = user;
    this.router = router;
  }

  authenticate(email, password) {
    this.service.authenticateUser(email, password).then((result) => {
      if (result.status !== false) {
        this.user.status = result.status;
        this.user.email = result.email;
        this.user.username = result.username;
        this.user.points = result.points;
        this.user.pointsToLevel();
        this.router.navigate('menu');
      }
    });
  }
}
