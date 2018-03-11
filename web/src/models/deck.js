import Card from 'models/card';

const SUITS = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
const NAMES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export class Deck {

  constructor() {
    this.cards = [];

    for (var s = 0; s < SUITS.length; s++) {
      for (var n = 0; n < NAMES.length; n++) {
        this.cards.push(new Card(SUITS[s], NAMES[n], n + 1));
      }
    }
  }

  shuffle() {
    for (var i = 0; i < 1000; i++) {
      var location1 = Math.floor((Math.random() * this.cards.length));
      var location2 = Math.floor((Math.random() * this.cards.length));
      var tmp = this.cards[location1];

      this.cards[location1] = this.cards[location2];
      this.cards[location2] = tmp;
    }

  }
}
