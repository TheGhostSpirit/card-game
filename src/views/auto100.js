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

  launch() {
<<<<<<< HEAD
    this.locked = true;
    this.success = 0;
    this.fails = 0;
    this.unknowns = 0;
    let beginTime = Date.now();
    for (let i = 0; i < this.gamesCount; i++) {
      setTimeout(() => {
        this.solver.load(this.games[i].game);
        let outcome = this.solver.resolve();
        if (outcome) this.success++;
        if (outcome === false) this.fails++;
        if (outcome === undefined) this.unknowns++;
        let finishTime = Date.now();
        this.time = ((finishTime - beginTime) / 1000);
        this.locked = (i < this.gamesCount - 1);
      });
    }
  }

  @computedFrom('success', 'gamesCount')
  get rate() {
    return (this.success) ? ((this.success / this.gamesCount) * 100).toFixed(1) : 0;
=======
    this.wins = 0;
    this.percentage = 0;
    this.outOfRange = 0;
    this.noSol = 0;
    let beginTime = Date.now();
    for (let i = 0; i < this.amount; i++) {
      this.solver.load(this.games[i].game);
      let outcome = this.solver.resolve();
      if (outcome) this.wins++;
      if (outcome === false) this.outOfRange++;
      if (typeof outcome === 'undefined') this.noSol++;
    }
    let finishTime = Date.now();
    this.time = ((finishTime - beginTime) / 1000);
    this.finished = true;
    this.percentage = (this.wins / this.amount) * 100;
    this.outOfRange = (this.outOfRange / this.amount) * 100;
    this.noSol = (this.noSol / this.amount) * 100;
>>>>>>> 56bb02913781110e47209134ad7a03787fc940a9
  }
}
