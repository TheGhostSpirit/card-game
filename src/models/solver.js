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
import { Move } from './move';

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
    // this.solitaire.initialize();
    // let game = JSON.parse('{"kingSlots":[[],[],[],[]],"slots":[[{"suit":"diams","name":"3","returned":false}],[{"suit":"clubs","name":"9","returned":true},{"suit":"diams","name":"10","returned":false}],[{"suit":"hearts","name":"9","returned":true},{"suit":"spades","name":"2","returned":true},{"suit":"hearts","name":"6","returned":false}],[{"suit":"hearts","name":"4","returned":true},{"suit":"clubs","name":"10","returned":true},{"suit":"clubs","name":"5","returned":true},{"suit":"spades","name":"K","returned":false}],[{"suit":"clubs","name":"4","returned":true},{"suit":"diams","name":"2","returned":true},{"suit":"diams","name":"K","returned":true},{"suit":"hearts","name":"Q","returned":true},{"suit":"spades","name":"10","returned":false}],[{"suit":"clubs","name":"A","returned":true},{"suit":"hearts","name":"5","returned":true},{"suit":"clubs","name":"6","returned":true},{"suit":"clubs","name":"3","returned":true},{"suit":"hearts","name":"8","returned":true},{"suit":"diams","name":"8","returned":false}],[{"suit":"spades","name":"3","returned":true},{"suit":"clubs","name":"Q","returned":true},{"suit":"hearts","name":"A","returned":true},{"suit":"spades","name":"J","returned":true},{"suit":"diams","name":"7","returned":true},{"suit":"spades","name":"Q","returned":true},{"suit":"hearts","name":"2","returned":false}]],"stub":{"cards":[{"suit":"diams","name":"4","returned":false},{"suit":"hearts","name":"3","returned":false},{"suit":"clubs","name":"7","returned":false},{"suit":"spades","name":"7","returned":false},{"suit":"clubs","name":"2","returned":false},{"suit":"hearts","name":"J","returned":false},{"suit":"spades","name":"8","returned":false},{"suit":"spades","name":"5","returned":false},{"suit":"spades","name":"A","returned":false},{"suit":"hearts","name":"K","returned":false},{"suit":"clubs","name":"J","returned":false},{"suit":"diams","name":"J","returned":false},{"suit":"spades","name":"9","returned":false},{"suit":"clubs","name":"8","returned":false},{"suit":"hearts","name":"10","returned":false},{"suit":"clubs","name":"K","returned":false},{"suit":"diams","name":"Q","returned":false},{"suit":"diams","name":"9","returned":false},{"suit":"diams","name":"5","returned":false},{"suit":"diams","name":"6","returned":false},{"suit":"spades","name":"4","returned":false},{"suit":"diams","name":"A","returned":false},{"suit":"spades","name":"6","returned":false},{"suit":"hearts","name":"7","returned":false}],"returnedCards":[]}}');
    // this.solitaire.restore(game);
    this.solitaire.newGame();
    this.solitaire.stub.fullTurn();
    this.shadowSolitaire.initialize();
    this.shadowSolitaire.restore(this.solitaire.dump());
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
    return result;
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
    if (this.stepIndex >= this.steps.length) {
      this.pause();
    } else {
      let stepInfo = this.steps[this.stepIndex];
      this.stepStatus = stepInfo.status;
      this.state = stepInfo.state;
      this.possibleMoves = stepInfo.possibleMoves;
      this.shadowSolitaire.restore(stepInfo.game);
      //  if (dealWithPause && stepInfo.pause) this.pause();
    }
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

  findMoves() {
    let moves = [];
    let kingSlotNumber = 4;
    let slotNumber = 7;
    for (let i = 0; i < kingSlotNumber; i++) {
      for (let j = 0; j < slotNumber; j++) {
        let c = this.solitaire.slots[j].cards[this.solitaire.slots[j].cards.length - 1];
        if (c && this.solitaire.kingSlots[i].canMoveTo([c])) {
          moves.push(
            new Move(
              this.solitaire.slots[j],
              this.solitaire.kingSlots[i],
              [c],
              `${c.symbol}:slot${j + 1}->kingslot`,
              ZONES.slots
            )
          );
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
            moves.push(
              new Move(
                this.solitaire.slots[i],
                this.solitaire.slots[k],
                selection,
                `${symbols}:slot${i + 1}->slot${k + 1}`,
                ZONES.slots
              )
            );
          }
        }
      }
    }
    for (let i = 0; i < kingSlotNumber; i++) {
      this.solitaire.stub.cards.filter(c => this.solitaire.kingSlots[i].canMoveTo([c])).forEach(c => moves.push(
        new Move(
          this.solitaire.stub,
          this.solitaire.kingSlots[i],
          [c],
          `${c.symbol}:stub->kingslot`
        )
      ));
    }
    for (let i = 0; i < slotNumber; i++) {
      this.solitaire.stub.cards.filter(c => this.solitaire.slots[i].canMoveTo([c])).forEach(c => moves.push(
        new Move(
          this.solitaire.stub,
          this.solitaire.slots[i],
          [c],
          `${c.symbol}:stub->slot${i + 1}`
        )
      ));
    }
    if (moves.length === 0) {
      for (let i = 0; i < kingSlotNumber; i++) {
        for (let j = 0; j < slotNumber; j++) {
          let emptyDestinationSlot = this.solitaire.slots[j].cards.length === 0;
          if (emptyDestinationSlot) continue;
          let c = this.solitaire.kingSlots[i].cards[this.solitaire.kingSlots[i].cards.length - 1];
          if (c && this.solitaire.slots[j].canMoveTo([c])) {
            moves.push(
              new Move(
                this.solitaire.kingSlots[i],
                this.solitaire.slots[j],
                [c],
                `${c.symbol}:kingslot->slot${j + 1}`,
                ZONES.kingSlots
              )
            );
          }
        }
      }
    }
    let map = new Map();
    moves.forEach(m => map.set(m.description, m));
    return Array.from(map.values());
  }

  doMove(move, message, possibleMoves) {
    this.pushState(message, possibleMoves);
    //let toState = this.solitaire.dump();
    this.solitaire.doMove(move.source.cards, move.destination.cards, move.selection, move.zone);
    //let fromState = this.solitaire.dump();
    return JSON.stringify(this.solitaire.dump());//move.description; // JSON.stringify({from: toState, to: fromState});
  }

  undoLastMove(message, possibleMoves) {
    this.pushState(message, possibleMoves, true);
    this.solitaire.undoMove();
  }

  resolveStep(n, lastMove) {
    if (this.steps.length > MAXMOVES) {
      return false;
    }
    let possibleMoves = this.findMoves();
    // if (lastMove) {
    //   let reverseMoves = possibleMoves.filter(m => m.isReverseOf(lastMove));
    //   possibleMoves = possibleMoves.filter(m => !m.isReverseOf(lastMove));
    //   reverseMoves.forEach(m => possibleMoves.push(m));
    // }
    let movesCount = possibleMoves.length;
    if (movesCount > 0) {
      for (let i = 0; i < movesCount; i++) {
        let move = possibleMoves[i];
        let state = this.doMove(move, `+E${n}-m${i + 1}/${movesCount}=${move.description}`, possibleMoves);
        if (this.set.has(state)) {
          this.undoLastMove(`-E${n}-m${i + 1}/${movesCount}=${move.description}:CYCLE`, possibleMoves);
          continue;
        } else {
          this.set.add(state);
        }
        if (!this.solitaire.isGameNotFinished()) {
          return true;
        }
        let res = this.resolveStep(n + 1, move);
        if (res) return true;
      }
      this.undoLastMove(`-E${n}:ENDLOOP`, possibleMoves);
    } else {
      this.undoLastMove(`-E${n}:NOSOLUTION`, possibleMoves);
    }
  }
}
