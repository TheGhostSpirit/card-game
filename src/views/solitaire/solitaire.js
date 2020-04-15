import { inject, computedFrom } from 'aurelia-framework';

import { Solitaire } from 'models/solitaire';
import { Solver } from 'models/index';

const DEFAULT_DELAY = 50;

@inject(Solitaire, Solver)
export class SolitaireGame {

  constructor(solitaire, solver) {
    this.solitaire = solitaire;
    this.solver = solver;
    this.delay = DEFAULT_DELAY;
    this.playLabel = 'Play';
    this.steps = [];
  }

  activate(param) {
    let game = (param.cheat) ? JSON.parse(
      '{"kingSlots":[[{"suit":"hearts","name":"A"},{"suit":"hearts","name":"2"},{"suit":"hearts","name":"3"},{"suit":"hearts","name":"4"},{"suit":"hearts","name":"5"},{"suit":"hearts","name":"6"},{"suit":"hearts","name":"7"},{"suit":"hearts","name":"8"},{"suit":"hearts","name":"9"},{"suit":"hearts","name":"10"},{"suit":"hearts","name":"J"},{"suit":"hearts","name":"Q"},{"suit":"hearts","name":"K"}],[{"suit":"spades","name":"A"},{"suit":"spades","name":"2"},{"suit":"spades","name":"3"},{"suit":"spades","name":"4"},{"suit":"spades","name":"5"},{"suit":"spades","name":"6"},{"suit":"spades","name":"7"},{"suit":"spades","name":"8"},{"suit":"spades","name":"9"},{"suit":"spades","name":"10"},{"suit":"spades","name":"J"},{"suit":"spades","name":"Q"},{"suit":"spades","name":"K"}],[{"suit":"diams","name":"A"},{"suit":"diams","name":"2"},{"suit":"diams","name":"3"},{"suit":"diams","name":"4"},{"suit":"diams","name":"5"},{"suit":"diams","name":"6"},{"suit":"diams","name":"7"},{"suit":"diams","name":"8"},{"suit":"diams","name":"9"},{"suit":"diams","name":"10"}],[{"suit":"clubs","name":"A"},{"suit":"clubs","name":"2"},{"suit":"clubs","name":"3"},{"suit":"clubs","name":"4"},{"suit":"clubs","name":"5"},{"suit":"clubs","name":"6"},{"suit":"clubs","name":"7"},{"suit":"clubs","name":"8"},{"suit":"clubs","name":"9"},{"suit":"clubs","name":"10"},{"suit":"clubs","name":"J"},{"suit":"clubs","name":"Q"},{"suit":"clubs","name":"K"}]],"slots":[[{"suit":"diams","name":"K","returned":false}],[],[],[],[],[],[],[]],"stub":{"cards":[{"suit":"diams","name":"J"}],"returnedCards":[{"suit":"diams","name":"Q","returned":true}]}}'
    ) : undefined;
    this.loadGame(game);
  }

  loadGame(game) {
    this.status = {};
    this.steps = [];
    this.stepIndex = -1;
    this.solitaire.loadGame(game);
  }

  resolveGame() {
    this.status = { message: 'running...' };
    this.solver.resolve(this.solitaire)
      .then(resolution => {
        this.steps = resolution.steps;
        this.status = { message: (resolution.result) ? `Finished in ${this.steps.length} moves.` : `No solution found in ${this.steps.length} moves!` };
        return resolution.result;
      })
      .catch(error => {
        this.status = { message: `${error.message} ${this.solver.steps.length} moves!` };
        return false;
      });
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
      this.status = {
        stepStatus: stepInfo.status,
        possibleMoves: stepInfo.possibleMoves
      };
      this.solitaire.restore(stepInfo.game);
    }
  }

  pause() {
    if (this.interval) {
      this.playLabel = 'Play';
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  @computedFrom('status')
  get resolutionDone() {
    return this.status && this.status.message !== 'running...';
  }

  @computedFrom('status')
  get resolutionRunning() {
    return this.status.message === 'running...';
  }

  @computedFrom('steps.length', 'resolutionDone')
  get cannotPlayback() {
    return this.steps.length === 0 || !this.resolutionDone;
  }

  @computedFrom('steps.length', 'stepIndex', 'resolutionDone')
  get cannotGoBack() {
    return this.steps.length === 0 || this.stepIndex <= 0 || !this.resolutionDone;
  }

  @computedFrom('steps.length', 'stepIndex', 'resolutionDone')
  get cannotGoNext() {
    return this.steps.length === 0 || this.stepIndex === this.steps.length || !this.resolutionDone;
  }

}
