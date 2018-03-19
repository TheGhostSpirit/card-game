import { inject } from 'aurelia-framework';
import { Deck } from 'models/deck';

@inject(Deck)
export class Solitaire {

  constructor(deck) {
    this.deck = deck;
    this.kingCells = [];
    this.stub = [];
    this.returnedStub = [];
    this.slots = [];
    this.prepare();
  }

  prepare() {
    this.deck.shuffle();
    this.fillSlots();
  }

  fillSlots() {
    for (let i = 0; i < 7; i++) this.slots.push([]);
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < i + 1; j++) {
        this.slots[i].push(this.deck.cards.pop());
      }
    }
  }
}
