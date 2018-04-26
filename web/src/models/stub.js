import { Card } from 'models/card';

export class Stub {

  constructor(solitaire) {
    this.cards = [];
    this.returnedCards = [];
    this.solitaire = solitaire;
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
    // remove stub selection if applicable
    this.solitaire.removeSelection();
    if (this.cards.length > 0) {
      this.cards[this.cards.length - 1].selected = false;
    }
    if (this.returnedCards.length !== 0) {
      // push a card from the stub
      this.cards.push(this.returnedCards.pop());
      this.cards[this.cards.length - 1].returned = false;
    } else {
      // return the all stub
      while (this.cards.length > 0) {
        let cardToReturn = this.cards.pop();
        cardToReturn.returned = true;
        this.returnedCards.push(cardToReturn);
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
