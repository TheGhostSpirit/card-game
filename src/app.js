export class App {

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map([
      { route: 'solitaire', moduleId: 'views/solitaire-game', name: 'Solitaire', title: 'Solitaire' },
      { route: 'spider', moduleId: 'views/spider-game', name: 'Spider', title: 'Spider' },
      { route: 'auto', moduleId: 'views/auto', name: 'Auto', title: 'Auto' },
      { route: 'autox100', moduleId: 'views/auto100', name: 'AutoX100', title: 'Auto x100' },
      { route: ['menu', ''], moduleId: 'views/menu', name: 'Menu', title: 'Menu' }
    ]);
    this.router = router;
  }
}
