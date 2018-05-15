import { HttpClient } from 'aurelia-fetch-client'; //on importe une classe de l'API Fetch
import { inject } from 'aurelia-framework';

@inject(HttpClient) //revient à créer une instance de la classe HttpClient
export class Service {

  constructor(httpClient) { //instance créée qu'on passe en paramètre dans le constructeur
    this.httpClient = httpClient; //permet d'accéder à cet objet hors du constructeur (un champ est disponible dans la classe)
    this.url = 'http://localhost:3000';
    //this.url = '/webapi';
  }

  getRankings() { //test sur un Mock --> le vrai json sera généré par le php (on changera juste l'url dans le fetch)
    //let url = 'mock/rankings.json';
    let url = this.url + '/api/leaderboard/global';
    return this.httpClient.fetch(url, {
      method: 'get'
    })
      .then(response => response.json()); //le stream est parsé en json
  }

  authenticateUser(email, password) {
    let url = this.url + '/api/login';
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
    let url = this.url + '/api/game/save';
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
    let url = this.url + `/api/game/restore/${email}`;
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
    let url = this.url + '/api/game/new';
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
    let url = this.url + '/api/game/end';
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

  initChallenge(email) {
    let url = this.url + '/api/game/newChallenge';
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

  endChallenge(email, score) {
    let url = this.url + '/api/game/endChallenge';
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

  getChallenge() {
    let url = this.url + '/api/game/getChallenge';
    return this.httpClient.fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json());
  }

  getChallengers() {
    let url = this.url + '/api/leaderboard/challenge';
    return this.httpClient.fetch(url, {
      method: 'get'
    })
      .then(response => response.json());
  }

}
