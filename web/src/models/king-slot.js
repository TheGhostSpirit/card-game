import { Card } from 'models/card';

export class KingSlot {

  constructor() {
    this.cards = [];
  }

  /**
    * Loads the king slot with the specified cards array.
    * @param {Array<Card>} cards - the array of cards used to load the king slot.
    */
  load(cards) {
    this.cards = [];
    this.cards = cards.map(c => Card.fromObject(c));
  }

  /**
   * Creates a dump of the king slot.
   */
  dump() {
    return this.cards.map(c => ({
      suit: c.suit,
      name: c.name
    }));
  }

  canGetFrom(index) {
    return index === this.cards.length - 1 && typeof this.cards[index] !== 'undefined' ? true : false;
  }

  canMoveTo(src) {
    if (src.length === 1) {
      return this.cards.length === 0 && src[0].value === 1 || this.cards.length > 0 && src[0].suit === this.cards[this.cards.length - 1].suit && src[0].value === this.cards[this.cards.length - 1].value + 1 ? true : false;
    }
    return false;
  }

  isFull() {
    return this.cards.length === 13;
  }
}
