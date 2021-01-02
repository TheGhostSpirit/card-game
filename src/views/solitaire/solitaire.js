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

  activate() {
    this.loadGame(null);
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
        this.status = {
          message: (resolution.result)
            ? `Finished in ${this.steps.length} moves.`
            : `No solution found in ${this.steps.length} moves!`
        };
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
        this.stepByStep(true);
      }, this.delay);
    }
  }

  stepByStep(forward) {
    this.stepIndex = (forward) ? ++this.stepIndex : --this.stepIndex;
    if (this.stepIndex === -1) {
      return;
    }
    if (this.stepIndex >= this.steps.length) {
      this.pause();
    } else {
      const stepInfo = this.steps[this.stepIndex];
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
