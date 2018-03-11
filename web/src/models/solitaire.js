import { inject } from 'aurelia-framework';
import Deck from 'models/deck';

@inject(Deck)
export class Solitaire {

  constructor(deck) {
    this.deck = deck;
    this.kingCells = [];
    this.stub = [];
    this.returnedStub = [];
    this.slots = [];
  }

  prepare() {
    this.deck.shuffle();
    this.fillSlots();
  }

  fillSlots() {
    // let card = this.deck.pop()  this.slots[i][j] = card ...
    for(let i = 0; i < 7; i++)
    {
      for(let j = 0; j < i + 1; j ++){
        this.slots[i][j] = this.deck.cards.pop();
        console.log(this.slots);
      }
    }
  }
}
