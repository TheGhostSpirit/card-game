import {
  Solver
} from 'models/solver';
import {
  Service
} from 'services/service';
import {
  inject,
  computedFrom
} from 'aurelia-framework';

@inject(Solver, Service)
export class Auto100 {
  constructor(solver, service) {
    this.service = service;
    this.solver = solver;
    this.expectedSuccess = 0;
    this.games = [];
    this.locked = true;
  }

  activate() {
    this.service.getGames().then(result => {
      this.games = result;
      this.gamesCount = result.length;
      this.expectedSuccess = this.games.filter(g => g.result).length;
      this.locked = false;
    });
  }

  showGameOutcome(outcome) {
    if (outcome) this.success++;
    if (outcome === false) this.fails++;
    if (outcome === null) this.unknowns++;
    //  let finishTime = Date.now();
    //  this.time = ((finishTime - beginTime) / 1000);
    // this.locked = (i < this.gamesCount - 1);
    // this.progress = Math.ceil((i / this.gamesCount) * 100);
  }

  launch() {
    this.locked = true;
    this.success = 0;
    this.fails = 0;
    this.unknowns = 0;
    // let beginTime = Date.now();
    this.games.reduce((acc, g) => {
      this.solver.load(g.game);
      return acc.then(() => {
        return this.solver.resolve().then(o => this.showGameOutcome(o));
      });
    }, Promise.resolve());
  }

  @computedFrom('success', 'gamesCount')
  get rate() {
    return (this.success) ? ((this.success / this.gamesCount) * 100).toFixed(1) : 0;
  }
}
