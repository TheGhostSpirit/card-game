import {
  inject,
  computedFrom
} from 'aurelia-framework';
import {
  Solitaire
} from 'models/solitaire/solitaire';
import {
  Deck
} from 'models/solitaire/deck';
import {
  ZONES
} from 'models/card/card-const';

const MAXMOVES = 1500;
const DEFAULTDELAY = 50;

@inject(Solitaire)
export class Solver {

  constructor(solitaire) {
    this.solitaire = solitaire;
    this.shadowSolitaire = new Solitaire(new Deck());
    this.status = '';
    this.set = new Set();
    this.delay = DEFAULTDELAY;
    this.playLabel = 'Play';
    this.steps = [];
  }

  initialize() {
    this.solitaire.newGame();
    this.solitaire.fullyTurnStub();
    this.shadowSolitaire.initialize();
    this.shadowSolitaire.restore(this.solitaire.dump());
  }

  findMoves() {
    let moves = [];
    let kingSlotNumber = 4;
    let slotNumber = 7;
    for (let i = 0; i < kingSlotNumber; i++) {
      for (let j = 0; j < slotNumber; j++) {
        let c = this.solitaire.slots[j].cards[this.solitaire.slots[j].cards.length - 1];
        if (c && this.solitaire.kingSlots[i].canMoveTo([c])) {
          moves.push({
            source: this.solitaire.slots[j].cards,
            destination: this.solitaire.kingSlots[i].cards,
            selection: [c],
            zone: ZONES.slots,
            description: `${c.symbol}:slot${j + 1}->kingslot`
          });
        }
      }
    }
    for (let i = 0; i < slotNumber; i++) {
      let p = this.solitaire.slots[i].cards.length - this.solitaire.slots[i].cards.findIndex(c => !c.returned);
      for (let j = 1; j <= p; j++) {
        let selection = this.solitaire.slots[i].cards.filter((c, ind) => ind >= this.solitaire.slots[i].cards.length - p);
        if (selection.length === 0) continue; // empty selection
        let symbols = `(${selection.map(c => c.symbol).join('-')})`;
        for (let k = 0; k < slotNumber; k++) {
          let emptyDestinationSlot = this.solitaire.slots[k].cards.length === 0;
          let kingSelection = selection[0].value === 13 && selection[0] === this.solitaire.slots[i].cards[0];
          if (this.solitaire.slots[k].canMoveTo(selection) && i !== k && !(emptyDestinationSlot && kingSelection)) {
            moves.push({
              source: this.solitaire.slots[i].cards,
              destination: this.solitaire.slots[k].cards,
              selection: selection,
              zone: ZONES.slots,
              description: `${symbols}:slot${i + 1}->slot${k + 1}`
            });
          }
        }
      }
    }
    for (let i = 0; i < kingSlotNumber; i++) {
      this.solitaire.stub.returnedCards.filter(c => this.solitaire.kingSlots[i].canMoveTo([c])).forEach(c => moves.push({
        source: this.solitaire.stub.returnedCards,
        destination: this.solitaire.kingSlots[i].cards,
        selection: [c],
        description: `${c.symbol}:stub->kingslot`
      }));
    }
    for (let i = 0; i < slotNumber; i++) {
      this.solitaire.stub.returnedCards.filter(c => this.solitaire.slots[i].canMoveTo([c])).forEach(c => moves.push({
        source: this.solitaire.stub.returnedCards,
        destination: this.solitaire.slots[i].cards,
        selection: [c],
        description: `${c.symbol}:stub->slot${i + 1}`
      }));
    }
    for (let i = 0; i < kingSlotNumber; i++) {
      for (let j = 0; j < slotNumber; j++) {
        let emptyDestinationSlot = this.solitaire.slots[j].cards.length === 0;
        if (emptyDestinationSlot) continue;
        let c = this.solitaire.kingSlots[i].cards[this.solitaire.kingSlots[i].cards.length - 1];
        if (c && this.solitaire.slots[j].canMoveTo([c])) {
          moves.push({
            source: this.solitaire.kingSlots[i].cards,
            destination: this.solitaire.slots[j].cards,
            selection: [c],
            zone: ZONES.kingSlots,
            description: `${c.symbol}:kingslot->slot${j + 1}`
          });
        }
      }
    }
    let map = new Map();
    moves.forEach(m => map.set(m.description, m));
    return Array.from(map.values());
  }

  resolve() {
    this.steps = [];
    this.stepIndex = -1;
    this.set.clear();
    this.resolutionDone = false;
    this.status = 'running...';
    let result = this.resolveStep(0);
    this.resolutionDone = true;
    this.status = (result) ? `finished in ${this.steps.length} moves.` : `no solution found in ${this.steps.length} moves!`;
  }

  playOrPause() {
    if (this.interval) {
      this.pause();
    } else {
      this.playLabel = 'Pause';
      this.interval = setInterval(() => {
        this.stepByStep(true, true);
      }, this.delay);
    }
  }

  stepByStep(forward, dealWithPause) {
    this.stepIndex = (forward) ? ++this.stepIndex : --this.stepIndex;
    if (this.stepIndex === -1) {
      return;
    }
    if (this.stepIndex >= this.steps.length) this.pause();
    let stepInfo = this.steps[this.stepIndex];
    this.stepStatus = stepInfo.status;
    this.state = stepInfo.state;
    this.possibleMoves = stepInfo.possibleMoves;
    this.shadowSolitaire.restore(stepInfo.game);
    if (dealWithPause && stepInfo.pause) this.pause();
  }

  pause() {
    if (this.interval) {
      this.playLabel = 'Play';
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  @computedFrom('steps.length', 'resolutionDone')
  get cannotPlayback() {
    return this.steps.length === 0 || !this.resolutionDone;
  }

  @computedFrom('stepIndex', 'resolutionDone')
  get cannotGoBack() {
    return this.stepIndex === -1 || !this.resolutionDone;
  }

  @computedFrom('stepIndex', 'resolutionDone')
  get cannotGoNext() {
    return this.stepIndex === this.steps.length || !this.resolutionDone;
  }

  pushState(message, possibleMoves, pause) {
    let dump = this.solitaire.dump();
    this.steps.push({
      game: dump,
      status: message,
      possibleMoves: possibleMoves.map(m => m.description).join(', '),
      state: JSON.stringify(dump),
      pause: pause
    });
  }

  resolveStep(n) {
    if (this.steps.length > MAXMOVES) {
      return false;
    }
    let possibleMoves = this.findMoves();
    let movesCount = possibleMoves.length;
    if (movesCount > 0) {
      for (let i = 0; i < movesCount; i++) {
        let move = possibleMoves[i];
        this.pushState(`E${n}-m${i}/${movesCount}=${move.description}`, possibleMoves);
        this.solitaire.doMove(move.source, move.destination, move.selection, move.zone);
        let state = JSON.stringify(this.solitaire.dump());
        if (this.set.has(state)) {
          this.pushState(`E${n}-m${i}/${movesCount}=${move.description}:CYCLE:UNDONE`, possibleMoves, true);
          this.solitaire.undoMove();
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
      this.pushState(`E${n}:ENDLOOP:UNDONE`, possibleMoves);
      this.solitaire.undoMove();
    } else {
      this.pushState(`E${n}:NOSOLUTION:UNDONE`, possibleMoves);
      this.solitaire.undoMove();
    }
  }
}
