import { Solver } from 'models/solver';
import { inject } from 'aurelia-framework';

@inject(Solver)
export class Auto {

  constructor(solver) {
    this.solver = solver;
    this.solitaire = solver._solitaire;
  }

  activate() {
    this.solitaire.newGame();
    this.solver.autoGame(0);
  }

}
