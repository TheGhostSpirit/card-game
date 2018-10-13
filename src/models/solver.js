import { inject } from 'aurelia-framework';
import { Solitaire } from 'models/solitaire';

@inject(Solitaire)
export class Solver {

  constructor(solitaire) {
    this._solitaire = solitaire;
    this.solutions = [];
    this.sourceWasSlot = false;
  }

  findSolutions() {
    let solutions = [];
    for (let i = 0; i < 7; i++) {
      this._solitaire.stub.returnedCards.filter(c => this._solitaire.slots[i].canMoveTo([c])).forEach(c => solutions.push({ source: this._solitaire.stub.returnedCards, destination: this._solitaire.slots[i].cards, selection: [c] }));
    }
    for (let i = 0; i < 4; i++) {
      this._solitaire.stub.returnedCards.filter(c => this._solitaire.kingSlots[i].canMoveTo([c])).forEach(c => solutions.push({ source: this._solitaire.stub.returnedCards, destination: this._solitaire.kingSlots[i].cards, selection: [c] }));
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 7; j++) {
        let c = this._solitaire.slots[j].cards[this._solitaire.slots[j].cards.length - 1];
        if (this._solitaire.kingSlots[i].canMoveTo([c])) {
          solutions.push({ source: this._solitaire.slots[j].cards, destination: this._solitaire.kingSlots[i].cards, selection: [c] });
          this.sourceWasSlot = true;
        }
      }
    }
    for (let i = 0; i < 7; i++) {
      let p = this._solitaire.slots[i].cards.length - this._solitaire.slots[i].cards.findIndex(c => !c.returned);
      for (let j = 1; j <= p; j++) {
        let sel = this._solitaire.slots[i].cards.filter((c, ind) => ind >= this._solitaire.slots[i].cards.length - p);
        for (let k = 0; k < 7; k++) {
          if (this._solitaire.slots[k].canMoveTo(sel) && i !== k) {
            solutions.push({
              source: this._solitaire.slots[i].cards, destination: this._solitaire.slots[k].cards, selection: sel
            });
            this.sourceWasSlot = true;
          }
        }
      }
    }
    return solutions;
  }

  autoGame(n) {
    if (this._solitaire.isGameNotFinished()) {
      if (n === this.solutions.length) {
        this.solutions.push([]);
      }
      this.solutions[n] = this.findSolutions();
      console.log(this.solutions);
      if (this.solutions[n].length > 0) {
        for (let i = 0; i < this.solutions[n].length; i++) {
          let move = this.solutions[n][i];
          this.doMove(move.source, move.destination, move.selection);
          // if (this._solitaire.isGameNotFinished()) break;
          this.autoGame(n + 1);
        }
      } else {
        this._solitaire.undoMove();
      }
    }
  }

  doMove(source, destination, selection) { //move called from the engine
    let beforeState = this._solitaire.dump();
    source.splice(-selection.length, selection.length);
    selection.forEach(c => {
      destination.push(c);
    });
    this.returnsNextCardInSlot(source);
    this._solitaire.moves.push(beforeState); //keeps a track of the moves to undo them later
  }

  returnsNextCardInSlot(source) {
    if (this.sourceWasSlot && source.length > 0 && !source.find(c => !c.returned)) {
      this._solitaire.returnCard(source[source.length - 1]);
      this.sourceWasSlot = false;
    }
  }
}
