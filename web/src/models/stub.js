import { Solitaire } from "./solitaire";

export class Stub {

  constructor() {
    this.cards = [];
    this.returnedCards = [];
  }

  canGetFrom(index) {
    return index === this.cards.length - 1 && this.cards.length !== 0 ? true : false;
  }

  canMoveTo(src) {
    return false;
  }

  turn() {
    if (this.returnedCards.length !== 0) {
      this.cards.push(this.returnedCards.pop());
      this.cards[this.cards.length - 1].returned = false;
    } else {
      while (this.cards.length > 0) {
        this.returnedCards.push(this.cards.pop());
        this.returnedCards[this.returnedCards.length - 1].returned = true;
      }
    }
  }

  fill(deck) {
    while (deck.cards.length > 0) {
      let card = deck.cards.pop();
      card.returned = true;
      this.returnedCards.push(card);
    }
  }

}
