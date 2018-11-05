import { Solver } from 'models/solver';
import { Service } from 'services/service';
import { inject, computedFrom, NewInstance } from 'aurelia-framework';

@inject(NewInstance.of(Solver), Service)
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

  showGameOutcome(outcome, i) {
    if (outcome) this.success++;
    if (outcome === false) this.fails++;
    this.progress = Math.ceil((i / this.gamesCount) * 100);
  }

  showError(error) {
    console.log(error.message);
    this.unknowns++;
  }

  launch() {
    this.locked = true;
    this.success = 0;
    this.fails = 0;
    this.unknowns = 0;
    let beginTime = Date.now();
    this.games.reduce((acc, g, i) => {
      return acc
        .then(() => {
          this.solver.loadGame(g.game);
          return this.solver.resolve();
        })
        .then(o => this.showGameOutcome(o, i))
        .catch(error => this.showError(error));
    }, Promise.resolve()).then(() => {
      let finishTime = Date.now();
      this.time = ((finishTime - beginTime) / 1000);
      this.locked = false;
    }).catch(error => {
      console.log(error.message);
      this.locked = false;
    });
  }

  @computedFrom('success', 'gamesCount')
  get rate() {
    return (this.success) ? ((this.success / this.gamesCount) * 100).toFixed(1) : 0;
  }
}
