import { Solver } from 'models/solver';
import { Service } from 'services/service';
import { inject } from 'aurelia-framework';

@inject(Solver, Service)
export class Auto100 {
  constructor(solver, service) {
    this.service = service;
    this.solver = solver;
    this.wins = 0;
    this.awaitedWins = 0;
    this.percentage = 0;
    this.amount = 100;
    this.games = [];
  }

  activate() {
    this.service.getGames().then(result => {
      this.games = result;
      this.solver.load(this.games[0].game);
      this.solitaire = this.solver.shadowSolitaire;
      this.games.forEach(g => {
        if (g.result) this.awaitedWins++;
      });
    });
  }

  launch() {
    let beginTime = Date.now();
    for (let i = 0; i < this.amount; i++) {
      let outcome = this.solver.resolve();
      if (outcome) this.wins++;
      this.solver.load(this.games[i].game);
    }
    let finishTime = Date.now();
    this.time = ((finishTime - beginTime) / 1000);
    this.finished = true;
    this.percentage = (this.wins / this.amount) * 100;
  }
}
