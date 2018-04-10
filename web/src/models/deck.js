import { Card } from 'models/card';

const SUITS = ['hearts', 'spades', 'diams', 'clubs'];
const NAMES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export class Deck {

  constructor() {
    this.cards = [];

    for (let s = 0; s < SUITS.length; s++) {
      for (let n = 0; n < NAMES.length; n++) {
        this.cards.push(new Card(SUITS[s], NAMES[n], n + 1));
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
