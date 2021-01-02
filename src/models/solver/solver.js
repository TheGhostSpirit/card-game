const MAX_MOVES = 1500;

export class Solver {

  resolve(game) {
    this.set = new Set();
    this.steps = [];
    this._game = game;
    this._game.prepareForResolution();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = this.resolveStep(0);
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
    if (this.steps.length >= MAX_MOVES) throw new Error('Out of moves!');
    const dump = this._game.dump();
    this.steps.push({
      game: dump,
      status: message,
      possibleMoves: possibleMoves.map(m => m.description).join(', '),
      state: JSON.stringify(dump),
      pause: pause
    });
  }

  doMove(step, move, possibleMoves) {
    const message = this.getMoveDescription(step, move, possibleMoves, true);
    this.pushState(message, possibleMoves);
    this._game.doMove(move.source.cards, move.destination.cards, move.selection, move.zone);
    return JSON.stringify(this._game.dump());
  }

  undoLastMove(step, move, possibleMoves) {
    const message = this.getMoveDescription(step, move, possibleMoves, false);
    this.pushState(message, possibleMoves, true);
    this._game.undoMove();
  }

  getMoveDescription(step, move, possibleMoves, add) {
    return add ? '+' : '-'
      + `E${step}-m${possibleMoves.indexOf(move)}/${possibleMoves.length}=${move.description}`;
  }

  *traverseMoves(n) {
    const possibleMoves = this._game.findMoves();

    for (const move of possibleMoves) {
      const state = this.doMove(n, move, possibleMoves);
      yield *this.traverseMoves(n + 1);
    }
  }

  foo() {
    for (const move of this.traverseMoves(0)) {
      if (!this._game.isGameNotFinished()) {
        return true;
      }
    }
    return false;
  }



  resolveStep(n) {
    let possibleMoves = this._game.findMoves();
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
        if (!this._game.isGameNotFinished()) {
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
