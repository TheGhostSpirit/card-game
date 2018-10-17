import {
  inject,
  computedFrom
} from 'aurelia-framework';
import {
  Solitaire
} from 'models/solitaire/solitaire';
import {
  SSolitaire
} from 'models/simple/ssolitaire';
// import {
//   Deck
// } from 'models/solitaire/deck';
import {
  SDeck
} from 'models/simple/sdeck';
import {
  ZONES
} from 'models/card/card-const';

const MAXROUNDS = 100;

@inject(Solitaire)
export class Solver {

  constructor(solitaire) {
    // this.solitaire = solitaire;
    // this.shadowSolitaire = new Solitaire(new Deck());
    this.solitaire = new SSolitaire(new SDeck());
    this.shadowSolitaire = new SSolitaire(new SDeck());
    this.possibleMoves = [];
    this.status = '';
    this.round = 0;
    this.steps = [];
    this.set = new Set();
  }

  initialize() {
    this.solitaire.newGame();
    this.solitaire.fullyTurnStub();
    this.shadowSolitaire.initialize();
    this.shadowSolitaire.restore(this.solitaire.dump());
  }

  findSolutions() {
    let solutions = [];
    let kingSlotNumber = 1;
    let slotNumber = 3;
    // let kingSlotNumber = 4;
    // let slotNumber = 7;
    for (let i = 0; i < kingSlotNumber; i++) {
      this.solitaire.stub.returnedCards.filter(c => this.solitaire.kingSlots[i].canMoveTo([c])).forEach(c => solutions.push({
        source: this.solitaire.stub.returnedCards,
        destination: this.solitaire.kingSlots[i].cards,
        selection: [c]
      }));
    }
    for (let i = 0; i < kingSlotNumber; i++) {
      for (let j = 0; j < slotNumber; j++) {
        let c = this.solitaire.slots[j].cards[this.solitaire.slots[j].cards.length - 1];
        if (c && this.solitaire.kingSlots[i].canMoveTo([c])) {
          solutions.push({
            source: this.solitaire.slots[j].cards,
            destination: this.solitaire.kingSlots[i].cards,
            selection: [c],
            zone: ZONES.slots
          });
        }
      }
    }
    for (let i = 0; i < slotNumber; i++) {
      let p = this.solitaire.slots[i].cards.length - this.solitaire.slots[i].cards.findIndex(c => !c.returned);
      for (let j = 1; j <= p; j++) {
        let sel = this.solitaire.slots[i].cards.filter((c, ind) => ind >= this.solitaire.slots[i].cards.length - p);
        for (let k = 0; k < slotNumber; k++) {
          if (sel[0] && this.solitaire.slots[k].canMoveTo(sel) && i !== k) {
            solutions.push({
              source: this.solitaire.slots[i].cards,
              destination: this.solitaire.slots[k].cards,
              selection: sel,
              zone: ZONES.slots
            });
          }
        }
      }
    }
    for (let i = 0; i < slotNumber; i++) {
      this.solitaire.stub.returnedCards.filter(c => this.solitaire.slots[i].canMoveTo([c])).forEach(c => solutions.push({
        source: this.solitaire.stub.returnedCards,
        destination: this.solitaire.slots[i].cards,
        selection: [c]
      }));
    }
    return solutions;
  }

  resolve() {
    this.status = 'running...';
    this.resolveStep(0);
    this.status = 'interrupted.';
  }

  playback() {
    this.interval = setInterval(() => {
      if (this.steps.length === 0) {
        this.pause();
      } else {
        let stepInfo = this.steps.shift();
        this.shadowSolitaire.restore(stepInfo.game);
        this.stepStatus = stepInfo.status;
      }
    }, 1000);
  }

  @computedFrom('steps.length')
  get cannotPlayback() {
    return this.steps.length === 0;
  }

  pause() {
    if (this.interval) clearInterval(this.interval);
  }

  pushState(message) {
    this.steps.push({
      game: this.solitaire.dump(),
      status: message
    });
  }

  resolveStep(n) {
    if (this.round > MAXROUNDS) {
      this.status = 'max depth !';
      return false;
    }
    if (n === this.possibleMoves.length) {
      this.possibleMoves.push([]);
    }
    this.possibleMoves[n] = this.findSolutions();
    this.round++;
    if (this.possibleMoves[n].length > 0) {
      for (let i = 0; i < this.possibleMoves[n].length; i++) {
        let move = this.possibleMoves[n][i];
        this.solitaire.doMove(move.source, move.destination, move.selection, move.zone);
        this.pushState(`E${n}-m${i}/${this.possibleMoves[n].length}`);
        let state = JSON.stringify(this.solitaire.dump());
        if (this.set.has(state)) {
          this.solitaire.undoMove();
          this.pushState(`E${n}-UNDO(cycle)`);
          continue;
        } else {
          this.set.add(state);
        }
        if (!this.solitaire.isGameNotFinished()) {
          return true;
        }
        let res = this.resolveStep(n + 1);
        if (res) return true;
      }
      this.solitaire.undoMove();
      this.pushState(`E${n}-UNDO(all-done)`);
    } else {
      this.solitaire.undoMove();
      this.pushState(`E${n}-UNDO(no-sol)`);
    }
  }
}
