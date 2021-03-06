import { Card, NAMES, SUITS } from './card';

export class Deck {

  constructor() {
    this.initialize();
  }

  /**
   * Initializes the internal structures of the deck.
   */
  initialize() {
    this.cards = [];
    for (let s = 0; s < SUITS.length; s++) {
      for (let n = 0; n < NAMES.length; n++) {
        this.cards.push(new Card(SUITS[s], NAMES[n]));
      }
    }
  }

  shuffle() {
    for (let i = 0; i < 1000; i++) {
      let location1 = Math.floor(Math.random() * this.cards.length);
      let location2 = Math.floor(Math.random() * this.cards.length);
      let tmp = this.cards[location1];
      this.cards[location1] = this.cards[location2];
      this.cards[location2] = tmp;
    }
  }
}
