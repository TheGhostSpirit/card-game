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
    this.previousCard = undefined;
    this.prepare();
  }

  prepare() {
    this.deck.shuffle();
    this.fillSlots();
    this.fillStub();
    this.prepareKingCells();
    this.setCardInitialStatus();
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

  /*moveFromSlotToSlot(currentSlot) {
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
  }*/

  moveCardFromSlotToSlot(currentCard, currentSlot) {
    //if the user already clicked on a card
    if (typeof this.previousCard !== 'undefined') {
      //if move is correct
      if (this.canBeMoved(this.previousCard, currentCard, this.previousSlot, currentSlot) === true) {
        this.selectCards(this.previousCard, this.previousSlot); //desel
        //this.slots[currentSlot].push(this.slots[this.previousSlot].pop()); --> move the cards
      } else {
        this.selectCard(this.previousCard, this.previousSlot); //desel
      }
      this.previousCard = undefined;
      //if the user didn't click on a card or wrong card
    } else if (this.canBeClicked(currentCard, currentSlot)) {
      this.previousCard = currentCard;
      this.previousSlot = currentSlot;
      this.selectCards(currentCard, currentSlot);
    }
  }

  canBeMoved(previousCard, currentCard, previousSlot, currentSlot) {
    return this.slots[currentSlot][currentCard].value === this.slots[previousSlot][previousCard].value + 1 ? true : false;
  }

  canBeClicked(card, slot) {
    if (this.slots[slot][card].returned !== true) {
      for (let i = card; i < this.slots[slot].length; i++) {
        if (this.slots[slot][i].value !== this.slots[slot][i + 1].value - 1) {
          return false;
        }
      }
      return true;
    }
  }

  returnStub() {
    if (this.stub.length !== 0) {
      this.returnedStub.push(this.stub.pop());
      this.returnedStub[this.returnedStub.length - 1].returned = false;
    } else {
      while (this.returnedStub.length > 0) {
        this.stub.push(this.returnedStub.pop());
        this.stub[this.stub.length - 1].returned = true;
      }
    }
  }

  /*check(previousSlot, currentSlot) {
    let currentLastCard = this.slots[currentSlot].length - 1;
    let previousLastCard = this.slots[previousSlot].length - 1;
    if (this.slots[previousSlot][previousLastCard].value + 1 === this.slots[currentSlot][currentLastCard].value) {
      return true;
    }
  }*/

  selectCards(card, slot) {
    do {
      this.selectCard(this.slots[slot][card]);
      card++;
    } while (card !== this.slots[slot].length - 1);
  }

  selectCard(card) {
    card.selected = !card.selected;
  }

  returnCard(card) {
    card.returned = !card.returned;
  }

  setCardInitialStatus() {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < this.slots[i].length - 1; j++) {
        this.slots[i][j].returned = true;
      }
    }
    for (let h = 0; h < this.stub.length; h++) {
      this.stub[h].returned = true;
    }
  }
}
