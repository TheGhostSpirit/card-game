import { Card } from 'models/card';

export class Stub {

  constructor() {
    this.cards = [];
    this.returnedCards = [];
  }

  /**
   * Loads the stub with the specified saved stub.
   * @param {Stub} stub - the saved stub of cards used to load the cards stub.
   */
  load(stub) {
    this.cards = [];
    this.returnedCards = [];
    if (typeof stub === 'undefined') return;
    if (stub.cards && stub.cards.length >= 0) {
      this.cards = stub.cards.map(c => Card.fromObject(c));
    }
    if (stub.returnedCards && stub.returnedCards.length >= 0) {
      this.returnedCards = stub.returnedCards.map(c => Card.fromObject(c));
    }
  }

  /**
 * Creates a dump of the stub.
 */
  dump() {
    return {
      cards: this.cards.map(c => ({
        suit: c.suit,
        name: c.name
      })),
      returnedCards: this.returnedCards.map(c => ({
        suit: c.suit,
        name: c.name,
        returned: true
      }))
    };
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
