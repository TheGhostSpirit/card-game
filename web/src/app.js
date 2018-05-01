import { inject } from 'aurelia-framework';
import { User } from 'models/user';

@inject(User)
export class App {

  constructor(user) {
    this.user = user;
  }

  configureRouter(config, router) {
    const autorizeStep = {
      run(navigationInstruction, next) {
        if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
          let isLoggedIn = this.user.status;
          if (!isLoggedIn) {
            return next.cancel(new Redirect('login'));
          }
        }
        return next();
      }
    };

    config.addAuthorizeStep(autorizeStep);
    config.map([
      { route: 'game', moduleId: 'views/game', name: 'Game', title: 'Game', settings: { auth: true } },
      { route: 'leaderboard', moduleId: 'views/leaderboard', name: 'Leaderboard', title: 'Leaderboard', settings: { auth: true } },
      { route: ['', 'login'], moduleId: 'views/login', name: 'Login', title: 'Login' },
      { route: 'menu', moduleId: 'views/menu', name: 'Menu', title: 'Menu', settings: { auth: true } }
    ]);

    this.router = router;
  }
}
