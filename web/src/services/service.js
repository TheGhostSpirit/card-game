import { HttpClient } from 'aurelia-fetch-client'; //on importe une classe de l'API Fetch
import { inject } from 'aurelia-framework';

@inject(HttpClient) //revient à créer une instance de la classe HttpClient
export class Service {

  constructor(httpClient) { //instance créée qu'on passe en paramètre dans le constructeur
    this.httpClient = httpClient; //permet d'accéder à cet objet hors du constructeur (un champ est disponible dans la classe)
  }

  getRankings() { //test sur un Mock --> le vrai json sera généré par le php (on changera juste l'url dans le fetch)
    return this.httpClient.fetch('mock/rankings.json') //retourne une promise
      .then(response => response.json()) //le stream est parsé en json
      .catch(error => console.error(error)); //executé en cas d'erreur
  }
}
