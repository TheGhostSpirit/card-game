export class App {
  
  constructor() {
  }

  configureRouter(config, router){
    config.map([
      { route: ['game', ''], moduleId: 'views/game',   title: 'Game'},
      { route: 'leaderboard',  moduleId: 'views/leaderboard', name:'Leaderboard' }
    ]);

    this.router = router;
  }
}
