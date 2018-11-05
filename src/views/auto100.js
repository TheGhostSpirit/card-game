import { Solver } from 'models/solver';
import { Solitaire } from 'models/solitaire/solitaire';
import { Service } from 'services/service';
import { inject, computedFrom } from 'aurelia-framework';

@inject(Solver, Solitaire, Service)
export class Auto100 {
  constructor(solver, solitaire, service) {
    this.solver = solver;
    this.solitaire = solitaire;
    this.service = service;
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
    if (outcome.result) this.success++;
    if (outcome.result === false) this.fails++;
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
          this.solitaire.loadGame(g.game);
          return this.solver.resolve(this.solitaire);
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
