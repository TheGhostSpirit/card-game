import { inject } from 'aurelia-framework';
import { Solver } from 'models/solver';

@inject(Solver)
export class Simple {

  constructor(solver) {
    this.solver = solver;
    this.solver.initialize();
    this.solitaire = solver.shadowSolitaire;
  }
}
