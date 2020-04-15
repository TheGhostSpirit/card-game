export class App {

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map([
      { route: 'solitaire', moduleId: 'views/solitaire/solitaire', name: 'Solitaire', title: 'Solitaire' },
      { route: 'solver', moduleId: 'views/solver/solver', name: 'Solver', title: 'Solver' },
      { route: ['menu', '', '**'], moduleId: 'views/menu/menu', name: 'Menu', title: 'Menu' }
    ]);
    this.router = router;
  }
}
