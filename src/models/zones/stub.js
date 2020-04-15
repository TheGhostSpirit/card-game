import { Card } from '../index';

export class Stub {

  /**
   * Creates an instance of the Card class.
   * @param {String} cards - shown cards
   * @param {String} name - hidden cards
   */
  constructor() {
    this.cards = [];
    this.returnedCards = [];
    this.id = 'Stub';
  }

  /**
   * Loads the stub with the specified saved stub.
   * @param {Stub} stub - the saved stub of cards used to load the cards stub.
   */
  load(stub) {
    this.cards = [];
    this.returnedCards = [];
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
        returned: c.returned
      }))
    };
  }

  canGetFrom(index) {
    return index === this.cards.length - 1 && this.cards.length !== 0;
  }

  canMoveTo(_) {
    return false;
  }

  turn() {
    if (this.returnedCards.length !== 0) {
      // push a card from the stub
      this.cards.push(this.returnedCards.pop());
      this.cards[this.cards.length - 1].returned = false;
    } else {
      // return the whole stub
      while (this.cards.length > 0) {
        let cardToReturn = this.cards.pop();
        cardToReturn.returned = true;
        this.returnedCards.push(cardToReturn);
      }
    }
  }

  fullTurn() {
    while (this.returnedCards.length !== 0) {
      this.turn();
    }
  }

  fill(deck) {
    while (deck.cards.length > 0) {
      let card = deck.cards.pop();
      card.returned = true;
      this.returnedCards.push(card);
    }
  }

  unselect() {
    this.cards.forEach(card => card.selected = false);
  }
}
