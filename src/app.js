export class App {

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map([
      { route: 'solitaire', moduleId: 'views/solitaire-game', name: 'Solitaire', title: 'Solitaire' },
      { route: 'solver', moduleId: 'views/solver', name: 'Solver', title: 'Solver' },
      { route: ['menu', '', '**'], moduleId: 'views/menu', name: 'Menu', title: 'Menu' }
    ]);
    this.router = router;
  }
}
