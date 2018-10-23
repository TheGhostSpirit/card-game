import { Card } from '../card/card';

export class SpiderStub {
  constructor() {
    this.cards = [];
  }

  fill(deck) {
    while (deck.cards.length > 0) {
      let card = deck.cards.pop();
      card.returned = true;
      this.cards.push(card);
    }
  }

  getLastCard() {
    let card = this.cards.pop();
    card.returned = !card.returned;
    return card;
  }

  dump() {
    return {
      cards: this.cards.map(c => ({
        suit: c.suit,
        name: c.name,
        returned: c.returned
      }))
    };
  }

  load(stub) {
    this.cards = [];
    if (stub.cards && stub.cards.length >= 0) {
      this.cards = stub.cards.map(c => Card.fromObject(c));
    }
  }

}
