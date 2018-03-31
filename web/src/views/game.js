import { Solitaire } from 'models/solitaire';
import { inject } from 'aurelia-framework';

@inject(Solitaire)
export class Game {
  
  constructor(solitaire) {
    this.solitaire = solitaire;
    this.previousSlot = undefined;
  }

  activate() {
  }

  move(currentSlot) {
    if (this.previousSlot) {
      this.solitaire.move(this.previousSlot, currentSlot);
      this.previousSlot = undefined;
    } else {
      this.previousSlot = currentSlot;
    }
  }

  returnStub(){
    this.solitaire.returnStub();
  }
}
