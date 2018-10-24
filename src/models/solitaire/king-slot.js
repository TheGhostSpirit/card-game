import { Card } from '../card/card';
import { SUITS, SUITSYMBOLS } from './solitaire-const';

export class KingSlot {

  constructor(suit) {
    this.cards = [];
    this.suit = suit;
    this.suitCss = `&${this.suit};`;
    this.color = this.getColor(this.suit);
    this.id = `K${SUITSYMBOLS[SUITS.indexOf(suit)]}`;
  }

  /**
    * Loads the king slot with the specified cards array.
    * @param {Array<Card>} cards - the array of cards used to load the king slot.
    */
  load(cards) {
    this.cards = [];
    this.cards = cards.map(c => Card.fromObject(c));
  }

  getColor(suit) {
    let index = SUITS.indexOf(suit);
    return index % 2 === 0 ? 'red' : 'black';
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
    return index === this.cards.length - 1 && typeof this.cards[index] !== 'undefined';
  }

  canMoveTo(src) {
    if (src.length === 1) {
      return this.cards.length === 0 && src[0].value === 1 && src[0].suit === this.suit || this.cards.length > 0 && src[0].suit === this.cards[this.cards.length - 1].suit && src[0].value === this.cards[this.cards.length - 1].value + 1;
    }
    return false;
  }

  isFull() {
    return this.cards.length === 13;
  }

  unselect(kingSlot) {
    this.cards.forEach(card => card.selected = false);
  }
}
