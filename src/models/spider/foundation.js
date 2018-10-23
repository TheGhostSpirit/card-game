import { Card } from '../card/card';

export class Foundation {
  constructor() {
    this.cards = [];
  }

  isFull() {
    return this.cards.length === 104;
  }

  dump() {
    return this.cards.map(c => ({
      suit: c.suit,
      name: c.name
    }));
  }

  load(cards) {
    this.cards = [];
    this.cards = cards.map(c => Card.fromObject(c));
  }
}
