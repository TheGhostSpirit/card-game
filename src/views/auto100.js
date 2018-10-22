import { Solver } from 'models/solver';
import { Service } from 'services/service';
import { inject } from 'aurelia-framework';

@inject(Solver, Service)
export class Auto100 {
  constructor(solver, service) {
    this.service = service;
    this.solver = solver;
    this.awaitedWins = 0;
    this.games = [];
  }

  activate() {
    this.service.getGames().then(result => {
      this.games = result;
      this.amount = result.length;
      this.awaitedWins = this.games.filter(g => g.result).length;
    });
  }

  launch() {
    this.wins = 0;
    this.percentage = 0;
    let beginTime = Date.now();
    for (let i = 0; i < this.amount; i++) {
      this.solver.load(this.games[i].game);
      let outcome = this.solver.resolve();
      if (outcome) this.wins++;
    }
    let finishTime = Date.now();
    this.time = ((finishTime - beginTime) / 1000);
    this.finished = true;
    this.percentage = (this.wins / this.amount) * 100;
  }
}
