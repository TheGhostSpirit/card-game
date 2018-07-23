import { Redirect } from 'aurelia-router';

export class App {

  configureRouter(config, router) {
    config.map([
      { route: 'game', moduleId: 'views/game', name: 'Game', title: 'Game'},
      { route: ['menu', ''], moduleId: 'views/menu', name: 'Menu', title: 'Menu'}
    ]);
    this.router = router;
  }
}
