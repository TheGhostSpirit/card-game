import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';

@inject(HttpClient)
export class Service {

  constructor(httpClient) {
    this.httpClient = httpClient;
    this.url = '/assets/mocks/100.games.json';
  }

  getGames() {
    return this.httpClient.fetch(this.url)
      .then(response => response.json());
  }

}
