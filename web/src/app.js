export class App {

  configureRouter(config, router) {
    config.map([
      { route: 'game', moduleId: 'views/game', name: 'Game' },
      { route: 'leaderboard', moduleId: 'views/leaderboard', name: 'Leaderboard' },
      { route: ['', 'login'], moduleId: 'views/login', name: 'Login' }
    ]);

    this.router = router;
  }
}
