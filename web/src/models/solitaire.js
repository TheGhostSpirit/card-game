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
    this.fillStub();
    this.prepareKingCells();
  }

  fillSlots() {
    for (let i = 0; i < 7; i++) this.slots.push([]);
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < i + 1; j++) {
        this.slots[i].push(this.deck.cards.pop());
      }
    }
  }

  fillStub() {
    while(this.deck.cards.length > 0) {
      this.stub.push(this.deck.cards.pop());
    }
  }

  prepareKingCells() {
    for (let i = 0; i < 4; i++) {
      this.kingCells.push([]);
    }
  }

  move(previousSlot, currentSlot) {
    if (this.check(previousSlot, currentSlot) === true) {
      this.slots[currentSlot].push(this.slots[previousSlot].pop());
    }
  }

  returnStub() {
    if (this.stub.length != 0) {
      this.returnedStub.push(this.stub.pop());
    } else {
      while(this.returnedStub.length > 0){
        this.stub.push(this.returnedStub.pop());
      }
    }
  }

  check(previousSlot, currentSlot){
    let currentLastCard = this.slots[currentSlot].length - 1;
    let previousLastCard = this.slots[previousSlot].length - 1;
    if (this.slots[previousSlot][previousLastCard].value + 1 === this.slots[currentSlot][currentLastCard].value){
      return true;
    }
  }
}
