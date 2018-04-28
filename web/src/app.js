import { inject } from 'aurelia-framework';
import { User } from 'models/user';

@inject(User)
export class App {

  constructor(user) {
    this.user = user;
  }

  configureRouter(config, router) {
    config.map([
      { route: 'game', moduleId: 'views/game', name: 'Game', title: 'Game' },
      { route: 'leaderboard', moduleId: 'views/leaderboard', name: 'Leaderboard', title: 'Leaderboard' },
      { route: ['', 'login'], moduleId: 'views/login', name: 'Login', title: 'Login' },
      { route: 'menu', moduleId: 'views/menu', name: 'Menu', title: 'Menu' }
    ]);

    this.router = router;
  }
}
