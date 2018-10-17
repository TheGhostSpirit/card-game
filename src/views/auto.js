import { Solver } from 'models/solver';
import { inject } from 'aurelia-framework';

@inject(Solver)
export class Auto {

  constructor(solver) {
    this.solver = solver;
    this.solver.initialize();
    this.solitaire = solver.shadowSolitaire;
  }
}
