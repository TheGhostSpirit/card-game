import {
  inject
} from 'aurelia-framework';
import {
  Solitaire
} from 'models/solitaire';
import { ZONES } from 'models/card-const';

const MAXROUNDS = 5000;

@inject(Solitaire)
export class Solver {

  constructor(solitaire) {
    this._solitaire = solitaire;
    this.solutions = [];
    this.status = 'running';
    this.round = 0;
  }

  findSolutions() {
    let solutions = [];
    for (let i = 0; i < 7; i++) {
      this._solitaire.stub.returnedCards.filter(c => this._solitaire.slots[i].canMoveTo([c])).forEach(c => solutions.push({
        source: this._solitaire.stub.returnedCards,
        destination: this._solitaire.slots[i].cards,
        selection: [c]
      }));
    }
    for (let i = 0; i < 4; i++) {
      this._solitaire.stub.returnedCards.filter(c => this._solitaire.kingSlots[i].canMoveTo([c])).forEach(c => solutions.push({
        source: this._solitaire.stub.returnedCards,
        destination: this._solitaire.kingSlots[i].cards,
        selection: [c]
      }));
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 7; j++) {
        let c = this._solitaire.slots[j].cards[this._solitaire.slots[j].cards.length - 1];
        if (c && this._solitaire.kingSlots[i].canMoveTo([c])) {
          solutions.push({
            source: this._solitaire.slots[j].cards,
            destination: this._solitaire.kingSlots[i].cards,
            selection: [c],
            zone: ZONES.slots
          });
        }
      }
    }
    for (let i = 0; i < 7; i++) {
      let p = this._solitaire.slots[i].cards.length - this._solitaire.slots[i].cards.findIndex(c => !c.returned);
      for (let j = 1; j <= p; j++) {
        let sel = this._solitaire.slots[i].cards.filter((c, ind) => ind >= this._solitaire.slots[i].cards.length - p);
        for (let k = 0; k < 7; k++) {
          if (sel[0] && this._solitaire.slots[k].canMoveTo(sel) && i !== k) {
            solutions.push({
              source: this._solitaire.slots[i].cards,
              destination: this._solitaire.slots[k].cards,
              selection: sel,
              zone: ZONES.slots
            });
          }
        }
      }
    }
    return solutions;
  }

  autoGame(n) {
    if (this.round > MAXROUNDS) {
      this.status = 'max depth !';
      return false;
    }
    if (n === this.solutions.length) {
      this.solutions.push([]);
    }
    this.solutions[n] = this.findSolutions();
    this.round++;
    if (this.solutions[n].length > 0) {
      for (let i = 0; i < this.solutions[n].length; i++) {
        let move = this.solutions[n][i];
        this._solitaire.doMove(move.source, move.destination, move.selection, move.zone);
        if (!this._solitaire.isGameNotFinished()) {
          return true;
        }
        let res = this.autoGame(n + 1);
        if (res) return true;
      }
    } else {
      this._solitaire.undoMove();
    }
  }
}
