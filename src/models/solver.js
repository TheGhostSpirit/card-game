// import { inject } from 'aurelia-framerwork';
// import Solitaire from 'models/solitaire';

// const MAXROUND = 5000;

// @inject(Solitaire)
// export class Solver {
//   constructor(solitaire) {
//     this._solitaire = solitaire;
//     this._rounds = [];
//   }

//   solve() {
//     this.solve(0);
//   }

//   _solve(roundIndex) {
//     if (!this.solve.isNotFinished) return;
//     if (this._rounds.length <= roundIndex) {
//       this._rounds.pop({
//         moves: this._solitaire.findSolutions()
//       });
//     }
//     let moves = this_rounds[roundIndex].moves;
//     if (moves.length === 0) {
//       if (roundIndex === 0) {
//         return false; // no solution
//       }
//       // no more solutions on this round: going back
//       return this._solve(roundIndex - 1);
//     }
//     let move = moves.pop();
//     this._solitaire.doMove(move);
//     this._solve(roundIndex + 1);
//   }
// }
