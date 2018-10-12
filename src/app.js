export class App {

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map([
      { route: 'game', moduleId: 'views/game', name: 'Game', title: 'Game' },
      { route: 'auto', moduleId: 'views/auto', name: 'Auto', title: 'Auto' },
      { route: ['menu', ''], moduleId: 'views/menu', name: 'Menu', title: 'Menu' }
    ]);
    this.router = router;
  }
}
