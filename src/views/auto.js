import { Solver } from 'models/solver';
import { inject } from 'aurelia-framework';

@inject(Solver)
export class Auto {

  constructor(solver) {
    this.solver = solver;
    this.solver.initialize();
    this.solitaire = solver.shadowSolitaire;
    this.wins = 0;
    this.percentage = 0;
    this.amount = 100;
  }

  activate() {
    for (let i = 0; i < this.amount; i++) {
      let outcome = this.solver.resolve();
      if (outcome) this.wins++;
      this.solver.initialize();
    }
    this.finished = true;
    this.percentage = (this.wins / this.amount) * 100;
  }
}
