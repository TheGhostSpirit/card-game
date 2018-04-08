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
    this.previousSlot = undefined;
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
    while (this.deck.cards.length > 0) {
      this.stub.push(this.deck.cards.pop());
    }
  }

  prepareKingCells() {
    for (let i = 0; i < 4; i++) {
      this.kingCells.push([]);
    }
  }

  moveFromSlotToSlot(currentSlot) {
    let currentLastCard = this.slots[currentSlot].length - 1;
    //if the user already clicked on a card
    if (typeof this.previousSlot !== 'undefined') {
      let previousLastCard = this.slots[this.previousSlot].length - 1;
      //if move is correct
      if (this.check(this.previousSlot, currentSlot) === true) {
        this.selectCard(this.slots[this.previousSlot][previousLastCard]);
        this.slots[currentSlot].push(this.slots[this.previousSlot].pop());
      } else {
        this.selectCard(this.slots[this.previousSlot][previousLastCard]);
      }
      this.previousSlot = undefined;
      //if the user didn't click on a card
    } else {
      this.previousSlot = currentSlot;
      this.selectCard(this.slots[currentSlot][currentLastCard]);
    }
  }

  returnStub() {
    if (this.stub.length !== 0) {
      this.returnedStub.push(this.stub.pop());
    } else {
      while (this.returnedStub.length > 0) {
        this.stub.push(this.returnedStub.pop());
      }
    }
  }

  check(previousSlot, currentSlot) {
    let currentLastCard = this.slots[currentSlot].length - 1;
    let previousLastCard = this.slots[previousSlot].length - 1;
    if (this.slots[previousSlot][previousLastCard].value + 1 === this.slots[currentSlot][currentLastCard].value) {
      return true;
    }
  }

  selectCard(card) {
    card.selected = !card.selected;
  }

  returnCard(card) {
    card.returned = !card.returned;
  }
}
