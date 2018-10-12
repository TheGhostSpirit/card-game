import { inject } from 'aurelia-framework';
import { Solitaire } from 'models/solitaire';

@inject(Solitaire)
export class Solver {

  constructor(solitaire) {
    this._solitaire = solitaire;
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
          }
        }
      }
    }
    return solutions;
  }

  autoGame(value) {
    let n = value;
    if (n === this.solutions.length) {
      this.solutions.push([]);
    }
    this.solutions[n] = this.findSolutions();
    if (this.solutions[n].length > 0) {
      for (let i = 0; i < this.solutions[n].length; i++) {
        let move = this.solutions[n][i];
        this.doMove(move.source, move.destination, move.selection, move.cardWasTurned);
        this.autoGame(n + 1);
      }
    } else {
      this.undoMove();
    }
  }

  doMove(source, destination, selection, cardWasTurned) { //move called from the engine
    source.splice(-selection.length, selection.length);
    selection.forEach(c => {
      destination.push(c);
    });
    if (cardWasTurned) {
      this.returnCard(source[source.length - 1]);
    }
    this.moves.push(new Move(source, destination, selection, cardWasTurned)); //keeps a track of the moves to undo them later
    this.isNotFinished = this.kingSlots.some(s => !s.isFull());//checks if game is over
  }
}
