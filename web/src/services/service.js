import { HttpClient } from 'aurelia-fetch-client'; //on importe une classe de l'API Fetch
import { inject } from 'aurelia-framework';

@inject(HttpClient) //revient à créer une instance de la classe HttpClient
export class Service {

  constructor(httpClient) { //instance créée qu'on passe en paramètre dans le constructeur
    this.httpClient = httpClient; //permet d'accéder à cet objet hors du constructeur (un champ est disponible dans la classe)
  }

  getRankings() { //test sur un Mock --> le vrai json sera généré par le php (on changera juste l'url dans le fetch)
    //let url = 'mock/rankings.json';
    let url = 'http://localhost:3000/api/leaderboard';
    return this.httpClient.fetch(url, {
      method: 'get'
    })
      .then(response => response.json()); //le stream est parsé en json
  }

  authenticateUser(email, password) {
    let url = 'http://localhost:3000/api/login';
    return this.httpClient.fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(response => response.json());
  }

  saveGame(email, savedGame, score) {
    let url = 'http://localhost:3000/api/game/save';
    return this.httpClient.fetch(url, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        savedGame: savedGame,
        score: score
      })
    })
      .then(response => response.json());
  }

  restoreGame(email) {
    let url = `http://localhost:3000/api/game/restore/${email}`;
    return this.httpClient.fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json());
  }

  updatePlayerStats(email) {
    let url = 'http://localhost:3000/api/game/new';
    return this.httpClient.fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    })
      .then(response => response.json());
  }

  endGame(email, score) {
    let url = 'http://localhost:3000/api/game/end';
    return this.httpClient.fetch(url, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        score: score
      })
    })
      .then(response => response.json());
  }

}
