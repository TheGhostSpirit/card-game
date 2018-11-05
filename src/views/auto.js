import { Solver } from 'models/solver';
import { inject } from 'aurelia-framework';

@inject(Solver)
export class Auto {

  constructor(solver) {
    this.solver = solver;
  }

  activate() {
    //let game = JSON.parse('{"kingSlots":[[{"suit":"hearts","name":"A"}],[],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"}]],"slots":[[{"suit":"spades","name":"K","returned":false},{"suit":"diams","name":"Q","returned":false},{"suit":"clubs","name":"J","returned":false},{"suit":"hearts","name":"10","returned":false},{"suit":"spades","name":"9","returned":false},{"suit":"hearts","name":"8","returned":false},{"suit":"spades","name":"7","returned":false},{"suit":"diams","name":"6","returned":false}],[{"suit":"diams","name":"K","returned":false},{"suit":"spades","name":"Q","returned":false},{"suit":"diams","name":"J","returned":false},{"suit":"spades","name":"10","returned":false},{"suit":"diams","name":"9","returned":false},{"suit":"clubs","name":"8","returned":false},{"suit":"hearts","name":"7","returned":false},{"suit":"spades","name":"6","returned":false},{"suit":"diams","name":"5","returned":false},{"suit":"spades","name":"4","returned":false},{"suit":"hearts","name":"3","returned":false}],[{"suit":"clubs","name":"K","returned":false}],[{"suit":"spades","name":"2","returned":true},{"suit":"diams","name":"7","returned":false}],[],[{"suit":"hearts","name":"Q","returned":true},{"suit":"hearts","name":"5","returned":true},{"suit":"spades","name":"5","returned":true},{"suit":"spades","name":"8","returned":true},{"suit":"spades","name":"J","returned":false},{"suit":"diams","name":"10","returned":false},{"suit":"clubs","name":"9","returned":false},{"suit":"diams","name":"8","returned":false},{"suit":"clubs","name":"7","returned":false},{"suit":"hearts","name":"6","returned":false}],[{"suit":"hearts","name":"2","returned":true},{"suit":"hearts","name":"K","returned":true},{"suit":"spades","name":"A","returned":true},{"suit":"hearts","name":"9","returned":false}]],"stub":{"cards":[],"returnedCards":[{"suit":"hearts","name":"J","returned":true},{"suit":"spades","name":"3","returned":true},{"suit":"hearts","name":"4","returned":true},{"suit":"clubs","name":"Q","returned":true},{"suit":"clubs","name":"10","returned":true}]}}');
    this.solver.loadGame();
    this.solitaire = this.solver.shadowSolitaire;
  }

}
