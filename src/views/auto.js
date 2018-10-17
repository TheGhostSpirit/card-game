import { Solver } from 'models/solver';
import { inject } from 'aurelia-framework';

@inject(Solver)
export class Auto {

  constructor(solver) {
    this.solver = solver;
    this.solitaire = solver.solitaire;
    this._solitaire = solver._solitaire;
  }

  activate() {
    this._solitaire.newGame();
    this._solitaire.fullyTurnStub();
    this.solitaire.initialize();
    this.solitaire.restore(this._solitaire.dump());
    this.solver.autoGame(0);
  }

}
