import { ZONES } from './solitaire/solitaire-const';
import { Move } from './move';

const MAXMOVES = 1500;

export class Solver {

  resolve(solitaire) {
    this.set = new Set();
    this.steps = [];
    this.solitaire = solitaire;
    this.solitaire.stub.fullTurn();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let result = this.resolveStep(0);
          resolve({
            result: result,
            steps: this.steps
          });
        } catch (error) {
          reject(error);
        }
      }, 10);
    });
  }

  pushState(message, possibleMoves, pause) {
    if (this.steps.length >= MAXMOVES) throw new Error('Out of moves!');
    let dump = this.solitaire.dump();
    this.steps.push({
      game: dump,
      status: message,
      possibleMoves: possibleMoves.map(m => m.description).join(', '),
      state: JSON.stringify(dump),
      pause: pause
    });
  }

  doMove(move, message, possibleMoves) {
    this.pushState(message, possibleMoves);
    //let toState = this.solitaire.dump();
    this.solitaire.doMove(move.source.cards, move.destination.cards, move.selection, move.zone);
    //let fromState = this.solitaire.dump();
    return JSON.stringify(this.solitaire.dump()); //move.description; // JSON.stringify({from: toState, to: fromState});
  }

  undoLastMove(message, possibleMoves) {
    this.pushState(message, possibleMoves, true);
    this.solitaire.undoMove();
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

  resolveStep(n) {
    let possibleMoves = this.findMoves();
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
        if (res === true) return true;
      }
    }
    this.undoLastMove(`-E${n}:NOSOLUTION`, possibleMoves);
    return false;
  }
}
