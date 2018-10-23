export class App {

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map([
      { route: 'game', moduleId: 'views/game', name: 'Game', title: 'Game' },
      { route: 'auto', moduleId: 'views/auto', name: 'Auto', title: 'Auto' },
      { route: 'spider', moduleId: 'views/spider', name: 'Spider', title: 'Spider' },
      { route: 'autox100', moduleId: 'views/auto100', name: 'AutoX100', title: 'Auto x100' },
      { route: ['menu', ''], moduleId: 'views/menu', name: 'Menu', title: 'Menu' }
    ]);
    this.router = router;
  }
}
