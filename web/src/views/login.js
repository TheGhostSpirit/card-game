import { Service } from 'services/service'; //importe la classe qui gère la couche service
import { inject } from 'aurelia-framework';

@inject(Service) //crée une instance de service
export class Login {
  constructor(service) { //qu'on passe en paramètre
    this.service = service; //accès hors du constructeur
  }

  authenticate(email, password) {
    this.service.authenticateUser(email, password).then(result => console.log(result));
  }
}
